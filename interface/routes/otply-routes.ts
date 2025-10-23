
import express from "express";
import {
    registerProviderImpl,
    listProviderImpl,
    deleteProviderImpl
} from "../../impl/otply-provider-impl.js";

import { RequireJWT } from "../../handlers/middleware/user-auth-handler.js";
import { RequireRole } from "../../handlers/middleware/require-role-handler.js";

const router = express.Router();

// req.params -> URI params
// req.query -> Query Params
// req.body -> POST payload

// Require basic user
router.use(RequireJWT);
router.get("/otply/providers", async (req, res) => {
    res.json({
        correlationId: req.correlationId,
        providers: await listProviderImpl(req.user)
    })
});

// Require admin roles for registering and deleting providers
router.post("/otply/providers", RequireRole(["ADMIN"]), async (req, res) => {
    res.json({
        correlationId: req.correlationId,
        provider: await registerProviderImpl(req.body, req.user)
    })
});

router.delete("/otply/providers/:id", RequireRole(["ADMIN"]), async (req, res) => {
    await deleteProviderImpl(req.params.id, req.user);
    res.json({
        correlationId: req.correlationId,
        message: "Provider deleted successfully."
    })
});

export default router;
