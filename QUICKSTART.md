# 🚀 Quick Start Guide

## 5-Minute Setup

### Step 1: Install Dependencies
```bash
npm install
```

### Step 2: Set Up Database

Create a `.env` file in the root:
```env
DATABASE_URL=postgresql://user:password@localhost:5432/beamcoin
```

Then run:
```bash
npm run db:migrate
npm run db:seed
```

### Step 3: Add Stripe Keys (Test Mode)

Get test keys from https://dashboard.stripe.com/test/apikeys

Add to `.env`:
```env
STRIPE_SECRET_KEY=sk_test_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

### Step 4: Start Dev Server
```bash
npm run dev
```

Visit http://localhost:3000

### Step 5: Test the Flow

1. **Issue BEAM**: Go to `/admin/issuance`, search `musician@test.com`, issue 200 BEAM
2. **Check Wallet**: Go to `/wallet` (update API route to use test user ID)
3. **Onboard Stripe**: Click "Complete Stripe Onboarding" in wallet
4. **Request Redemption**: Enter 100 BEAM, submit
5. **Approve**: Go to `/admin/redemptions`, click "Approve & Pay"

### Step 6: Verify

- Check Stripe Dashboard → Transfers (Test Mode)
- Check Prisma Studio: `npm run db:studio`
- Check Impact Dashboard: `/impact`

## Need Help?

- Full setup: See `SETUP.md`
- Testing guide: See `TESTING.md`
- Troubleshooting: Check console logs and Prisma Studio

