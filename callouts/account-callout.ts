import { PrismaCallout } from "./prisma-callout.js";
import { createAccountRequestSchema, loginRequestSchema } from "../schemas/zod-schemas.js";
import z from "zod";
import bcrypt from "bcryptjs";
import { AppError } from "../handlers/middleware/error-handler.js";
import { generateAccessToken, generateRefreshToken } from "../_shared/jwt-helper.js";

export async function loginCallout(payload: z.infer<typeof loginRequestSchema>) {
    loginRequestSchema.parse(payload);

    const email = payload.email;
    const raw_password = payload.password;

    const prisma = PrismaCallout.getInstance().getClient();

    // Find account
    const account = await prisma.otply_user.findFirst({
        where: {
            email: email
        }
    });

    if (!account) {
        throw new AppError({
            name: "ACCOUNT_NOT_FOUND_BUSINESS_ERROR",
            message: "No account with the email.",
            statusCode: 401
        });
    }

    // Verify password
    const isMatch = await bcrypt.compare(raw_password, account.password_hash);

    if (!isMatch) throw new AppError({
        name: "PASSWORD_INCORRECT_BUSINESS_ERROR",
        message: "Password is incorrect.",
        statusCode: 403
    });

    // Generate and Sign JWT
    const { password_hash, ...jwtPayload } = account;
    const access_token = generateAccessToken(jwtPayload);
    const refresh_token = generateRefreshToken(jwtPayload);

    // Store refresh_token
    await prisma.otply_user_refresh_token.create({
        data: {
            refresh_token
        }
    })

    return {
        access_token,
        refresh_token
    };
}

export async function createAccountCallout(payload: z.infer<typeof createAccountRequestSchema>) {
    createAccountRequestSchema.parse(payload);

    const prisma = PrismaCallout.getInstance().getClient();
    const password = bcrypt.hashSync(payload.password);

    const account = await prisma.otply_user.create({
        data: {
            username: payload.username,
            password_hash: password,
            email: payload.email,
            organization_id: payload.organization_id,
            name: payload.name
        }
    });

    const { password_hash, ...cleanAccount } = account;

    return cleanAccount;
}

export async function logoutCallout(refresh_token: string) {
    const prisma = PrismaCallout.getInstance().getClient();

    await prisma.otply_user_refresh_token.delete({
        where: {
            refresh_token
        }
    });
}