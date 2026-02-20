import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:8000",
  headers: {
    "Content-Type": "application/json",
  },
});

// Add auth token to requests if present
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("access_token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Response interceptor: if 401, try to refresh token once and retry original request
let isRefreshing = false;
let refreshSubscribers = [];

function onRefreshed(token) {
  refreshSubscribers.map((cb) => cb(token));
}

function addRefreshSubscriber(cb) {
  refreshSubscribers.push(cb);
}

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (!originalRequest) return Promise.reject(error);

    // Only attempt once
    if (error.response && error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        if (isRefreshing) {
          // wait for refresh to finish
          return new Promise((resolve, reject) => {
            addRefreshSubscriber((token) => {
              originalRequest.headers.Authorization = `Bearer ${token}`;
              resolve(api(originalRequest));
            });
          });
        }

        isRefreshing = true;
        const refresh_token = localStorage.getItem("refresh_token");
        if (!refresh_token) throw error;

        // call refresh endpoint
        const { default: authService } = await import("./authService");
        const tokenResp = await authService.refresh({ refresh_token });
        if (tokenResp?.access_token) {
          localStorage.setItem("access_token", tokenResp.access_token);
          if (tokenResp.refresh_token) localStorage.setItem("refresh_token", tokenResp.refresh_token);
          originalRequest.headers.Authorization = `Bearer ${tokenResp.access_token}`;
          onRefreshed(tokenResp.access_token);
          refreshSubscribers = [];
          isRefreshing = false;
          return api(originalRequest);
        }
        isRefreshing = false;
        return Promise.reject(error);
      } catch (e) {
        isRefreshing = false;
        // clear tokens and redirect to login maybe
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        return Promise.reject(e);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
