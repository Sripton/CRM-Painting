import { Request, Response, Router } from "express";
import multer from "multer";
import {
  uploadBuffer,
  makeImageKey,
  deleteFromS3,
} from "../../../services/s3.js";
import { prisma } from "../../../db/prisma/prisma.js";
import {
  requireAuth,
  requireAdmin,
} from "../../../middlewares/authSecurity.js";
import { validate as isUUID } from "uuid";

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
    try {
      const artworkId = req.params.id as string; // идентификатор
      const file = req?.file; // объект файла, который добавил multer. Он содержит поля: buffer (содержимое файла), originalname, mimetype, size и др.

      // проверка валидноcти id
      if (!isUUID(artworkId)) {
        return res.status(400).json({ message: "Некорректный id картины" });
      }
      // если файл не был выбран
      if (!file) return res.status(400).json({ message: "file обязателен" });

      // проверь mimeType файла перед загрузкой изображения
      if (!file.mimetype.startsWith("image/")) {
        // все MIME-типы изображений начинаются с image/
        // значения берутся из MIME type registry
        //   Пример      {
        //   fieldname: "file",
        //   originalname: "painting.jpg",
        //   mimetype: "image/jpeg",
        //   size: 245001,
        //   buffer: <Buffer ...>
        // }
        return res
          .status(400)
          .json({ message: "Разрешены только изображения" });
      }
      // проверяем, что картина существует, и забираем текущее фото, если оно есть
      const artwork = await prisma.artwork.findUnique({
        where: { id: artworkId },
        select: { id: true },
      });

      // Если запись не найдена
      if (!artwork)
        return res.status(404).json({ message: "Artwork не найден" });

      // поиск старого изображения  для замены
      const existingImage = await prisma.image.findUnique({
        where: { artworkId },
        select: { id: true, key: true },
      });

      // Перед созданием новой записи удаляем старую, если она есть
      if (existingImage) {
        // удаляем из MinIO
        await deleteFromS3({ key: existingImage.key });

        // удаляем из базы данных
        await prisma.image.delete({
          where: { id: existingImage.id },
        });
      }

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
      // const endpoint = process.env.S3_ENDPOINT ?? "";
      // const bucket = process.env.S3_BUCKET ?? "";
      const baseUrl = process.env.PUBLIC_FILES_BASE_URL ?? "";
      const url = `${baseUrl.replace(/\/$/, "")}/${key}`; // http://localhost:9000/artworks/.......

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

      return res.json({ ok: true, image });
    } catch (error) {
      console.error("POST /artworks/:id/images error:", error);
      return res.status(500).json({ message: "Ошибка сервера" });
    }
  },
);

// маршрут для удаления  изображения + файла из MinIO
// router.delete("/images/:id", async (req: Request, res: Response) => {
//   try {
//     const imageId = req.params.id as string;

//     // проверка валидноcти id
//     if (!isUUID(imageId)) {
//       return res.status(400).json({ message: "Некорректный id изображения" });
//     }

//     // находим картинку
//     const image = await prisma.image.findUnique({
//       where: { id: imageId },
//       select: { id: true, key: true },
//     });

//     // если поиск не успешный
//     if (!image) return res.status(404).json({ message: "Image не найден" });

//     // удалить объект из MinIO/S3
//     await deleteFromS3({ key: image.key });
//     // удалить запись из БД
//     await prisma.image.delete({ where: { id: image.id } });

//     // возвращаем положительный ответ
//     return res.json({ ok: true });
//   } catch (error) {
//     console.log(error);
//     return res.status(500).json({ message: "Ошибка сервера" });
//   }
// });

export default router;
