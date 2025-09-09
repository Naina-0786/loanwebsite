import { hash } from "zod";
import  prisma from "../config/prisma.js";
import { asyncHandler } from "../middleware/error.middleware.js";
import { ErrorResponse, SuccessResponse } from "../utils/response.util.js";
import { adminSchema } from "../validations/admin.js";
import bcrypt from "bcryptjs";
import { id } from "zod/v4/locales";
import { generateToken } from "../utils/jwt.utils.js";

 export const AdminCreate = asyncHandler(async (req, res, next) => {
    const data = adminSchema.parse(req.body);
   const Adminexist = await prisma.admin.findUnique({
       where: {
           email: data.email
       }

   })

   if (Adminexist) {
       return SuccessResponse(res, "Admin Already exist", {}, 400);
     }
     const hashPassword = await bcrypt.hash(data.password, 10);
     



// Create Admin in database
const Admin = await prisma.admin.create({
    data: {
        email: data.email,
        name: data.name,
        password: hashPassword
    }
});
     res.json({ data: Admin });
 });

 export const getAllAdmin = asyncHandler(async (req, res, next) => {
     const page = Number(req.query.page) || 1;
     const limit = Number(req.query.limit) || 10;
 
     const skip = (page - 1) * limit;
         
     const Admin = await prisma.admin.findMany({
         skip,
         take: limit,
     });
 
     const totalAdmin = await prisma.admin.count();
     return SuccessResponse(res, "Admin", { Admin, totalAdmin }, 200);
 });
export const getAdminById = asyncHandler(async (req, res, next) => {
    const id = Number(req.params.id);
    if (!id) return next(new ErrorResponse("id is required", 400));
 
    const Admin = await prisma.admin.findUnique({
        where: {
            id,
        },
    });
 
    if (!Admin) return next(new ErrorResponse("Admin is not find", 201));
 
    return SuccessResponse(res, "Admin", { Admin }, 200);
     
});
export const adminLogin = asyncHandler(async (req, res, next) => {
    const { email, password } = req.body

    const Admin = await prisma.admin.findUnique({
        where: {
            email,
           
        }
    })

    if (!Admin) return next(new ErrorResponse("Admin is not find", 201));
    if (!await bcrypt.compare(password, Admin.password)) return next(new ErrorResponse("Invalid password", 201));
    const token = generateToken({id: Admin.id,});
    res.cookie("token", token, {
        secure: process.env.NODE_ENV === "production", //? Secure in production
        sameSite: "strict", //? Prevent CSRF attacks
    })
        return SuccessResponse(res, "Admin", { Admin, token }, 200);
    
    });

 export const deleteAdmin = asyncHandler(async (req, res, next) => {
     const id = Number(req.params.id);
     if (!id) return next(new ErrorResponse("id is required", 400));
 
     const Admin = await prisma.admin.delete({
         where: {
             id,
         },
     });
 
     if (!Admin) return next(new ErrorResponse("Admin is not find", 201));
 
     return SuccessResponse(res, "Admin", { Admin }, 200);
     
 });