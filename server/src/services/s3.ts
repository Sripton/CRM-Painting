import {
  S3Client,
  PutObjectCommand, // содержатся параметры запроса (имя корзины, ключ объекта, тело, метаданные и т.п.).
  DeleteObjectCommand,
} from "@aws-sdk/client-s3";

// вспомогательная функция  для безопасного чтения переменных окружения
function requireEnv(name: string) {
  const v = process.env[name];
  if (!v) throw new Error(`Missing env: ${name}`);
  return v;
}

// Создание клиента S3Client для Cloudflare R2
export const s3 = new S3Client({
  region: process.env.S3_REGION || "us-east-1", // автоматически определяем регион, если не задан
  endpoint: requireEnv("S3_ENDPOINT"), // адрес S3-совместимого сервиса
  // данные для аутентификации
  credentials: {
    accessKeyId: requireEnv("S3_ACCESS_KEY"), //  идентификатор ключа доступа
    secretAccessKey: requireEnv("S3_SECRET_KEY"), // sсекретный ключ
  },
  forcePathStyle: process.env.S3_FORCE_PATH_STYLE === "true", // важно для MinIO
});

// Функция загрузки текста в R2
export async function uploadTextToS3(params: {
  key: string; // имя (ключ) объекта в хранилище
  text: string; // строка с текстом, который нужно загрузить
}) {
  const Bucket = requireEnv("S3_BUCKET"); // имя корзины (bucket) из переменной окружения

  //принимает команду. преобразует её в HTTP-запрос, подписывает запрос, отправляет его на сервер S3, получает ответ и преобразует его в удобный объект JavaScript
  await s3.send(
    // объект передачи данных, который хранит входные параметры
    new PutObjectCommand({
      Bucket, // имя корзины, куда загружаем
      Key: params.key, // ключ объекта
      Body: Buffer.from(params.text, "utf-8"), // тело запроса
      ContentType: "text/plain; charset=utf-8", // тип содержимого. Указываем text/plain; charset=utf-8, чтобы при скачивании файл интерпретировался как текстовый с правильной кодировкой.
    }),
  );
  return { ok: true, key: params.key };
}

// Назначение: загрузить переданный буфер (бинарные данные) в S3 по указанному ключу
export async function uploadBuffer(params: {
  key: string; // путь (ключ) объекта в S3
  buffer: Buffer; // данные для загрузки в виде Buffer
  contentType?: string; // тип файла
}) {
  const Bucket = requireEnv("S3_BUCKET"); // корзинa из переменной окружения

  //принимает команду. преобразует её в HTTP-запрос, подписывает запрос, отправляет его на сервер S3, получает ответ и преобразует его в удобный объект JavaScript
  await s3.send(
    // объект передачи данных, который хранит входные параметры
    new PutObjectCommand({
      Bucket,
      Key: params.key,
      Body: params.buffer,
      ContentType: params.contentType,
    }),
  );
  return { ok: true, key: params.key };
}

// сгенерировать уникальный и структурированный ключ (путь) для изображения, связанного с конкретным произведением искусства
export function makeImageKey(
  artworkId: string, //  идентификатор произведения, используется для создания подпапки.
  originalName: string, //  оригинальное имя файла (например, "photo.jpg"). Из него извлекается расширение.
) {
  const safeName = originalName || "file.bin";
  const ext = (safeName.split(".").pop() || "bin").toLowerCase();
  return `artworks/${artworkId}/${crypto.randomUUID()}.${ext}`; // строковый ключ, который можно передать в uploadBuffer
}

// функцию удаления из S3/MinIO
export async function deleteFromS3(params: { key: string }) {
  const Bucket = requireEnv("S3_BUCKET");
  await s3.send(
    new DeleteObjectCommand({
      Bucket,
      Key: params.key,
    }),
  );
  return { ok: true };
}
