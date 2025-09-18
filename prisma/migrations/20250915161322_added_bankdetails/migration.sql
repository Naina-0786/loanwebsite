-- AlterTable
ALTER TABLE `loanapplication` ADD COLUMN `accountNumber` VARCHAR(191) NULL,
    ADD COLUMN `bankName` VARCHAR(191) NULL,
    ADD COLUMN `ifscCode` VARCHAR(191) NULL;
