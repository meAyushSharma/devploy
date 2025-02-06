/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `Image` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Image_name_key" ON "Image"("name");
