/*
  Warnings:

  - The primary key for the `MetaData` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- AlterTable
ALTER TABLE "MetaData" DROP CONSTRAINT "MetaData_pkey",
ALTER COLUMN "email" SET DATA TYPE TEXT,
ADD CONSTRAINT "MetaData_pkey" PRIMARY KEY ("email");
