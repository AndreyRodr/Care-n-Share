/*
  Warnings:

  - You are about to drop the column `category` on the `Doacoes_Checkin` table. All the data in the column will be lost.
  - You are about to drop the column `unit` on the `Doacoes_Checkin` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Doacoes_Checkin" DROP COLUMN "category",
DROP COLUMN "unit";

-- AlterTable
ALTER TABLE "Post" ADD COLUMN     "category" TEXT,
ADD COLUMN     "type" TEXT,
ADD COLUMN     "unit" TEXT;
