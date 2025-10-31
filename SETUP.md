# BEAM Coin Ledger Setup Guide

## Prerequisites

- Node.js 18+ 
- PostgreSQL database (or use Supabase/Render)
- Stripe account with Connect enabled
- (Optional) Firebase Auth account

## Initial Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Set up environment variables:**
   Create a `.env` file in the root directory with the following variables:
   ```env
   # Database
   DATABASE_URL=postgres://user:password@localhost:5432/beam_coin_ledger

   # Stripe
   STRIPE_SECRET_KEY=sk_test_...
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
   STRIPE_WEBHOOK_SECRET=whsec_...

   # Firebase Auth (optional - replace with your auth solution)
   FIREBASE_API_KEY=...
   FIREBASE_PROJECT_ID=...
   FIREBASE_AUTH_DOMAIN=...
   FIREBASE_STORAGE_BUCKET=...
   FIREBASE_MESSAGING_SENDER_ID=...
   FIREBASE_APP_ID=...

   # Next.js
   NEXTAUTH_URL=http://localhost:3000
   ```

3. **Generate Prisma client:**
   ```bash
   npm run db:generate
   ```

4. **Run database migrations:**
   ```bash
   npm run db:migrate
   ```

5. **Start development server:**
   ```bash
   npm run dev
   ```

## Stripe Setup

1. Create a Stripe account and enable **Stripe Connect**
2. Get your API keys from the Stripe Dashboard
3. Set up a webhook endpoint:
   - URL: `https://your-domain.com/api/stripe/webhook`
   - Events to listen for:
     - `transfer.paid`
     - `account.updated`
   - Copy the webhook secret to `STRIPE_WEBHOOK_SECRET`

## Authentication Setup

**Note:** The current implementation uses placeholder authentication (`temp-user-id`). You need to:

1. Implement Firebase Auth (or your preferred auth solution)
2. Replace `temp-user-id` in all API routes with actual user session data
3. Add admin authentication middleware for admin routes

Example for Next.js with Firebase:
```typescript
// In API routes
import { getServerSession } from "next-auth";
// or with Firebase
import { auth } from "@/lib/firebase-admin";

const user = await auth.verifyIdToken(token);
const userId = user.uid;
```

## Admin Routes

The following routes require admin authentication (currently not enforced):
- `/api/admin/users`
- `/api/admin/issuance`
- `/api/redemptions/approve`

Add authentication middleware before these routes handle requests.

## Testing

1. Create a test user via database or admin panel
2. Issue BEAM coins through `/admin/issuance`
3. Test redemption flow:
   - Complete Stripe onboarding
   - Request redemption
   - Approve redemption (admin)
   - Verify Stripe transfer

## Deployment

### Vercel

1. Connect your GitHub repo to Vercel
2. Add all environment variables in Vercel dashboard
3. Set up database (Supabase recommended)
4. Configure Stripe webhook URL in Stripe Dashboard

### Database

Recommended: **Supabase** (free tier available)
1. Create a new Supabase project
2. Copy the connection string to `DATABASE_URL`
3. Run migrations: `npm run db:migrate`
