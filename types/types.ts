/**
 * Organize your types here
 */
import { otply_user } from "../generated/prisma/index.js";

export interface LoginRequest {
    email: string;
    password: string;
}

export interface OTPRequest {
    slug: string
}

export interface OTPRegisterRequest {
    name: string;
    slug: string;
    identifier: string;
    secret: string;
}

export interface CreateAccountRequest {
    email: string;
    password: string;
    name: string;
    username: string;
    organization_id?: string;
}

export interface CreateOrganizationRequest {
    name: string;
}


export interface UserNoHash extends Omit<otply_user, 'password_hash'> { }
