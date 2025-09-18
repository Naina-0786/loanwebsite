/*
  Warnings:

  - You are about to drop the column `number` on the `otp` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[email]` on the table `Otp` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX `Otp_number_key` ON `otp`;

-- AlterTable
ALTER TABLE `otp` DROP COLUMN `number`,
    ADD COLUMN `email` VARCHAR(191) NOT NULL DEFAULT '';

-- CreateIndex
CREATE UNIQUE INDEX `Otp_email_key` ON `Otp`(`email`);
