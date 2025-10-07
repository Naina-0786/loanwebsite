import { Prisma } from "../../generated/prisma/index.js";
import prisma from "../config/prisma.js";
import { asyncHandler } from "../middleware/error.middleware.js";
import { ErrorResponse, SuccessResponse } from "../utils/response.util.js";
import { popupSchema } from "../validations/popup.js";
export const popupCreate = await asyncHandler(async (req, res, next) => {
    const data = popupSchema.parse(req.body);
    const popup = await prisma.popup.create({
        data: {
            name: data.name,
            email: data.email,
            phoneNumber: data.phoneNumber,
            message: data.message
        }
    });
    if (!popup)
        return next(new ErrorResponse("popup is not found", 201));
    return SuccessResponse(res, "popup", { popup }, 200);
});
export const popupgetAll = asyncHandler(async (req, res, next) => {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const popup = await prisma.popup.findMany({
        skip,
        take: limit
    });
    const totalPopUp = await prisma.popup.count();
    if (!popup)
        return next(new ErrorResponse("popup is not found", 201));
    return SuccessResponse(res, "popup", { popup, totalPopUp, totalPages: Math.ceil(totalPopUp / limit), currentPage: page, count: popup.length }, 200);
});
export const popupgetById = asyncHandler(async (req, res, next) => {
    const popup = await prisma.popup.findUnique({
        where: {
            id: Number(req.params.id)
        }
    });
    if (!popup)
        return next(new ErrorResponse("popup is not found", 201));
    return SuccessResponse(res, "popup", { popup }, 200);
});
export const deletePopup = asyncHandler(async (req, res, next) => {
    const popup = await prisma.popup.delete({
        where: {
            id: Number(req.params.id)
        }
    });
    if (!popup)
        return next(new ErrorResponse("popup is not found", 201));
    return SuccessResponse(res, "popup", popup, 200);
});
//# sourceMappingURL=popup.js.map