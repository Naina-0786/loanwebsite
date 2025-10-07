import  zod  from "zod";

 export const popupSchema = zod.object({
    name: zod.string(),
    email: zod.string(),
    phoneNumber: zod.string().min(10),   
    message: zod.string().min(3)
});