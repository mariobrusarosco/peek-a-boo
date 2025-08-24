/*
  Warnings:

  - You are about to drop the column `description` on the `projects` table. All the data in the column will be lost.
  - You are about to drop the column `organizationId` on the `projects` table. All the data in the column will be lost.
  - You are about to drop the column `emailVerified` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `image` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `organizationId` on the `users` table. All the data in the column will be lost.
  - You are about to drop the `accounts` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `audit_logs` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `environments` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `flag_rules` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `flag_values` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `flag_variations` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `flags` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `organizations` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `project_members` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `sessions` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `verification_tokens` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `userId` to the `projects` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "accounts" DROP CONSTRAINT "accounts_userId_fkey";

-- DropForeignKey
ALTER TABLE "environments" DROP CONSTRAINT "environments_organizationId_fkey";

-- DropForeignKey
ALTER TABLE "flag_rules" DROP CONSTRAINT "flag_rules_flagValueId_fkey";

-- DropForeignKey
ALTER TABLE "flag_values" DROP CONSTRAINT "flag_values_environmentId_fkey";

-- DropForeignKey
ALTER TABLE "flag_values" DROP CONSTRAINT "flag_values_flagId_fkey";

-- DropForeignKey
ALTER TABLE "flag_values" DROP CONSTRAINT "flag_values_variationId_fkey";

-- DropForeignKey
ALTER TABLE "flag_variations" DROP CONSTRAINT "flag_variations_flagId_fkey";

-- DropForeignKey
ALTER TABLE "flags" DROP CONSTRAINT "flags_organizationId_fkey";

-- DropForeignKey
ALTER TABLE "flags" DROP CONSTRAINT "flags_projectId_fkey";

-- DropForeignKey
ALTER TABLE "project_members" DROP CONSTRAINT "project_members_projectId_fkey";

-- DropForeignKey
ALTER TABLE "project_members" DROP CONSTRAINT "project_members_userId_fkey";

-- DropForeignKey
ALTER TABLE "projects" DROP CONSTRAINT "projects_organizationId_fkey";

-- DropForeignKey
ALTER TABLE "sessions" DROP CONSTRAINT "sessions_userId_fkey";

-- DropForeignKey
ALTER TABLE "users" DROP CONSTRAINT "users_organizationId_fkey";

-- AlterTable
ALTER TABLE "projects" DROP COLUMN "description",
DROP COLUMN "organizationId",
ADD COLUMN     "userId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "users" DROP COLUMN "emailVerified",
DROP COLUMN "image",
DROP COLUMN "organizationId";

-- DropTable
DROP TABLE "accounts";

-- DropTable
DROP TABLE "audit_logs";

-- DropTable
DROP TABLE "environments";

-- DropTable
DROP TABLE "flag_rules";

-- DropTable
DROP TABLE "flag_values";

-- DropTable
DROP TABLE "flag_variations";

-- DropTable
DROP TABLE "flags";

-- DropTable
DROP TABLE "organizations";

-- DropTable
DROP TABLE "project_members";

-- DropTable
DROP TABLE "sessions";

-- DropTable
DROP TABLE "verification_tokens";

-- DropEnum
DROP TYPE "ProjectRole";

-- DropEnum
DROP TYPE "RuleOperator";

-- AddForeignKey
ALTER TABLE "projects" ADD CONSTRAINT "projects_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
