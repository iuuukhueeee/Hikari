-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Url" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "originalUrl" TEXT NOT NULL,
    "shortUrl" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "displayUrl" TEXT NOT NULL
);
INSERT INTO "new_Url" ("createdAt", "description", "id", "originalUrl", "shortUrl", "updatedAt") SELECT "createdAt", "description", "id", "originalUrl", "shortUrl", "updatedAt" FROM "Url";
DROP TABLE "Url";
ALTER TABLE "new_Url" RENAME TO "Url";
CREATE UNIQUE INDEX "Url_shortUrl_key" ON "Url"("shortUrl");
CREATE UNIQUE INDEX "Url_displayUrl_key" ON "Url"("displayUrl");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
