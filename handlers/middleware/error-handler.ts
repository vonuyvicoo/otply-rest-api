import { ZodError } from "zod";
import { PrismaClientValidationError } from "../../generated/prisma/runtime/library.js";
import type { Request, Response, NextFunction } from "express";

export function ErrorHandler(err: any, req: Request, res: Response, next: NextFunction) {
    let errorName: string = "Technical Error";
    let errorPayload: any;
    let errorStatusCode: number = 500;

    if (err instanceof ZodError) {
        errorName = err.name;
        errorPayload = err.issues;
        errorStatusCode = 401;
    } else if (err instanceof PrismaClientValidationError) {
        errorName = err.name;
        errorPayload = err.message;
        errorStatusCode = 401;
    } else if (err instanceof AppError) {
        errorName = err.name;
        errorPayload = err.message;
        errorStatusCode = err.statusCode;
    }

    console.error(`[OTPly API] [${req.correlationId}]:`, err.message, err.stack);

    res.status(errorStatusCode).json({
        "correlationId": req.correlationId,
        "error": {
            "name": errorName,
            "payload": errorPayload || "Something went wrong."
        },
    });

    next();
}

export class AppError extends Error {
    public statusCode;

    constructor(errorInstance: Partial<{ name?: string, message: string, statusCode?: number }>) {
        super(errorInstance.message);
        this.name = errorInstance.name || "Business Error";
        this.statusCode = errorInstance.statusCode || 500;
    }
}