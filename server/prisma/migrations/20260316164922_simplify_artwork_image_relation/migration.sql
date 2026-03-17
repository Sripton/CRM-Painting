/*
  Warnings:

  - You are about to drop the column `coverImageId` on the `Artwork` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[artworkId]` on the table `Image` will be added. If there are existing duplicate values, this will fail.
  - Made the column `artworkId` on table `Image` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "Artwork" DROP CONSTRAINT "Artwork_coverImageId_fkey";

-- DropIndex
DROP INDEX "Artwork_coverImageId_key";

-- DropIndex
DROP INDEX "Image_artworkId_idx";

-- AlterTable
ALTER TABLE "Artwork" DROP COLUMN "coverImageId";

-- AlterTable
ALTER TABLE "Image" ALTER COLUMN "artworkId" SET NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Image_artworkId_key" ON "Image"("artworkId");
