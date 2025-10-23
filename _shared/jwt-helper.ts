import jwt, { JwtPayload } from "jsonwebtoken";
import { PrismaCallout } from "../callouts/prisma-callout.js";
import { AppError } from "../handlers/middleware/error-handler.js";
import { UserNoHash } from "../types/types.js";

export function generateAccessToken(user: UserNoHash) {
    if (!process.env.JWT_ACCESS_TOKEN_SECRET) throw new Error("JWT_ACCESS_TOKEN_SECRET is not set.")

    return jwt.sign(user, process.env.JWT_ACCESS_TOKEN_SECRET, {
        expiresIn: "1d"
    });
}

export function generateRefreshToken(user: UserNoHash) {
    if (!process.env.JWT_REFRESH_TOKEN_SECRET) throw new Error("JWT_REFRESH_TOKEN_SECRET is not set.")

    return jwt.sign(user, process.env.JWT_REFRESH_TOKEN_SECRET, {
        expiresIn: "14d"
    });
}

export function verifyAccessToken(access_token: string) {
    if (!process.env.JWT_ACCESS_TOKEN_SECRET) throw new Error("JWT_ACCESS_TOKEN_SECRET is not set.")
    let payload: UserNoHash;

    try {
        payload = jwt.verify(access_token, process.env.JWT_ACCESS_TOKEN_SECRET) as UserNoHash;
    } catch (err) {
        console.error("JWT Veritification Error: ", err);
        throw new AppError({
            name: "ACCESS_TOKEN_INVALID_BUSINESS_ERROR",
            message: "Access token is invalid or expired.",
            statusCode: 403
        })
    };

    return payload;
}

export function verifyRefreshToken(refresh_token: string) {
    if (!process.env.JWT_REFRESH_TOKEN_SECRET) throw new Error("JWT_REFRESH_TOKEN_SECRET is not set.")
    let payload: UserNoHash;

    try {
        payload = jwt.verify(refresh_token, process.env.JWT_REFRESH_TOKEN_SECRET) as UserNoHash;
    } catch (err) {
        console.error("JWT Veritification Error: ", err);
        throw new AppError({
            name: "REFRESH_TOKEN_INVALID_BUSINESS_ERROR",
            message: "Refresh token is invalid or expired.",
            statusCode: 403
        })
    };

    return payload;
}

export async function validateRefreshTokenDatabase(refresh_token: string, type: "user" | "api") {
    const prisma = PrismaCallout.getInstance().getClient();
    try {
        if (type === "user") {
            await prisma.otply_user_refresh_token.findUniqueOrThrow({
                where: {
                    refresh_token
                }
            });
        } else if (type === "api") {
            await prisma.otply_api_client_refresh_token.findUniqueOrThrow({
                where: {
                    refresh_token
                }
            });
        } else {
            throw new Error("Internal server error.")
        }
    } catch (err) {
        console.error(err);
        throw new AppError({
            name: "REFRESH_TOKEN_NOT_FOUND_BUSINESS_ERROR",
            message: "Refresh Token not found.",
            statusCode: 403
        })
    }
}

export async function generateAccessTokenFromRefreshToken(refresh_token: string, type: "user" | "api") {
    if (!process.env.JWT_REFRESH_TOKEN_SECRET) throw new Error("JWT_REFRESH_TOKEN_SECRET is not set.")

    const payload = verifyRefreshToken(refresh_token);
    await validateRefreshTokenDatabase(refresh_token, type);

    // Remove old JWT metadata fields
    const { exp, iat, ...userData } = payload as JwtPayload;

    return generateAccessToken(userData as UserNoHash);


}