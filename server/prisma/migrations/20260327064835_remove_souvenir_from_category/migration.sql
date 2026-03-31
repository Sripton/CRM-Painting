/*
  Warnings:

  - The values [SOUVENIR] on the enum `ArtworkCategory` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "ArtworkCategory_new" AS ENUM ('PAINTING', 'WATERCOLOR', 'WALL_PAINTING', 'RELIEF', 'LITHOGRAPHY', 'DRAWING', 'EASEL_GRAPHICS', 'UNIQUE_GRAPHICS', 'BRAND_IDENTITY', 'POSTER', 'PROJECT', 'ADVERTISING', 'PORTRAIT', 'ARCHITECTURE', 'SUBJECT', 'LANDSCAPE');
ALTER TABLE "Artwork" ALTER COLUMN "category" TYPE "ArtworkCategory_new" USING ("category"::text::"ArtworkCategory_new");
ALTER TYPE "ArtworkCategory" RENAME TO "ArtworkCategory_old";
ALTER TYPE "ArtworkCategory_new" RENAME TO "ArtworkCategory";
DROP TYPE "public"."ArtworkCategory_old";
COMMIT;
