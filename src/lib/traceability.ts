export function extractPublicTraceabilityCode(value: string) {
  const trimmed = value.trim();
  if (!trimmed) return "";
  try {
    const url = new URL(trimmed);
    return url.searchParams.get("product") || url.pathname.split("/").filter(Boolean).at(-1) || "";
  } catch {
    return trimmed.slice(0, 120);
  }
}

export function publicTraceabilityUrl(code: string, origin = window.location.origin) {
  return new URL(`/verify/${encodeURIComponent(extractPublicTraceabilityCode(code))}`, origin).toString();
}
