# Cloudflare Pages deployment

This project keeps Netlify configuration intact while providing an independent Cloudflare Pages production deployment. The Pages Function under `functions/api/` proxies browser API requests to Render so session and CSRF cookies remain first-party on the frontend hostname.

## One-time Cloudflare setup

1. In **Workers & Pages**, create a Pages project using **Direct Upload**. Use the same name you will store in `CLOUDFLARE_PAGES_PROJECT`.
2. Create a Cloudflare API token with **Account / Cloudflare Pages / Edit** for the relevant account.
3. In the GitHub frontend repository, create these Actions secrets:
   - `CLOUDFLARE_API_TOKEN`
   - `CLOUDFLARE_ACCOUNT_ID`
4. Create these Actions variables:
   - `CLOUDFLARE_PAGES_PROJECT` — the Pages project name
   - `VITE_GOOGLE_CLIENT_ID` — the existing Google OAuth web client ID
5. In the Pages project settings, add `API_ORIGIN=https://mlimiconnect.onrender.com` for Production. The function has the same safe default, but the variable makes future migrations explicit.
6. Push to `main` or manually run **Deploy Cloudflare Pages**. The workflow tests, builds, deploys, and checks both the HTML application and proxied API.

## Authentication domain change

Before directing users to the Pages hostname, add that exact HTTPS origin to Django's `CSRF_TRUSTED_ORIGINS` and `CORS_ALLOWED_ORIGINS`. Set `PASSKEY_RP_ID` to the permanent frontend hostname and `PASSKEY_ORIGINS` to the exact HTTPS origin. Existing passkeys are scoped to their original relying-party domain, so choose the permanent custom domain before inviting users to create passkeys.

## Rollback

Cloudflare retains previous Pages deployments. In **Workers & Pages → project → Deployments**, select the last verified deployment and choose **Rollback to this deployment**. After rollback, verify `/`, `/login`, `/api/status/`, and one authenticated non-financial flow.
