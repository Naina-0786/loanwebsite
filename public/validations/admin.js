import { z } from "zod";
export const adminSchema = z.object({
    email: z.string(),
    name: z.string(),
    password: z.string(),
});
//# sourceMappingURL=admin.js.map