import { Router } from "express";
import { asyncHandler } from "../middleware/error.middleware.js";
import { ErrorResponse, SuccessResponse } from "../utils/response.util.js";
import { statusCode } from "../types/types.js";
import prisma from "../config/prisma.js";

const ContactRoute = Router();

/**
 * ✅ Create or Update Contact (only 1 document allowed)
 */
ContactRoute.put(
  "/contact",
  asyncHandler(async (req, res, next) => {
    const { email, phoneNumber } = req.body;

    if (!email || !phoneNumber) {
      return next(
        new ErrorResponse(
          "email and phoneNumber are required",
          statusCode.Bad_Request
        )
      );
    }

    try {
      // Step 1: Find if one record already exists
      let record = await prisma.contact.findFirst();

      // Step 2: If exists, update it. If not, create new one.
      if (record) {
        record = await prisma.contact.update({
          where: { id: record.id },
          data: { email, phoneNumber },
        });
      } else {
        record = await prisma.contact.create({
          data: { email, phoneNumber },
        });
      }

      return SuccessResponse(res, "Contact saved successfully", record);
    } catch (error) {
      console.error("Create/Update error:", error);
      return next(
        new ErrorResponse(
          "Failed to save contact",
          statusCode.Internal_Server_Error
        )
      );
    }
  })
);

/**
 * ✅ Get Contact (only one record expected)
 */
ContactRoute.get(
  "/get-one",
  asyncHandler(async (req, res, next) => {
    try {
      const record = await prisma.contact.findFirst();

      if (!record) {
        return next(
          new ErrorResponse("No contact found", statusCode.Not_Found)
        );
      }

      return SuccessResponse(res, "Contact fetched successfully", record);
    } catch (error) {
      console.error("Fetch error:", error);
      return next(
        new ErrorResponse(
          "Failed to fetch contact",
          statusCode.Internal_Server_Error
        )
      );
    }
  })
);

export default ContactRoute;