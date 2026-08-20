# Subscription payment API

The browser must never activate a paid feature by itself. The backend is the source of truth for subscription access and payment status.

## Required endpoints

`POST /api/subscriptions/checkout-sessions/`

Accept `{ "plan_id": "farmer-plus" | "buyer-pro", "payment_method": "airtel_money" | "tnm_mpamba" }` and return a provider checkout URL or mobile-money payment reference.

`GET /api/subscriptions/me/`

Return the customer's active plan, status (`pending_payment`, `active`, `cancelled`, `past_due`), expiry date and enabled features.

`POST /api/subscriptions/cancel/`

Cancel renewal without removing access already paid for.

## Payment and access rules

1. Create a pending subscription only after validating the authenticated user's role and selected plan.
2. Verify payment-provider callbacks on the server; do not trust a browser success message.
3. Mark the plan active only after a verified callback, then store a ledger entry in the project account.
4. Enforce each premium feature from the API using the active plan, not from a React-only check.
5. Record gross subscription payment, provider fee, tax (if applicable), and net project income separately from marketplace commissions.
