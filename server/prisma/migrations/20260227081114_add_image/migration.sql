/*
  Warnings:

  - A unique constraint covering the columns `[coverImageId]` on the table `Artwork` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Artwork" ADD COLUMN     "coverImageId" TEXT;

-- CreateTable
CREATE TABLE "Image" (
    "id" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "mimeType" TEXT,
    "sizeBytes" INTEGER,
    "widthPx" INTEGER,
    "heightPx" INTEGER,
    "artworkId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Image_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Image_key_key" ON "Image"("key");

-- CreateIndex
CREATE INDEX "Image_artworkId_idx" ON "Image"("artworkId");

-- CreateIndex
CREATE UNIQUE INDEX "Artwork_coverImageId_key" ON "Artwork"("coverImageId");

-- AddForeignKey
ALTER TABLE "Artwork" ADD CONSTRAINT "Artwork_coverImageId_fkey" FOREIGN KEY ("coverImageId") REFERENCES "Image"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Image" ADD CONSTRAINT "Image_artworkId_fkey" FOREIGN KEY ("artworkId") REFERENCES "Artwork"("id") ON DELETE CASCADE ON UPDATE CASCADE;
