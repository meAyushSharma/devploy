/*
  Warnings:

  - You are about to drop the `metaData` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "metaData";

-- CreateTable
CREATE TABLE "MetaData" (
    "email" INTEGER NOT NULL,
    "code" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MetaData_pkey" PRIMARY KEY ("email")
);

-- CreateIndex
CREATE UNIQUE INDEX "MetaData_email_key" ON "MetaData"("email");
