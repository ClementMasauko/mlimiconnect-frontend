type WebAuthnOptions = Record<string, unknown> & { challenge: string; user?: { id: string }; excludeCredentials?: Array<{ id: string }>; allowCredentials?: Array<{ id: string }> };

const decode = (value: string) => {
  const normalized = value.replace(/-/g, "+").replace(/_/g, "/").padEnd(Math.ceil(value.length / 4) * 4, "=");
  return Uint8Array.from(atob(normalized), character => character.charCodeAt(0));
};
const encode = (value: ArrayBuffer) => btoa(String.fromCharCode(...new Uint8Array(value))).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");

export const browserSupportsPasskeys = () => window.isSecureContext && "PublicKeyCredential" in window && !!navigator.credentials;

const prepare = (options: WebAuthnOptions): PublicKeyCredentialCreationOptions | PublicKeyCredentialRequestOptions => ({
  ...options,
  challenge: decode(options.challenge),
  ...(options.user ? { user: { ...options.user, id: decode(options.user.id) } } : {}),
  ...(options.excludeCredentials ? { excludeCredentials: options.excludeCredentials.map(item => ({ ...item, id: decode(item.id) })) } : {}),
  ...(options.allowCredentials ? { allowCredentials: options.allowCredentials.map(item => ({ ...item, id: decode(item.id) })) } : {}),
} as PublicKeyCredentialCreationOptions | PublicKeyCredentialRequestOptions);

const serialize = (credential: PublicKeyCredential) => {
  const response = credential.response;
  if (response instanceof AuthenticatorAttestationResponse) return { id: credential.id, rawId: encode(credential.rawId), type: credential.type, response: { clientDataJSON: encode(response.clientDataJSON), attestationObject: encode(response.attestationObject), transports: response.getTransports?.() || [] }, clientExtensionResults: credential.getClientExtensionResults() };
  const assertion = response as AuthenticatorAssertionResponse;
  return { id: credential.id, rawId: encode(credential.rawId), type: credential.type, response: { clientDataJSON: encode(assertion.clientDataJSON), authenticatorData: encode(assertion.authenticatorData), signature: encode(assertion.signature), userHandle: assertion.userHandle ? encode(assertion.userHandle) : null }, clientExtensionResults: credential.getClientExtensionResults() };
};

export const createPasskey = async (options: WebAuthnOptions) => {
  const credential = await navigator.credentials.create({ publicKey: prepare(options) as PublicKeyCredentialCreationOptions });
  if (!(credential instanceof PublicKeyCredential)) throw new Error("Passkey creation was cancelled.");
  return serialize(credential);
};
export const getPasskey = async (options: WebAuthnOptions) => {
  const credential = await navigator.credentials.get({ publicKey: prepare(options) as PublicKeyCredentialRequestOptions });
  if (!(credential instanceof PublicKeyCredential)) throw new Error("Passkey sign-in was cancelled.");
  return serialize(credential);
};
