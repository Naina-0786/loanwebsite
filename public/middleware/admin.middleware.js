import jwt from "jsonwebtoken";
import prisma from "../config/prisma.js";
import { ErrorResponse } from "../utils/response.util.js";
import { asyncHandler } from "./error.middleware.js";
import ENV from "../config/env.js";
export const adminAuth = asyncHandler(async (req, res, next) => {
    let token;
    // Check for token in Authorization header
    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
        token = req.headers.authorization.split(" ")[1];
    }
    // Check for token in cookies
    else if (req.cookies.token) {
        token = req.cookies.token;
    }
    if (!token) {
        return next(new ErrorResponse("Access denied. No token provided.", 401));
    }
    try {
        // Verify token
        const decoded = jwt.verify(token, ENV.JWT_SECRET || "");
        // Find admin in database
        const admin = await prisma.admin.findUnique({
            where: { id: decoded.id },
            select: { id: true, email: true, name: true }
        });
        if (!admin) {
            return next(new ErrorResponse("Admin not found. Invalid token.", 401));
        }
        // Attach admin to request object
        req.admin = admin;
        next();
    }
    catch (error) {
        return next(new ErrorResponse("Invalid token.", 401));
    }
});
// Middleware to ensure only admins can access certain routes
export const requireAdmin = (req, res, next) => {
    if (!req.admin) {
        return next(new ErrorResponse("Admin access required.", 403));
    }
    next();
};
//# sourceMappingURL=admin.middleware.js.map