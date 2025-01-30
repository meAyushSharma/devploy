/*
  Warnings:

  - Added the required column `value` to the `Compose` table without a default value. This is not possible if the table is not empty.
  - Added the required column `value` to the `Environment` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Compose" ADD COLUMN     "value" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Environment" ADD COLUMN     "value" TEXT NOT NULL;
