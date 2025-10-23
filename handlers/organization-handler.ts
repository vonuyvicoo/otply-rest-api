import { createOrganizationCallout, getOrganizationsCallout, getOrganizationCallout } from "../callouts/organization-callout.js";

export async function createOrganizationHandler(payload: any, userId: string) {
    return await createOrganizationCallout(payload, userId);
}

export async function getOrganizationHandler(id: string) {
    return await getOrganizationCallout(id);
}

export async function getOrganizationsHandler() {
    return await getOrganizationsCallout();
}
