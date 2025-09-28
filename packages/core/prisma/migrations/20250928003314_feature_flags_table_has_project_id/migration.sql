/*
  Warnings:

  - Added the required column `projectId` to the `feature_flags` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "feature_flags" ADD COLUMN     "projectId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "feature_flags" ADD CONSTRAINT "feature_flags_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;
