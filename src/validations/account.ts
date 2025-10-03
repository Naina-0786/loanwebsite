import { z } from "zod";

export const accountSchema = z.object({
    accountNumber: z.string(),
    bankName: z.string(),
    ifscCode: z.string(),
});