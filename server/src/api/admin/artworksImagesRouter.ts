import { Request, Response, Router } from "express";
import multer from "multer";
import { uploadBuffer, makeImageKey, deleteFromS3 } from "../../services/s3.js";
import { prisma } from "../../db/prisma/prisma.js";
import { requireAuth, requireAdmin } from "../../middlewares/authSecurity.js";

const router = Router();
// защита middleware
router.use(
  requireAuth, //  Сначала проверяется токен
  requireAdmin, // потом роль
);

// экземпляр multer.
const upload = multer({
  storage: multer.memoryStorage(), // указывает multer хранить загруженный файл в оперативной памяти как объект Buffer. Это удобно для дальнейшей передачи в S3 без сохранения на диск.
  limits: { fileSize: 15 * 1024 * 1024 }, // ограничивает максимальный размер файла 15 мегабайт
});

// маршрут
router.post(
  "/artworks/:id/images",

  upload.single("file"), // middleware multer, который извлекает из запроса один файл с полем name = "file". Загруженный файл будет доступен в req.file. Если поле отсутствует или файл не передан, req.file останется undefined.
  async (req: Request, res: Response) => {
    const artworkId = req.params.id as string; // идентификатор
    const file = req?.file; // объект файла, который добавил multer. Он содержит поля: buffer (содержимое файла), originalname, mimetype, size и др.

    if (!file) return res.status(400).json({ message: "file обязателен" });

    // проверяем что artwork существует в базе данных
    const artwork = await prisma.artwork.findUnique({
      where: { id: artworkId },
      select: { id: true, coverImageId: true },
    });

    // Если запись не найдена
    if (!artwork) return res.status(404).json({ message: "Artwork не найден" });

    // Генерация ключа для S3
    const key = makeImageKey(artworkId, file.originalname);

    // Загрузка файла в S3
    // отправляет файл (буфер) в S3 по указанному ключу. Она использует переменную окружения S3_BUCKET для определения имени корзины.
    await uploadBuffer({
      key,
      buffer: file.buffer,
      contentType: file.mimetype,
    });

    // Формирование URL файла
    const endpoint = process.env.S3_ENDPOINT ?? "";
    const bucket = process.env.S3_BUCKET ?? "";
    const url = `${endpoint.replace(/\/$/, "")}/${bucket}/${key}`; // http://localhost:9000/artworks/.......

    // Сохранение  в базе данных
    const image = await prisma.image.create({
      data: {
        key,
        url,
        mimeType: file.mimetype,
        sizeBytes: file.size,
        artworkId,
      },
    });

    // авто-назначение cover если его ещё нет
    if (!artwork.coverImageId) {
      await prisma.artwork.update({
        where: { id: artworkId },
        data: { coverImageId: image.id },
      });
    }

    console.log(
      "ACCESS_SECRET=",
      JSON.stringify(process.env.JWT_ACCESS_SECRET),
    );
    return res.json({ ok: true, image });
  },
);

// маршрут для удаления  изображения + файла из MinIO
router.delete("/images/:id", async (req: Request, res: Response) => {
  try {
    const imageId = req.params.id as string;

    // находим картинку
    const image = await prisma.image.findUnique({
      where: { id: imageId },
      select: { id: true, key: true, artworkId: true },
    });

    // если поиск не успешный
    if (!image) return res.status(404).json({ message: "Image не найден" });

    // если это cover — сбросываем coverImageId
    if (image.artworkId) {
      const art = await prisma.artwork.findUnique({
        where: { id: image.artworkId },
        select: { id: true, coverImageId: true },
      });

      // изменяем coverImageId на null
      if (art?.coverImageId === image.id) {
        await prisma.artwork.update({
          where: { id: art.id },
          data: { coverImageId: null },
        });
      }
    }
    // удалить объект из MinIO/S3
    await deleteFromS3({ key: image.key });

    // удалить запись из БД
    await prisma.image.delete({ where: { id: image.id } });

    // если у artwork теперь нет cover — поставить первую оставшуюся
    if (image.artworkId) {
      const art2 = await prisma.artwork.findUnique({
        where: { id: image.artworkId },
        select: { id: true, coverImageId: true },
      });

      // если artwork  И у него нету поля !art2.coverImageId => null
      if (art2 && !art2.coverImageId) {
        // ищем первый попавшиее изображение
        const first = await prisma.image.findFirst({
          where: { artworkId: art2.id },
          orderBy: { createdAt: "asc" },
          select: { id: true },
        });

        // если first = true
        if (first) {
          await prisma.artwork.update({
            where: { id: art2.id },
            data: {
              coverImageId: first.id,
            },
          });
        }
      }
    }

    // возвращаем положительный ответ
    return res.json({ ok: true });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Ошибка сервера" });
  }
});

export default router;
