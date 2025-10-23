import express from "express";
import swaggerUi from "swagger-ui-express";
import YAML from "yamljs";
import path from "path";
import { fileURLToPath } from "url";
import { getAbsoluteFSPath } from "swagger-ui-dist";

const router = express.Router();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load Swagger document
const swaggerDocument = YAML.load(path.join(__dirname, "../../docs/docs.yaml"));

// Debug: Log the loaded document
console.log("Loaded Swagger Document:", JSON.stringify(swaggerDocument, null, 2));

// Swagger UI options to fix Vercel serverless issues
const swaggerUiOptions = {
    explorer: false,
    customCss: '.swagger-ui .opblock .opblock-summary-path-description-wrapper { align-items: center; display: flex; flex-wrap: wrap; gap: 0 10px; padding: 0 10px; width: 100%; }',
    customCssUrl: 'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/5.0.0/swagger-ui.min.css',
    swaggerOptions: {
        persistAuthorization: true,
        displayRequestDuration: true,
        tryItOutEnabled: true
    }
};

// Get absolute path to swagger-ui-dist for static assets
const swaggerUiDistPath = getAbsoluteFSPath();

// Serve Swagger UI static assets
router.use('/docs/', express.static(swaggerUiDistPath));

// Setup Swagger UI with custom options
router.use('/docs/', swaggerUi.serve, swaggerUi.setup(swaggerDocument, swaggerUiOptions));

// Serve the OpenAPI spec as JSON
router.get('/swagger.json', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(swaggerDocument);
});


// Health check endpoint
router.get("/health", async (req, res) => {
    res.json({
        "message": "API is fully working."
    });
});

export default router;
