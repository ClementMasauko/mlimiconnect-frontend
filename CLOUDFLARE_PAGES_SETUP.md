# Cloudflare Pages fallback

This repository can be deployed to Cloudflare Pages if Netlify production deploys are paused.

1. Import the existing GitHub frontend repository in **Workers & Pages → Create application → Pages**.
2. Set the build command to `npm run build` and the output directory to `dist`.
3. Add `VITE_GOOGLE_CLIENT_ID` with the same Google OAuth web client ID used by Netlify.
4. Add `VITE_APP_VERSION` using the deployment commit SHA when the build system does not supply it.
5. Optionally set the Pages Function variable `API_ORIGIN`; it defaults to `https://mlimiconnect.onrender.com`.
6. Add the new `https://<project>.pages.dev` origin to Django's `CORS_ALLOWED_ORIGINS` and `CSRF_TRUSTED_ORIGINS`, and add it to the Google OAuth authorized JavaScript origins.
7. Test login, logout, Google sign-in, account deletion, uploads, and a write request before moving the custom domain.

The catch-all Pages Function under `functions/api/` keeps authentication same-origin by forwarding `/api/*` to Django. Cloudflare Pages serves this React application as an SPA by default; `public/_headers` applies the production security headers to static responses.

Official references: https://developers.cloudflare.com/pages/framework-guides/deploy-a-react-site/ and https://developers.cloudflare.com/pages/functions/routing/
