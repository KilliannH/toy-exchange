/*
  Warnings:

  - You are about to drop the column `fileName` on the `ToyImage` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."ToyImage" DROP COLUMN "fileName",
ADD COLUMN     "signedUrl" TEXT;
