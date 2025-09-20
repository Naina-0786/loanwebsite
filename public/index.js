import express from "express";
import errorMiddleware from "./middleware/error.middleware.js";
import { requestOtp, verifyOtp } from "./controller/otp.js";
import { deletePayment, getpymentById, grtAllPayment, updatePayment, updateLoanApplication, getLoanApplicationById, getAllLoanApplications, createPaymentFee, getPaymentFeeConfig, updatePaymentFeeConfig, getDashboardStats, updateFeeStatus } from "./controller/application.js";
import { uploadPaymentScreenshots } from "./middleware/multer.middleware.js";
import cors from "cors";
import cookieParser from "cookie-parser";
import { AdminCreate, adminLogin, deleteAdmin, getAdminById, getAllAdmin, updateAdmin } from "./controller/admin.js";
const app = express();
app.use(cors({
    origin: "*",
    credentials: true
}));
app.use(express.json());
app.use(cookieParser());
// ================================
// HEALTH CHECK & INFO ROUTES
// ================================
app.get("/", (req, res) => {
    res.json({
        success: true,
        message: "Loan Application API Server is running",
        version: "1.0.0",
    });
});
app.get("/api/health", (req, res) => {
    res.json({
        success: true,
        message: "API is healthy",
        timestamp: new Date().toISOString(),
        uptime: process.uptime()
    });
});
// ================================
// OTP AUTHENTICATION ROUTES
// ================================
app.post("/api/otp/generate", requestOtp); // Generate OTP for loan application
app.post("/api/otp/verify", verifyOtp); // Verify OTP and create loan application
// ================================
// PAYMENT FEE MANAGEMENT ROUTES
// ================================
app.post("/api/fee/create", createPaymentFee); // Get all payment fees with pagination
app.get("/api/fee/:id", getpymentById); // Get payment fee by ID
app.post("/api/fee/:id", updatePayment); // Update payment fee
// ================================
// LOAN APPLICATION MANAGEMENT ROUTES
// ================================
app.get("/api/loan-applications", getAllLoanApplications); // Get all loan applications with pagination
app.get("/api/loan-applications/dashboard", getDashboardStats); // Get dashboard statistics
app.get("/api/loan-applications/:id", getLoanApplicationById); // Get loan application by ID
app.post("/api/loan-applications/:id", uploadPaymentScreenshots, updateLoanApplication); // Update loan application with payment screenshots
// ================================
// ADMIN ROUTES
// ================================
app.post("/api/admin/login", adminLogin);
app.post("/api/admin/create", AdminCreate);
app.get("/api/admin/all", getAllAdmin);
app.delete("/api/admin/:id", deleteAdmin);
app.get("/api/admin/:id", getAdminById);
app.put("/api/admin/:id", updateAdmin);
// Admin payment fee management routes
app.get("/api/admin/payment-fees", getPaymentFeeConfig);
app.post("/api/admin/payment-fees", createPaymentFee);
app.put("/api/admin/payment-fees/:id", updatePaymentFeeConfig);
// Admin loan application management routes
app.get("/api/loan-applications", getAllLoanApplications);
app.get("/api/loan-applications/:id", getLoanApplicationById);
app.post('/api/loan-applications/:id/kyc', updateLoanApplication);
app.post("/api/loan-applications/:id", uploadPaymentScreenshots, updateLoanApplication);
app.post("/api/loan-applications/:id/fees/:feeType", updateFeeStatus);
// Admin dashboard routes
app.get("/api/admin/dashboard/stats", getDashboardStats);
app.use(errorMiddleware);
app.listen(3000, () => {
    console.log("Server is running on port 3000");
});
//# sourceMappingURL=index.js.map