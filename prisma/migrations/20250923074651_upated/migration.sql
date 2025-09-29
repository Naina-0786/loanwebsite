/*
  Warnings:

  - A unique constraint covering the columns `[email]` on the table `LoanApplication` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `LoanApplication_email_key` ON `LoanApplication`(`email`);
