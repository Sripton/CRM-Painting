import { Request, Response, Router } from "express";
import multer from "multer";
import { prisma } from "../../../db/prisma/prisma.js";
import {
  requireAuth,
  requireAdmin,
} from "../../../middlewares/authSecurity.js";
import { validate as isUUID } from "uuid";
import { uploadBuffer, deleteFromS3 } from "../../../services/s3.js";
import path from "path";
import crypto from "crypto";
import { buffer } from "stream/consumers";

const router = Router();

// генерирация путь-ключ для файла изображения перед загрузкой в S3
function makePublicationImageKey(publicationId: string, originalname: string) {
  // path.extname -  извлекает расширение файла из полного имени файла, включая точку.
  const ext = path.extname(originalname) || ".jpg"; // Если расширение не найдено, подставляется ".jpg" по умолчанию.

  // Создаём уникальный идентификатор: -> "3f1f4d6d-2d90-4dc1-8f1d-3d9b6d4d5a11.png || .jpg"
  const fileName = `${crypto.randomUUID()}${ext}`;
  return `publications/${publicationId}/${fileName}`; // publications/11111111-2222-3333-4444-555555555555/7c9c8b8f-3e4d-4d9f-a7c2-123456789abc.png
}

// экземпляр multer.
const upload = multer({
  storage: multer.memoryStorage(), // указывает multer хранить загруженный файл в оперативной памяти как объект Buffer. Это удобно для дальнейшей передачи в S3 без сохранения на диск.
  limits: { fileSize: 15 * 1024 * 1024 }, // ограничивает максимальный размер файла 15 мегабайт
});

//POST endpoint для загрузки обложки публикации
router.post(
  "/publications/:id/cover-image",
  upload.single("file"),
  async (req: Request, res: Response) => {
    const id = req.params.id as string;
    const file = req.file;

    try {
      // валидность id
      if (!isUUID(id)) {
        return res.status(400).json({ message: "Некорректный id публикации" });
      }

      // елсли файл не передан
      if (!file) {
        return res.status(400).json({ message: "file обязателен" });
      }

      // проверь mimeType файла перед загрузкой изображения
      // все MIME-типы изображений начинаются с image/
      if (!file.mimetype.startsWith("image/")) {
        return res
          .status(400)
          .json({ message: "Разрешены только изображения" });
      }

      // ищем публикацию
      const publication = await prisma.publication.findUnique({
        where: { id },
        select: { id: true },
      });

      // если не найден
      if (!publication) {
        return res.status(404).json({ message: "Publication не найден" });
      }

      // проверяем существует ли image для данной публикации
      const existingImage = await prisma.publicationImage.findUnique({
        where: { publicationId: id },
        select: { id: true, key: true },
      });

      // если image существует то заменяем его
      if (existingImage) {
        // удаляем  изображение
        await deleteFromS3({ key: existingImage.key });
        // удаляем запись из бд с помошью id
        await prisma.publicationImage.delete({
          where: { id: existingImage.id },
        });
      }

      // создаем ключ
      const key = makePublicationImageKey(id, file.originalname);

      // Загрузка файла в S3
      // отправляет файл (буфер) в S3 по указанному ключу. Она использует переменную окружения S3_BUCKET для определения имени корзины.
      await uploadBuffer({
        key,
        buffer: file.buffer,
        contentType: file.mimetype,
      });

      // Формирование URL файла
      // const endpoint = process.env.S3_ENDPOINT ?? "";
      // const bucket = process.env.S3_BUCKET ?? "";

      const baseUrl = process.env.PUBLIC_FILES_BASE_URL ?? "";
      const url = `${baseUrl.replace(/\/$/, "")}/${key}`;

      // Сохранение  в базе данных
      const image = await prisma.publicationImage.create({
        data: {
          key,
          url,
          publicationId: id,
        },
      });

      // отправка данных
      return res.json({ ok: true, image });
    } catch (error) {
      console.error("POST /publications/:id/cover-image error:", error);
      return res.status(500).json({ message: "Ошибка сервера" });
    }
  },
);

export default router;
