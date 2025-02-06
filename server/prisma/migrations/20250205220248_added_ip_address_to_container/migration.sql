/*
  Warnings:

  - Added the required column `default_port` to the `Container` table without a default value. This is not possible if the table is not empty.
  - Added the required column `ipAddress` to the `Container` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Container" ADD COLUMN     "default_port" INTEGER NOT NULL,
ADD COLUMN     "ipAddress" TEXT NOT NULL;
