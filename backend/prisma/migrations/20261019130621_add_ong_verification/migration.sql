-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('USER', 'ADMIN');

-- CreateEnum
CREATE TYPE "OngVerificationStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "role" "UserRole" NOT NULL DEFAULT 'USER',
ADD COLUMN     "verificationStatus" "OngVerificationStatus";

-- CreateTable
CREATE TABLE "OngVerification" (
    "id" TEXT NOT NULL,
    "ongId" TEXT NOT NULL,
    "cnpj" TEXT NOT NULL,
    "legalName" TEXT,
    "cnpjSituation" TEXT,
    "cnpjCheckedAt" TIMESTAMP(3),
    "validationProvider" TEXT,
    "validationRawResponse" JSONB,
    "statuteDocumentUrl" TEXT NOT NULL,
    "addressProofDocumentUrl" TEXT NOT NULL,
    "rejectionReason" TEXT,
    "reviewedAt" TIMESTAMP(3),
    "reviewedById" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "OngVerification_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "OngVerification_ongId_key" ON "OngVerification"("ongId");

-- CreateIndex
CREATE UNIQUE INDEX "OngVerification_cnpj_key" ON "OngVerification"("cnpj");

-- AddForeignKey
ALTER TABLE "OngVerification" ADD CONSTRAINT "OngVerification_ongId_fkey" FOREIGN KEY ("ongId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OngVerification" ADD CONSTRAINT "OngVerification_reviewedById_fkey" FOREIGN KEY ("reviewedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- Mantém as ONGs que já existiam operacionais durante a transição.
-- Novas ONGs serão criadas com status PENDING pela aplicação.
UPDATE "User"
SET "verificationStatus" = 'APPROVED'
WHERE "type" = 'O'
  AND "verificationStatus" IS NULL;