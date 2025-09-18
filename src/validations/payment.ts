import { z } from "zod"

export const paymentSchema = z.object({
    processingFee: z.string(),
    bankTransactionPaperFee: z.string(),
    insuranceFee: z.string(),
    cibilFee: z.string(),
    tdsFee: z.string(),
    nocFee: z.string(),
})