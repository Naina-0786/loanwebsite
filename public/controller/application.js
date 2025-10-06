import prisma from "../config/prisma.js";
import { asyncHandler } from "../middleware/error.middleware.js";
import { ErrorResponse, SuccessResponse } from "../utils/response.util.js";
import { handleImageUpload } from "../utils/utils.js";
import { paymentScreenshotFields, updateLoanApplicationSchema } from "../validations/loan-application.js";
import { paymentSchema } from "../validations/payment.js";
import cloudinary, { deleteFromCloudinary } from "../config/cloudinary.js";
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
    return SuccessResponse(res, "payment", payment, 200);
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
    return SuccessResponse(res, "payment", payment, 200);
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
// Admin-specific payment fee management
export const createPaymentFee = asyncHandler(async (req, res, next) => {
    const data = paymentSchema.parse(req.body);
    const payment = await prisma.paymentFee.create({
        data
    });
    return SuccessResponse(res, "Payment fee created successfully", { payment }, 201);
});
export const getPaymentFeeConfig = asyncHandler(async (req, res, next) => {
    // Get the latest payment fee configuration
    const paymentFee = await prisma.paymentFee.findFirst({
        orderBy: { id: 'desc' }
    });
    console.log({ paymentFee });
    if (!paymentFee) {
        return next(new ErrorResponse("Payment fee configuration not found", 404));
    }
    return SuccessResponse(res, "Payment fee configuration retrieved successfully", { paymentFee }, 200);
});
export const updatePaymentFeeConfig = asyncHandler(async (req, res, next) => {
    const id = Number(req.params.id);
    if (!id)
        return next(new ErrorResponse("ID is requiredddd", 400));
    const data = paymentSchema.parse(req.body);
    const paymentFee = await prisma.paymentFee.update({
        where: { id },
        data
    });
    return SuccessResponse(res, "Payment fee configuration updated successfully", { paymentFee }, 200);
});
// Update loan application with payment screenshots and approval status
export const updateLoanApplication = asyncHandler(async (req, res, next) => {
    const applicationId = Number(req.params.id);
    console.log("update loan application payload", req.body);
    console.log('Received req.files:', req.files);
    if (!applicationId) {
        return next(new ErrorResponse("Application ID is required", 400));
    }
    // Check if loan application exists
    const existingApplication = await prisma.loanApplication.findUnique({
        where: { id: applicationId }
    });
    if (!existingApplication) {
        return next(new ErrorResponse("Loan application not found", 404));
    }
    // Parse and validate the request body (excluding files)
    const validatedData = updateLoanApplicationSchema.parse(req.body);
    // Get uploaded files
    const files = req.files;
    // Prepare update data
    const updateData = { ...validatedData };
    // Handle image uploads for each payment screenshot field
    const imageUploadPromises = [];
    for (const fieldName of paymentScreenshotFields) {
        const file = files?.[fieldName]?.[0]; // Get first file for this field
        if (file) {
            imageUploadPromises.push(handleImageUpload(file, fieldName, existingApplication[fieldName], applicationId).then((imageData) => {
                if (imageData) {
                    updateData[fieldName] = imageData;
                }
            }));
        }
    }
    // Wait for all image uploads to complete
    try {
        await Promise.all(imageUploadPromises);
    }
    catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Failed to upload images";
        return next(new ErrorResponse(errorMessage, 500));
    }
    // Update the loan application
    const updatedApplication = await prisma.loanApplication.update({
        where: { id: applicationId },
        data: updateData,
    });
    return SuccessResponse(res, "Loan application updated successfully", { data: updatedApplication }, 200);
});
// Get loan application by ID with payment screenshots
export const getLoanApplicationById = asyncHandler(async (req, res, next) => {
    const applicationId = Number(req.params.id);
    if (!applicationId) {
        return next(new ErrorResponse("Application ID is required", 400));
    }
    const application = await prisma.loanApplication.findUnique({
        where: { id: applicationId }
    });
    if (!application) {
        return next(new ErrorResponse("Loan application not found", 404));
    }
    return SuccessResponse(res, "Loan application retrieved successfully", application, 200);
});
// Get all loan applications with pagination
export const getAllLoanApplications = asyncHandler(async (req, res, next) => {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const search = req.query.search;
    const status = req.query.status;
    const sortBy = req.query.sortBy || 'createdAt';
    const sortOrder = req.query.sortOrder || 'desc';
    const skip = (page - 1) * limit;
    // Build where clause for filtering
    const whereClause = {};
    if (search) {
        whereClause.OR = [
            { email: { contains: search } },
            { phone: { contains: search } },
            { fullName: { contains: search } },
            { id: isNaN(Number(search)) ? undefined : Number(search) }
        ].filter(condition => condition.id !== undefined || condition.email || condition.phone || condition.fullName);
    }
    if (status) {
        // Filter by overall status or specific fee status
        if (['PENDING', 'APPROVED', 'REJECTED'].includes(status)) {
            whereClause.OR = [
                { processingFeeStatus: status },
                { bankTransactionStatus: status },
                { insuranceStatus: status },
                { cibilStatus: status },
                { tdsStatus: status },
                { nocStatus: status }
            ];
        }
    }
    const [applications, totalCount] = await Promise.all([
        prisma.loanApplication.findMany({
            where: whereClause,
            skip,
            take: limit,
            orderBy: { [sortBy]: sortOrder }
        }),
        prisma.loanApplication.count({ where: whereClause })
    ]);
    return SuccessResponse(res, "Loan applications retrieved successfully", {
        applications,
        totalCount,
        totalPages: Math.ceil(totalCount / limit),
        currentPage: page,
        count: applications.length
    }, 200);
});
// Admin-specific endpoints for fee management
export const updateFeeStatus = asyncHandler(async (req, res, next) => {
    const applicationId = Number(req.params.id);
    const feeType = req.params.feeType;
    const { status } = req.body;
    if (!applicationId) {
        return next(new ErrorResponse("Application ID is required", 400));
    }
    if (!feeType || !status) {
        return next(new ErrorResponse("Fee type and status are required", 400));
    }
    if (!['PENDING', 'APPROVED', 'REJECTED'].includes(status)) {
        return next(new ErrorResponse("Invalid status. Must be PENDING, APPROVED, or REJECTED", 400));
    }
    const validFeeTypes = [
        'processingFeeStatus',
        'bankTransactionStatus',
        'insuranceStatus',
        'cibilStatus',
        'tdsStatus',
        'nocStatus'
    ];
    if (!validFeeTypes.includes(feeType)) {
        return next(new ErrorResponse("Invalid fee type", 400));
    }
    // Check if application exists
    const existingApplication = await prisma.loanApplication.findUnique({
        where: { id: applicationId }
    });
    if (!existingApplication) {
        return next(new ErrorResponse("Loan application not found", 404));
    }
    // Update the specific fee status
    const updateData = { [feeType]: status };
    const updatedApplication = await prisma.loanApplication.update({
        where: { id: applicationId },
        data: updateData
    });
    return SuccessResponse(res, `${feeType} updated successfully`, { application: updatedApplication }, 200);
});
const imageFields = [
    "processingFee",
    "bankTransactionPaperFee",
    "insuranceFee",
    "cibilFee",
    "tdsFee",
    "nocFee",
];
// ------------------------------------------------
// Controller: deleteLoanApplication
// ------------------------------------------------
export const deleteLoanApplication = asyncHandler(async (req, res, next) => {
    const applicationId = Number(req.params.id);
    if (!applicationId) {
        return next(new ErrorResponse("Application ID is required", 400));
    }
    // ✅ Find existing loan application
    const existingApplication = await prisma.loanApplication.findUnique({
        where: { id: applicationId },
    });
    if (!existingApplication) {
        return next(new ErrorResponse("Loan application not found", 404));
    }
    // ✅ Delete associated images from Cloudinary
    const imageDeletePromises = [];
    for (const field of imageFields) {
        const data = existingApplication[field];
        if (!data)
            continue;
        try {
            // Parse JSON field (Prisma Json type may come as object or string)
            const parsed = typeof data === "string" ? JSON.parse(data) : data;
            if (Array.isArray(parsed)) {
                // Handle multiple images (if stored as an array)
                for (const img of parsed) {
                    if (img?.public_id) {
                        imageDeletePromises.push(deleteFromCloudinary(img.public_id));
                    }
                }
            }
            else if (parsed?.public_id) {
                // Single image
                imageDeletePromises.push(deleteFromCloudinary(parsed.public_id));
            }
        }
        catch (err) {
            console.error(`Failed to parse or delete Cloudinary image for ${field}:`, err);
        }
    }
    // ✅ Wait for all deletions
    try {
        await Promise.all(imageDeletePromises);
    }
    catch (error) {
        console.error("One or more Cloudinary deletions failed:", error);
        // Continue even if some deletions fail
    }
    // ✅ Delete loan application record
    const deletedApplication = await prisma.loanApplication.delete({
        where: { id: applicationId },
    });
    return SuccessResponse(res, "Loan application and associated images deleted successfully", { data: deletedApplication }, 200);
});
//# sourceMappingURL=application.js.map