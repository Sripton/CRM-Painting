FROM node:22-bookworm-slim AS base
RUN apt-get update \
  && apt-get install -y --no-install-recommends openssl \
  && rm -rf /var/lib/apt/lists/*
WORKDIR /app

FROM base AS deps
COPY package.json package-lock.json ./
COPY prisma.config.ts ./
COPY prisma ./prisma
RUN npm ci
RUN npx prisma generate

FROM deps AS build
COPY prisma.config.ts ./
COPY tsconfig.json ./
COPY src ./src
RUN npm run build

FROM base AS runtime
WORKDIR /app
ENV NODE_ENV=production
COPY package.json package-lock.json ./
COPY prisma.config.ts ./
COPY prisma ./prisma
RUN npm ci --omit=dev
RUN npx prisma generate
COPY --from=build /app/dist ./dist
EXPOSE 8080
CMD ["sh", "-c", "npx prisma migrate deploy && node dist/server.js"]
