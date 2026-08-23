# MlimiConnect

MlimiConnect is a React/Vite marketplace for Malawi's agricultural ecosystem, with a companion Express USSD service.

## Marketplace experience updates

The interface has been upgraded to a unified, professional marketplace experience inspired by established online-marketplace patterns while retaining MlimiConnect branding and agricultural focus.

### Public experience

- The landing page now includes a clear marketplace hero, product categories, trust indicators, and a **public featured-products preview**. Visitors can see product images, prices, quantities, locations, and verified-farm badges before creating an account.
- Public information pages (`About`, `Contact`, `FAQ`, `Support`, `Pricing`, `Blog`, and legal pages) now use the shared public navigation and footer.
- The sign-in and registration journey uses a branded split-screen account experience with clear value propositions and account-security messaging.

### Marketplace and purchase flow

- The authenticated marketplace has a retail-style utility header, marketplace search, category navigation, cart count, and account controls.
- Product browsing uses richer product cards: imagery, price, unit, seller/location details, ratings, verification status, saved-item controls, and direct cart actions.
- Product detail pages now include stock, seller information, reviews, quantity controls, secure-order messaging, and add-to-cart behavior that preserves the selected quantity.
- Cart pages include item controls, order summary, subtotal, checkout call-to-action, and secure-payment messaging.
- Checkout keeps payment selection and discounts separate from order totals. Payments remain disabled unless `VITE_PAYMENTS_ENABLED=true` and the supporting server workflow is complete.

### Account and workspace

- Main application, admin, and public page shells share typography, form fields, tables, panels, actions, spacing, dark mode, and responsive styling.
- Account preferences provide language, dark-mode, low-data-mode, install-app, sign-out, and deletion-management controls.
- Notification preferences are grouped by Email, SMS, and Push channels with a save action.
- The notifications centre presents a readable inbox-style list with unread states, categories, mark-all-read, and a shortcut to notification preferences.

### Revenue model

The platform uses transparent, opt-in revenue mechanisms:

- **Settled-order commission:** 3.5% platform commission, recognized only after a successful settled order. Mobile-money/processing costs are tracked separately in the admin revenue view.
- **Optional subscriptions:** Farmer Plus and Buyer Pro plans provide advanced visibility, analytics, sourcing, and support tools.
- **Promoted listings:** Farmers can request an optional promoted-listing campaign, starting from MWK 1,500. Full price and duration must be confirmed before payment when campaign billing is connected.
- Buyer access is not charged by these seller tools. Subscription and promotion requests currently remain pending requests until server-side payment and entitlement APIs are connected.

### Key implementation files

- `src/components/Navbar.tsx` — shared marketplace header and search controls.
- `src/components/ui/Footer.tsx` — shared marketplace footer.
- `src/layouts/MainLayout.tsx`, `src/layouts/PublicLayout.tsx`, and `src/layouts/AdminLayout.tsx` — unified page shells.
- `src/pages/LandingPage.tsx` — public marketplace preview.
- `src/pages/marketplace/` — catalog, product detail, cart, checkout, search, and farm-input flows.
- `src/pages/profile/` and `src/pages/notifications/` — account and notification experiences.
- `src/pages/Pricing.tsx`, `src/pages/Subscription.tsx`, and `src/pages/admin/Revenue.tsx` — revenue and plan experience.

### Validation status

After these updates, `npm.cmd run check` has completed successfully (TypeScript validation and the Vite production build).

## Local development

1. In the sibling `backend` folder, follow its `README.md`, migrate the database, and run Django on port 8000.
2. Copy `.env.example` to `.env`; keep `VITE_API_URL=http://localhost:8000`, payments disabled, and demo flags false for real API data.
3. Run `npm.cmd install` and `npm.cmd run dev`.
4. Run `npm.cmd run check` for TypeScript, ESLint, frontend tests, and the production build.

Authentication now uses a server-owned `HttpOnly` session cookie with CSRF protection. The browser no longer stores access or refresh tokens. Set `VITE_DEMO_DATA_ENABLED=true` only when intentionally presenting the seeded prototype catalog without the backend.

## English and Chichewa

The application uses `react-i18next`; the language selector is available in the main header, authentication pages, and account settings. Selection persists under `mc_language`, updates the HTML `lang` attribute, and falls back to English. Add every new user-facing key to both `src/i18n/en.json` and `src/i18n/ny.json`, use `useTranslation()` instead of hard-coded JSX text, and run `npm.cmd run i18n:check` to enforce parity.

## Install on a phone (PWA demo)

The app includes an install manifest and service worker. Build and publish the `dist` folder to any HTTPS host (for example Vercel, Netlify, or your configured Nginx server). Open the published **HTTPS** URL on the phone:

- **Android / Chrome:** tap **Install app** in the top bar or Settings. If the browser does not show the prompt, open Chrome's three-dot menu and choose **Install app** / **Add to Home screen**.
- **iPhone / Safari:** tap Share, then **Add to Home Screen**.

An IP address from `npm.cmd run dev -- --host` is useful for testing the layout on a phone, but browsers require HTTPS before they allow installation outside `localhost`.

## Android APK

Capacitor Android is included in the `android/` folder. To build a debug APK, install Android Studio with an Android SDK and a supported JDK, then run:

```powershell
npm.cmd run android:apk
```

The output will be `android/app/build/outputs/apk/debug/app-debug.apk`. For a Play Store or customer release, use Android Studio to create a signed release APK/AAB with your own keystore; do not distribute a debug APK as a production app.

### Sending an installable file to Android

A PWA is a website and cannot be installed by copying its `dist` folder over Bluetooth; publish it over HTTPS and install it from the browser. To send the app by Bluetooth, build a **signed Android APK** and copy that `.apk` file to the phone. The recipient must allow installation from the Bluetooth/file-manager app when Android asks. Install a JDK (17 or newer), configure `JAVA_HOME`, and use Android Studio to create a signed release build before sharing it.

## USSD service

1. Copy `ussd-service/.env.example` to `ussd-service/.env` and configure all values.
2. Run `npm.cmd install` in `ussd-service`, then `npm.cmd run dev`.
3. Configure Africa's Talking to POST to `/ussd` and use `/health` for health checks.

The USSD service requires an API endpoint at `POST /api/ussd/authenticate` which receives `{ phone, pin }` and returns `{ authenticated: boolean }`. It intentionally rejects PIN attempts when this endpoint is absent or unavailable.

The Django backend now provides this endpoint. Set the same long random `USSD_SERVICE_KEY` in both services, ensure the user's phone is stored in `+265...` format, then create a hashed PIN with `py manage.py set_ussd_pin <username-or-phone> <4-digit-pin>`. The USSD service uses phone-level lockout and safely replays identical responses when the provider retries a callback.

## Security notes

The frontend guards routes for user experience, but the API must independently enforce authentication and role permissions. Move browser tokens to secure `HttpOnly` cookies when the API supports cookie-based authentication.

## Tests

Run `npm.cmd test` within `ussd-service` to test USSD language selection, authentication, and lockout behavior.

## CI and deployment

GitHub Actions in `.github/workflows/ci.yml` runs frontend type-checking/building and USSD tests on every push and pull request. The included `Dockerfile` files build deployable frontend and USSD images. Configure HTTPS, `VITE_API_URL`, `AUTH_API_URL`, Redis credentials, and API-side CORS/authorization in your hosting environment; never commit `.env` files.

For monitoring, set up an error-monitoring provider in the deployment account and expose only its public client identifier as `VITE_SENTRY_DSN` (or the equivalent provider value). Server-side credentials must remain deployment secrets.
