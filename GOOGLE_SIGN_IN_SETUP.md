# Google sign-in setup

The application uses Google Identity Services in popup mode. Google returns a signed ID token to the browser; the frontend sends it to Django, and Django verifies it before creating the existing session cookie.

## Google Cloud

1. Create or select a Google Cloud project.
2. Configure the OAuth consent screen with the MlimiConnect name, support email, homepage, privacy-policy URL, and terms URL.
3. Create an **OAuth client ID** with application type **Web application**.
4. Add these authorised JavaScript origins:
   - `http://localhost:5173`
   - `https://mlimiconnect.netlify.app`
   - Any future custom production domain
5. Popup mode does not require a redirect URI for this implementation.

## Deployment values

Use the same public Web client ID in both services:

- Netlify: `VITE_GOOGLE_CLIENT_ID`
- Render web service: `GOOGLE_CLIENT_ID`

The value ends in `.apps.googleusercontent.com`. It is a public identifier, not a client secret. Redeploy both services after setting it; deploy the backend first so the verification endpoint and database migration are ready before the button appears.

Never add a Google client secret to a `VITE_` variable or commit it to this repository.
