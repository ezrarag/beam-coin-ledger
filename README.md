# BEAM Coin Ledger

A web application for managing BEAM Coin balances, redemption, and Stripe payouts.

## Tech Stack

- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- Prisma ORM (PostgreSQL/Supabase compatible)
- Firebase Auth
- Stripe SDK
- Zod validation
- React Query for data fetching

## Setup

1. Install dependencies:
```bash
npm install
```

2. Copy `.env.example` to `.env` and fill in your environment variables

3. Set up the database:
```bash
npm run db:migrate
```

4. Run the development server:
```bash
npm run dev
```

## Project Structure

```
apps/web/              # Next.js application
packages/core/         # Shared types and schemas
packages/db/           # Prisma client and models
```

## Deployment

- Host on Vercel
- Use Supabase or Render for Postgres
- Add Stripe webhook URL to dashboard

