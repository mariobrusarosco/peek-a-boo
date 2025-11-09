/*
  Warnings:

  - A unique constraint covering the columns `[key,projectId,environment]` on the table `feature_flags` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `key` to the `feature_flags` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Environment" AS ENUM ('DEVELOPMENT', 'STAGING', 'PRODUCTION');

-- AlterTable
ALTER TABLE "feature_flags" ADD COLUMN     "description" TEXT,
ADD COLUMN     "enabled" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "environment" "Environment" NOT NULL DEFAULT 'DEVELOPMENT',
ADD COLUMN     "key" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "feature_flags_key_projectId_environment_key" ON "feature_flags"("key", "projectId", "environment");
