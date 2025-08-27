-- CreateEnum
CREATE TYPE "public"."Condition" AS ENUM ('NEW', 'VERY_GOOD', 'GOOD', 'USED');

-- CreateEnum
CREATE TYPE "public"."Category" AS ENUM ('CONSTRUCTION', 'DOLLS', 'VEHICLES', 'BOARD_GAMES', 'BOOKS', 'OTHER');

-- CreateEnum
CREATE TYPE "public"."Mode" AS ENUM ('DON', 'EXCHANGE', 'POINTS');

-- CreateEnum
CREATE TYPE "public"."Status" AS ENUM ('AVAILABLE', 'RESERVED', 'EXCHANGED');

-- CreateTable
CREATE TABLE "public"."User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "city" TEXT,
    "lat" DOUBLE PRECISION,
    "lng" DOUBLE PRECISION,
    "radiusKm" INTEGER DEFAULT 10,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Toy" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "condition" "public"."Condition" NOT NULL,
    "category" "public"."Category" NOT NULL,
    "ageMin" INTEGER NOT NULL,
    "ageMax" INTEGER NOT NULL,
    "mode" "public"."Mode" NOT NULL,
    "lat" DOUBLE PRECISION,
    "lng" DOUBLE PRECISION,
    "status" "public"."Status" NOT NULL DEFAULT 'AVAILABLE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Toy_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."ToyImage" (
    "id" TEXT NOT NULL,
    "toyId" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "ToyImage_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "public"."User"("email");

-- AddForeignKey
ALTER TABLE "public"."Toy" ADD CONSTRAINT "Toy_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ToyImage" ADD CONSTRAINT "ToyImage_toyId_fkey" FOREIGN KEY ("toyId") REFERENCES "public"."Toy"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
