/*
  Warnings:

  - Added the required column `type` to the `Doacoes_Checkin` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "TransactionType" AS ENUM ('CREDIT', 'DEBIT', 'MONEY', 'PIX');

-- AlterTable
ALTER TABLE "Doacoes_Checkin" ADD COLUMN     "type" "TransactionType" NOT NULL;
