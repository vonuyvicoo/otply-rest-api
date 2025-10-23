import { PrismaClient } from "../generated/prisma/index.js";

export class PrismaCallout {
    private prisma: PrismaClient;
    private static instance: PrismaCallout;

    private constructor() {
        this.prisma = new PrismaClient();
    }

    public static getInstance() {
        if (!PrismaCallout.instance) {
            PrismaCallout.instance = new PrismaCallout();
        }
        return PrismaCallout.instance;
    }

    public getClient(): PrismaClient {
        return this.prisma;
    }

}