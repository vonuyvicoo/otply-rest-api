
import "dotenv/config";
import express, { Request, Response, NextFunction } from "express";

// Deps
import cookieParser from "cookie-parser";
import cors from "cors";

// Global Handlers
import { AppError, ErrorHandler } from "../handlers/middleware/error-handler.js";
import { GenerateCorrelationID } from "../handlers/middleware/correlation-id-handler.js";
import { RequestLogger } from "../handlers/middleware/request-logger-handler.js";

// Route imports
import publicRoutes from "./routes/public-routes.js";
import accountRoutes from "./routes/account-routes.js";
import otplyRoutes from "./routes/otply-routes.js";
import organizationRoutes from "./routes/organization-routes.js";

const app = express();
const port = process.env.PORT;

const BASE_PATH = "/api/v1";

// CORS Configuration
const corsOptions = {
    origin: process.env.CORS_ORIGIN || "http://localhost:3001",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
};
app.use(cors(corsOptions));

// Dep middlewares
app.use(cookieParser());

// Logging Handlers
app.use(GenerateCorrelationID);
app.use(RequestLogger);
app.use(express.json())

// Our API routes
app.use(BASE_PATH, publicRoutes);
app.use(BASE_PATH, accountRoutes);
app.use(BASE_PATH, otplyRoutes);
app.use(BASE_PATH, organizationRoutes);

app.use((req: Request, res: Response, next: NextFunction) => {
    throw new AppError({
        name: "PATH_NOT_FOUND_BUSINESS_ERROR",
        message: "Path you're trying to access does not exist.",
        statusCode: 404
    })
})

// Global Error Handler
app.use(ErrorHandler);

if (process.env.NODE_ENV !== 'production') {
    app.listen(port, () => {
        console.log("[OTPly API] Server started successfully. Running in port: ", port);
    });
}

export default app;
