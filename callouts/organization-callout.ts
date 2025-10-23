import { PrismaCallout } from "./prisma-callout.js";
import { createOrganizationRequestSchema } from "../schemas/zod-schemas.js";
import z from "zod";

export async function getOrganizationCallout(id: string) {
    const prisma = PrismaCallout.getInstance().getClient();
    const organization = await prisma.otply_organization.findUnique({
        where: {
            id
        }, include: {
            otply_users: {
                select: {
                    name: true,
                    email: true,
                    role: true
                }
            }
        }
    });

    return organization;
}

export async function getOrganizationsCallout() {
    const prisma = PrismaCallout.getInstance().getClient();
    return await prisma.otply_organization.findMany()
}

export async function createOrganizationCallout(payload: z.infer<typeof createOrganizationRequestSchema>, userId: string) {
    createOrganizationRequestSchema.parse(payload);

    const prisma = PrismaCallout.getInstance().getClient();
    const organization = await prisma.otply_organization.create({
        data: {
            name: payload.name
        }
    });

    // Change user's organization ID then change role to ADMIN
    await prisma.otply_user.update({
        where: {
            id: userId
        },
        data: {
            organization_id: organization.id,
            role: "ADMIN"
        }
    });

    return organization;
}