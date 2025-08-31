/*
  Warnings:

  - You are about to drop the `VerificationToken` table. If the table is not empty, all the data it contains will be lost.

*/
-- AlterTable
ALTER TABLE "public"."User" ADD COLUMN     "emailVerified" TIMESTAMP(3);

-- DropTable
DROP TABLE "public"."VerificationToken";

-- CreateTable
CREATE TABLE "public"."EmailVerificationToken" (
    "id" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "EmailVerificationToken_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "EmailVerificationToken_token_key" ON "public"."EmailVerificationToken"("token");

-- CreateIndex
CREATE INDEX "EmailVerificationToken_userId_idx" ON "public"."EmailVerificationToken"("userId");

-- AddForeignKey
ALTER TABLE "public"."EmailVerificationToken" ADD CONSTRAINT "EmailVerificationToken_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
