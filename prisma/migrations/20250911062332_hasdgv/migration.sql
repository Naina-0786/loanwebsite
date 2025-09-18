-- CreateTable
CREATE TABLE `Admin` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `created` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Admin_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `PaymentFee` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `processingFee` VARCHAR(191) NOT NULL,
    `bankTransactionPaperFee` VARCHAR(191) NOT NULL,
    `insuranceFee` VARCHAR(191) NOT NULL,
    `cibilFee` VARCHAR(191) NOT NULL,
    `tdsFee` VARCHAR(191) NOT NULL,
    `nocFee` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `LoanApplication` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `email` VARCHAR(191) NOT NULL,
    `phone` VARCHAR(191) NULL,
    `loanAmount` VARCHAR(191) NULL,
    `interest` VARCHAR(191) NULL,
    `loanTenure` INTEGER NULL,
    `aadharNumber` VARCHAR(191) NULL,
    `panNumber` VARCHAR(191) NULL,
    `fullName` VARCHAR(191) NULL,
    `fatherName` VARCHAR(191) NULL,
    `address` VARCHAR(191) NULL,
    `processingFee` JSON NULL,
    `isProcessingFeeApproved` BOOLEAN NOT NULL DEFAULT false,
    `bankTransactionPaperFee` JSON NULL,
    `isBankTransactionApproved` BOOLEAN NOT NULL DEFAULT false,
    `insuranceFee` JSON NULL,
    `isInsuranceApproved` BOOLEAN NOT NULL DEFAULT false,
    `cibilFee` JSON NULL,
    `isCibilApproved` BOOLEAN NOT NULL DEFAULT false,
    `tdsFee` JSON NULL,
    `isTdsApproved` BOOLEAN NOT NULL DEFAULT false,
    `nocFee` JSON NULL,
    `isNocApproved` BOOLEAN NOT NULL DEFAULT false,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Otp` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `email` VARCHAR(191) NOT NULL,
    `otp` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Otp_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
