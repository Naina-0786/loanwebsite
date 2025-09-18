import { z } from "zod";
export declare const loanValidation: z.ZodObject<{
    email: z.ZodString;
    fatherName: z.ZodString;
    address: z.ZodOptional<z.ZodString>;
    pincode: z.ZodOptional<z.ZodString>;
    phone: z.ZodOptional<z.ZodString>;
    loanAmount: z.ZodOptional<z.ZodString>;
    interest: z.ZodOptional<z.ZodString>;
    loanTenure: z.ZodOptional<z.ZodNumber>;
    aadharNumber: z.ZodOptional<z.ZodString>;
    panNumber: z.ZodOptional<z.ZodString>;
    fullName: z.ZodOptional<z.ZodString>;
    processingFeeStatus: z.ZodOptional<z.ZodEnum<{
        PENDING: "PENDING";
        APPROVED: "APPROVED";
        REJECTED: "REJECTED";
    }>>;
}, z.core.$strip>;
export declare const updateLoanApplicationSchema: z.ZodObject<{
    email: z.ZodOptional<z.ZodString>;
    phone: z.ZodOptional<z.ZodString>;
    loanAmount: z.ZodOptional<z.ZodString>;
    interest: z.ZodOptional<z.ZodString>;
    loanTenure: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodNumber]>>;
    aadharNumber: z.ZodOptional<z.ZodString>;
    panNumber: z.ZodOptional<z.ZodString>;
    fullName: z.ZodOptional<z.ZodString>;
    fatherName: z.ZodOptional<z.ZodString>;
    address: z.ZodOptional<z.ZodString>;
    pincode: z.ZodOptional<z.ZodString>;
    bankName: z.ZodOptional<z.ZodString>;
    accountNumber: z.ZodOptional<z.ZodString>;
    ifscCode: z.ZodOptional<z.ZodString>;
    processingFeeStatus: z.ZodOptional<z.ZodEnum<{
        PENDING: "PENDING";
        APPROVED: "APPROVED";
        REJECTED: "REJECTED";
    }>>;
    bankTransactionStatus: z.ZodOptional<z.ZodEnum<{
        PENDING: "PENDING";
        APPROVED: "APPROVED";
        REJECTED: "REJECTED";
    }>>;
    insuranceStatus: z.ZodOptional<z.ZodEnum<{
        PENDING: "PENDING";
        APPROVED: "APPROVED";
        REJECTED: "REJECTED";
    }>>;
    cibilStatus: z.ZodOptional<z.ZodEnum<{
        PENDING: "PENDING";
        APPROVED: "APPROVED";
        REJECTED: "REJECTED";
    }>>;
    tdsStatus: z.ZodOptional<z.ZodEnum<{
        PENDING: "PENDING";
        APPROVED: "APPROVED";
        REJECTED: "REJECTED";
    }>>;
    nocStatus: z.ZodOptional<z.ZodEnum<{
        PENDING: "PENDING";
        APPROVED: "APPROVED";
        REJECTED: "REJECTED";
    }>>;
}, z.core.$strict>;
export declare const paymentScreenshotFields: readonly ["processingFee", "bankTransactionPaperFee", "insuranceFee", "cibilFee", "tdsFee", "nocFee"];
export type PaymentScreenshotField = typeof paymentScreenshotFields[number];
//# sourceMappingURL=loan-application.d.ts.map