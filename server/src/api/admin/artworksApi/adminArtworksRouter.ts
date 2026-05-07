import { Request, Response, Router } from "express";
import {
  requireAdmin,
  requireAuth,
} from "../../../middlewares/authSecurity.js";
import { prisma } from "../../../db/prisma/prisma.js";
import { Prisma, ArtworkCategory, ArtworkGroup } from "@prisma/client";
import { validate as isUUID } from "uuid";
import { deleteFromS3 } from "../../../services/s3.js";

const router = Router();

// Защита middleware
router.use(
  requireAuth, // Сначала проверяется токен
  requireAdmin,
); // потом роль

// функция на проверку, что данные это число и оно не отрицательное
function isNonNegativeInteger(value: unknown) {
  return Number.isInteger(value) && Number(value) >= 0;
}

// валидация seo
function isValidSlug(value: string) {
  return /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value);
}

// GET /api/admin/artwork
// добрабатываю запрос что бы работал и в качестве поиска по title
router.get("/artworks", async (req: Request, res: Response) => {
  try {
    // если есть данные для посика
    const search =
      typeof req.query.search === "string" ? req.query.search.trim() : "";

    // если нужны данные для статуса публикации. получаем сначала status
    const status =
      typeof req.query.status === "string" ? req.query.status : "all";

    // список картин
    const artworks = await prisma.artwork.findMany({
      // если поиск был запрошен
      // where: search
      //   ? {
      //       title: {
      //         contains: search,
      //         mode: "insensitive",
      //       },
      //     }
      //   : // если поиск не дал результатов
      //     undefined,
      // orderBy: { createdAt: "desc" },

      where: {
        ...(search
          ? {
              title: {
                contains: search,
                mode: "insensitive",
              },
            }
          : {}),
        ...(status === "published"
          ? { isPublished: true }
          : status === "draft"
            ? { isPublished: false }
            : {}),
      },
      orderBy: { createdAt: "desc" },

      // API будет возвращать меньше данных: быстрее, чище, безопаснее
      select: {
        id: true,
        title: true,
        titleEn: true,
        slug: true,
        artworkGroup: true,
        category: true,
        isPublished: true,
        createdAt: true,
        updatedAt: true,
        image: {
          select: {
            id: true,
            url: true,
          },
        },
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
      title,
      titleEn,
      slug,
      description,
      year,
      widthCm,
      heightCm,
      materials,
      priceCents,
      currency,
      artworkGroup,
      category,
      isPublished,
    } = req.body;

    // нормализация title/slug перед созданием. не попадут пустые строки
    // чтобы если  title или slug не придут, сервер не упал до проверки
    const cleanTitle = typeof title === "string" ? title.trim() : "";
    const cleanTitleEn = typeof titleEn === "string" ? titleEn.trim() : "";
    const cleanSlug = typeof slug === "string" ? slug.trim() : "";

    // если не указан title
    if (!cleanTitle || cleanTitle.length < 2) {
      return res
        .status(400)
        .json({ message: "title должен содержать минимум 2 символа" });
    }

    // если не указан titleEn
    if (!cleanTitleEn || cleanTitleEn.length < 2) {
      return res
        .status(400)
        .json({ message: "title должен содержать минимум 2 символа" });
    }

    // если не указан slug
    if (!cleanSlug || !isValidSlug(cleanSlug)) {
      return res.status(400).json({
        message: "slug должен быть в формате: latin letters, numbers, hyphen",
      });
    }

    if (year !== undefined && year !== null && !isNonNegativeInteger(year)) {
      return res
        .status(400)
        .json({ message: "year должен быть неотрицательным целым числом" });
    }

    if (
      widthCm !== undefined &&
      widthCm !== null &&
      !isNonNegativeInteger(widthCm)
    ) {
      return res
        .status(400)
        .json({ message: "widthCm должен быть неотрицательным целым числом" });
    }

    if (
      heightCm !== undefined &&
      heightCm !== null &&
      !isNonNegativeInteger(heightCm)
    ) {
      return res
        .status(400)
        .json({ message: "heightCm должен быть неотрицательным целым числом" });
    }

    if (
      priceCents !== undefined &&
      priceCents !== null &&
      !isNonNegativeInteger(priceCents)
    ) {
      return res.status(400).json({
        message: "priceCents должен быть неотрицательным целым числом",
      });
    }

    // проверка если клиент передаёт эти поля, то их значения обязательно должны быть допустимыми вариантами, определёнными в Prisma-схеме
    // Проверка category
    if (
      category !== undefined &&
      category !== null &&
      !Object.values(ArtworkCategory).includes(category as ArtworkCategory)
    ) {
      return res.status(400).json({ message: "Такой категории нет" });
    }

    // Проверка artworkGroup
    if (
      artworkGroup !== undefined &&
      artworkGroup !== null &&
      !Object.values(ArtworkGroup).includes(artworkGroup as ArtworkGroup)
    ) {
      return res.status(400).json({ message: "Такой группы нет" });
    }

    // создаем artwork
    const artwork = await prisma.artwork.create({
      data: {
        title: cleanTitle,
        titleEn: cleanTitleEn,
        slug: cleanSlug,
        description,
        year,
        widthCm,
        heightCm,
        materials,
        priceCents,
        currency,
        artworkGroup: artworkGroup,
        category: category,
        isPublished,
      },
    });

    // отправляем на клиент
    return res.status(201).json(artwork);
  } catch (error) {
    console.error("POST /artworks error:", error);
    // проверяем, является ли перехваченная ошибка известной ошибкой Prisma. Такие ошибки имеют специальный формат и код, по которому можно понять, что именно пошло не так.
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      // Код P2002 означает попытку нарушить уникальность поля например, вставить запись с уже существующим значением поля, которое должно быть уникальным
      if (error.code === "P2002") {
        return res.status(400).json({ message: "slug уже существует" });
      }
      // если проблема в prisma
      if (error.code === "P2022") {
        return res
          .status(500)
          .json({ message: "Схема Prisma не совпадает с базой данных" });
      }
    }
    return res.status(500).json({ message: "Ошибка сервера" });
  }
});

// маршрут для получения одной картины
router.get("/artworks/:id", async (req: Request, res: Response) => {
  const id = req.params.id as string;
  try {
    // проверка id
    if (!isUUID(id)) {
      return res.status(400).json({ message: "Некорректный id" });
    }
    // ищем artwork в бд
    const artwork = await prisma.artwork.findUnique({
      where: { id },
      // добавляем к нему связанные записи из таблицы Image
      include: {
        image: true,
      },
    });

    // если artwork не найден
    if (!artwork) {
      return res.status(404).json({ message: "Поиск не дал результатов" });
    }
    return res.status(200).json(artwork);
  } catch {
    return res.status(500).json({ message: "Ошибка сервера" });
  }
});

// маршрут изменения картины
router.patch("/artworks/:id", async (req: Request, res: Response) => {
  const id = req.params.id as string;
  const {
    title,
    titleEn,
    slug,
    description,
    year,
    widthCm,
    heightCm,
    materials,
    priceCents,
    currency,
    artworkGroup,
    category,
    isPublished,
  } = req.body;
  try {
    // проверка id
    if (!isUUID(id)) {
      return res.status(400).json({ message: "Некорректный id" });
    }
    // ищем по id
    const artwork = await prisma.artwork.findUnique({
      where: { id },
      select: { id: true },
    });

    // если не найден в базе данных
    if (!artwork) {
      return res.status(404).json({ message: "artwork не найден" });
    }

    // Инициализируем все строковые поля для корректной работы
    const cleanTitle = typeof title === "string" ? title.trim() : undefined;
    const cleanTitleEn =
      typeof titleEn === "string" ? titleEn.trim() : undefined;
    const cleanSlug = typeof slug === "string" ? slug.trim() : undefined;
    const cleanDescription =
      typeof description === "string" ? description.trim() : undefined;
    const cleanMaterials =
      typeof materials === "string" ? materials.trim() : undefined;
    const cleanCurrency =
      typeof currency === "string" ? currency.trim() : undefined;

    // были ли поля переданы в запросе для наименования
    if (title !== undefined && (!cleanTitleEn || cleanTitleEn.length < 2)) {
      return res
        .status(400)
        .json({ message: "title должен содержать минимум 2 символа" });
    }
    // были ли поля переданы в запросе для наименования
    if (titleEn !== undefined && (!cleanTitle || cleanTitle.length < 2)) {
      return res
        .status(400)
        .json({ message: "title должен содержать минимум 2 символа" });
    }

    // были ли поля переданы в запросе для url
    if (slug !== undefined && (!cleanSlug || !isValidSlug(cleanSlug))) {
      return res.status(400).json({
        message: "slug должен быть в формате: latin letters, numbers, hyphen",
      });
    }

    // Проверка category
    if (
      category !== undefined &&
      (typeof category !== "string" ||
        !Object.values(ArtworkCategory).includes(category as ArtworkCategory))
    ) {
      return res.status(400).json({ message: "Некорректная категория" });
    }

    // Проверка artworkGroup
    if (
      artworkGroup !== undefined &&
      (typeof artworkGroup !== "string" ||
        !Object.values(ArtworkGroup).includes(artworkGroup as ArtworkGroup))
    ) {
      return res.status(400).json({ message: "Некорректная группа" });
    }

    // валидация  isPublished
    if (isPublished !== undefined && typeof isPublished !== "boolean") {
      return res
        .status(400)
        .json({ message: "isPublished должен быть boolean" });
    }

    // функция преобразования числовых полей в значение number
    function toOptionalInt(value: unknown) {
      if (value === undefined) return undefined;
      if (value === null || value === "") return null;

      const num = Number(value);

      if (!Number.isInteger(num)) {
        throw new Error("Не допустимое значение int");
      }

      return num;
    }

    // преобразвание числовых полей
    let parsedYear: number | null | undefined;
    let parsedWidthCm: number | null | undefined;
    let parsedHeightCm: number | null | undefined;
    let parsedPriceCents: number | null | undefined;

    try {
      parsedYear = toOptionalInt(year);
      parsedWidthCm = toOptionalInt(widthCm);
      parsedHeightCm = toOptionalInt(heightCm);
      parsedPriceCents = toOptionalInt(priceCents);
    } catch {
      return res
        .status(400)
        .json({ message: "Числовые поля должны быть целыми числами" });
    }

    // проверка  на не отрицательное число
    if (parsedYear !== undefined && parsedYear !== null && parsedYear < 0) {
      return res
        .status(400)
        .json({ message: "year должен быть неотрицательным" });
    }

    // проверка  на не отрицательное число
    if (
      parsedWidthCm !== undefined &&
      parsedWidthCm !== null &&
      parsedWidthCm < 0
    ) {
      return res
        .status(400)
        .json({ message: "widthCm должен быть неотрицательным" });
    }

    // проверка  на не отрицательное число
    if (
      parsedHeightCm !== undefined &&
      parsedHeightCm !== null &&
      parsedHeightCm < 0
    ) {
      return res
        .status(400)
        .json({ message: "heightCm должен быть неотрицательным" });
    }

    // проверка  на не отрицательное число
    if (
      parsedPriceCents !== undefined &&
      parsedPriceCents !== null &&
      parsedPriceCents < 0
    ) {
      return res
        .status(400)
        .json({ message: "priceCents должен быть неотрицательным" });
    }

    // объект для обновления
    const data: Record<string, unknown> = {};

    // инициализаци объекта data
    if (cleanTitle !== undefined) data.title = cleanTitle;
    if (cleanTitleEn !== undefined) data.titleEn = cleanTitleEn;
    if (cleanSlug !== undefined) data.slug = cleanSlug;
    if (cleanDescription !== undefined)
      data.description = cleanDescription || null;
    if (cleanMaterials !== undefined) data.materials = cleanMaterials || null;
    if (cleanCurrency !== undefined) data.currency = cleanCurrency || null;
    if (parsedYear !== undefined) data.year = parsedYear;
    if (parsedWidthCm !== undefined) data.widthCm = parsedWidthCm;
    if (parsedHeightCm !== undefined) data.heightCm = parsedHeightCm;
    if (parsedPriceCents !== undefined) data.priceCents = parsedPriceCents;
    if (artworkGroup !== undefined) data.artworkGroup = artworkGroup;
    if (category !== undefined) data.category = category;
    if (isPublished !== undefined) data.isPublished = isPublished;

    // если ничего не передали
    if (Object.keys(data).length === 0) {
      return res.status(400).json({ message: "Нет данных для обновления" });
    }

    // обновляем
    const update = await prisma.artwork.update({
      where: { id },
      data,
      // отправляем модель image
      include: {
        image: true,
      },
    });

    return res.json(update);
  } catch (error) {
    console.error("PATCH /artworks/:id error:", error);
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2002") {
        return res.status(400).json({ message: "slug уже существует" });
      }
    }
    console.log(error);
    return res.status(500).json({ message: "Ошибка сервера" });
  }
});

// маршрут удаления картины
router.delete("/artworks/:id", async (req: Request, res: Response) => {
  const id = req.params.id as string;
  try {
    // валидность id
    if (!isUUID(id)) {
      return res.status(400).json({ message: "Некорректный id" });
    }

    // ищем картину в базе данных
    const artwork = await prisma.artwork.findUnique({
      where: { id },
      include: { image: true },
    });

    // если не найден
    if (!artwork) {
      return res.status(404).json({ message: "artwork не найден" });
    }

    // если image сушествует удаляем из minIo
    if (artwork.image) {
      await deleteFromS3({ key: artwork?.image?.key });
    }

    // удалем саму картину
    await prisma.artwork.delete({ where: { id } });

    return res.json({ ok: true });
  } catch (error) {
    console.error("DELETE /artworks/:id error:", error);
    return res.status(500).json({ message: "Ошибка сервера" });
  }
});

export default router;
