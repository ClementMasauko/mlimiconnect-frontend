import { useEffect, useRef, useState } from "react";

type GoogleCredentialResponse = { credential: string };
type GoogleIdentityApi = {
  accounts: { id: {
    initialize: (options: { client_id: string; callback: (response: GoogleCredentialResponse) => void }) => void;
    renderButton: (element: HTMLElement, options: Record<string, string | number>) => void;
    disableAutoSelect: () => void;
  } };
};

declare global {
  interface Window { google?: GoogleIdentityApi }
}

const scriptId = "google-identity-services";

function loadGoogleIdentity(): Promise<GoogleIdentityApi> {
  if (window.google) return Promise.resolve(window.google);
  return new Promise((resolve, reject) => {
    const finish = () => window.google ? resolve(window.google) : reject(new Error("Google sign-in did not load."));
    const existing = document.getElementById(scriptId) as HTMLScriptElement | null;
    if (existing) {
      existing.addEventListener("load", finish, { once: true });
      existing.addEventListener("error", () => reject(new Error("Google sign-in could not be loaded.")), { once: true });
      return;
    }
    const script = document.createElement("script");
    script.id = scriptId;
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;
    script.onload = finish;
    script.onerror = () => reject(new Error("Google sign-in could not be loaded."));
    document.head.appendChild(script);
  });
}

export default function GoogleSignInButton({ clientId, onCredential, onError }: {
  clientId: string;
  onCredential: (credential: string) => void;
  onError: (message: string) => void;
}) {
  const container = useRef<HTMLDivElement>(null);
  const credentialHandler = useRef(onCredential);
  const errorHandler = useRef(onError);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    credentialHandler.current = onCredential;
    errorHandler.current = onError;
  }, [onCredential, onError]);

  useEffect(() => {
    let active = true;
    void loadGoogleIdentity().then(google => {
      if (!active || !container.current) return;
      google.accounts.id.initialize({ client_id: clientId, callback: response => credentialHandler.current(response.credential) });
      container.current.replaceChildren();
      google.accounts.id.renderButton(container.current, {
        type: "standard", theme: "outline", size: "large", text: "continue_with",
        shape: "rectangular", logo_alignment: "left",
        width: Math.min(400, Math.max(240, container.current.clientWidth)),
      });
      setLoading(false);
    }).catch(error => {
      if (!active) return;
      setLoading(false);
      errorHandler.current(error instanceof Error ? error.message : "Google sign-in could not be loaded.");
    });
    return () => { active = false; };
  }, [clientId]);

  return <div className="min-h-11 w-full" aria-busy={loading}>
    {loading && <div className="h-11 w-full animate-pulse rounded-md bg-slate-100 dark:bg-slate-800" role="status" aria-label="Loading Google sign-in" />}
    <div ref={container} className="flex w-full justify-center" />
  </div>;
}
