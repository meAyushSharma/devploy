/*
  Warnings:

  - You are about to drop the column `default_port` on the `Container` table. All the data in the column will be lost.
  - Added the required column `ports` to the `Container` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Container" DROP COLUMN "default_port",
ADD COLUMN     "ports" TEXT NOT NULL;
