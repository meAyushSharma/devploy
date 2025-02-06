/*
  Warnings:

  - You are about to drop the column `containerId` on the `Image` table. All the data in the column will be lost.
  - Added the required column `imageId` to the `Container` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `Image` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Image" DROP CONSTRAINT "Image_containerId_fkey";

-- AlterTable
ALTER TABLE "Container" ADD COLUMN     "imageId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Image" DROP COLUMN "containerId",
ADD COLUMN     "userId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "Container" ADD CONSTRAINT "Container_imageId_fkey" FOREIGN KEY ("imageId") REFERENCES "Image"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Image" ADD CONSTRAINT "Image_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
