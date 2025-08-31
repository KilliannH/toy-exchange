-- CreateTable
CREATE TABLE "public"."RateLimitLog" (
    "id" TEXT NOT NULL,
    "identifier" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "RateLimitLog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "RateLimitLog_identifier_createdAt_idx" ON "public"."RateLimitLog"("identifier", "createdAt");

-- CreateIndex
CREATE INDEX "RateLimitLog_createdAt_idx" ON "public"."RateLimitLog"("createdAt");
