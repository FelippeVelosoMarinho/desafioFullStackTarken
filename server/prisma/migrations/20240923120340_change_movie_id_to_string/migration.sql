/*
  Warnings:

  - The primary key for the `Movie` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Library_Movies" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "libraryId" INTEGER NOT NULL,
    "movieId" TEXT NOT NULL,
    "addedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Library_Movies_libraryId_fkey" FOREIGN KEY ("libraryId") REFERENCES "Library" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Library_Movies_movieId_fkey" FOREIGN KEY ("movieId") REFERENCES "Movie" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Library_Movies" ("addedAt", "id", "libraryId", "movieId") SELECT "addedAt", "id", "libraryId", "movieId" FROM "Library_Movies";
DROP TABLE "Library_Movies";
ALTER TABLE "new_Library_Movies" RENAME TO "Library_Movies";
CREATE TABLE "new_Movie" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "posterUrl" TEXT NOT NULL,
    "imdbGrade" REAL NOT NULL,
    "releaseDate" DATETIME NOT NULL,
    "genre" TEXT NOT NULL,
    "description" TEXT NOT NULL
);
INSERT INTO "new_Movie" ("description", "genre", "id", "imdbGrade", "name", "posterUrl", "releaseDate") SELECT "description", "genre", "id", "imdbGrade", "name", "posterUrl", "releaseDate" FROM "Movie";
DROP TABLE "Movie";
ALTER TABLE "new_Movie" RENAME TO "Movie";
CREATE TABLE "new_Review" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "content" TEXT NOT NULL,
    "rating" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" INTEGER NOT NULL,
    "movieId" TEXT NOT NULL,
    CONSTRAINT "Review_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Review_movieId_fkey" FOREIGN KEY ("movieId") REFERENCES "Movie" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Review" ("content", "createdAt", "id", "movieId", "rating", "userId") SELECT "content", "createdAt", "id", "movieId", "rating", "userId" FROM "Review";
DROP TABLE "Review";
ALTER TABLE "new_Review" RENAME TO "Review";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
