# MlimiConnect production readiness

The application includes production-oriented marketplace, payment reconciliation, seller fulfilment, finance ledger, durable delivery jobs, and operational controls. Public launch still requires the external approvals and deployment evidence below.

## Implemented release controls

- Canonical `/api/v1` OpenAPI schema with strict validation and generated TypeScript types.
- Server-owned checkout totals, stock reservation/expiry, per-seller fulfilment, signed payment reconciliation, balanced ledger postings, refunds, settlement release, and audited payouts.
- Transactional message outbox with retry/backoff and scheduled expiry/maintenance tasks.
- Readiness/liveness endpoints, structured privacy-filtered logs, protected-file authorization, pagination, CSP, and CI across frontend/backend/browser contracts.
- Auctions, subscriptions, expert requests, promotions, wallet, and unfinished analytics remain disabled by default.

## Before enabling payments

1. Set `VITE_PAYMENTS_ENABLED=true` only after provider sandbox and production certification, webhook-secret rotation, end-to-end refund testing, and finance sign-off are evidenced.
2. Use a licensed payment partner; do not collect or hold customer funds in the frontend.
3. Verify production session cookies are `HttpOnly`, `Secure`, and use an appropriate `SameSite` policy; verify CSRF protection on every state-changing route.
4. Enforce authentication and role/ownership permissions on every API route. Frontend route guards are not authorization.
5. Sync and validate the production infrastructure blueprint, configure all secrets, confirm the paid database has point-in-time recovery, and complete a restore drill.
6. Apply migrations so the demo-data cleanup runs, then verify no demo inventory is publicly active.

## Public traceability contract

- `GET /api/traceability/verify/{batch_code}/` is unauthenticated and returns the batch's approved public verification record.
- Public codes must be unguessable or rate-limited. Never expose private user contacts, exact private farm coordinates, internal notes, payment data, or unpublished documents.

## Pilot launch

Start with one region and a small set of verified farmers and buyers. Manually monitor fulfilment, payment reconciliation, delivery outcomes, and disputes before widening access.

## External release gates

- Independent fluent Chichewa review recorded in `CHICHEWA_REVIEW.md`.
- Physical-device and Malawi-network results recorded in `REAL_DEVICE_PILOT.md`.
- Qualified legal approval of the operating entity, privacy notice, terms, fees, refunds, retention, and complaints process.
- Play Console Data Safety/permission declarations, app signing, asset links, internal-track testing, and staged rollout completed by an authorised account owner.
- Production provider credentials, DNS, monitoring destinations, incident contacts, backup evidence, and recovery drill recorded by operations.
