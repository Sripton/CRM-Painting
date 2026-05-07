import { Request, Response, Router } from "express";
import { prisma } from "../../../db/prisma/prisma.js";
import { PublicationType } from "@prisma/client";
import { requireAuth, requireAdmin } from "../../../middlewares/authSecurity.js";
import { validate as isUUID } from "uuid";
import { deleteFromS3 } from "../../../services/s3.js";
const router = Router();

// Защита middleware
router.use(
  requireAuth, // Сначала проверяется токен
  requireAdmin,
);

// проверка на валидность slug
function isValidSlug(value: string) {
  return /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value);
}

// проверка на валидность строки
function normalizeNullableString(value: unknown): string | null | undefined {
  if (value === null) return null;
  if (value === undefined) return undefined;
  if (typeof value !== "string") return undefined;

  const trimmed = value.trim();
  return trimmed === "" ? null : trimmed;
}

// проверка на валидность даты
function parseOptionalDate(value: unknown): Date | null | undefined {
  if (value === undefined) return undefined;
  if (value === null || value === "") return null;

  // Если строка имеет правильный формат (например, "2025-12-31"), получаем нормальную дату.
  const date = new Date(String(value)); // создаём дату из строки

  // проверяет, равно ли значение NaN. Если да – дата невалидна, и выбрасывается ошибка.
  if (Number.isNaN(date.getTime())) {
    throw new Error("Некорректная дата");
  }
  return date;
}

function validatePublicationFields(input: {
  type: PublicationType;
  title?: string | null;
  titleEn?: string | null;
  slug?: string | null;
  body?: string | null;
  bodyEn?: string | null;
  quoteText?: string | null;
  quoteTextEn?: string | null;
}) {
  const { type, title, slug, body, quoteText } = input;

  // Для APHORISM логично требовать цитату
  if (type === "APHORISM") {
    if (!quoteText || quoteText.trim().length < 1) {
      return "Поле обязательно";
    }

    if (slug && !isValidSlug(slug)) {
      return "slug должен быть в формате: latin letters, numbers, hyphen";
    }
    return null;
  }

  // Для остальных типов обязательны title/titleEn/slug/body/bodyEn
  if (!title || title.trim().length < 2) {
    return "title должен содержать минимум 2 символа";
  }

  if (!slug || !isValidSlug(slug)) {
    return "slug должен быть в формате: latin letters, numbers, hyphen";
  }
  if (!body || body.trim().length < 1) {
    return "body обязателен";
  }

  return null;
}

// GET маршрут для получения всех публикаций /api/admin/publications
router.get("/publications", async (req: Request, res: Response) => {
  try {
    const search =
      typeof req.query.search === "string" ? req.query.search.trim() : "";
    const status =
      typeof req.query.status === "string" ? req.query.status : "all";
    const type = typeof req.query.type === "string" ? req.query.type : "";

    const publications = await prisma.publication.findMany({
      where: {
        ...(search
          ? {
              OR: [
                { title: { contains: search, mode: "insensitive" } },
                { titleEn: { contains: search, mode: "insensitive" } },
                { slug: { contains: search, mode: "insensitive" } },
                { quoteText: { contains: search, mode: "insensitive" } },
              ],
            }
          : {}),

        ...(status === "published"
          ? { isPublished: true }
          : status === "draft"
            ? { isPublished: false }
            : {}),

        ...(type &&
        Object.values(PublicationType).includes(type as PublicationType)
          ? { type: type as PublicationType }
          : {}),
      },

      orderBy: [{ publishedAt: "desc" }, { createdAt: "desc" }],
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
        createdAt: true,
        updatedAt: true,
        coverImage: {
          select: {
            id: true,
            url: true,
          },
        },
      },
    });
    return res.json(publications);
  } catch (error) {
    console.error("GET /publications error:", error);
    return res.status(500).json({ message: "Ошибка сервера" });
  }
});

