# README2

## Что мы сделали сегодня

Сегодня мы:

1. Проверили, для какой архитектуры собраны Docker-образы
2. Убедились, что VPS работает на `x86_64`
3. Пересобрали и заново запушили образы в Docker Hub как `linux/amd64`
4. Скопировали папку `vps-deploy` на VPS
5. Настроили `app.env` и `server.env`
6. Запустили контейнеры на VPS
7. Исправили конфликт порта MinIO
8. Создали первого администратора

---

## Главная мысль

Если проект собирается на Mac с Apple Silicon, Docker по умолчанию может собрать образ как `linux/arm64`.

Но обычный VPS чаще всего работает на `x86_64`, значит ему нужен образ:

```text
linux/amd64
```

Если залить `arm64`-образ на обычный VPS, контейнер может не запуститься.

---

## 1. Логин в Docker Hub

На Mac в терминале:

```bash
docker login
```

Проверка успешного входа:

```bash
docker info
```

---

## 2. Проверка архитектуры уже опубликованного образа

Проверка server-образа:

```bash
docker pull elmar1988/crm-painting-server:latest
docker image inspect elmar1988/crm-painting-server:latest --format '{{.Architecture}}/{{.Os}}'
```

Проверка client-образа:

```bash
docker pull elmar1988/crm-painting-client:latest
docker image inspect elmar1988/crm-painting-client:latest --format '{{.Architecture}}/{{.Os}}'
```

Как читать результат:

- `amd64/linux` -> подходит для обычного VPS
- `arm64/linux` -> это образ под ARM

У нас сначала было:

```text
arm64/linux
```

Потом мы пересобрали правильно.

---

## 3. Проверка архитектуры VPS

Подключение к серверу:

```bash
ssh root@193.124.114.112
```

Проверка архитектуры:

```bash
uname -m
```

Если результат:

- `x86_64` -> нужны образы `linux/amd64`
- `aarch64` -> нужны образы `linux/arm64`

У нас VPS показал:

```text
x86_64
```

---

## 4. Правильная сборка и push образов для VPS

Эти команды запускались на Mac в корне проекта:

```bash
cd /Users/elmarerzikhanov/Desktop/PROJECTS/CRM_painting
docker buildx build --platform linux/amd64 -t elmar1988/crm-painting-server:latest ./server --push
docker buildx build --platform linux/amd64 -t elmar1988/crm-painting-client:latest ./client --push
```

После этого снова проверили:

```bash
docker pull elmar1988/crm-painting-server:latest
docker image inspect elmar1988/crm-painting-server:latest --format '{{.Architecture}}/{{.Os}}'

docker pull elmar1988/crm-painting-client:latest
docker image inspect elmar1988/crm-painting-client:latest --format '{{.Architecture}}/{{.Os}}'
```

И получили:

```text
amd64/linux
```

---

## 5. Копирование deploy-файлов на VPS

На Mac в корне проекта:

```bash
scp -r ./vps-deploy root@193.124.114.112:/root/
```

Потом снова подключение:

```bash
ssh root@193.124.114.112
```

Переход в папку:

```bash
cd /root/vps-deploy
ls
```

---

## 6. Создание env-файлов на VPS

На VPS:

```bash
cd /root/vps-deploy
cp app.env.example app.env
cp server.env.example server.env
```

---

## 7. Настройка app.env

Мы редактировали файл:

```bash
nano /root/vps-deploy/app.env
```

Рабочий пример:

```env
DOCKERHUB_NAMESPACE=elmar1988
APP_IMAGE_TAG=latest
APP_PLATFORM=linux/amd64
POSTGRES_DB=crm_painting
POSTGRES_USER=crm_painting
POSTGRES_PASSWORD=StrongPostgresPass123
CLIENT_PORT=8080
MINIO_ROOT_USER=admin
MINIO_ROOT_PASSWORD=StrongMinioPass123
MINIO_BUCKET=crm-painting
MINIO_REGION=us-east-1
MINIO_API_PORT=9002
MINIO_CONSOLE_PORT=9003
MINIO_PUBLIC_URL=http://193.124.114.112:9002/crm-painting
```

Почему `9002` и `9003`:

Потому что на VPS порт `9000` уже был занят другим Docker-сервисом.

Проверяли это так:

```bash
ss -tulpn | grep ':9000'
```

---

## 8. Настройка server.env

Мы редактировали:

```bash
nano /root/vps-deploy/server.env
```

Рабочий пример:

