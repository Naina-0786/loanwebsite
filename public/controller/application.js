import prisma from "../config/prisma.js";
import { asyncHandler } from "../middleware/error.middleware.js";
import { ErrorResponse, SuccessResponse } from "../utils/response.util.js";
import { handleImageUpload } from "../utils/utils.js";
import { paymentScreenshotFields, updateLoanApplicationSchema } from "../validations/loan-application.js";
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
    if (!paymentFee) {
        return next(new ErrorResponse("Payment fee configuration not found", 404));
    }
    return SuccessResponse(res, "Payment fee configuration retrieved successfully", { paymentFee }, 200);
});
export const updatePaymentFeeConfig = asyncHandler(async (req, res, next) => {
    const id = Number(req.params.id);
    if (!id)
        return next(new ErrorResponse("ID is required", 400));
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
// Get dashboard statistics
export const getDashboardStats = asyncHandler(async (req, res, next) => {
    const [totalApplications, pendingApprovals, approvedApplications, rejectedApplications, recentApplications, feeStatusBreakdown] = await Promise.all([
        // Total applications
        prisma.loanApplication.count(),
        // Applications with any pending fees
        prisma.loanApplication.count({
            where: {
                OR: [
                    { processingFeeStatus: 'PENDING' },
                    { bankTransactionStatus: 'PENDING' },
                    { insuranceStatus: 'PENDING' },
                    { cibilStatus: 'PENDING' },
                    { tdsStatus: 'PENDING' },
                    { nocStatus: 'PENDING' }
                ]
            }
        }),
        // Applications with all fees approved
        prisma.loanApplication.count({
            where: {
                AND: [
                    { processingFeeStatus: 'APPROVED' },
                    { bankTransactionStatus: 'APPROVED' },
                    { insuranceStatus: 'APPROVED' },
                    { cibilStatus: 'APPROVED' },
                    { tdsStatus: 'APPROVED' },
                    { nocStatus: 'APPROVED' }
                ]
            }
        }),
        // Applications with any rejected fees
        prisma.loanApplication.count({
            where: {
                OR: [
                    { processingFeeStatus: 'REJECTED' },
                    { bankTransactionStatus: 'REJECTED' },
                    { insuranceStatus: 'REJECTED' },
                    { cibilStatus: 'REJECTED' },
                    { tdsStatus: 'REJECTED' },
                    { nocStatus: 'REJECTED' }
                ]
            }
        }),
        // Recent applications (last 10)
        prisma.loanApplication.findMany({
            take: 10,
            orderBy: { createdAt: 'desc' },
            select: {
                id: true,
                email: true,
                fullName: true,
                loanAmount: true,
                createdAt: true,
                processingFeeStatus: true,
                bankTransactionStatus: true,
                insuranceStatus: true,
                cibilStatus: true,
                tdsStatus: true,
                nocStatus: true
            }
        }),
        // Fee status breakdown
        Promise.all([
            // Processing Fee
            Promise.all([
                prisma.loanApplication.count({ where: { processingFeeStatus: 'PENDING' } }),
                prisma.loanApplication.count({ where: { processingFeeStatus: 'APPROVED' } }),
                prisma.loanApplication.count({ where: { processingFeeStatus: 'REJECTED' } })
            ]),
            // Bank Transaction Fee
            Promise.all([
                prisma.loanApplication.count({ where: { bankTransactionStatus: 'PENDING' } }),
                prisma.loanApplication.count({ where: { bankTransactionStatus: 'APPROVED' } }),
                prisma.loanApplication.count({ where: { bankTransactionStatus: 'REJECTED' } })
            ]),
            // Insurance Fee
            Promise.all([
                prisma.loanApplication.count({ where: { insuranceStatus: 'PENDING' } }),
                prisma.loanApplication.count({ where: { insuranceStatus: 'APPROVED' } }),
                prisma.loanApplication.count({ where: { insuranceStatus: 'REJECTED' } })
            ]),
            // CIBIL Fee
            Promise.all([
                prisma.loanApplication.count({ where: { cibilStatus: 'PENDING' } }),
                prisma.loanApplication.count({ where: { cibilStatus: 'APPROVED' } }),
                prisma.loanApplication.count({ where: { cibilStatus: 'REJECTED' } })
            ]),
            // TDS Fee
            Promise.all([
                prisma.loanApplication.count({ where: { tdsStatus: 'PENDING' } }),
                prisma.loanApplication.count({ where: { tdsStatus: 'APPROVED' } }),
                prisma.loanApplication.count({ where: { tdsStatus: 'REJECTED' } })
            ]),
            // NOC Fee
            Promise.all([
                prisma.loanApplication.count({ where: { nocStatus: 'PENDING' } }),
                prisma.loanApplication.count({ where: { nocStatus: 'APPROVED' } }),
                prisma.loanApplication.count({ where: { nocStatus: 'REJECTED' } })
            ])
        ])
    ]);
    const stats = {
        totalApplications,
        pendingApprovals,
        approvedApplications,
        rejectedApplications,
        recentApplications,
        feeStatusBreakdown: {
            processingFee: {
                pending: feeStatusBreakdown[0][0],
                approved: feeStatusBreakdown[0][1],
                rejected: feeStatusBreakdown[0][2]
            },
            bankTransaction: {
                pending: feeStatusBreakdown[1][0],
                approved: feeStatusBreakdown[1][1],
                rejected: feeStatusBreakdown[1][2]
            },
            insurance: {
                pending: feeStatusBreakdown[2][0],
                approved: feeStatusBreakdown[2][1],
                rejected: feeStatusBreakdown[2][2]
            },
            cibil: {
                pending: feeStatusBreakdown[3][0],
                approved: feeStatusBreakdown[3][1],
                rejected: feeStatusBreakdown[3][2]
            },
            tds: {
                pending: feeStatusBreakdown[4][0],
                approved: feeStatusBreakdown[4][1],
                rejected: feeStatusBreakdown[4][2]
            },
            noc: {
                pending: feeStatusBreakdown[5][0],
                approved: feeStatusBreakdown[5][1],
                rejected: feeStatusBreakdown[5][2]
            }
        }
    };
    return SuccessResponse(res, "Dashboard statistics retrieved successfully", stats, 200);
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
//# sourceMappingURL=application.js.map