# VPS Deploy

В эту папку вынесены файлы, которые нужно загрузить на VPS для запуска проекта из уже опубликованных Docker Hub образов.

## Какие Файлы Загружать На VPS

Загрузи на сервер всю папку `vps-deploy/`:

- `docker-compose.yml`
- `app.env.example`
- `server.env.example`
- `README.md`

После загрузки переименуй:

- `app.env.example` -> `app.env`
- `server.env.example` -> `server.env`

## Что Должно Быть Уже Готово

Перед деплоем на VPS у тебя должны быть опубликованы Docker Hub образы:

- `your-dockerhub-username/crm-painting-client:<tag>`
- `your-dockerhub-username/crm-painting-server:<tag>`

Важно:

- если VPS на `amd64`, а сборка делается на Mac `arm64`, обычный `docker compose build` создаст ARM-образы
- такие образы на VPS дадут ошибку `exec format error`
- для VPS нужно публиковать либо `linux/amd64`, либо multi-arch образы

Если образы ещё не опубликованы, сначала локально:

```bash
docker login
docker compose build client server
docker compose push client server
```

Для твоего случая правильно публиковать так:

```bash
docker buildx build --platform linux/amd64 -t your-dockerhub-username/crm-painting-server:latest ./server --push
docker buildx build --platform linux/amd64 -t your-dockerhub-username/crm-painting-client:latest ./client --push
```

Или multi-arch:

```bash
docker buildx build --platform linux/amd64,linux/arm64 -t your-dockerhub-username/crm-painting-server:latest ./server --push
docker buildx build --platform linux/amd64,linux/arm64 -t your-dockerhub-username/crm-painting-client:latest ./client --push
```

## Как Заполнить `app.env`

В файле `app.env` укажи:

```env
DOCKERHUB_NAMESPACE=your-dockerhub-username
APP_IMAGE_TAG=latest
APP_PLATFORM=linux/amd64
POSTGRES_DB=crm_painting
POSTGRES_USER=crm_painting
POSTGRES_PASSWORD=strong-postgres-password
CLIENT_PORT=8080
MINIO_ROOT_USER=admin
MINIO_ROOT_PASSWORD=strong-minio-password
MINIO_BUCKET=crm-painting
MINIO_REGION=us-east-1
MINIO_API_PORT=9000
MINIO_CONSOLE_PORT=9001
MINIO_PUBLIC_URL=http://your-vps-ip:9000/crm-painting
```

## Как Заполнить `server.env`

В файле `server.env` укажи:

```env
PORT=8080
DATABASE_URL=postgresql://crm_painting:strong-postgres-password@postgres:5432/crm_painting?schema=public
SETUP_TOKEN=strong-setup-token
JWT_ACCESS_SECRET=strong-access-secret
JWT_REFRESH_SECRET=strong-refresh-secret
ACCESS_TTL=15m
REFRESH_TTL=30d
COOKIE_SECURE=false
PUBLIC_FILES_BASE_URL=http://your-vps-ip:9000/crm-painting
S3_ENDPOINT=http://minio:9000
S3_REGION=us-east-1
S3_ACCESS_KEY=admin
S3_SECRET_KEY=strong-minio-password
S3_BUCKET=crm-painting
S3_FORCE_PATH_STYLE=true
```

`POSTGRES_PASSWORD` в `app.env` и пароль внутри `DATABASE_URL` в `server.env` должны совпадать.

`MINIO_ROOT_PASSWORD` в `app.env` и `S3_SECRET_KEY` в `server.env` тоже должны совпадать.

## Как Запустить На VPS

Перейди в папку на сервере:

```bash
cd /path/to/vps-deploy
```

Запусти:

```bash
docker compose --env-file app.env up -d
```

## Как Проверить

Проверить контейнеры:

```bash
docker compose --env-file app.env ps
```

Проверить backend:

```bash
docker compose --env-file app.env logs --tail=100 server
```

Проверить frontend:

```bash
docker compose --env-file app.env logs --tail=100 client
```

## Адреса После Запуска

- сайт: `http://your-vps-ip:CLIENT_PORT`
- MinIO API: `http://your-vps-ip:MINIO_API_PORT`
- MinIO Console: `http://your-vps-ip:MINIO_CONSOLE_PORT`

## Первый Admin

После старта создай первого администратора:

```bash
curl -X POST http://your-vps-ip:8080/api/auth/setup \
  -H "Content-Type: application/json" \
  -H "x-setup-token: strong-setup-token" \
  -d '{"email":"admin@example.com","password":"StrongAdminPassword123!"}'
```

## Обновление Релиза