```env
PORT=8080
DATABASE_URL=postgresql://crm_painting:StrongPostgresPass123@postgres:5432/crm_painting?schema=public
SETUP_TOKEN=StrongSetupToken123
JWT_ACCESS_SECRET=StrongAccessSecret123
JWT_REFRESH_SECRET=StrongRefreshSecret123
ACCESS_TTL=15m
REFRESH_TTL=30d
COOKIE_SECURE=false
PUBLIC_FILES_BASE_URL=http://193.124.114.112:9002/crm-painting
S3_ENDPOINT=http://minio:9000
S3_REGION=us-east-1
S3_ACCESS_KEY=admin
S3_SECRET_KEY=StrongMinioPass123
S3_BUCKET=crm-painting
S3_FORCE_PATH_STYLE=true
```

Важно:

- пароль Postgres в `app.env` и `server.env` должен совпадать
- пароль MinIO в `app.env` и `server.env` должен совпадать
- `SETUP_TOKEN` потом используется для создания первого администратора

---

## 9. Проверка Docker на VPS

На VPS:

```bash
docker --version
docker compose version
```

У нас Docker и Compose уже были установлены.

---

## 10. Запуск проекта на VPS

На VPS в папке `/root/vps-deploy`:

```bash
docker compose --env-file app.env pull
docker compose --env-file app.env up -d
docker compose --env-file app.env ps
```

Если всё хорошо, контейнеры должны быть в статусе `Up`.

---

## 11. Проверка логов

На VPS:

```bash
cd /root/vps-deploy
docker compose --env-file app.env logs --tail=100 server
docker compose --env-file app.env logs --tail=100 client
```

На что смотреть:

- у `server` не должно быть ошибок миграции и запуска
- у `client` должен нормально стартовать `nginx`

У нас в логах backend успешно применил миграции и написал:

```text
Server start on 8080 PORT
```

---

## 12. Адреса после запуска

После запуска у нас получилось:

- сайт: `http://193.124.114.112:8080`
- MinIO API: `http://193.124.114.112:9002`
- MinIO Console: `http://193.124.114.112:9003`

---

## 13. Создание первого администратора

Через Thunder Client:

- Method: `POST`
- URL: `http://193.124.114.112:8080/api/auth/setup`

Headers:

- `Content-Type: application/json`
- `x-setup-token: StrongSetupToken123`

Body JSON:

```json
{
  "email": "street-flash@mail.ru",
  "password": "1988_Painting"
}
```

Успешный ответ был таким:

```json
{
  "admin": {
    "id": "35b9df52-d344-4d4a-a896-47cb1c3b3c6c",
    "email": "street-flash@mail.ru",
    "role": "ADMIN",
    "createdAt": "2026-04-15T17:30:34.706Z"
  }
}
```

После этого вход в систему работает.

---

## 14. Что важно запомнить на будущее

### Где выполнять команды

- `docker login`, `docker buildx build`, `scp` -> на Mac
- `docker compose pull`, `docker compose up -d`, `logs`, `ps` -> на VPS

### Как понять, где ты сейчас

- если видишь `elmarerzikhanov@MacBook-Pro-Elmar` -> ты на Mac
- если видишь `root@ruvds-zakt7` -> ты на VPS

### Что проверять первым делом

1. Архитектуру VPS: `uname -m`
2. Архитектуру Docker-образа: `docker image inspect ...`
3. Свободны ли нужные порты: `ss -tulpn | grep ':PORT'`
4. Логи после запуска: `docker compose logs`

---

## 15. Короткий сценарий для следующего похожего деплоя

### На Mac

```bash
docker login
cd /Users/elmarerzikhanov/Desktop/PROJECTS/CRM_painting
docker buildx build --platform linux/amd64 -t elmar1988/crm-painting-server:latest ./server --push
docker buildx build --platform linux/amd64 -t elmar1988/crm-painting-client:latest ./client --push
scp -r ./vps-deploy root@193.124.114.112:/root/
```

### На VPS

```bash
ssh root@193.124.114.112
cd /root/vps-deploy
cp app.env.example app.env
cp server.env.example server.env
nano app.env
nano server.env
docker compose --env-file app.env pull
docker compose --env-file app.env up -d
docker compose --env-file app.env ps
docker compose --env-file app.env logs --tail=100 server
docker compose --env-file app.env logs --tail=100 client
```

### Создание первого админа

Через Thunder Client:

- `POST http://193.124.114.112:8080/api/auth/setup`
- Header `x-setup-token: StrongSetupToken123`
- Header `Content-Type: application/json`
- JSON body с `email` и `password`

---

## 16. Что можно улучшить потом

Позже стоит сделать:

1. Домен
2. HTTPS
3. Reverse proxy
4. `COOKIE_SECURE=true`
5. Нормальные секреты вместо учебных значений
6. Отдельный production-checklist

---

## Итог

Сегодня мы успешно:

- пересобрали образы в `linux/amd64`
- запушили их в Docker Hub
- подняли проект на VPS
- решили конфликт порта MinIO
- создали первого администратора
- проверили, что вход в систему работает
