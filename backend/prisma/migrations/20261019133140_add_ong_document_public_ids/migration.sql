/*
  Warnings:

  - Added the required column `addressProofDocumentPublicId` to the `OngVerification` table without a default value. This is not possible if the table is not empty.
  - Added the required column `statuteDocumentPublicId` to the `OngVerification` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "OngVerification" ADD COLUMN     "addressProofDocumentPublicId" TEXT NOT NULL,
ADD COLUMN     "statuteDocumentPublicId" TEXT NOT NULL;
