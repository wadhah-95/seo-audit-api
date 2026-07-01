-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Audit" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "url" TEXT NOT NULL,
    "score" INTEGER NOT NULL,
    "htmlLength" INTEGER NOT NULL,
    "statusCode" INTEGER NOT NULL,
    "analysis" JSONB NOT NULL,
    "recommendations" JSONB NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "siteFiles" JSONB,
    "reachable" BOOLEAN NOT NULL DEFAULT true
);
INSERT INTO "new_Audit" ("analysis", "createdAt", "htmlLength", "id", "recommendations", "score", "siteFiles", "statusCode", "url") SELECT "analysis", "createdAt", "htmlLength", "id", "recommendations", "score", "siteFiles", "statusCode", "url" FROM "Audit";
DROP TABLE "Audit";
ALTER TABLE "new_Audit" RENAME TO "Audit";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
