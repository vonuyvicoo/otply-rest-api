import { createOrganizationHandler, getOrganizationHandler, getOrganizationsHandler } from "../handlers/organization-handler.js";

export async function createOrganizationImpl(payload: any, userId: string) {
    return await createOrganizationHandler(payload, userId);
}

export async function getOrganizationImpl(id: string) {
    return await getOrganizationHandler(id);
}

export async function getOrganizationsImpl() {
    return await getOrganizationsHandler();
}