# Play Store privacy and permission declarations

This is the source-of-truth worksheet for the final Play Console submission. A release owner must compare it with the exact production build and provider contracts before submitting; source code cannot submit or attest to the Play form.

## Android permissions

| Permission | Purpose shown to the user | Collection rule |
| --- | --- | --- |
| Camera | Photograph a listing, crop diagnosis, traceability record, delivery evidence, or livestock document after a user action | Foreground only; no continuous capture |
| Approximate/precise location | Select delivery points, calculate distance, locate nearby listings, or add traceability location after a user action | Foreground only; no background-location permission |
| Internet | Connect to MlimiConnect and configured service providers | TLS only in release builds |

Manual entry must remain available where the feature can operate without a denied permission. The manifest does not request contacts, advertising ID, microphone, background location, SMS reading, or storage-wide access.

## Data Safety answers to verify

- Account data: username, email, phone, general location, role, and organisation information.
- User content: listing text/images, messages, uploaded verification/evidence documents, crop photographs sent with explicit diagnosis consent, and support requests.
- Transactions: orders, provider references, refunds, commissions, settlements, and payout records; the app must not claim it stores payment credentials.
- Location: approximate or precise location only for user-requested marketplace, delivery, weather, or traceability functions; not for advertising.
- Diagnostics: privacy-filtered crash and performance data when Sentry is configured; request bodies, credentials, full contacts, photographs, and coordinates are excluded by configuration.
- Security: data is encrypted in transit; account deletion is available in authenticated settings and public instructions are at `/account-deletion`.
- Advertising: no advertising SDK or ad-personalisation use is declared by this build.

Before submission, enter the final privacy-policy URL, public account-deletion URL, support contact, data-retention answers, and every third-party processor used by the deployed environment. Save a dated export or screenshot of the submitted declaration with the release evidence.
