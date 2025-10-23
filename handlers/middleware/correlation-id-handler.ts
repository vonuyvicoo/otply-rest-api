import { v4 as uuidv4 } from "uuid"
import type { Request, Response, NextFunction } from "express";
import { UserNoHash } from "../../types/types.js";

// Extend Express Request to include correlationId
declare global {
    namespace Express {
        interface Request {
            correlationId?: string;
            sub: string;
            user: UserNoHash
        }
    }
}

export function GenerateCorrelationID(req: Request, res: Response, next: NextFunction) {
    req.correlationId = uuidv4();
    next();
}