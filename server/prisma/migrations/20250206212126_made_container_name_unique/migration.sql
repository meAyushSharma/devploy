/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `Container` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Container_name_key" ON "Container"("name");
