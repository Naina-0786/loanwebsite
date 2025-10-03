import { Router } from "express";
import { asyncHandler } from "../middleware/error.middleware.js";
import { ErrorResponse, SuccessResponse } from "../utils/response.util.js";
import { statusCode } from "../types/types.js";
import prisma from "../config/prisma.js";
const AccountNumberRoute = Router();
/**
 * ✅ Create or Update Account Number (only 1 document allowed)
 */
AccountNumberRoute.put("/account", asyncHandler(async (req, res, next) => {
    const { accountNumber, bankName, ifscCode } = req.body;
    if (!accountNumber || !bankName || !ifscCode) {
        return next(new ErrorResponse("accountNumber, bankName, and ifscCode are required", statusCode.Bad_Request));
    }
    try {
        // Step 1: Find if one record already exists
        let record = await prisma.accountNumber.findFirst();
        // Step 2: If exists, update it. If not, create new one.
        if (record) {
            record = await prisma.accountNumber.update({
                where: { id: record.id },
                data: { accountNumber, bankName, ifscCode },
            });
        }
        else {
            record = await prisma.accountNumber.create({
                data: { accountNumber, bankName, ifscCode },
            });
        }
        return SuccessResponse(res, "Account number saved successfully", record);
    }
    catch (error) {
        console.error("Create/Update error:", error);
        return next(new ErrorResponse("Failed to save account number", statusCode.Internal_Server_Error));
    }
}));
/**
 * ✅ Get Account Number (only one record expected)
 */
AccountNumberRoute.get("/get-one", asyncHandler(async (req, res, next) => {
    try {
        const record = await prisma.accountNumber.findFirst();
        if (!record) {
            return next(new ErrorResponse("No account number found", statusCode.Not_Found));
        }
        return SuccessResponse(res, "Account number fetched successfully", record);
    }
    catch (error) {
        console.error("Fetch error:", error);
        return next(new ErrorResponse("Failed to fetch account number", statusCode.Internal_Server_Error));
    }
}));
export default AccountNumberRoute;
//# sourceMappingURL=account.routes.js.map