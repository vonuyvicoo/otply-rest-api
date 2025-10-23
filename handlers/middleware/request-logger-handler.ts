import type { Request, Response, NextFunction } from "express";

export function RequestLogger(req: Request, res: Response, next: NextFunction) {
    console.info(`[OTPly SYS API] ${new Date().toISOString()} - ${req.path} - ${req.correlationId}`);
    next();
}