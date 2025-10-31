# TODO

## Critical - Authentication & Security

- [ ] **Replace `temp-user-id` placeholder with real authentication**
  - [ ] Implement authentication solution (Firebase Auth, NextAuth, or other)
  - [ ] Replace `temp-user-id` in `/api/user/route.ts`
  - [ ] Replace `temp-user-id` in `/api/wallet/route.ts`
  - [ ] Replace `temp-user-id` in `/api/ledger/route.ts`
  - [ ] Replace `temp-user-id` in `/api/redemptions/route.ts`
  - [ ] Replace `temp-user-id` in `/api/payouts/onboard/route.ts`
  - [ ] Update all API routes to extract user ID from session/token

- [ ] **Add admin authentication middleware**
  - [ ] Secure `/api/admin/users` route
  - [ ] Secure `/api/admin/issuance` route
  - [ ] Secure `/api/redemptions/approve` route
  - [ ] Implement admin role management in database schema
  - [ ] Add role-based access control (RBAC)

## Important - Production Readiness

- [ ] **Set up authentication**
  - [ ] Choose and configure auth provider (Firebase Auth recommended)
  - [ ] Set up authentication middleware for API routes
  - [ ] Implement session management

- [ ] **Implement proper error handling**
  - [ ] Add consistent error response format
  - [ ] Add error logging/monitoring
  - [ ] Add user-friendly error messages

- [ ] **Add email notifications**
  - [ ] Email on redemption request
  - [ ] Email on redemption approval/completion
  - [ ] Email on Stripe account issues

- [ ] **Set up monitoring and logging**
  - [ ] Configure application monitoring (Sentry, LogRocket, etc.)
  - [ ] Set up structured logging
  - [ ] Add error tracking and alerts

## Testing & Quality

- [ ] **Add unit/integration tests**
  - [ ] API route tests
  - [ ] Database operation tests
  - [ ] Stripe integration tests
  - [ ] Authentication flow tests

## Deployment & Operations

- [ ] **Initial Git setup**
  - [ ] Stage all files: `git add .`
  - [ ] Make initial commit: `git commit -m "Initial commit"`
  - [ ] (Optional) Set up git user config if needed

- [ ] **Deploy to Vercel**
  - [ ] Connect GitHub repo to Vercel
  - [ ] Add all environment variables in Vercel dashboard
  - [ ] Configure build settings
  - [ ] Set up database (Supabase recommended)

- [ ] **Configure production Stripe webhook**
  - [ ] Create webhook endpoint in Stripe Dashboard
  - [ ] Add production webhook secret to environment variables
  - [ ] Test webhook events in production

- [ ] **Switch to live Stripe keys** (when ready for production)
  - [ ] Replace test keys with production keys
  - [ ] Update environment variables
  - [ ] Test with live mode

## Nice to Have

- [ ] Add rate limiting to API routes
- [ ] Add request validation middleware
- [ ] Add API documentation (Swagger/OpenAPI)
- [ ] Add admin dashboard UI for managing redemptions
- [ ] Add user profile management
- [ ] Add transaction history pagination
- [ ] Add export functionality for admin reports

