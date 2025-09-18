import crypto from "crypto";
export const generateOtp = () => {
    const otp = crypto.randomInt(1000, 10000).toString();
    return otp;
};
export const sendOtp = async (email, otp) => {
    // Simulate OTP sending logic here
    console.log(`Sending OTP ${otp} to ${email}`);
};
//# sourceMappingURL=otp.utils.js.map