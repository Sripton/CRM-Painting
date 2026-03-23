-- CreateEnum
CREATE TYPE "ArtworkGroup" AS ENUM ('PAINTING_AND_WALL_ART', 'GRAPHICS_AND_PRINTS', 'DESIGN_AND_ADVERTISING', 'SUBJECTS_AND_THEMES');

-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "ArtworkCategory" ADD VALUE 'RELIEF';
ALTER TYPE "ArtworkCategory" ADD VALUE 'LITHOGRAPHY';
ALTER TYPE "ArtworkCategory" ADD VALUE 'DRAWING';
ALTER TYPE "ArtworkCategory" ADD VALUE 'EASEL_GRAPHICS';
ALTER TYPE "ArtworkCategory" ADD VALUE 'UNIQUE_GRAPHICS';
ALTER TYPE "ArtworkCategory" ADD VALUE 'BRAND_IDENTITY';
ALTER TYPE "ArtworkCategory" ADD VALUE 'POSTER';
ALTER TYPE "ArtworkCategory" ADD VALUE 'PROJECT';
ALTER TYPE "ArtworkCategory" ADD VALUE 'ADVERTISING';
ALTER TYPE "ArtworkCategory" ADD VALUE 'SOUVENIR';
ALTER TYPE "ArtworkCategory" ADD VALUE 'PORTRAIT';
ALTER TYPE "ArtworkCategory" ADD VALUE 'ARCHITECTURE';
ALTER TYPE "ArtworkCategory" ADD VALUE 'SUBJECT';
ALTER TYPE "ArtworkCategory" ADD VALUE 'LANDSCAPE';

-- AlterTable
ALTER TABLE "Artwork" ADD COLUMN     "artworkGroup" "ArtworkGroup";
