import { registerProviderCallout, listProviderCallout, deleteProviderCallout } from "../callouts/otply-provider-callout.js";

export async function registerProviderHandler(payload: any, user: any) {
    return await registerProviderCallout(payload, user);
}
export async function listProviderHandler(user: any) {
    return await listProviderCallout(user);
}

export async function deleteProviderHandler(provider_id: string, user: any) {
    return await deleteProviderCallout(provider_id, user);
}