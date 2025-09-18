import { z } from "zod";
export declare const paymentSchema: z.ZodObject<{
    processingFee: z.ZodString;
    bankTransactionPaperFee: z.ZodString;
    insuranceFee: z.ZodString;
    cibilFee: z.ZodString;
    tdsFee: z.ZodString;
    nocFee: z.ZodString;
}, z.core.$strip>;
//# sourceMappingURL=payment.d.ts.map