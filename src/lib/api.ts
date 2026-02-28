// src/lib/api.ts
import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:8000",
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Attach access token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("mc_access");
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle 401 → try to refresh token
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Prevent infinite loop & check if refresh token exists
    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      localStorage.getItem("mc_refresh")
    ) {
      originalRequest._retry = true;

      try {
        // Use plain axios to avoid recursion
        const refreshResponse = await axios.post(
          `${api.defaults.baseURL}/api/auth/token/refresh/`,
          {
            refresh: localStorage.getItem("mc_refresh"),
          }
        );

        const newAccessToken = refreshResponse.data.access;

        // Update storage and headers
        localStorage.setItem("mc_access", newAccessToken);
        api.defaults.headers.common["Authorization"] = `Bearer ${newAccessToken}`;
        originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;

        // Retry original request with new token
        return api(originalRequest);
      } catch (refreshError) {
        console.error("Token refresh failed:", refreshError);

        // Clean up and force logout
        localStorage.removeItem("mc_access");
        localStorage.removeItem("mc_refresh");
        localStorage.removeItem("mc_user");

        // Redirect to login with reason
        window.location.href = "/login?reason=session_expired";
        return Promise.reject(refreshError);
      }
    }

    // For all other errors, just reject
    return Promise.reject(error);
  }
);

export default api;