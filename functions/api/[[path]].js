const DEFAULT_API_ORIGIN = "https://mlimiconnect.onrender.com";

export async function onRequest(context) {
  const incoming = new URL(context.request.url);
  const apiOrigin = String(context.env.API_ORIGIN || DEFAULT_API_ORIGIN).replace(/\/$/, "");
  const target = new URL(`${incoming.pathname}${incoming.search}`, apiOrigin);
  const headers = new Headers(context.request.headers);
  headers.delete("host");
  headers.delete("cf-connecting-ip");
  headers.set("x-forwarded-host", incoming.host);
  headers.set("x-forwarded-proto", incoming.protocol.replace(":", ""));
  const upstreamRequest = new Request(target, { method: context.request.method, headers, body: ["GET", "HEAD"].includes(context.request.method) ? undefined : context.request.body, redirect: "manual" });
  return fetch(upstreamRequest);
}
