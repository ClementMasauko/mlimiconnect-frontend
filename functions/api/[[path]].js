const defaultApiOrigin = "https://mlimiconnect.onrender.com";

export async function onRequest({ request, env }) {
  const incoming = new URL(request.url);
  const apiOrigin = String(env.API_ORIGIN || defaultApiOrigin).replace(/\/$/, "");
  const upstream = new URL(`${incoming.pathname}${incoming.search}`, `${apiOrigin}/`);
  const headers = new Headers(request.headers);
  headers.set("X-Forwarded-Host", incoming.host);
  headers.set("X-Forwarded-Proto", incoming.protocol.replace(":", ""));
  return fetch(new Request(upstream, { method: request.method, headers, body: request.body, redirect: "manual" }));
}
