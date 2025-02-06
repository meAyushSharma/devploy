/*
  Warnings:

  - You are about to drop the column `envId` on the `Container` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `Container` table. All the data in the column will be lost.
  - Added the required column `envId` to the `Image` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Container" DROP CONSTRAINT "Container_envId_fkey";

-- DropForeignKey
ALTER TABLE "Container" DROP CONSTRAINT "Container_userId_fkey";

-- AlterTable
ALTER TABLE "Container" DROP COLUMN "envId",
DROP COLUMN "userId";

-- AlterTable
ALTER TABLE "Image" ADD COLUMN     "envId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "Image" ADD CONSTRAINT "Image_envId_fkey" FOREIGN KEY ("envId") REFERENCES "Environment"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
