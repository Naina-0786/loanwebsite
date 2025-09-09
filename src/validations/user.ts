import { z } from "zod";

export const userValidation = z.object({
    email: z.string(),
    name: z.string(),
   aadharcard: z.string(),
    pancard: z.string(),
    fathername: z.string(),
    address: z.string(),
    pincode: z.string(),
    mobilenumber: z.string(),
   
})