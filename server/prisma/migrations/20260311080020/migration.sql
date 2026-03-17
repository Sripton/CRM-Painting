/*
  Warnings:

  - You are about to drop the column `publishedAt` on the `Artwork` table. All the data in the column will be lost.
  - Made the column `category` on table `Artwork` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Artwork" DROP COLUMN "publishedAt",
ALTER COLUMN "category" SET NOT NULL;
