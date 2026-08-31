import axios, { AxiosError, type InternalAxiosRequestConfig } from "axios";
import { ApiErrorResponseSchema } from "../generated/schemas";

const apiBaseUrl = import.meta.env.VITE_API_URL || (import.meta.env.DEV ? "http://localhost:8000" : window.location.origin);
const api = axios.create({ baseURL: apiBaseUrl, withCredentials: true, headers: { "Content-Type": "application/json" } });
let csrfToken: string | null = null;

async function ensureCsrfToken() {
  if (csrfToken) return csrfToken;
  const { data } = await axios.get<{ csrfToken: string }>(`${api.defaults.baseURL}/api/csrf/`, { withCredentials: true });
  csrfToken = data.csrfToken;
  return csrfToken;
}

api.interceptors.request.use(async (config: InternalAxiosRequestConfig) => {
  const method = config.method?.toLowerCase();
  if (method && !["get", "head", "options"].includes(method)) config.headers.set("X-CSRFToken", await ensureCsrfToken());
  return config;
});

api.interceptors.response.use(response => response, (error: AxiosError) => {
  const parsed = ApiErrorResponseSchema.safeParse(error.response?.data);
  const detail = parsed.success ? parsed.data.detail : undefined;
  if (error.response?.status === 401 || (error.response?.status === 403 && detail === "Authentication credentials were not provided.")) window.dispatchEvent(new CustomEvent("mc:session-expired"));
  return Promise.reject(error);
});

export function getApiError(error: unknown, fallback: string) {
  if (!axios.isAxiosError(error)) return error instanceof Error ? error.message : fallback;
  const parsed = ApiErrorResponseSchema.safeParse(error.response?.data);
  if (parsed.success) return parsed.data.error?.message || parsed.data.detail || fallback;
  return error.message || fallback;
}

export default api;