// POST маршрут для создания публикации /api/admin/publications
router.post("/publications", async (req: Request, res: Response) => {
  try {
    const {
      type,
      title,
      titleEn,
      slug,
      body,
      bodyEn,
      quoteText,
      quoteTextEn,
      isPublished,
      publishedAt,
    } = req.body;

    // проверка на валидность type
    if (!Object.values(PublicationType).includes(type as PublicationType)) {
      return res.status(400).json({ message: "Некорректный тип публикации" });
    }

    // валидность вводимых строк
    const cleanTitle = normalizeNullableString(title);
    const cleanTitleEn = normalizeNullableString(titleEn);
    const cleanSlug = normalizeNullableString(slug);
    const cleanBody = normalizeNullableString(body);
    const cleanBodyEn = normalizeNullableString(bodyEn);
    const cleanQuoteText = normalizeNullableString(quoteText);
    const cleanQuoteTextEn = normalizeNullableString(quoteTextEn);

    const validationError = validatePublicationFields({
      type: type as PublicationType,
      title: cleanTitle ?? undefined,
      titleEn: cleanTitleEn ?? undefined,
      slug: cleanSlug ?? undefined,
      body: cleanBody ?? undefined,
      bodyEn: cleanBodyEn ?? undefined,
      quoteText: cleanQuoteText ?? undefined,
      quoteTextEn: cleanQuoteTextEn ?? undefined,
    });

    // если выявлена ошибка отображаем его
    if (validationError) {
      return res.status(400).json({ message: validationError });
    }

    if (isPublished !== undefined && typeof isPublished !== "boolean") {
      return res
        .status(400)
        .json({ message: "isPublished должен быть boolean" });
    }

    let parsedPublishedAt: Date | null | undefined;

    try {
      parsedPublishedAt = parseOptionalDate(publishedAt);
    } catch {
      return res
        .status(400)
        .json({ message: "Некорректный формат publishedAt" });
    }

    // создание публикации
    const publication = await prisma.publication.create({
      data: {
        type: type as PublicationType,
        title: cleanTitle ?? null,
        titleEn: cleanTitleEn ?? null,
        slug: cleanSlug ?? null,
        body: cleanBody ?? null,
        bodyEn: cleanBodyEn ?? null,
        quoteText: cleanQuoteText ?? null,
        quoteTextEn: cleanQuoteTextEn ?? null,
        isPublished: typeof isPublished === "boolean" ? isPublished : false,
        publishedAt: parsedPublishedAt !== undefined ? parsedPublishedAt : null,
      },
      include: {
        coverImage: true,
      },
    });
    // отправляем данные на клиент
    return res.status(201).json(publication);
  } catch {
    return res.status(500).json({ message: "Ошибка сервера" });
  }
});

// GET /api/admin/publications/:id
router.get("/publications/:id", async (req: Request, res: Response) => {
  try {
    // берем id из параметров
    const id = req.params.id as string;

    if (!isUUID(id)) {
      return res.status(400).json({ message: "Некорректный id" });
    }

    // ищем публикацию по id
    const publication = await prisma.publication.findUnique({
      where: { id },
      include: { coverImage: true },
    });

    if (!publication) {
      return res.status(404).json({ message: "Публикация не найдена" });
    }

    return res.json(publication);
  } catch (error) {
    console.error("GET /publications/:id error:", error);
    return res.status(500).json({ message: "Ошибка сервера" });
  }
});

