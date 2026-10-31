/*
  Warnings:

  - You are about to drop the column `projectId` on the `Doacoes_Checkin` table. All the data in the column will be lost.
  - You are about to drop the `Project` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_ProjectCauses` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Doacoes_Checkin" DROP CONSTRAINT "Doacoes_Checkin_projectId_fkey";

-- DropForeignKey
ALTER TABLE "Project" DROP CONSTRAINT "Project_ongId_fkey";

-- DropForeignKey
ALTER TABLE "_ProjectCauses" DROP CONSTRAINT "_ProjectCauses_A_fkey";

-- DropForeignKey
ALTER TABLE "_ProjectCauses" DROP CONSTRAINT "_ProjectCauses_B_fkey";

-- AlterTable
ALTER TABLE "Doacoes_Checkin" DROP COLUMN "projectId",
ADD COLUMN     "postId" TEXT;

-- AlterTable
ALTER TABLE "Post" ADD COLUMN     "amountRaised" DECIMAL(12,2) NOT NULL DEFAULT 0,
ADD COLUMN     "fundraisingDeadline" TIMESTAMP(3),
ADD COLUMN     "fundraisingGoal" DECIMAL(12,2) NOT NULL DEFAULT 0;

-- DropTable
DROP TABLE "Project";

-- DropTable
DROP TABLE "_ProjectCauses";

-- CreateTable
CREATE TABLE "_PostCauses" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_PostCauses_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_PostCauses_B_index" ON "_PostCauses"("B");

-- CreateIndex
CREATE INDEX "Post_ongId_idx" ON "Post"("ongId");

-- AddForeignKey
ALTER TABLE "Doacoes_Checkin" ADD CONSTRAINT "Doacoes_Checkin_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Post"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PostCauses" ADD CONSTRAINT "_PostCauses_A_fkey" FOREIGN KEY ("A") REFERENCES "Cause"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PostCauses" ADD CONSTRAINT "_PostCauses_B_fkey" FOREIGN KEY ("B") REFERENCES "Post"("id") ON DELETE CASCADE ON UPDATE CASCADE;
