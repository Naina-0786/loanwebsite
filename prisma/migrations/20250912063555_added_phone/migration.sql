/*
  Warnings:

  - Made the column `phone` on table `loanapplication` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `loanapplication` MODIFY `email` VARCHAR(191) NULL,
    MODIFY `phone` VARCHAR(191) NOT NULL;
