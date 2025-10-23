
import express from "express";
import {
    createOrganizationImpl,
    getOrganizationImpl,
    getOrganizationsImpl
} from "../../impl/organization-impl.js";

import {
    logoutImpl
} from "../../impl/account-impl.js";

import { RequireJWT } from "../../handlers/middleware/user-auth-handler.js";
import { AppError } from "../../handlers/middleware/error-handler.js";

const router = express.Router();

// req.params -> URI params
// req.query -> Query Params
// req.body -> POST payload


// List all organizations in deployment
router.get("/organizations", async (req, res) => {
    const organizations = await getOrganizationsImpl();
    res.json({
        correlationId: req.correlationId,
        organizations
    })
});

router.use(RequireJWT);
router.post("/organizations", async (req, res) => {
    const organization = await createOrganizationImpl(req.body, req.user.id);

    // Force user logout
    const refreshToken = req.cookies["otply_refresh_token"];
    logoutImpl(refreshToken);

    res.clearCookie("otply_access_token");
    res.clearCookie("otply_refresh_token");

    res.json({
        correlationId: req.correlationId,
        organization,
        message: "Please login again."
    })
});

router.get("/organizations/:id", async (req, res) => {
    // Verify relationship
    if (req.params.id !== req.user.organization_id) throw new AppError({
        name: "USER_NOT_RELATED_BUSINESS_ERROR",
        message: "You don't have permission to view this organization.",
        statusCode: 401
    })

    const organization = await getOrganizationImpl(req.params.id);
    res.json({
        correlationId: req.correlationId,
        organization
    })
});

export default router;
