/*
  Warnings:

  - You are about to drop the column `updatedAt` on the `CoverLetter` table. All the data in the column will be lost.
  - Added the required column `updattedAt` to the `CoverLetter` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "CoverLetter" DROP CONSTRAINT "CoverLetter_fileName_fkey";

-- AlterTable
ALTER TABLE "CoverLetter" DROP COLUMN "updatedAt",
ADD COLUMN     "updattedAt" TIMESTAMP(3) NOT NULL;
