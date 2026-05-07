# CRM Painting Production Setup

Этот репозиторий содержит production-конфигурацию для запуска сайта в Docker:

- `client` - фронтенд на Vite/React
- `server` - backend на Node.js/Express + Prisma
- `postgres` - основная база данных
- `minio` - S3-совместимое хранилище для изображений

## Структура Production Конфигурации

- [docker-compose.yml](/Users/elmarerzikhanov/Desktop/PROJECTS/CRM_painting/docker-compose.yml:1) - основной production compose
- [client/Dockerfile](/Users/elmarerzikhanov/Desktop/PROJECTS/CRM_painting/client/Dockerfile:1) - сборка и запуск фронтенда через `nginx`
- [server/Dockerfile](/Users/elmarerzikhanov/Desktop/PROJECTS/CRM_painting/server/Dockerfile:1) - сборка backend и запуск с `prisma migrate deploy`
- [.env.production](/Users/elmarerzikhanov/Desktop/PROJECTS/CRM_painting/.env.production:1) - переменные для compose и инфраструктурных сервисов
- [server/.env.production](/Users/elmarerzikhanov/Desktop/PROJECTS/CRM_painting/server/.env.production:1) - переменные backend

## Что Уже Настроено

- фронтенд собирается в статический build и раздаётся через `nginx`
- `nginx` проксирует `/api` в контейнер `server`
- backend подключается к `postgres`
- backend использует `minio` как S3-хранилище
- bucket в MinIO создаётся автоматически контейнером `minio-init`
- для bucket включается публичное чтение, чтобы сохранённые URL изображений были доступны клиенту

## Что Нужно Перед Запуском

Нужно проверить и при необходимости поменять значения в двух файлах:

- [.env.production](/Users/elmarerzikhanov/Desktop/PROJECTS/CRM_painting/.env.production:1)
- [server/.env.production](/Users/elmarerzikhanov/Desktop/PROJECTS/CRM_painting/server/.env.production:1)

Минимум нужно заменить:

- `POSTGRES_PASSWORD`
- `MINIO_ROOT_PASSWORD`
- `SETUP_TOKEN`
- `JWT_ACCESS_SECRET`
- `JWT_REFRESH_SECRET`

Если проект запускается не локально, нужно также заменить:

- `MINIO_PUBLIC_URL`
- при необходимости `CLIENT_PORT`
- при необходимости `VITE_API_URL`

## Как Заполнить `.env.production`

Файл [.env.production](/Users/elmarerzikhanov/Desktop/PROJECTS/CRM_painting/.env.production:1) управляет `docker-compose`.

Поля:

- `POSTGRES_DB` - имя базы PostgreSQL
- `POSTGRES_USER` - пользователь PostgreSQL
- `POSTGRES_PASSWORD` - пароль PostgreSQL
- `CLIENT_PORT` - внешний порт сайта
- `VITE_API_URL` - базовый URL API для фронтенда; можно оставить пустым, если фронт и API идут через один домен и `nginx`
- `MINIO_ROOT_USER` - логин администратора MinIO
- `MINIO_ROOT_PASSWORD` - пароль администратора MinIO
- `MINIO_BUCKET` - bucket для картинок
- `MINIO_REGION` - регион S3, обычно `us-east-1`
- `MINIO_API_PORT` - внешний порт S3 API
- `MINIO_CONSOLE_PORT` - внешний порт веб-консоли MinIO
- `MINIO_PUBLIC_URL` - публичная база URL для доступа к файлам

Локальный пример:

```env
POSTGRES_DB=crm_painting
POSTGRES_USER=crm_painting
POSTGRES_PASSWORD=strong-postgres-password
CLIENT_PORT=80
VITE_API_URL=
MINIO_ROOT_USER=minioadmin
MINIO_ROOT_PASSWORD=strong-minio-password
MINIO_BUCKET=crm-painting
MINIO_REGION=us-east-1
MINIO_API_PORT=9000
MINIO_CONSOLE_PORT=9001
MINIO_PUBLIC_URL=http://localhost:9000/crm-painting
```

## Как Заполнить `server/.env.production`

Файл [server/.env.production](/Users/elmarerzikhanov/Desktop/PROJECTS/CRM_painting/server/.env.production:1) используется backend-контейнером.

Поля:

- `PORT` - порт backend внутри контейнера
- `SETUP_TOKEN` - токен для одноразового создания администратора
- `JWT_ACCESS_SECRET` - секрет access token
- `JWT_REFRESH_SECRET` - секрет refresh token
- `ACCESS_TTL` - срок жизни access token
- `REFRESH_TTL` - срок жизни refresh token
- `COOKIE_SECURE` - `true` для HTTPS production
- `PUBLIC_FILES_BASE_URL` - публичная база URL для картинок
- `S3_ENDPOINT` - внутренний endpoint MinIO внутри docker сети
- `S3_REGION` - регион S3
- `S3_ACCESS_KEY` - логин MinIO
- `S3_SECRET_KEY` - пароль MinIO
- `S3_BUCKET` - bucket
- `S3_FORCE_PATH_STYLE` - для MinIO должно быть `true`

