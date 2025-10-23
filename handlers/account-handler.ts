import { loginCallout, createAccountCallout, logoutCallout } from "../callouts/account-callout.js";
import { getOTPThroughProviderCallout } from "../callouts/otply-provider-callout.js";

export async function loginHandler(payload: any) {
    return await loginCallout(payload);
}

export async function createAccountHandler(payload: any) {
    return await createAccountCallout(payload);
}

export async function getOTPForUserHandler(payload: any, user: any) {
    return await getOTPThroughProviderCallout(payload, user);
}

export async function logoutHandler(refresh_token: string) {
    return await logoutCallout(refresh_token);
}