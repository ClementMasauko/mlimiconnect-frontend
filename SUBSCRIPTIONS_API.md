# Subscription payment API

The browser must never activate a paid feature by itself. The backend is the source of truth for subscription access and payment status.

## Required endpoints

`POST /api/subscriptions/checkout-sessions/`

Accept `plan_id` (`farmer-plus`, `buyer-pro`, `cooperative`, `organization`, or `enterprise`), `billing_cycle` (`monthly` or `annual`), and `payment_method` (`airtel_money`, `tnm_mpamba`, `bank_transfer`, `card`, or `invoice`). Return a provider checkout URL or payment reference. Invoice is restricted to verified organizations with approved billing contacts. Enterprise pricing must come from a server-side quote.

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

## Account and entitlement model

Store these independently:

- Trading capabilities: `can_buy`, `can_sell`.
- Legal account type: `individual`, `cooperative`, `company`, `ngo`, `government`, or `institution`.
- Subscription plan and status.
- Organization verification, staff roles, branches, billing contacts, seats and member limits.

The profile response should embed the active subscription, but every protected API must enforce entitlement again on the server.

## Advisory access

- Free: 5 AI advisory requests monthly.
- Farmer Plus: unlimited AI and 1 expert credit monthly.
- Cooperative: 3 expert credits monthly.
- Organization: 5 expert credits monthly.
- Enterprise: 10 expert credits or the contracted allowance.
- Institutional reports require a verified NGO, government or institution on Organization or Enterprise.

Required endpoints: `POST /api/advisory/ai/`, `GET /api/advisory/usage/`, `GET /api/advisory/experts/`, and `POST /api/advisory/expert-consultations/`. Meter usage and consultation credits on the server.
