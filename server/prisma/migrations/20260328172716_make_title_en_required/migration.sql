/*
  Warnings:

  - Made the column `titleEn` on table `Artwork` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Artwork" ALTER COLUMN "titleEn" SET NOT NULL;
