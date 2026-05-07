import { Request, Response, Router } from "express";
import { prisma } from "../../db/prisma/prisma.js";
const router = Router();

router.get("/publications", async (req: Request, res: Response) => {
  try {
    // Забираем все опубликованные
    const publications = await prisma.publication.findMany({
      where: { isPublished: true },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        type: true,
        title: true,
        titleEn: true,
        slug: true,
        body: true,
        bodyEn: true,
        quoteText: true,
        quoteTextEn: true,
        isPublished: true,
        publishedAt: true,
        coverImage: {
          select: {
            id: true,
            url: true,
          },
        },
      },
    });

    // отправляем на фронт
    return res.json(publications);
  } catch (error) {
    console.error("GET /api/artworks error:", error);
    return res.status(500).json({ message: "Ошибка сервера" });
  }
});

export default router;
