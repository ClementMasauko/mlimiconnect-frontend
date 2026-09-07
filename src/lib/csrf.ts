export function csrfTokenFromCookie(cookieHeader: string): string | null {
  const prefix = "csrftoken=";
  const value = cookieHeader
    .split(";")
    .map(cookie => cookie.trim())
    .find(cookie => cookie.startsWith(prefix))
    ?.slice(prefix.length);

  if (!value) return null;
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
}

export function isCsrfFailure(status: number | undefined, payload: unknown): boolean {
  if (status !== 403 || !payload || typeof payload !== "object") return false;
  const response = payload as { detail?: unknown; error?: { message?: unknown } };
  const message = typeof response.detail === "string"
    ? response.detail
    : typeof response.error?.message === "string"
      ? response.error.message
      : "";
  return message.toLowerCase().startsWith("csrf failed:");
}
