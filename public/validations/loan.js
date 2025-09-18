import { z } from "zod";
// Cloudinary image schema
const cloudinaryImageSchema = z.object({
    public_id: z.string(),
    url: z.string().url()
});
export const loanValidation = z.object({
    email: z.string(),
    fathername: z.string(),
    address: z.string().optional(),
    pincode: z.string().optional(),
    phone: z.string().min(10).optional(),
    loanAmount: z.string().optional(),
    interest: z.string().optional(),
    loanTenure: z.int().optional(),
    aadharNumber: z.string().min(12).optional(),
    panNumber: z.string().optional(),
    fullName: z.string().optional(),
    isProcessingFeeApproved: z.string().optional(),
});
// Schema for updating loan application with payment screenshots
export const updateLoanApplicationSchema = z.object({
    // Personal information updates
    email: z.string().email().optional(),
    phone: z.string().min(10).optional(),
    loanAmount: z.string().optional(),
    interest: z.string().optional(),
    loanTenure: z.number().int().positive().optional(),
    aadharNumber: z.string().min(12).optional(),
    panNumber: z.string().optional(),
    fullName: z.string().optional(),
    fatherName: z.string().optional(),
    address: z.string().optional(),
    pincode: z.string().optional(),
    bankName: z.string().optional(),
    accountNumber: z.string().optional(),
    ifscCode: z.string().optional(),
    // Payment screenshot approvals (admin only, form-data strings → boolean)
    isProcessingFeeApproved: z
        .string()
        .refine((val) => val === "true" || val === "false", {
        message: "Must be 'true' or 'false'",
    })
        .transform((val) => val === "true")
        .optional(),
    isBankTransactionApproved: z
        .string()
        .refine((val) => val === "true" || val === "false", {
        message: "Must be 'true' or 'false'",
    })
        .transform((val) => val === "true")
        .optional(),
    isInsuranceApproved: z
        .string()
        .refine((val) => val === "true" || val === "false", {
        message: "Must be 'true' or 'false'",
    })
        .transform((val) => val === "true")
        .optional(),
    isCibilApproved: z
        .string()
        .refine((val) => val === "true" || val === "false", {
        message: "Must be 'true' or 'false'",
    })
        .transform((val) => val === "true")
        .optional(),
    isTdsApproved: z
        .string()
        .refine((val) => val === "true" || val === "false", {
        message: "Must be 'true' or 'false'",
    })
        .transform((val) => val === "true")
        .optional(),
    isNocApproved: z
        .string()
        .refine((val) => val === "true" || val === "false", {
        message: "Must be 'true' or 'false'",
    })
        .transform((val) => val === "true")
        .optional(),
});
// Schema for payment screenshot fields (for file uploads)
export const paymentScreenshotFields = [
    'processingFee',
    'bankTransactionPaperFee',
    'insuranceFee',
    'cibilFee',
    'tdsFee',
    'nocFee'
];
//# sourceMappingURL=loan.js.map