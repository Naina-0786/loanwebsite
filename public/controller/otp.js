import prisma from "../config/prisma.js";
import { asyncHandler } from "../middleware/error.middleware.js";
import { statusCode } from "../types/types.js";
import { generateOtp, sendOtp } from "../utils/otp.utils.js";
import { ErrorResponse, SuccessResponse } from "../utils/response.util.js";
import { generateOtpSchema, verifyOtpSchema } from "../validations/otp.js";
export const requestOtp = asyncHandler(async (req, res, next) => {
    const validData = generateOtpSchema.parse(req.body);
    console.log("payload", req.body);
    // 🔹 If email is test@example.com, always send OTP = 123456
    const otp = validData.email === "test@example.com" ? "1234" : generateOtp();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000);
    const existingOtp = await prisma.otp.findUnique({
        where: { email: validData.email },
    });
    if (existingOtp) {
        await prisma.otp.delete({ where: { id: existingOtp.id } });
    }
    await prisma.otp.create({
        data: { email: validData.email, otp, expiresAt },
    });
    await sendOtp(validData.email, otp);
    return SuccessResponse(res, "OTP sent successfully", { email: validData.email }, statusCode.OK);
});
export const verifyOtp = asyncHandler(async (req, res) => {
    const validData = verifyOtpSchema.parse(req.body);
    console.log("payload", req.body);
    const storedOtp = await prisma.otp.findFirst({
        where: {
            email: validData.email,
            otp: validData.otp,
            expiresAt: { gt: new Date() },
        },
    });
    if (!storedOtp) {
        throw new ErrorResponse("Invalid or expired OTP", statusCode.Bad_Request);
    }
    await prisma.otp.delete({ where: { id: storedOtp.id } });
    let loanApplication = await prisma.loanApplication.findUnique({
        where: { email: validData.email },
    });
    if (!loanApplication) {
        loanApplication = await prisma.loanApplication.create({
            data: { email: validData.email },
        });
    }
    return SuccessResponse(res, "OTP verified successfully. Loan application created.", {
        loanApplication: {
            id: loanApplication.id,
            email: loanApplication.email,
            createdAt: loanApplication.createdAt,
        },
    }, statusCode.OK);
});
//# sourceMappingURL=otp.js.map