
import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import { AccountCreate, getOneAccount, updateAccount } from "./controller/account.js";
import {
  AdminCreate,
  adminLogin,
  deleteAdmin,
  getAdminById,
  getAllAdmin,
  updateAdmin,
} from "./controller/admin.js";
import {
  createPaymentFee,
  deleteLoanApplication,
  getAllLoanApplications,
  getLoanApplicationById,
  getpymentById,
  updateFeeStatus,
  updateLoanApplication,
  updatePayment
} from "./controller/application.js";
import { requestOtp, verifyOtp } from "./controller/otp.js";
import { adminAuth } from "./middleware/admin.middleware.js";
import errorMiddleware from "./middleware/error.middleware.js";
import { uploadPaymentScreenshots } from "./middleware/multer.middleware.js";
import PaymentFeeRoute from "./routes/payment.route.js";
import QrRoute from "./routes/qr.routes.js";
import AccountNumberRoute from "./routes/account.routes.js";

const app = express();

// ================================
// CORS CONFIG
// ================================
const allowedOrigins = ["http://localhost:5173", "https://instantdhanicredit.com"];

const corsOptions = {
  origin: function (
    origin: string | undefined,
    callback: (err: Error | null, allow?: boolean) => void
  ) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.warn("Blocked by CORS:", origin);
      callback(null, false);
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());

// ================================
// HEALTH CHECK
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
    uptime: process.uptime(),
  });
});

// ================================
// OTP AUTH
// ================================
app.post("/api/otp/generate", requestOtp);
app.post("/api/otp/verify", verifyOtp);

// ================================
// PAYMENT FEE (Public)
// ================================
app.post("/api/fee/create", createPaymentFee);
app.get("/api/fee/:id", getpymentById);
app.post("/api/fee/:id", updatePayment);

app.use("/api/admin", PaymentFeeRoute)

// ================================
// LOAN APPLICATION (Public)
// ================================
app.get("/api/loan-applications", getAllLoanApplications);
app.get("/api/loan-applications/:id", getLoanApplicationById);
app.post(
  "/api/loan-applications/:id",
  uploadPaymentScreenshots,
  updateLoanApplication
);

// ================================
// ADMIN ROUTES
// ================================
app.post("/api/admin/login", adminLogin);

// Admin loan applications
app.get("/api/admin/loan-applications", getAllLoanApplications);
app.get("/api/admin/loan-applications/:id", getLoanApplicationById);
app.post(
  "/api/admin/loan-applications/:id/kyc",
  updateLoanApplication
);
app.post(
  "/api/admin/loan-applications/:id",
  uploadPaymentScreenshots,
  updateLoanApplication
);
app.delete("/api/admin/loan-applications/:id", deleteLoanApplication);
app.post(
  "/api/admin/loan-applications/:id/fees/:feeType",
  updateFeeStatus
);

// Admin dashboard

// Admin management
app.post("/api/admin/create", adminAuth, AdminCreate);
app.get("/api/admin/all", getAllAdmin);
app.put("/api/admin/:id", updateAdmin);
app.delete("/api/admin/:id", deleteAdmin);
app.get("/api/admin/:id", getAdminById);


// Account
// app.post("/api/account/create",  AccountCreate);
app.get("/api/account",getOneAccount);
app.put("/api/admin/account/update/:id", updateAccount);


app.use("/api/account", AccountNumberRoute);

// ================================
// QR ROUTES
// ================================
app.use("/api/v1/qr", QrRoute);

// ================================
// ERROR HANDLER
// ================================
app.use(errorMiddleware);

// ================================
// START SERVER
// ================================
app.listen(3000, () => {
  console.log("Server is running on port 3000");
});

