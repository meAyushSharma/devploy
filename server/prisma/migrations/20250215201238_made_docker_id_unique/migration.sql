/*
  Warnings:

  - A unique constraint covering the columns `[dockerId]` on the table `Container` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[dockerId]` on the table `Image` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Container_dockerId_key" ON "Container"("dockerId");

-- CreateIndex
CREATE UNIQUE INDEX "Image_dockerId_key" ON "Image"("dockerId");
