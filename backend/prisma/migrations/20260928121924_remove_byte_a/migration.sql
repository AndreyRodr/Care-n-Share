/*
  Warnings:

  - You are about to drop the column `imageMimeType` on the `Post` table. All the data in the column will be lost.
  - You are about to drop the column `imageMimeType` on the `Project` table. All the data in the column will be lost.
  - You are about to drop the column `profilePictureMimeType` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Post" DROP COLUMN "imageMimeType",
ALTER COLUMN "image" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "Project" DROP COLUMN "imageMimeType",
ALTER COLUMN "image" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "profilePictureMimeType",
ALTER COLUMN "profilePicture" SET DATA TYPE TEXT;
