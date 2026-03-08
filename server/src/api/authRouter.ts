import { Request, Response, Router } from "express";
import { prisma } from "../db/prisma.js";
import bcrypt from "bcrypt"; // для сравнения хэшей паролей при логине
import jwt from "jsonwebtoken"; // для создания и проверки JWT
import ms, { type StringValue } from "ms"; // для вычисления срока жизни токена в базе
import crypto from "crypto"; // хэшируем refresh-токен перед сохранением в БД

const router = Router();

// Маршрут для  создания пользовтаеля/admin
router.post("/setup", async (req: Request, res: Response) => {
  try {
    // Проверка токена
    const token = req.header("x-setup-token"); // x-setup-token: some-long-random-string
    if (
      !process.env.SETUP_TOKEN || // Есть нету  ли SETUP_TOKEN в .env
      token !== process.env.SETUP_TOKEN // Совпадает ли токен из запроса с токеном в .env
    ) {
      return res.status(403).json({ message: "Запрещен" });
    }

    // запретить повторный setup
    const existingAdmin = await prisma.user.findFirst({
      // Ищем в базе пользователя с ролью ADMIN.
      where: { role: "ADMIN" },
      select: { id: true },
    });

    // Если найден
    if (existingAdmin) {
      // Запрещаем создавать второго админа
      return res.status(403).json({ message: "Админ уже существует" });
    }

    // Берём данные из тела запроса (JSON)
    const { email, password } = req.body as {
      email?: string;
      password?: string;
    };

    // Проверка обязательных полей
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Требуется адрес электронной почты и пароль" });
    }

    // хешируем пароль
    const passwordHash = await bcrypt.hash(password, 10);

    // создаем админа
    const admin = await prisma.user.create({
      data: {
        email,
        passwordHash,
        role: "ADMIN",
      },
      select: { id: true, email: true, role: true, createdAt: true },
    });

    return res.status(201).json({ admin });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Ошибка сервера" });
  }
});

// Утилита для безопасного чтения переменных окружения
function requireEnv(name: string) {
  const v = process.env[name];
  if (!v) throw new Error(`Отсутствует в env: ${name}`);
  return v;
}

// Создаёт access-токен
function signAccessToken(payload: { sub: string; role: string }) {
  return jwt.sign(
    payload, // данные, которые будут вшиты в токен
    requireEnv("JWT_ACCESS_SECRET"), // Секрет берём из JWT_ACCESS_SECRET
    {
      expiresIn: process.env.ACCESS_TTL || "15m", // Время жизни
    },
  );
}

// создаём refresh-токен (долгоживущий), но с другим секретом и временем жизни
function signRefreshToken(payload: { sub: string }) {
  return jwt.sign(
    payload, // данные, которые будут вшиты в токен
    requireEnv("JWT_REFRESH_SECRET"), // // Секрет берём из JWT_ACCESS_SECRET
    {
      expiresIn: process.env.REFRESH_TTL || "30d", // Время жизни
    },
  );
}

// хешируем строку refresh-token
function sha256(input: string) {
  // вычисляет хеш с помощью алгоритма SHA-256 (криптографическая хеш-функция)
  return crypto
    .createHash("sha256")
    .update(input) // данные для хеширования
    .digest("hex"); // завершает вычисление хеша и возвращает его в виде строки из шестнадцатеричных символов
}

//для установки атрибута Secure у cookie
const cookieSecure = process.env.COOKIE_SECURE === "true";

