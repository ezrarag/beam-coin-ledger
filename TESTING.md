# BEAM Coin Ledger - Testing Guide

## Quick Start Testing Flow

### 1. Initial Setup

```bash
# Install dependencies
npm install

# Set up your .env file (see SETUP.md for full list)
DATABASE_URL=postgresql://user:password@localhost:5432/beamcoin
STRIPE_SECRET_KEY=sk_test_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Generate Prisma client
npm run db:generate

# Run migrations
npm run db:migrate

# Seed test data
npx tsx packages/db/prisma/seed.ts
```

### 2. Start Development Server

```bash
npm run dev
```

Visit http://localhost:3000

### 3. Test User IDs

After seeding, you'll have:
- **Admin**: `admin@beam.test`
- **Musician**: `musician@test.com`

To use in API routes, temporarily replace `temp-user-id` with the actual user ID from the seed output.

### 4. Testing the Full Flow

#### Step 1: Issue BEAM Coins
1. Go to `/admin/issuance`
2. Search for `musician@test.com`
3. Issue 200 BEAM with note "Test issuance"

#### Step 2: Check Wallet
1. Go to `/wallet` (you'll need to update the API route to use the test user ID)
2. Should see balance of 200 BEAM
3. Transaction history should show the issuance entry

#### Step 3: Complete Stripe Onboarding
1. In `/wallet`, click "Complete Stripe Onboarding"
2. This redirects to Stripe Connect Express onboarding
3. Complete with test data:
   - Use Stripe's test SSN: `000-00-0002`
   - Use test address: any valid US address
   - Link a test bank account (Stripe provides test account numbers)

#### Step 4: Request Redemption
1. Back in `/wallet`, enter 100 BEAM in redemption form
2. Submit redemption request
3. Check database - should see `RedemptionRequest` with status `PENDING`

#### Step 5: Approve Redemption
1. Use the admin API endpoint or create a simple admin UI button
2. POST to `/api/redemptions/approve` with `{ redemptionId: "..." }`
3. This will:
   - Debit wallet by 100 BEAM (minus 0.5% fee = 99.5 BEAM payout)
   - Create Stripe Transfer to connected account
   - Update redemption status to `COMPLETED`

#### Step 6: Verify in Stripe Dashboard
1. Go to Stripe Dashboard → Transfers (Test Mode)
2. Should see the transfer to the connected account
3. Check amount matches (99.50 USD for 100 BEAM redemption)

### 5. Testing Webhooks Locally

```bash
# Install Stripe CLI if not already installed
brew install stripe/stripe-cli/stripe  # macOS
# or download from https://stripe.com/docs/stripe-cli

# Authenticate
stripe login

# Forward webhooks to local server
stripe listen --forward-to localhost:3000/api/stripe/webhook
```

In another terminal, trigger test events:
```bash
stripe trigger transfer.paid
stripe trigger account.updated
```

### 6. Using Prisma Studio

Visual database browser:
```bash
npm run db:studio
```

This opens at http://localhost:5555 where you can:
- View all users, wallets, ledger entries, and redemptions
- Edit records directly
- Verify data integrity

### 7. Common Issues & Solutions

#### "No DATABASE_URL found"
- Create `.env` file in root directory
- Add `DATABASE_URL=postgresql://...`

#### "Prisma Client not generated"
```bash
npm run db:generate
```

#### "Table does not exist"
```bash
npm run db:migrate
```

#### "User not found" errors
- Make sure you ran the seed script
- Update API routes to use actual user IDs instead of `temp-user-id`
- Or set up authentication to get real user IDs from session

#### Stripe webhook verification fails
- Make sure `STRIPE_WEBHOOK_SECRET` matches the webhook secret from Stripe Dashboard
- When using Stripe CLI, the secret is printed when you run `stripe listen`

### 8. Test Data Reference

**Stripe Test Data:**
- Test card: `4242 4242 4242 4242`
- Test SSN: `000-00-0002`
- Test routing number: `110000000` (for US bank accounts)
- Test account number: Any 9-digit number

**Stripe Test Bank Accounts:**
Stripe provides test account numbers in their dashboard under:
Developers → Test data → Bank account numbers

### 9. Next Steps After Local Testing

1. ✅ Replace `temp-user-id` with real authentication
2. ✅ Add admin authentication middleware
3. ✅ Set up email notifications
4. ✅ Deploy to Vercel
5. ✅ Configure production Stripe webhook
6. ✅ Switch to live Stripe keys (when ready for production)

### 10. Admin API Testing

You can test admin endpoints directly with curl:

```bash
# Issue BEAM (replace USER_ID with actual ID from seed)
curl -X POST http://localhost:3000/api/admin/issuance \
  -H "Content-Type: application/json" \
  -d '{"userId":"USER_ID","amount":100,"note":"Test issuance"}'

# Approve redemption (replace REDEMPTION_ID)
curl -X POST http://localhost:3000/api/redemptions/approve \
  -H "Content-Type: application/json" \
  -d '{"redemptionId":"REDEMPTION_ID"}'
```

