import { z } from "zod";
// Schema for generating OTP
export const generateOtpSchema = z.object({
    email: z.string().email("Invalid email format"),
});
// Schema for verifying OTP
export const verifyOtpSchema = z.object({
    email: z.string().email("Invalid email format"),
    otp: z.string().length(4, "OTP must be exactly 4 digits"),
});
// Schema for resending OTP
export const resendOtpSchema = z.object({
    email: z.string().email("Invalid email format"),
});
//# sourceMappingURL=otp.js.map