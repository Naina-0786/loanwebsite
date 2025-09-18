import prisma from "../config/prisma.js";
import { asyncHandler } from "../middleware/error.middleware.js";
import { ErrorResponse, SuccessResponse } from "../utils/response.util.js";
import { paymentSchema } from "../validations/payment.js";
export const grtAllPayment = asyncHandler(async (req, res, next) => {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const payment = await prisma.paymentFee.findMany({
        skip,
        take: limit,
    });
    if (!payment)
        return next(new ErrorResponse("payment is not found", 201));
    return SuccessResponse(res, "payment", { payment }, 200);
});
export const getpymentById = asyncHandler(async (req, res, next) => {
    const id = Number(req.params.id);
    if (!id)
        return next(new ErrorResponse("id is required", 400));
    const payment = await prisma.paymentFee.findUnique({
        where: {
            id,
        }
    });
    if (!payment)
        return next(new ErrorResponse("payment is not found", 201));
    return SuccessResponse(res, "payment", { payment }, 200);
});
export const updatePayment = asyncHandler(async (req, res, next) => {
    const id = Number(req.params.id);
    if (!id)
        return next(new ErrorResponse("id is required", 400));
    const data = paymentSchema.parse(req.body);
    const payment = await prisma.paymentFee.update({
        where: {
            id,
        },
        data
    });
    if (!payment)
        return next(new ErrorResponse("payment is not found", 201));
    return SuccessResponse(res, "payment", { payment }, 200);
});
export const deletePayment = asyncHandler(async (req, res, next) => {
    const id = Number(req.params.id);
    if (!id)
        return next(new ErrorResponse("id is required", 400));
    const payment = await prisma.paymentFee.delete({
        where: {
            id,
        }
    });
    if (!payment)
        return next(new ErrorResponse("payment is not found", 201));
    return SuccessResponse(res, "payment", { payment }, 200);
});
//# sourceMappingURL=payment.js.map