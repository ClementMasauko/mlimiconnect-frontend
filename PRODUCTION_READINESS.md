# MlimiConnect production readiness

The frontend now builds, but payments, orders, listings, and user data must not go live until the API and operating controls below are complete.

## Required API contracts

- `POST /api/marketplace/listings/` accepts multipart form data: `name`, `description`, `price`, `quantity`, `category`, and optional `image`. It returns the created listing.
- `POST /api/marketplace/checkout/` accepts `payment_method` (`airtel_money` or `tnm_mpamba`). It creates a pending order and initiates a payment request; it must never mark an order paid at this stage.
- A server-side, signed provider webhook verifies payment and atomically updates the pending order. The client must read the resulting order status from the API.

## Before enabling payments

1. Set `VITE_PAYMENTS_ENABLED=true` only after the payment API, webhook signature verification, idempotency, refunds, reconciliation, and provider sandbox tests are complete.
2. Use a licensed payment partner; do not collect or hold customer funds in the frontend.
3. Replace the current browser-token approach with secure `HttpOnly`, `Secure`, `SameSite` cookies once the API supports cookie authentication.
4. Enforce authentication and role/ownership permissions on every API route. Frontend route guards are not authorization.
5. Configure HTTPS, production CORS, secrets, database backups, audit logs, error monitoring, and an incident contact.
6. Replace all marketplace, order, wallet, messaging, traceability, and advisory mock data before inviting public users.

## Pilot launch

Start with one region and a small set of verified farmers and buyers. Manually monitor fulfilment, payment reconciliation, delivery outcomes, and disputes before widening access.
