import { email } from "zod";
import prisma from "../config/prisma.js";
import { asyncHandler } from "../middleware/error.middleware.js";
import { userValidation } from "../validations/user.js";
import { ErrorResponse, SuccessResponse } from "../utils/response.util.js";

export const user = asyncHandler(async (req, res, next) => { 
    const data = userValidation.parse(req.body);


// user created
const userCreate = await prisma.user.create({
    data: data

 })
    res.json({ data: user })
});
export const getAllUser = asyncHandler(async (req, res, next) => {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const users = await prisma.user.findMany({
        skip,
        take: limit,
    })
    });

const totalUser = await prisma.user.count();
return SuccessResponse