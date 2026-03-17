import { Request, Response, Router } from "express";
import { requireAdmin, requireAuth } from "../../middlewares/authSecurity.js";
import { prisma } from "../../db/prisma/prisma.js";
import { Prisma } from "@prisma/client";
import { validate as isUUID } from "uuid";
import { deleteFromS3 } from "../../services/s3.js";
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
      // include: {
      //   coverImage: true,
      // },
      // API будет возвращать меньше данных: быстрее, чище, безопаснее
      select: {
        id: true,
        title: true,
        slug: true,
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

    // нормализация title/slug перед созданием. не попадут пустые строки
    // чтобы если  title или slug не придут, сервер не упал до проверки
    const cleanTitle = typeof title === "string" ? title.trim() : "";
    const cleanSlug = typeof slug === "string" ? slug.trim() : "";

    // если не указали
    if (!cleanTitle || !cleanSlug) {
      return res.status(400).json({ message: "title и slug обязательны" });
    }
    // нормализация категорий. уточнить у заказчика ???????????????
    const allowedCategories = ["PAINTING", "WATERCOLOR", "WALL_PAINTING"];

    // проверка
    if (category && !allowedCategories.includes(category)) {
      return res.status(400).json({ message: "Такой категория нет" });
    }

    // создаем artwork
    const artwork = await prisma.artwork.create({
      data: {
        title: cleanTitle,
        slug: cleanSlug,
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
  } = req.body; // данные для редактирования
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
    const cleanSlug = typeof slug === "string" ? slug.trim() : undefined;
    const cleanDescription =
      typeof description === "string" ? description.trim() : undefined;
    const cleanMaterials =
      typeof materials === "string" ? materials.trim() : undefined;
    const cleanCurrency =
      typeof currency === "string" ? currency.trim() : undefined;

    // были ли поля переданы в запросе для наименования
    if (
      title !== undefined &&
      // если после дулаения пробелов оказалось пустой строкой
      !cleanTitle // становится истинным, если после удаления пробелов строка оказалась пустой
    ) {
      return res.status(400).json({ message: "title не может быть пустым" });
    }

    // были ли поля переданы в запросе для url
    if (
      slug !== undefined &&
      !cleanSlug // становится истинным, если после удаления пробелов строка оказалась пустой
    ) {
      return res.status(400).json({ message: "slug не может быть пустым" });
    }
    // Выбор категории
    const allowedCategories = [
      "PAINTING",
      "WATERCOLOR",
      "WALL_PAINTING",
    ] as const;

    //если не соответствует категория
    if (
      category !== undefined &&
      (typeof category !== "string" ||
        !allowedCategories.includes(category as any))
    ) {
      return res.status(400).json({ message: "Некорректная категория" });
    }

    // валидация  isPublished
    if (isPublished !== undefined && typeof isPublished !== "boolean") {
      return res
        .status(400)
        .json({ message: "isPublished должен быть boolean" });
    }

    // функция преобразования числовых полей в значение number
    function toOptionalInt(value: unknown) {
      // если value не является числом
      if (value === undefined || value === null || value === "") return null;
      // преобразование value в число
      const num = Number(value);
      //дополнительная проверка на integer
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
      parsedYear = year !== undefined ? toOptionalInt(year) : undefined;
      parsedWidthCm =
        widthCm !== undefined ? toOptionalInt(widthCm) : undefined;
      parsedHeightCm =
        heightCm !== undefined ? toOptionalInt(heightCm) : undefined;
      parsedPriceCents =
        priceCents !== undefined ? toOptionalInt(priceCents) : undefined;
    } catch {
      return res
        .status(400)
        .json({ message: "Числовые поля должны быть целыми числами" });
    }

    // объект для обновления
    const data: any = {};

    // инициализаци объекта data
    if (cleanTitle !== undefined) data.title = cleanTitle;
    if (cleanSlug !== undefined) data.slug = cleanSlug;
    if (cleanDescription !== undefined)
      data.description = cleanDescription || null;
    if (cleanMaterials !== undefined) data.materials = cleanMaterials || null;
    if (cleanCurrency !== undefined) data.currency = cleanCurrency || null;
    if (parsedYear !== undefined) data.year = parsedYear;
    if (parsedWidthCm !== undefined) data.widthCm = parsedWidthCm;
    if (parsedHeightCm !== undefined) data.heightCm = parsedHeightCm;
    if (parsedPriceCents !== undefined) data.priceCents = parsedPriceCents;
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
