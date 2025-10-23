# OTPly API

**OTPly** is a secure, organization-based TOTP (Time-based One-Time Password) management API designed for per-organization deployment. It provides a centralized solution for managing TOTP providers and generating time-based authentication codes for various services.

## 🏗️ Architecture

OTPly follows a clean, layered architecture pattern with clear separation of concerns:

### Core Components

-   **Interface Layer** (`interface/`): Express.js routes and API endpoints
-   **Implementation Layer** (`impl/`): Business logic implementation
-   **Handler Layer** (`handlers/`): Request/response handling and middleware
-   **Callout Layer** (`callouts/`): Data access and external service integration
-   **Shared Layer** (`_shared/`): Common utilities and helpers
-   **Types & Schemas** (`types/`, `schemas/`): TypeScript definitions and Zod validation schemas

### Technology Stack

-   **Runtime**: Node.js with TypeScript
-   **Framework**: Express.js 5.x
-   **Database**: PostgreSQL with Prisma ORM
-   **Authentication**: JWT (JSON Web Tokens) with refresh token rotation
-   **Password Hashing**: bcryptjs
-   **TOTP Generation**: totp-generator library
-   **Validation**: Zod schemas
-   **Documentation**: OpenAPI 3.0 (Swagger)
-   **Deployment**: Vercel-ready with serverless support

## 🔐 Security Features

### Authentication & Authorization

-   **JWT-based Authentication**: Secure access and refresh token system
-   **Role-based Access Control**: ADMIN and USER roles with granular permissions
-   **Password Security**: bcrypt hashing with salt rounds
-   **Cookie Security**: HttpOnly, Secure, SameSite protection
-   **Token Rotation**: Automatic refresh token rotation on access

### TOTP Implementation

-   **RFC 6238 Compliant**: Standard TOTP algorithm implementation
-   **Time-based Codes**: 6-digit codes with configurable expiration
-   **Secret Management**: Secure storage of TOTP secrets per provider
-   **Organization Isolation**: Complete data separation between organizations

### Security Middleware

-   **Correlation ID Tracking**: Request tracing for audit logs
-   **Request Logging**: Comprehensive request/response logging
-   **Error Handling**: Structured error responses without information leakage
-   **Input Validation**: Zod schema validation for all endpoints

## 🚀 Features

### Core Functionality

-   **Multi-tenant Architecture**: Organization-based data isolation
-   **User Management**: Account creation, authentication, and profile management
-   **TOTP Provider Management**: Register, list, and delete TOTP providers
-   **OTP Generation**: Real-time TOTP code generation with expiration timestamps
-   **Audit Logging**: Track user actions and system events

### API Capabilities

-   **RESTful Design**: Clean, intuitive API endpoints
-   **OpenAPI Documentation**: Interactive Swagger UI at `/api/v1/docs`
-   **Health Monitoring**: Built-in health check endpoint
-   **CORS Support**: Configurable cross-origin resource sharing
-   **Rate Limiting Ready**: Prepared for rate limiting implementation

### Developer Experience

-   **TypeScript**: Full type safety throughout the application
-   **Hot Reload**: Development server with automatic restart
-   **Environment Configuration**: Flexible environment variable management
-   **Database Migrations**: Prisma-based schema management
-   **API Testing**: Swagger UI for interactive testing

## 📋 API Endpoints

### Public Endpoints

-   `GET /api/v1/health` - Health check
-   `GET /api/v1/docs` - Interactive API documentation
-   `POST /api/v1/accounts/login` - User authentication
-   `POST /api/v1/accounts` - Account registration
-   `GET /api/v1/organizations` - List organizations

### Authenticated Endpoints

-   `GET /api/v1/accounts/me` - Get user profile
-   `GET /api/v1/accounts/otp` - Generate OTP for provider
-   `GET /api/v1/organizations/:id` - Get organization details
-   `POST /api/v1/organizations` - Create organization

### Admin Endpoints

