/*
  Warnings:

  - You are about to drop the `oidc_model` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "oidc_model";

-- CreateTable
CREATE TABLE "OidcModel" (
    "id" TEXT NOT NULL,
    "type" INTEGER NOT NULL,
    "payload" JSONB NOT NULL,
    "grantId" TEXT,
    "userCode" TEXT,
    "uid" TEXT,
    "expiresAt" TIMESTAMP(3),
    "consumedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "OidcModel_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "OidcModel_uid_key" ON "OidcModel"("uid");

-- CreateIndex
CREATE UNIQUE INDEX "OidcModel_id_type_key" ON "OidcModel"("id", "type");
