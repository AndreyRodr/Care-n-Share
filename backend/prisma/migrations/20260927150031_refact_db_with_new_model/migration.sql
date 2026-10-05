/*
  Warnings:

  - The `image` column on the `Post` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `profilePicture` column on the `User` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the `Activity` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Donation` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Goal` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Notification` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "DonationCheckinStatus" AS ENUM ('PENDING', 'CHECKED_IN', 'CANCELLED');

-- DropForeignKey
ALTER TABLE "Activity" DROP CONSTRAINT "Activity_ongId_fkey";

-- DropForeignKey
ALTER TABLE "Donation" DROP CONSTRAINT "Donation_donorId_fkey";

-- DropForeignKey
ALTER TABLE "Donation" DROP CONSTRAINT "Donation_goalId_fkey";

-- DropForeignKey
ALTER TABLE "Donation" DROP CONSTRAINT "Donation_ongId_fkey";

-- DropForeignKey
ALTER TABLE "Goal" DROP CONSTRAINT "Goal_ongId_fkey";

-- DropForeignKey
ALTER TABLE "Notification" DROP CONSTRAINT "Notification_userId_fkey";

-- DropForeignKey
ALTER TABLE "Post" DROP CONSTRAINT "Post_ongId_fkey";

-- AlterTable
ALTER TABLE "Post" ADD COLUMN     "imageMimeType" TEXT,
DROP COLUMN "image",
ADD COLUMN     "image" BYTEA;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "profilePictureMimeType" TEXT,
DROP COLUMN "profilePicture",
ADD COLUMN     "profilePicture" BYTEA;

-- DropTable
DROP TABLE "Activity";

-- DropTable
DROP TABLE "Donation";

-- DropTable
DROP TABLE "Goal";

-- DropTable
DROP TABLE "Notification";

-- DropEnum
DROP TYPE "ContributionType";

-- DropEnum
DROP TYPE "DonationStatus";

-- CreateTable
CREATE TABLE "Cause" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Cause_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Project" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "image" BYTEA,
    "imageMimeType" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "ongId" TEXT NOT NULL,

    CONSTRAINT "Project_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Doacoes_Checkin" (
    "id" TEXT NOT NULL,
    "itemName" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "quantity" DECIMAL(12,3) NOT NULL,
    "unit" TEXT NOT NULL,
    "status" "DonationCheckinStatus" NOT NULL DEFAULT 'PENDING',
    "checkedInAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "donorId" TEXT NOT NULL,
    "ongId" TEXT NOT NULL,
    "validatedById" TEXT,
    "projectId" TEXT,

    CONSTRAINT "Doacoes_Checkin_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Estoque_ONG" (
    "id" TEXT NOT NULL,
    "itemName" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "unit" TEXT NOT NULL,
    "quantity" DECIMAL(12,3) NOT NULL DEFAULT 0,
    "minimumQuantity" DECIMAL(12,3) NOT NULL DEFAULT 0,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "ongId" TEXT NOT NULL,

    CONSTRAINT "Estoque_ONG_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_UserCauses" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_UserCauses_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_ProjectCauses" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_ProjectCauses_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "Cause_name_key" ON "Cause"("name");

-- CreateIndex
CREATE INDEX "Doacoes_Checkin_ongId_status_idx" ON "Doacoes_Checkin"("ongId", "status");

-- CreateIndex
CREATE INDEX "Doacoes_Checkin_donorId_idx" ON "Doacoes_Checkin"("donorId");

-- CreateIndex
CREATE UNIQUE INDEX "Estoque_ONG_ongId_itemName_unit_key" ON "Estoque_ONG"("ongId", "itemName", "unit");

-- CreateIndex
CREATE INDEX "_UserCauses_B_index" ON "_UserCauses"("B");

-- CreateIndex
CREATE INDEX "_ProjectCauses_B_index" ON "_ProjectCauses"("B");

-- AddForeignKey
ALTER TABLE "Post" ADD CONSTRAINT "Post_ongId_fkey" FOREIGN KEY ("ongId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Project" ADD CONSTRAINT "Project_ongId_fkey" FOREIGN KEY ("ongId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Doacoes_Checkin" ADD CONSTRAINT "Doacoes_Checkin_donorId_fkey" FOREIGN KEY ("donorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Doacoes_Checkin" ADD CONSTRAINT "Doacoes_Checkin_ongId_fkey" FOREIGN KEY ("ongId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Doacoes_Checkin" ADD CONSTRAINT "Doacoes_Checkin_validatedById_fkey" FOREIGN KEY ("validatedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Doacoes_Checkin" ADD CONSTRAINT "Doacoes_Checkin_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Estoque_ONG" ADD CONSTRAINT "Estoque_ONG_ongId_fkey" FOREIGN KEY ("ongId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_UserCauses" ADD CONSTRAINT "_UserCauses_A_fkey" FOREIGN KEY ("A") REFERENCES "Cause"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_UserCauses" ADD CONSTRAINT "_UserCauses_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ProjectCauses" ADD CONSTRAINT "_ProjectCauses_A_fkey" FOREIGN KEY ("A") REFERENCES "Cause"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ProjectCauses" ADD CONSTRAINT "_ProjectCauses_B_fkey" FOREIGN KEY ("B") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;
