/*
  Warnings:

  - You are about to drop the column `isBankTransactionApproved` on the `loanapplication` table. All the data in the column will be lost.
  - You are about to drop the column `isCibilApproved` on the `loanapplication` table. All the data in the column will be lost.
  - You are about to drop the column `isInsuranceApproved` on the `loanapplication` table. All the data in the column will be lost.
  - You are about to drop the column `isNocApproved` on the `loanapplication` table. All the data in the column will be lost.
  - You are about to drop the column `isProcessingFeeApproved` on the `loanapplication` table. All the data in the column will be lost.
  - You are about to drop the column `isTdsApproved` on the `loanapplication` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `loanapplication` DROP COLUMN `isBankTransactionApproved`,
    DROP COLUMN `isCibilApproved`,
    DROP COLUMN `isInsuranceApproved`,
    DROP COLUMN `isNocApproved`,
    DROP COLUMN `isProcessingFeeApproved`,
    DROP COLUMN `isTdsApproved`,
    ADD COLUMN `bankTransactionStatus` ENUM('PENDING', 'APPROVED', 'REJECTED') NOT NULL DEFAULT 'PENDING',
    ADD COLUMN `cibilStatus` ENUM('PENDING', 'APPROVED', 'REJECTED') NOT NULL DEFAULT 'PENDING',
    ADD COLUMN `insuranceStatus` ENUM('PENDING', 'APPROVED', 'REJECTED') NOT NULL DEFAULT 'PENDING',
    ADD COLUMN `nocStatus` ENUM('PENDING', 'APPROVED', 'REJECTED') NOT NULL DEFAULT 'PENDING',
    ADD COLUMN `processingFeeStatus` ENUM('PENDING', 'APPROVED', 'REJECTED') NOT NULL DEFAULT 'PENDING',
    ADD COLUMN `tdsStatus` ENUM('PENDING', 'APPROVED', 'REJECTED') NOT NULL DEFAULT 'PENDING';
