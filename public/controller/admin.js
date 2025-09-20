// Updated admin controller file: add updateAdmin export
import prisma from "../config/prisma.js";
import { asyncHandler } from "../middleware/error.middleware.js";
import { ErrorResponse, SuccessResponse } from "../utils/response.util.js";
import { adminSchema } from "../validations/admin.js";
import bcrypt from "bcryptjs";
import { generateToken } from "../utils/jwt.utils.js";
export const AdminCreate = asyncHandler(async (req, res, next) => {
    const data = adminSchema.parse(req.body);
    const adminExist = await prisma.admin.findUnique({
        where: {
            email: data.email
        }
    });
    if (adminExist) {
        return next(new ErrorResponse("Admin with this email already exists", 400));
    }
    const hashPassword = await bcrypt.hash(data.password, 10);
    // Create Admin in database
    const admin = await prisma.admin.create({
        data: {
            email: data.email,
            name: data.name,
            password: hashPassword
        },
        select: {
            id: true,
            name: true,
            email: true,
            created: true,
            updated: true
        }
    });
    return SuccessResponse(res, "Admin created successfully", { admin }, 201);
});
export const getAllAdmin = asyncHandler(async (req, res, next) => {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const search = req.query.search;
    const skip = (page - 1) * limit;
    const whereClause = search ? {
        OR: [
            { name: { contains: search } },
            { email: { contains: search } }
        ]
    } : {};
    const [admins, totalAdmin] = await Promise.all([
        prisma.admin.findMany({
            where: whereClause,
            skip,
            take: limit,
            select: {
                id: true,
                name: true,
                email: true,
                created: true,
                updated: true
            },
            orderBy: { created: 'desc' }
        }),
        prisma.admin.count({ where: whereClause })
    ]);
    return SuccessResponse(res, "Admins retrieved successfully", {
        admins,
        totalAdmin,
        totalPages: Math.ceil(totalAdmin / limit),
        currentPage: page,
        count: admins.length
    }, 200);
});
export const getAdminById = asyncHandler(async (req, res, next) => {
    const id = Number(req.params.id);
    if (!id)
        return next(new ErrorResponse("ID is required", 400));
    const admin = await prisma.admin.findUnique({
        where: { id },
        select: {
            id: true,
            name: true,
            email: true,
            created: true,
            updated: true
        }
    });
    if (!admin)
        return next(new ErrorResponse("Admin not found", 404));
    return SuccessResponse(res, "Admin retrieved successfully", { admin }, 200);
});
export const adminLogin = asyncHandler(async (req, res, next) => {
    const { email, password } = req.body;
    console.log(email, password);
    if (!email || !password) {
        return next(new ErrorResponse("Email and password are required", 400));
    }
    const admin = await prisma.admin.findUnique({
        where: { email }
    });
    if (!admin)
        return next(new ErrorResponse("Invalid credentials", 401));
    const isPasswordValid = await bcrypt.compare(password, admin.password);
    if (!isPasswordValid)
        return next(new ErrorResponse("Invalid credentials", 401));
    const token = generateToken({ id: admin.id });
    res.cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 30 * 24 * 60 * 60 * 1000 // 30 days
    });
    const adminResponse = {
        id: admin.id,
        name: admin.name,
        email: admin.email,
        created: admin.created,
        updated: admin.updated
    };
    return SuccessResponse(res, "Login successful", { admin: adminResponse, token }, 200);
});
export const deleteAdmin = asyncHandler(async (req, res, next) => {
    const id = Number(req.params.id);
    if (!id)
        return next(new ErrorResponse("ID is required", 400));
    const admin = await prisma.admin.delete({
        where: { id },
        select: {
            id: true,
            name: true,
            email: true
        }
    });
    return SuccessResponse(res, "Admin deleted successfully", { admin }, 200);
});
export const updateAdmin = asyncHandler(async (req, res, next) => {
    const id = Number(req.params.id);
    if (!id)
        return next(new ErrorResponse("ID is required", 400));
    // Use partial schema for update (fields optional)
    const partialSchema = adminSchema.partial();
    const data = partialSchema.parse(req.body);
    const updateData = {};
    if (data.name)
        updateData.name = data.name;
    if (data.email) {
        const existingAdmin = await prisma.admin.findUnique({
            where: { email: data.email }
        });
        if (existingAdmin && existingAdmin.id !== id) {
            return next(new ErrorResponse("Admin with this email already exists", 400));
        }
        updateData.email = data.email;
    }
    if (data.password && data.password.length > 0) {
        updateData.password = await bcrypt.hash(data.password, 10);
    }
    const updatedAdmin = await prisma.admin.update({
        where: { id },
        data: updateData,
        select: {
            id: true,
            name: true,
            email: true,
            created: true,
            updated: true
        }
    });
    if (!updatedAdmin)
        return next(new ErrorResponse("Admin not found", 404));
    return SuccessResponse(res, "Admin updated successfully", { admin: updatedAdmin }, 200);
});
export const adminLogout = asyncHandler(async (req, res, next) => {
    res.clearCookie("token");
    return SuccessResponse(res, "Logout successful", {}, 200);
});
export const getAdminProfile = asyncHandler(async (req, res, next) => {
    const admin = req.admin;
    if (!admin) {
        return next(new ErrorResponse("Admin not found", 404));
    }
    return SuccessResponse(res, "Admin profile retrieved successfully", { admin }, 200);
});
//# sourceMappingURL=admin.js.map