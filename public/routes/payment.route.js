import { Router } from "express";
import { asyncHandler } from "../middleware/error.middleware.js";
import { ErrorResponse, SuccessResponse } from "../utils/response.util.js";
import { statusCode } from "../types/types.js";
import prisma from "../config/prisma.js";
const PaymentFeeRoute = Router();
PaymentFeeRoute.put('/payment-fees', asyncHandler(async (req, res, next) => {
    console.log('Request body:', req.body); // Log the incoming request
    // Extract fee values from request body
    const { processingFee, bankTransactionPaperFee, insuranceFee, cibilFee, tdsFee, nocFee, } = req.body;
    // ✅ Validate inputs
    if (!processingFee && !bankTransactionPaperFee && !insuranceFee && !cibilFee && !tdsFee && !nocFee) {
        return next(new ErrorResponse('At least one fee is required', statusCode.Bad_Request));
    }
    try {
        // 🔹 Step 1: Find existing PaymentFee record
        let paymentFee = await prisma.paymentFee.findFirst();
        const updateData = {};
        // 🔹 Step 2: Prepare update/create data
        if (processingFee)
            updateData.processingFee = processingFee;
        if (bankTransactionPaperFee)
            updateData.bankTransactionPaperFee = bankTransactionPaperFee;
        if (insuranceFee)
            updateData.insuranceFee = insuranceFee;
        if (cibilFee)
            updateData.cibilFee = cibilFee;
        if (tdsFee)
            updateData.tdsFee = tdsFee;
        if (nocFee)
            updateData.nocFee = nocFee;
        if (paymentFee) {
            // 🔹 Step 3: Update existing PaymentFee
            paymentFee = await prisma.paymentFee.update({
                where: { id: paymentFee.id },
                data: updateData,
            });
        }
        else {
            // 🔹 Step 4: Create new PaymentFee
            paymentFee = await prisma.paymentFee.create({
                data: updateData,
            });
        }
        return SuccessResponse(res, 'Payment fee configuration updated successfully', paymentFee);
    }
    catch (error) {
        console.error('Update error:', error);
        return next(new ErrorResponse('Failed to update payment fee configuration', statusCode.Internal_Server_Error));
    }
}));
PaymentFeeRoute.get('/payment-fees', asyncHandler(async (req, res, next) => {
    try {
        const paymentFees = await prisma.paymentFee.findFirst();
        if (!paymentFees) {
            return next(new ErrorResponse('Payment fee configuration not found', statusCode.Not_Found));
        }
        return SuccessResponse(res, 'Payment fee configuration fetched successfully', paymentFees);
    }
    catch (error) {
        return next(new ErrorResponse('Failed to fetch payment fee configuration', statusCode.Internal_Server_Error));
    }
}));
export default PaymentFeeRoute;
//# sourceMappingURL=payment.route.js.map