-   `GET /api/v1/otply/providers` - List TOTP providers
-   `POST /api/v1/otply/providers` - Register TOTP provider
-   `DELETE /api/v1/otply/providers/:id` - Delete TOTP provider

## 🛠️ Installation & Setup

### Prerequisites

-   Node.js 18+
-   PostgreSQL database
-   npm or yarn package manager

### Environment Setup

1. **Clone the repository**

    ```bash
    git clone <repository-url>
    cd otply-api
    ```

2. **Install dependencies**

    ```bash
    npm install
    ```

3. **Environment Configuration**
   Create a `.env` file with the following variables:

    ```env
    # Database
    DATABASE_URL="postgresql://username:password@localhost:5432/otply_db"

    # JWT Secrets
    JWT_ACCESS_TOKEN_SECRET="your-access-token-secret"
    JWT_REFRESH_TOKEN_SECRET="your-refresh-token-secret"

    # Server Configuration
    PORT=3000
    NODE_ENV="development"

    # Optional: Cookie Domain (for subdomain persistence)
    COOKIE_DOMAIN=".yourdomain.com"
    ```

4. **Database Setup**

    ```bash
    # Generate Prisma client
    npx prisma generate

    # Run database migrations
    npx prisma db push
    ```

5. **Development Server**

    ```bash
    npm run dev
    ```

6. **Production Build**
    ```bash
    npm run build
    npm start
    ```

## 🔧 Configuration

### Database Schema

The application uses PostgreSQL with the following key models:

-   `otply_organization`: Organization management
-   `otply_user`: User accounts with role-based access
-   `otply_provider`: TOTP provider configurations
-   `otply_audit_log`: Action tracking and auditing

### TOTP Configuration

-   **Algorithm**: HMAC-SHA1 (RFC 6238 standard)
-   **Code Length**: 6 digits
-   **Time Step**: 30 seconds
-   **Window**: Standard TOTP window for clock drift tolerance

### Security Configuration

-   **Access Token Expiry**: 1 day
-   **Refresh Token Expiry**: 14 days
-   **Password Hashing**: bcrypt with automatic salt generation
-   **Cookie Security**: HttpOnly, Secure (production), SameSite=Lax

## 📖 Usage Examples

### Register a TOTP Provider

```bash
curl -X POST http://localhost:3000/api/v1/otply/providers \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "name": "GitHub",
    "slug": "github-main",
    "identifier": "user@example.com",
    "secret": "JBSWY3DPEHPK3PXP"
  }'
```

### Generate OTP Code

```bash
curl -X GET "http://localhost:3000/api/v1/accounts/otp?slug=github-main" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Response Example

```json
{
    "correlationId": "uuid-here",
    "otp": {
        "otp": "123456",
        "expires": 1640995200000
    }
}
```

## 🚀 Deployment

### Vercel Deployment

The application is optimized for Vercel serverless deployment:

1. **Connect Repository**: Link your GitHub repository to Vercel
2. **Environment Variables**: Set all required environment variables in Vercel dashboard
3. **Database**: Ensure PostgreSQL database is accessible from Vercel
4. **Deploy**: Automatic deployment on git push

### Docker Deployment

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

## 🔍 Monitoring & Logging

### Health Monitoring

-   **Health Check**: `GET /api/v1/health`
-   **Correlation IDs**: Unique request tracking
-   **Request Logging**: Comprehensive request/response logging
-   **Error Tracking**: Structured error logging with correlation IDs

### Audit Trail

-   **User Actions**: Track provider management actions
-   **Authentication Events**: Login/logout tracking
-   **Organization Changes**: Monitor organization modifications

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the ISC License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Von Uyvico** - [@vonuyvicoo](https://github.com/vonuyvicoo)

## 🔗 Related Projects

-   Based on the [express-api-led-template](https://github.com/vonuyvicoo/express-api-led-template)
-   Inspired by API-led architecture patterns

---

**Note**: OTPly is designed for per-organization deployment and is not intended for cross-organizational multi-tenancy. Each organization should maintain its own instance for optimal security and data isolation.

PS. THis is not vibe-coded :D except for this README lol.
