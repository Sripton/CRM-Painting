import { Request, Response, Router } from "express";
import { requireAdmin, requireAuth } from "../../middlewares/authSecurity.js";
import { prisma } from "../../db/prisma/prisma.js";
const router = Router();

// Защита middleware
router.use(
  requireAuth, // Сначала проверяется токен
  requireAdmin,
); // потом роль

// GET /api/admin/artworks
router.get("/artworks", async (req: Request, res: Response) => {
  try {
    // список картин
    const artworks = await prisma.artwork.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        coverImage: true,
      },
    });
    return res.json(artworks);
  } catch {
    return res.status(500).json({ message: "Ошибка сервера" });
  }
});

// POST /api/admin/artworks
router.post("/artworks", async (req: Request, res: Response) => {
  try {
    const {
      title, // название
      slug, // это строка для URL. безопасное название для URL
      description, // описание
      year, // год
      widthCm, // ширина
      heightCm, // высота
      materials, // материал
      priceCents, // цена
      currency, // валюта
      category, // категория
      isPublished, // опубликован/неопубликован
    } = req.body;

    // если не дали и не указали url
    if (!title || !slug) {
      return res.status(400).json({ message: "title и slug обязательны" });
    }

    // создаем artwork
    const artwork = await prisma.artwork.create({
      data: {
        title,
        slug,
        description,
        year,
        widthCm,
        heightCm,
        materials,
        priceCents,
        currency,
        category,
        isPublished,
      },
    });

    // отправляем на клиент
    return res.status(201).json(artwork);
  } catch {
    return res.status(500).json({ message: "Ошибка сервера" });
  }
});

export default router;
