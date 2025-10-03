import type { NextFunction } from "express";
import { asyncHandler } from "../middleware/error.middleware.js";
import prisma from "../config/prisma.js";
import { ErrorResponse, SuccessResponse } from "../utils/response.util.js";
import { accountSchema } from "../validations/account.js";

export const AccountCreate = asyncHandler(async (req, res, next) => {
    const data = accountSchema.parse(req.body);

    const account = await prisma.accountNumber.create({
        data: {
            accountNumber: data.accountNumber,
            bankName: data.bankName,
            ifscCode: data.ifscCode
        },
        })
    if (!account) return next(new ErrorResponse("account is not found", 201))
    return SuccessResponse(res, "account", { account }, 200)
});
export const getOneAccount = asyncHandler(async (req, res, next) => {
    const account = await prisma.accountNumber.findFirst()
    if (!account) return next(new ErrorResponse("account is not found", 201))
    return SuccessResponse(res, "account", { account }, 200)        

})

export const updateAccount = asyncHandler(async (req, res, next) => {
    const id = Number(req.params.id)
    if (!id) return next(new ErrorResponse("id is required", 400));
    const data = accountSchema.parse(req.body);
    const account = await prisma.accountNumber.update({
        where: {
            id,
        },
        data
    })
    if (!account) return next(new ErrorResponse("account is not found", 201))
    return SuccessResponse(res, "account",  account , 200)
})
