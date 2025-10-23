// This file serves as a proxy for Vercel to detect Express
// The actual application logic is in interface/library-service-api-interface.js
import express from "express";
import app from "./interface/main-api-interface.js";

// Re-export the app for Vercel
export default app;