Пример:

```env
PORT=8080
SETUP_TOKEN=strong-setup-token
JWT_ACCESS_SECRET=strong-access-secret
JWT_REFRESH_SECRET=strong-refresh-secret
ACCESS_TTL=15m
REFRESH_TTL=30d
COOKIE_SECURE=true
PUBLIC_FILES_BASE_URL=http://localhost:9000/crm-painting
S3_ENDPOINT=http://minio:9000
S3_REGION=us-east-1
S3_ACCESS_KEY=minioadmin
S3_SECRET_KEY=strong-minio-password
S3_BUCKET=crm-painting
S3_FORCE_PATH_STYLE=true
```

## Порядок Запуска

1. Заполни [.env.production](/Users/elmarerzikhanov/Desktop/PROJECTS/CRM_painting/.env.production:1).
2. Заполни [server/.env.production](/Users/elmarerzikhanov/Desktop/PROJECTS/CRM_painting/server/.env.production:1).
3. Из корня проекта выполни:

```bash
docker compose up --build -d
```

4. Проверить статус контейнеров:

```bash
docker compose ps
```

5. Проверить логи backend:

```bash
docker compose logs -f server
```

6. Проверить логи MinIO:

```bash
docker compose logs -f minio
```

## Какие Сервисы Будут Доступны

- сайт: `http://localhost:${CLIENT_PORT}`
- MinIO API: `http://localhost:${MINIO_API_PORT}`
- MinIO Console: `http://localhost:${MINIO_CONSOLE_PORT}`

При текущих значениях по умолчанию это:

- сайт: `http://localhost`
- MinIO API: `http://localhost:9000`
- MinIO Console: `http://localhost:9001`

## Как Создать Первого Администратора

После запуска нужно один раз выполнить запрос на backend endpoint `/api/auth/setup`.

Пример:

```bash
curl -X POST http://localhost/api/auth/setup \
  -H "Content-Type: application/json" \
  -H "x-setup-token: change-me" \
  -d '{"email":"admin@example.com","password":"strong-password"}'
```

Если сайт запущен не на `localhost`, замени URL на свой домен.

Важно:

- `x-setup-token` должен совпадать со значением `SETUP_TOKEN`
- повторный setup запрещён после создания первого администратора

## Как Работает MinIO В Этой Схеме

- backend загружает файлы в bucket `MINIO_BUCKET`
- bucket создаётся автоматически через `minio-init`
- для bucket включён публичный доступ на чтение
- URL файла в базе формируется так:

```text
${MINIO_PUBLIC_URL}/${key}
```

Пример:

```text
http://localhost:9000/crm-painting/publications/<publicationId>/<file>.jpg
```

Поэтому `MINIO_PUBLIC_URL` должен указывать на внешний адрес, который реально доступен браузеру.

## Остановка И Перезапуск

Остановить проект:

```bash
docker compose down
```

Остановить проект с удалением volume:

```bash
docker compose down -v
```

`down -v` удалит:

- базу PostgreSQL
- все файлы MinIO

Используй это только если данные не нужны.

## Обновление После Изменений Кода

После изменения кода пересобери и перезапусти контейнеры:

```bash
docker compose up --build -d
```

Если нужно пересобрать только один сервис:

```bash
docker compose up --build -d server
docker compose up --build -d client
```

## Docker Hub

`docker-compose.yml` уже настроен так, чтобы `client` и `server` собирались с Docker Hub тегами.

Нужные переменные в [.env.production](/Users/elmarerzikhanov/Desktop/PROJECTS/CRM_painting/.env.production:1):

- `DOCKERHUB_NAMESPACE` - твой Docker Hub username или org
- `APP_IMAGE_TAG` - тег образа, например `latest` или `2026-04-14`

Пример:

```env
DOCKERHUB_NAMESPACE=mydockerhubuser
APP_IMAGE_TAG=latest
```

Сборка образов с нужными тегами:

```bash
docker compose build client server
```

После этого будут созданы образы:

```text
mydockerhubuser/crm-painting-client:latest
mydockerhubuser/crm-painting-server:latest
```

Логин в Docker Hub:

```bash
docker login
```

Публикация образов:

```bash
docker compose push client server
```

Если нужно выложить конкретный релиз:

```bash
APP_IMAGE_TAG=2026-04-14 docker compose build client server
APP_IMAGE_TAG=2026-04-14 docker compose push client server
```

## Текущие Ограничения

В `server` сейчас есть существующие TypeScript-ошибки в прикладном коде. Они не относятся к Docker-конфигурации, но их нужно исправить, если цель - гарантированно собирать backend без ручных обходов.

Проблемные файлы:

- `server/src/api/admin/publicationsApi/adminPublication.ts`
- `server/src/api/auth/authRouter.ts`

## Рекомендуемый Следующий Шаг

После заполнения секретов выполнить:

```bash
docker compose up --build -d
docker compose ps
docker compose logs -f server
```

Если нужно, следующим шагом можно:

- исправить TypeScript-ошибки backend
- вынести MinIO на отдельный поддомен
- настроить HTTPS и reverse proxy перед `client`
