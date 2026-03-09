-- CreateEnum
CREATE TYPE "ArtworkCategory" AS ENUM ('PAINTING', 'WATERCOLOR', 'WALL_PAINTING');

-- AlterTable
ALTER TABLE "Artwork" ADD COLUMN     "category" "ArtworkCategory";
