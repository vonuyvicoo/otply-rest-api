import type { Request, Response, NextFunction } from "express";
import { verifyAccessToken, generateAccessTokenFromRefreshToken } from "../../_shared/jwt-helper.js";
import { AppError } from "./error-handler.js";
import { UserNoHash } from "../../types/types.js";

export async function RequireJWT(req: Request, res: Response, next: NextFunction) {
    const token = req.cookies["otply_access_token"];
    const refresh_token = req.cookies["otply_refresh_token"];
    if (!token && !refresh_token) {
        throw new AppError({
            name: "USER_NOT_AUTHENTICATED_BUSINESS_ERROR",
            message: "No tokens found",
            statusCode: 401
        });
    }

    let user: UserNoHash;
    try {
        user = verifyAccessToken(token);
    } catch (jwtError) {
        console.log("[JWT] Attempting refresh token.")

        // Attempt to refresh token
        const refreshToken = refresh_token;
        const newAccessToken = await generateAccessTokenFromRefreshToken(refreshToken, "user");

        user = verifyAccessToken(newAccessToken);

        // Update access token in cookie
        // too lazy to modularize cookie helper
        // Set cookie with subdomain persistence
        const cookieOptions: any = {
            maxAge: 1000 * 60 * 60 * 24 * 30, // 30 days
            httpOnly: true, // Prevent JavaScript access
            secure: process.env.NODE_ENV === 'production', // HTTPS only in production
            sameSite: 'lax', // CSRF protection
        };

        // Add domain for subdomain persistence if configured
        if (process.env.COOKIE_DOMAIN) {
            cookieOptions.domain = process.env.COOKIE_DOMAIN;
        }

        // Persist cookie
        res.cookie("otply_access_token", newAccessToken, cookieOptions);
    }
    req.user = user;
    req.sub = user.id;

    next();
}