/*
  Warnings:

  - You are about to drop the column `number` on the `popup` table. All the data in the column will be lost.
  - Added the required column `phoneNumber` to the `popup` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `popup` DROP COLUMN `number`,
    ADD COLUMN `phoneNumber` VARCHAR(191) NOT NULL;
