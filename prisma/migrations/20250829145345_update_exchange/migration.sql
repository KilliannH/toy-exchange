-- AlterTable
ALTER TABLE "public"."Exchange" ADD COLUMN     "ownerConfirmed" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "requesterConfirmed" BOOLEAN NOT NULL DEFAULT false;
