-- CreateEnum
CREATE TYPE "PublicationType" AS ENUM ('NEWS', 'APHORISM', 'ESSAY', 'ARTICLE', 'REVIEW');

-- CreateTable
CREATE TABLE "Publication" (
    "id" TEXT NOT NULL,
    "type" "PublicationType" NOT NULL,
    "title" TEXT,
    "titleEn" TEXT,
    "slug" TEXT,
    "body" TEXT,
    "bodyEn" TEXT,
    "quoteText" TEXT,
    "quoteTextEn" TEXT,
    "isPublished" BOOLEAN NOT NULL DEFAULT false,
    "publishedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Publication_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PublicationImage" (
    "id" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "publicationId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PublicationImage_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Publication_slug_key" ON "Publication"("slug");

-- CreateIndex
CREATE INDEX "Publication_type_isPublished_publishedAt_idx" ON "Publication"("type", "isPublished", "publishedAt");

-- CreateIndex
CREATE UNIQUE INDEX "PublicationImage_key_key" ON "PublicationImage"("key");

-- CreateIndex
CREATE UNIQUE INDEX "PublicationImage_publicationId_key" ON "PublicationImage"("publicationId");

-- AddForeignKey
ALTER TABLE "PublicationImage" ADD CONSTRAINT "PublicationImage_publicationId_fkey" FOREIGN KEY ("publicationId") REFERENCES "Publication"("id") ON DELETE CASCADE ON UPDATE CASCADE;
