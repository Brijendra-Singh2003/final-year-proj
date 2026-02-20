import api from "./api";

export const login = async ({ email, password }) => {
  const res = await api.post("/api/auth/login", { email, password });
  const { tokens, user } = res.data;
  if (tokens?.access_token) {
    localStorage.setItem("access_token", tokens.access_token);
    localStorage.setItem("refresh_token", tokens.refresh_token);
  }
  return { user, tokens };
};

export const register = async (payload) => {
  const res = await api.post("/api/auth/register", payload);
  const { tokens, user } = res.data;
  if (tokens?.access_token) {
    localStorage.setItem("access_token", tokens.access_token);
    localStorage.setItem("refresh_token", tokens.refresh_token);
  }
  return { user, tokens };
};

export const getMe = async () => {
  const res = await api.get("/api/auth/me");
  return res.data;
};

export const refresh = async ({ refresh_token }) => {
  const res = await api.post("/api/auth/refresh", { refresh_token });
  // response is TokenResponse with access_token, refresh_token, expires_in
  const data = res.data;
  // normalize field names (backend uses access_token)
  return data;
};

export const logout = async () => {
  try {
    await api.post("/api/auth/logout");
  } finally {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
  }
};
