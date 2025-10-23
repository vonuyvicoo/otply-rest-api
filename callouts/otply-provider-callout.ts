
import { AppError } from "../handlers/middleware/error-handler.js";
import { PrismaCallout } from "./prisma-callout.js";
import { oTPRegisterRequestSchema } from "../schemas/zod-schemas.js";
import { oTPRequestSchema } from "../schemas/zod-schemas.js";
import { TOTP } from "totp-generator"

import z from "zod";
import { UserNoHash } from "../types/types.js";

export async function registerProviderCallout(payload: z.infer<typeof oTPRegisterRequestSchema>, user: UserNoHash) {
    oTPRegisterRequestSchema.parse(payload);

    if (!user.organization_id) throw new AppError({
        name: "USER_NO_ORGANIZATION_BUSINESS_ERROR",
        message: "You are still not registered in an organization. Can't register provider.",
        statusCode: 401
    })

    const prisma = PrismaCallout.getInstance().getClient();
    const providerObject = await prisma.otply_provider.create({
        data: {
            name: payload.name,
            slug: payload.slug,
            identifier: payload.identifier,
            secret: payload.secret,
            organization_id: user.organization_id
        }
    });

    const { secret, ...cleanProvider } = providerObject;

    return cleanProvider;
}

export async function deleteProviderCallout(provider_id: string, user: UserNoHash) {
    if (!user.organization_id) throw new AppError({
        name: "USER_NO_ORGANIZATION_BUSINESS_ERROR",
        message: "You are still not registered in an organization. Can't register provider.",
        statusCode: 401
    })

    const prisma = PrismaCallout.getInstance().getClient();
    await prisma.otply_provider.delete({
        where: {
            id: provider_id,
            organization_id: user.organization_id
        }
    });

}

export async function getOTPThroughProviderCallout(payload: z.infer<typeof oTPRequestSchema>, user: UserNoHash) {
    if (!user.organization_id) throw new AppError({
        name: "USER_NO_ORGANIZATION_BUSINESS_ERROR",
        message: "You are still not registered in an organization. Can't register provider.",
        statusCode: 401
    })

    oTPRequestSchema.parse(payload);
    const prisma = PrismaCallout.getInstance().getClient();
    const provider = await prisma.otply_provider.findUnique({
        where: {
            slug_organization_id: {
                slug: payload.slug,
                organization_id: user.organization_id
            }
        }
    });

    if (!provider) {
        throw new AppError({
            name: "INVALID_PROVIDER_BUSINESS_ERROR",
            message: "Provider isn't registered yet.",
            statusCode: 404
        })
    }

    const secretKey = provider.secret;
    const { otp, expires } = await TOTP.generate(secretKey);

    return {
        otp, expires
    }
}

export async function listProviderCallout(user: UserNoHash) {
    if (!user.organization_id) throw new AppError({
        name: "USER_NO_ORGANIZATION_BUSINESS_ERROR",
        message: "You are still not registered in an organization. Can't register provider.",
        statusCode: 401
    })

    const prisma = PrismaCallout.getInstance().getClient();
    const providerObject = await prisma.otply_provider.findMany({
        select: {
            id: true,
            name: true,
            slug: true,
            identifier: true
        },
        where: {
            organization_id: user.organization_id
        }
    });

    return providerObject;
}