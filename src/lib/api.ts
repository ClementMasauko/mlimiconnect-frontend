import axios, { AxiosError, type InternalAxiosRequestConfig } from "axios";

const api = axios.create({ baseURL: import.meta.env.VITE_API_URL || "http://localhost:8000", withCredentials: true, headers: { "Content-Type": "application/json" } });
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
  const detail = (error.response?.data as { detail?: string } | undefined)?.detail;
  if (error.response?.status === 401 || (error.response?.status === 403 && detail === "Authentication credentials were not provided.")) window.dispatchEvent(new CustomEvent("mc:session-expired"));
  return Promise.reject(error);
});

export function getApiError(error: unknown, fallback: string) {
  if (!axios.isAxiosError(error)) return error instanceof Error ? error.message : fallback;
  const data = error.response?.data as { detail?: string; non_field_errors?: string[] } | undefined;
  return data?.detail || data?.non_field_errors?.[0] || error.message || fallback;
}

export default api;
