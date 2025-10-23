import { loginHandler, getOTPForUserHandler, createAccountHandler, logoutHandler } from "../handlers/account-handler.js";

export async function loginImpl(payload: any) {
    return await loginHandler(payload);
}

export async function createAccountImpl(payload: any) {
    return await createAccountHandler(payload);
}

export async function getOTPForUserImpl(payload: any, user: any) {
    return await getOTPForUserHandler(payload, user);
}

export async function logoutImpl(refresh_token: string) {
    return await logoutHandler(refresh_token);
}