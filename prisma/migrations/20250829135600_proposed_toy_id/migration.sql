-- AlterTable
ALTER TABLE "public"."Message" ADD COLUMN     "proposedToyId" TEXT;

-- AddForeignKey
ALTER TABLE "public"."Message" ADD CONSTRAINT "Message_proposedToyId_fkey" FOREIGN KEY ("proposedToyId") REFERENCES "public"."Toy"("id") ON DELETE SET NULL ON UPDATE CASCADE;
