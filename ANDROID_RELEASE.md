# Android production release

Use Play App Signing with a Google-managed app-signing key and a separate upload key. Store the upload key only in CI secrets. Never commit key files or `keystore.properties`.

Release from `android-vMAJOR.MINOR.PATCH` tags. `APP_VERSION_CODE` must increase for every Play upload and `APP_VERSION_NAME` follows SemVer. The workflow builds a signed R8-minified AAB for internal testing before staged production promotion.

Publish `/.well-known/assetlinks.json` using the SHA-256 fingerprint of the Play App Signing certificate, not the upload certificate. Verify with `adb shell pm get-app-links mw.mlimiconnect.app`.
