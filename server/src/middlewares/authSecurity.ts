import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

// вспомогательная функция  для безопасного чтения переменных окружения
function requireEnv(name: string) {
  const v = process.env[name];
  if (!v) throw new Error(`Missing env: ${name}`);
  return v;
}
// проверка access-токена
export function requireAuth(req: Request, res: Response, next: NextFunction) {
  //стандартный способ получить заголовок Authorization
  const header = req.header("authorization");
  // получаем token
  const token = header?.startsWith("Bearer ") ? header.slice(7) : null;

  if (!token) return res.status(401).json({ message: "Нет токена" });
  try {
    // принимает токен и секретный ключ. Если токен действителен, возвращает декодированный payload
    const payload = jwt.verify(token, requireEnv("JWT_ACCESS_SECRET")); // ! переменная окружения точно определена (не undefined)

    // проверка
    if (typeof payload !== "object" || payload === null) {
      return res.status(401).json({ message: "Некорректный токен" });
    }

    // Данные
    const sub = payload.sub;
    const role = payload.role;

    // проверка данных
    if (typeof sub !== "string" || typeof role !== "string") {
      return res.status(401).json({ message: "Некорректный payload токена" });
    }

    req.auth = { sub, role };
    next(); // Передаем управление
  } catch {
    // если нет — выбрасывает исключение.
    return res.status(401).json({ message: "Токен недействителен/истек" });
  }
}

export function requireAdmin(req: Request, res: Response, next: NextFunction) {
  const auth = req.auth;
  if (!auth || auth.role !== "ADMIN") {
    return res.status(403).json({ message: "Только для ADMIN" });
  }
  next();
}
