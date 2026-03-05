import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

// проверка access-токена
export function requireAuth(req: Request, res: Response, next: NextFunction) {
  //стандартный способ получить заголовок Authorization
  const header = req.header("authorization");

  const token = header?.startsWith("Bearer ") ? header.slice(7) : null;

  if (!token) return res.status(401).json({ message: "Нет токена" });
  try {
    // принимает токен и секретный ключ. Если токен действителен, возвращает декодированный payload
    const payload = jwt.verify(token, process.env.JWT_ACCESS_SECRET!); // ! переменная окружения точно определена (не undefined)
    // Сохранение payload: (req as any).auth = payload — добавляет поле auth к объекту req
    //  берем глобально req
    req.auth = payload as any;
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
