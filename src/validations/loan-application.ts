import { z } from "zod";

// Cloudinary image schema
const cloudinaryImageSchema = z.object({
  public_id: z.string(),
  url: z.string().url()
});

// Enum for status (must match Prisma `Status`)
const statusEnum = z.enum(["PENDING", "APPROVED", "REJECTED"]);

export const loanValidation = z.object({
  email: z.string(),
  fatherName: z.string(),
  address: z.string().optional(),
  pincode: z.string().optional(),
  phone: z.string().min(10).optional(),
  loanAmount: z.string().optional(),
  interest: z.string().optional(),
  loanTenure: z.number().int().optional(), // fixed from z.int() → z.number().int()
  aadharNumber: z.string().min(12).optional(),
  panNumber: z.string().optional(),
  fullName: z.string().optional(),

  // fee status
  processingFeeStatus: statusEnum.optional(),
});

// Schema for updating loan application with payment screenshots
export const updateLoanApplicationSchema = z.object({
  // Personal information updates
  email: z.string().email().optional(),
  phone: z.string().min(10).optional(),
  loanAmount: z.string().optional(),
  interest: z.string().optional(),
  loanTenure: z.union([z.string(), z.number()]).optional(),
  aadharNumber: z.string().optional(),
  panNumber: z.string().optional(),
  fullName: z.string().optional(),
  fatherName: z.string().optional(),
  address: z.string().optional(),
  pincode: z.string().optional(),
  bankName: z.string().optional(),
  accountNumber: z.string().optional(),
  ifscCode: z.string().optional(),

  // Payment status updates (enum instead of boolean)
  processingFeeStatus: statusEnum.optional(),
  bankTransactionStatus: statusEnum.optional(),
  insuranceStatus: statusEnum.optional(),
  cibilStatus: statusEnum.optional(),
  tdsStatus: statusEnum.optional(),
  nocStatus: statusEnum.optional(),
})

// Schema for payment screenshot fields (for file uploads)
export const paymentScreenshotFields = [
  "processingFee",
  "bankTransactionPaperFee",
  "insuranceFee",
  "cibilFee",
  "tdsFee",
  "nocFee"
] as const;

export type PaymentScreenshotField = typeof paymentScreenshotFields[number];
