import { registerProviderHandler, listProviderHandler, deleteProviderHandler } from "../handlers/otply-provider-handler.js";

export async function registerProviderImpl(payload: any, user: any) {
    return await registerProviderHandler(payload, user);
}

export async function listProviderImpl(user: any) {
    return await listProviderHandler(user);
}

export async function deleteProviderImpl(provider_id: string, user: any) {
    return await deleteProviderHandler(provider_id, user);
}