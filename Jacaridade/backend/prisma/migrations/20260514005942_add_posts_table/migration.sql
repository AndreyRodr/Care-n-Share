-- CreateTable
CREATE TABLE "Post" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "image" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "ongId" TEXT NOT NULL,
    CONSTRAINT "Post_ongId_fkey" FOREIGN KEY ("ongId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
