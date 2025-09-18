import type { NextFunction, Request, Response } from "express";
declare global {
    namespace Express {
        interface Request {
            admin?: {
                id: number;
                email: string;
                name: string;
            };
        }
    }
}
export declare const adminAuth: (req: Request, res: Response, next: NextFunction) => void;
export declare const requireAdmin: (req: Request, res: Response, next: NextFunction) => void;
//# sourceMappingURL=admin.middleware.d.ts.map