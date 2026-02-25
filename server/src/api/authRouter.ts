import { Request, Response, Router } from "express";
import { prisma } from "../db/prisma.js";
import bcrypt from "bcrypt";
const router = Router();

// Маршрут для  создания пользовтаеля/admin
router.post("/setup", async (req: Request, res: Response) => {
  try {
    // Проверка токена
    const token = req.header("x-setup-token"); // x-setup-token: some-long-random-string

    if (
      !process.env.SETUP_TOKEN || // Есть ли SETUP_TOKEN в .env
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

// Маршрут для  логирования
router.post("/login", async (req: Request, res: Response) => {});

export default router;
