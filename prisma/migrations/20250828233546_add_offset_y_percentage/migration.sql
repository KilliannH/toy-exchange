/*
  Warnings:

  - You are about to drop the column `offsetY` on the `ToyImage` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."ToyImage" DROP COLUMN "offsetY",
ADD COLUMN     "offsetYPercentage" DOUBLE PRECISION;
