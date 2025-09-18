import { z } from "zod";
export declare const generateOtpSchema: z.ZodObject<{
    email: z.ZodString;
}, z.core.$strip>;
export declare const verifyOtpSchema: z.ZodObject<{
    email: z.ZodString;
    otp: z.ZodString;
}, z.core.$strip>;
export declare const resendOtpSchema: z.ZodObject<{
    email: z.ZodString;
}, z.core.$strip>;
//# sourceMappingURL=otp.d.ts.map