// PATCH /api/admin/publications/:id
router.patch("/publications/:id", async (req: Request, res: Response) => {
  try {
    // берем id из параметров
    const id = req.params.id as string;

    if (!isUUID(id)) {
      return res.status(400).json({ message: "Некорректный id" });
    }

    // проверка на существование публикации
    const existingPublication = await prisma.publication.findUnique({
      where: { id },
      select: {
        id: true,
        type: true,
      },
    });

    if (!existingPublication) {
      return res.status(404).json({ message: "Публикация не найдена" });
    }

    const {
      type,
      title,
      titleEn,
      slug,
      body,
      bodyEn,
      quoteText,
      quoteTextEn,
      isPublished,
      publishedAt,
    } = req.body;

    // валидация для type
    if (
      type !== undefined &&
      !Object.values(PublicationType).includes(type as PublicationType)
    ) {
      return res.status(400).json({ message: "Некорректный тип публикации" });
    }

    // update для type
    const nextType =
      (type as PublicationType | undefined) ?? existingPublication.type;

    // normalize для строк
    const cleanTitle = normalizeNullableString(title);
    const cleanTitleEn = normalizeNullableString(titleEn);
    const cleanSlug = normalizeNullableString(slug);
    const cleanBody = normalizeNullableString(body);
    const cleanBodyEn = normalizeNullableString(bodyEn);
    const cleanQuoteText = normalizeNullableString(quoteText);
    const cleanQuoteTextEn = normalizeNullableString(quoteTextEn);

    // собираем будущие знаяения для валидации
    const currentPublication = await prisma.publication.findUnique({
      where: { id },
      select: {
        title: true,
        titleEn: true,
        slug: true,
        body: true,
        bodyEn: true,
        quoteText: true,
        quoteTextEn: true,
      },
    });

    if (!currentPublication) {
      return res.status(404).json({ message: "Публикция не найена" });
    }

    const merged = {
      type: nextType,
      title: cleanTitle !== undefined ? cleanTitle : currentPublication.title,
      titleEn:
        cleanTitleEn !== undefined ? cleanTitleEn : currentPublication.titleEn,
      slug: cleanSlug !== undefined ? cleanSlug : currentPublication.slug,
      body: cleanBody !== undefined ? cleanBody : currentPublication.body,
      bodyEn:
        cleanBodyEn !== undefined ? cleanBodyEn : currentPublication.bodyEn,
      quoteText:
        cleanQuoteText !== undefined
          ? cleanQuoteText
          : currentPublication.quoteText,
      quoteTextEn:
        cleanQuoteTextEn !== undefined
          ? cleanQuoteTextEn
          : currentPublication.quoteTextEn,
    };

    // валидация. предосталвенных данных
    const validationError = validatePublicationFields({
      type: merged.type,
      title: merged.title ?? undefined,
      titleEn: merged.titleEn ?? undefined,
      slug: merged.slug ?? undefined,
      body: merged.body ?? undefined,
      bodyEn: merged.bodyEn ?? undefined,
      quoteText: merged.quoteText ?? undefined,
      quoteTextEn: merged.quoteTextEn ?? undefined,
    });

    if (validationError) {
      return res
        .status(400)
        .json({ message: `validationError = ${validationError}` });
    }

    // если публикация существвет но статуc
    if (isPublished !== undefined && typeof isPublished !== "boolean") {
      return res.status(400).json({ message: "isPublished не верный тип" });
    }

    // валидируем дату
    let parsedPublishedAt: Date | null | undefined;

    try {
      parsedPublishedAt = parseOptionalDate(publishedAt);
    } catch {
      return res.status(400).json({ message: "Не корректный формат" });
    }

    // данные для изменения
    const data: Record<string, unknown> = {};
    if (type !== undefined) data.type = type;
    if (cleanTitle !== undefined) data.title = cleanTitle;
    if (cleanTitleEn !== undefined) data.titleEn = cleanTitleEn;
    if (cleanSlug !== undefined) data.slug = cleanSlug;
    if (cleanBody !== undefined) data.body = cleanBody;
    if (cleanBodyEn !== undefined) data.bodyEn = cleanBodyEn;
    if (cleanQuoteText !== undefined) data.quoteText = cleanQuoteText;
    if (cleanQuoteTextEn !== undefined) data.quoteTextEn = cleanQuoteTextEn;
    if (isPublished !== undefined) data.isPublished = isPublished;
    if (publishedAt !== undefined) data.publishedAt = parsedPublishedAt;

    // если данные были не переданы
    if (Object.keys(data).length === 0) {
      return res.status(400).json({ message: "Данные были не переданы" });
    }

    // обновление
    const update = await prisma.publication.update({
      where: { id },
      data,
      include: { coverImage: true },
    });

    // отправялем ответ
    return res.json(update);
  } catch (error) {
    console.error("PATCH /publications/:id error:", error);
    return res.status(500).json({ message: "Ошибка сервера" });
  }
});

// DELETE /api/admin/publications/:id
router.delete("/publications/:id", async (req: Request, res: Response) => {
  // Забираем парамметр id
  const id = req.params.id as string;
  try {
    if (!isUUID(id)) {
      return res.status(400).json({ message: "Некорректный id" });
    }

    // ищем публикацию по id
    const publication = await prisma.publication.findUnique({
      where: { id },
      include: { coverImage: true },
    });

    // если публикация не найдена
    if (!publication) {
      return res.status(404).json({ message: "Публикация не найдена" });
    }

    // если у публикации существует coverImage
    // сначала удаляем файл с помошью deleteFromS3
    // а сама запись  PublicationImage удалится каскадом
    if (publication.coverImage) {
      await deleteFromS3({ key: publication?.coverImage?.key });
    }

    // удаляем запись
    await prisma.publication.delete({
      where: { id },
    });

    // отправялем успещный ответ при удалении
    return res.status(200).json({ ok: true });
  } catch (error) {
    console.error("DELETE /publications/:id error:", error);
    return res.status(500).json({ message: "Ошибка сервера" });
  }
});

export default router;
