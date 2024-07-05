/*
  Warnings:

  - You are about to drop the column `updattedAt` on the `CoverLetter` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[name]` on the table `File` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `fileName` to the `CoverLetter` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `CoverLetter` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "CoverLetter" DROP COLUMN "updattedAt",
ADD COLUMN     "fileName" TEXT NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "File_name_key" ON "File"("name");

-- AddForeignKey
ALTER TABLE "CoverLetter" ADD CONSTRAINT "CoverLetter_fileName_fkey" FOREIGN KEY ("fileName") REFERENCES "File"("name") ON DELETE CASCADE ON UPDATE CASCADE;
