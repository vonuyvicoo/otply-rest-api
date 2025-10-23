import type { Request, Response, NextFunction } from "express";
import { AppError } from "./error-handler.js";
export function RequireRole(roles: string[]) {
    const roleMiddleware = function (req: Request, res: Response, next: NextFunction) {
        if (!roles.includes(req.user.role)) throw new AppError({
            name: "USER_ACTION_UNAUTHORIZED_BUSINESS_ERROR",
            message: "You are not allowed to perform this action. This action requires elevated privileges.",
            statusCode: 403
        });

        next();
    };

    return roleMiddleware;
}