# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

```bash
# Start development server with Turbopack
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

## Project Architecture

This is a Next.js 15 financial technology application with the following key architectural patterns:

### Tech Stack
- **Framework**: Next.js 15 with App Router
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT with Passport.js (local, custom strategies)
- **UI**: React 19, Tailwind CSS, Radix UI components
- **Blockchain**: Solana integration (@solana/web3.js, @solana/spl-token)
- **Payment Processing**: Stripe integration
- **Real-time**: WebSocket server for live updates
- **File Storage**: AWS S3 with multer-s3
- **Notifications**: Firebase Cloud Messaging, SMS via Vonage
- **Communication**: WhatsApp integration for bot functionality

### Directory Structure

- **`/app`**: Next.js App Router pages and API routes
  - `/api/v1/*`: RESTful API endpoints organized by domain
  - `/dashboard/*`: Protected dashboard pages
  - `/docs/*`: API documentation pages
- **`/components`**: Reusable React components
  - `/ui/*`: Base UI components (Radix UI + Tailwind)
  - `/dashboard/*`: Dashboard-specific components
  - `/docs/*`: Documentation components
- **`/lib`**: Core utilities and configurations
  - `db.ts`: MongoDB connection with caching
  - `auth-provider.tsx`: Authentication context
  - `solana.ts`: Blockchain utilities
  - `/middleware/*`: Authentication middleware
- **`/models`**: Mongoose schema definitions
- **`/repositories`**: Data access layer (repository pattern)
- **`/services`**: Business logic layer
- **`/types`**: TypeScript type definitions
- **`/notifications`**: Push notification and SMS handlers

### Authentication Flow
- JWT tokens stored in HTTP-only cookies
- Middleware protection for `/dashboard/*` routes (middleware.ts:8)
- API routes use `verifyTokenApp` middleware for authentication
- Session management via `/api/v1/auth/session`

### Key Integrations
- **Solana Wallet**: SPL token transfers and wallet management
- **WhatsApp Bot**: Automated financial operations via WhatsApp
- **Payment Gateway**: Monime integration for deposits/withdrawals
- **KYC**: Identity verification system
- **Real-time Features**: WebSocket for live transaction updates

### Database Pattern
Uses repository pattern with services layer:
1. **Models** define Mongoose schemas
2. **Repositories** handle data access (CRUD operations)
3. **Services** contain business logic and call repositories
4. **API Routes** call services and handle HTTP concerns

### Environment Requirements
- `MONGO_URI`: MongoDB connection string
- JWT secret for token signing
- AWS S3 credentials for file uploads
- Solana network configuration
- Third-party service API keys (Stripe, Vonage, Firebase)