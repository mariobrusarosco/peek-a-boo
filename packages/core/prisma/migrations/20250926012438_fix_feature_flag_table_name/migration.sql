/*
  Warnings:

  - You are about to drop the `FeatureFlag` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "FeatureFlag";

-- CreateTable
CREATE TABLE "feature_flags" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "value" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "feature_flags_pkey" PRIMARY KEY ("id")
);
