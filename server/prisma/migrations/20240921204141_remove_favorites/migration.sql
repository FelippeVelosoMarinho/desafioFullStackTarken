/*
  Warnings:

  - You are about to drop the `Favorite` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the column `createdAt` on the `Library` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `Library` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `Library` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "Favorite_userId_movieId_key";

-- DropIndex
DROP INDEX "Library_Movies_libraryId_movieId_key";

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "Favorite";
PRAGMA foreign_keys=on;

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Library" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userId" INTEGER NOT NULL,
    CONSTRAINT "Library_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Library" ("id", "userId") SELECT "id", "userId" FROM "Library";
DROP TABLE "Library";
ALTER TABLE "new_Library" RENAME TO "Library";
CREATE UNIQUE INDEX "Library_userId_key" ON "Library"("userId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
