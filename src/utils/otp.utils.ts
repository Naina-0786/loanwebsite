import crypto from "crypto"; 

export const generateOtp = (): string => {
  const otp = crypto.randomInt(1000, 10000).toString();
  return otp;
};

export const sendOtp = async (email: string, otp: string): Promise<void> => {
  // Simulate OTP sending logic here
  console.log(`Sending OTP ${otp} to ${email}`);
};