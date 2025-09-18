// import { Router } from "express";
// import { adminAuth, requireAdmin } from "../middleware/admin.middleware.js";
// import {
//     AdminCreate,
//     getAllAdmin,
//     getAdminById,
//     adminLogin,
//     updateAdmin,
//     deleteAdmin,
//     adminLogout,
//     getAdminProfile
// } from "../controller/admin.js";
// import {
//     createPaymentFee,
//     getPaymentFeeConfig,
//     updatePaymentFeeConfig,
//     getAllLoanApplications,
//     getLoanApplicationById,
//     updateFeeStatus,
//     getDashboardStats,
//     updateLoanApplication
// } from "../controller/application.js";
// import { uploadPaymentScreenshots } from "../middleware/multer.middleware.js";
export {};
// const router = Router();
// // Public admin routes (no authentication required)
// router.post("/login", adminLogin);
// // Protected admin routes (authentication required)
// router.use(adminAuth);
// router.use(requireAdmin);
// // Admin profile routes
// router.get("/profile", getAdminProfile);
// router.post("/logout", adminLogout);
// // Admin management routes
// router.get("/", getAllAdmin);
// router.post("/", AdminCreate);
// router.get("/:id", getAdminById);
// router.put("/:id", updateAdmin);
// router.delete("/:id", deleteAdmin);
// // Payment fee management routes
// router.get("/payment-fees", getPaymentFeeConfig);
// router.post("/payment-fees", createPaymentFee);
// router.put("/payment-fees/:id", updatePaymentFeeConfig);
// // Loan application management routes
// router.get("/loan-applications", getAllLoanApplications);
// router.get("/loan-applications/:id", getLoanApplicationById);
// router.put("/loan-applications/:id", uploadPaymentScreenshots, updateLoanApplication);
// router.put("/loan-applications/:id/fees/:feeType", updateFeeStatus);
// // Dashboard routes
// router.get("/dashboard/stats", getDashboardStats);
// export default router;
//# sourceMappingURL=admin.routes.js.map