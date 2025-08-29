/*
  Warnings:

  - A unique constraint covering the columns `[exchangeId,reviewerId]` on the table `Review` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "public"."Review_exchangeId_key";

-- CreateIndex
CREATE UNIQUE INDEX "Review_exchangeId_reviewerId_key" ON "public"."Review"("exchangeId", "reviewerId");