Если опубликовал новую версию образов:

1. Поменяй `APP_IMAGE_TAG` в `app.env`
2. Выполни:

```bash
docker compose --env-file app.env pull
docker compose --env-file app.env up -d
```

## Что Учитывать

- Если VPS используется как production через HTTPS, `COOKIE_SECURE` лучше поставить `true`
- Если сайт будет работать за доменом и reverse proxy, `MINIO_PUBLIC_URL` лучше заменить на внешний домен файлов
- Сейчас `client` и `server` запускаются из Docker Hub образов, а `postgres` и `minio` поднимаются прямо на VPS

## Production С Доменом И HTTPS

Для production подготовлены отдельные файлы:

- `docker-compose.production.yml`
- `Caddyfile`
- `app.production.env.example`
- `server.production.env.example`

### Что Это Даёт

- сайт работает по домену через `https`
- наружу открыты только `80` и `443`
- `client`, `server` и MinIO API не публикуются наружу
- MinIO Console доступна только локально на VPS через `127.0.0.1:9003`

### Что Должно Быть Готово До Запуска

1. Домен должен смотреть на IP VPS
2. На DNS должны быть созданы `A`-записи на твой VPS
3. Порты `80` и `443` должны быть открыты у провайдера и в firewall

### Как Подготовить Файлы На VPS

Скопируй примеры:

```bash
cp app.production.env.example app.production.env
cp server.production.env.example server.production.env
```

Заполни `app.production.env`:

```env
DOCKERHUB_NAMESPACE=your-dockerhub-username
APP_IMAGE_TAG=latest
APP_PLATFORM=linux/amd64
APP_DOMAIN=example.com
LETSENCRYPT_EMAIL=admin@example.com
POSTGRES_DB=crm_painting
POSTGRES_USER=crm_painting
POSTGRES_PASSWORD=change-me-to-a-long-random-password
MINIO_ROOT_USER=admin
MINIO_ROOT_PASSWORD=change-me-to-a-long-random-password
MINIO_BUCKET=crm-painting
MINIO_REGION=us-east-1
MINIO_CONSOLE_BIND_IP=127.0.0.1
MINIO_CONSOLE_PORT=9003
```

Заполни `server.production.env`:

```env
PORT=8080
DATABASE_URL=postgresql://crm_painting:change-me-to-a-long-random-password@postgres:5432/crm_painting?schema=public
SETUP_TOKEN=change-me-to-a-long-random-random-string
JWT_ACCESS_SECRET=change-me-to-a-long-random-random-string
JWT_REFRESH_SECRET=change-me-to-a-long-random-random-string
ACCESS_TTL=15m
REFRESH_TTL=30d
COOKIE_SECURE=true
PUBLIC_FILES_BASE_URL=https://example.com/files/crm-painting
S3_ENDPOINT=http://minio:9000
S3_REGION=us-east-1
S3_ACCESS_KEY=admin
S3_SECRET_KEY=change-me-to-a-long-random-password
S3_BUCKET=crm-painting
S3_FORCE_PATH_STYLE=true
```

Важно:

- `APP_DOMAIN` и домен в `PUBLIC_FILES_BASE_URL` должны совпадать
- `POSTGRES_PASSWORD` в двух env-файлах должен совпадать
- `MINIO_ROOT_PASSWORD` и `S3_SECRET_KEY` должны совпадать
- `COOKIE_SECURE=true` включать только для HTTPS, а здесь HTTPS как раз поднимает `Caddy`

### Как Запустить Production

В папке `vps-deploy`:

```bash
docker compose -f docker-compose.production.yml --env-file app.production.env up -d
```

Проверка:

```bash
docker compose -f docker-compose.production.yml --env-file app.production.env ps
docker compose -f docker-compose.production.yml --env-file app.production.env logs --tail=100 caddy
docker compose -f docker-compose.production.yml --env-file app.production.env logs --tail=100 server
```

После успешного старта сайт должен открываться так:

- `https://example.com`

Файлы MinIO будут раздаваться так:

- `https://example.com/files/crm-painting/...`

### Как Открывать MinIO Console

Она публикуется только на localhost VPS. Для доступа с Mac можно сделать SSH-туннель:

```bash
ssh -L 9003:127.0.0.1:9003 root@your-vps-ip
```

После этого открыть в браузере:

```text
http://127.0.0.1:9003
```

### Как Обновлять Релиз

После публикации новых Docker-образов:

```bash
docker compose -f docker-compose.production.yml --env-file app.production.env pull
docker compose -f docker-compose.production.yml --env-file app.production.env up -d
```
