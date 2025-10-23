
import express from "express";
import {
    loginImpl,
    getOTPForUserImpl,
    createAccountImpl
} from "../../impl/account-impl.js";

import { RequireJWT } from "../../handlers/middleware/user-auth-handler.js";
const router = express.Router();

// req.params -> URI params
// req.query -> Query Params
// req.body -> POST payload


router.post("/accounts/login", async (req, res) => {
    const { access_token, refresh_token } = await loginImpl(req.body);

    // Set cookie with subdomain persistence
    const cookieOptions: any = {
        maxAge: 1000 * 60 * 60 * 24 * 30, // 30 days
        httpOnly: true, // Prevent JavaScript access
        secure: process.env.NODE_ENV === 'production', // HTTPS only in production
        sameSite: 'lax', // CSRF protection
    };

    // Add domain for subdomain persistence if configured
    if (process.env.COOKIE_DOMAIN) {
        cookieOptions.domain = process.env.COOKIE_DOMAIN;
    }

    // Persist cookie
    res.cookie("otply_access_token", access_token, cookieOptions);
    res.cookie("otply_refresh_token", refresh_token, cookieOptions);

    res.json({
        correlationId: req.correlationId,
        access_token,
        refresh_token
    })
});

router.post("/accounts", async (req, res) => {
    const account = await createAccountImpl(req.body);

    res.json({
        correlationId: req.correlationId,
        account
    })
});

router.get("/accounts/me", RequireJWT, async (req, res) => {
    const profile = req.user;
    res.json({
        correlationId: req.correlationId,
        profile: { ...(profile) }
    })
});

router.get("/accounts/otp", RequireJWT, async (req, res) => {
    res.json({
        correlationId: req.correlationId,
        otp: (await getOTPForUserImpl(req.query, req.user))
    })
});

export default router;
