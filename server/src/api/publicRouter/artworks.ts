import { Request, Response, Router } from "express";
import { prisma } from "../../db/prisma/prisma.js";

const router = Router();

// возвращает только isPublished: true. список для публичной страницы
router.get("/artworks", async (req: Request, res: Response) => {
  try {
    // Забираем все опубликованные картины
    const artworks = await prisma.artwork.findMany({
      where: { isPublished: true }, // отдаем только те картины у которых статус = опубликован
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        title: true,
        titleEn: true,
        slug: true,
        description: true,
        year: true,
        widthCm: true,
        heightCm: true,
        materials: true,
        priceCents: true,
        currency: true,
        artworkGroup: true,
        category: true,
        image: {
          select: {
            url: true,
          },
        },
      },
    });
    // отправляем на фронт
    return res.json(artworks);
  } catch (error) {
    console.error("GET /api/artworks error:", error);
    return res.status(500).json({ message: "Ошибка сервера" });
  }
});

// возвращает только опубликованную картину по slug. для того что бы была отдельная страница одной картины в публичной части
router.get("/artworks/:slug", async (req: Request, res: Response) => {
  try {
    // типизируем параметр
    const slug = String(req.params.slug || "").trim();

    // если параметр не выдан
    if (!slug) {
      return res.status(400).json({ message: "Некорректный slug" });
    }

    // ищем картину по параметру slug
    const artwork = await prisma.artwork.findFirst({
      where: {
        slug,
        isPublished: true,
      },
      select: {
        id: true,
        title: true,
        slug: true,
        description: true,
        year: true,
        widthCm: true,
        heightCm: true,
        materials: true,
        priceCents: true,
        currency: true,
        artworkGroup: true,
        category: true,
        image: {
          select: {
            url: true,
          },
        },
      },
    });

    // если картина не найдена
    if (!artwork) {
      return res.status(404).json({ message: "Картина не найдена" });
    }
    // отправляем результат
    return res.json(artwork);
  } catch (error) {
    console.error("GET /api/artworks/:slug error:", error);
    return res.status(500).json({ message: "Ошибка сервера" });
  }
});

export default router;