// Маршрут для логирования
router.post("/login", async (req: Request, res: Response) => {
  try {
    // данные из req.body
    const { email, password } = req.body as {
      email?: string;
      password?: string;
    };

    // если данные не пришли
    if (!email || !password) {
      return res.status(400).json({ message: "Нужны email и password" });
    }

    // ищем пользователя по email
    const user = await prisma.user.findUnique({
      where: { email },
      select: { id: true, email: true, passwordHash: true, role: true },
    });

    // если пользователь  не нашелся
    if (!user) {
      return res.status(401).json({ message: "Неверные учетные данные" });
    }

    // сопоставляем пароль для
    const ok = await bcrypt.compare(password, user.passwordHash);

    // если пароль не верен
    if (!ok) {
      return res.status(401).json({ message: "Введен неверный пароль" });
    }

    // запрет входа не-админам
    if (user.role !== "ADMIN") {
      return res.status(403).json({ message: "Доступ запрещен" });
    }

    // генерируем access‑токен
    // используется для авторизации запросов к API: клиент отправляет его в заголовке Authorization, и сервер проверяет его подпись и срок действия.
    const accessToken = signAccessToken({ sub: user.id, role: user.role }); // указываем, кому выдан токен.

    // генерируем refresh‑токен
    // предназначен исключительно для получения нового access‑токена, когда старый истёк.
    const refreshToken = signRefreshToken({ sub: user.id });

    // определяем срок действия refresh-токена и вычисляем точную дату, когда он перестанет считаться действительным
    // сохраняем refresh hash в БД
    const refreshTtl: StringValue = (process.env.REFRESH_TTL ||
      "30d") as StringValue; // ms string/number. StringValue = чтобы не ругался eslint

    // вычисляем момент истечения срока токена
    const expiresAt = new Date(Date.now() + ms(refreshTtl)); // Сложение даёт абсолютное значение времени (в миллисекундах), когда токен должен стать недействительным

    // данные для модели RefreshToken
    await prisma.refreshToken.create({
      data: {
        tokenHash: sha256(refreshToken),
        userId: user.id,
        expiresAt: expiresAt,
      },
    });

    // refresh токен — в httpOnly cookie
    res.cookie("refresh_token", refreshToken, {
      httpOnly: true,
      sameSite: "lax",
      secure: cookieSecure,
      path: "/",
      maxAge: ms(refreshTtl),
    });

    // access токен можно вернуть в json
    return res.json({
      accessToken,
      user: { id: user.id, email: user.email, role: user.role },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Ошибка сервера" });
  }
});

//  REFRESH получить новый accessToken
// для обновления access-токена, когда он истёк
router.post("/refresh", async (req: Request, res: Response) => {
  try {
    // Извлечение refresh токена из cookies
    const token = req.cookies?.refresh_token as string | undefined;
    // Если токен не найден
    if (!token) return res.status(401).json({ message: "Нет refresh token" });

    // Верификация JWT
    let payload: any;
    try {
      // проверяем подпись токена
      payload = jwt.verify(token, requireEnv("JWT_REFRESH_SECRET"));
    } catch {
      return res.status(401).json({ message: "Refresh token недействителен" });
    }

    // Хеширование токена
    const tokenHash = sha256(token);

    // Поиск токена в базе данных
    const dbToken = await prisma.refreshToken.findFirst({
      where: {
        userId: payload.sub,
        tokenHash,
        revokedAt: null,
        expiresAt: { gt: new Date() },
      },
    });

    // если токен отсутствует в БД
    if (!dbToken)
      return res.status(401).json({ message: "Refresh token отозван/истек" });

    // Поиск пользователя в базе
    const user = await prisma.user.findUnique({
      where: { id: payload.sub },
      select: { id: true, role: true, email: true },
    });

    if (!user)
      return res.status(401).json({ message: "Пользователь не найден" });

    // Генерация нового access-токена
    const accessToken = signAccessToken({ sub: user.id, role: user.role });

    // Отправка ответа
    return res.json({ accessToken, user });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Ошибка сервера" });
  }
});

router.get("/logout", async (req: Request, res: Response) => {
  const token = (req.cookies?.refresh_token as string) || undefined;
  if (token) {
    await prisma.refreshToken.updateMany({
      where: { tokenHash: sha256(token), revokedAt: null },
      data: { revokedAt: new Date() },
    });
  }

  res.clearCookie("refresh_token", { path: "/" });
  return res.json({ ok: true });
});

export default router;
