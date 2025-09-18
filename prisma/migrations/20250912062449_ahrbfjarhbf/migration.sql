/*
  Warnings:

  - You are about to drop the column `email` on the `otp` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[number]` on the table `Otp` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `number` to the `Otp` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX `Otp_email_key` ON `otp`;

-- AlterTable
ALTER TABLE `otp` DROP COLUMN `email`,
    ADD COLUMN `number` VARCHAR(191) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `Otp_number_key` ON `Otp`(`number`);
