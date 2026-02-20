import React, { createContext, useState, useEffect } from "react";
import { getMe, login as authLogin, logout as authLogout } from "../services/authService";

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initialize = async () => {
      try {
        const token = localStorage.getItem("access_token");
        if (!token) {
          setUser(null);
          return;
        }

        const me = await getMe();
        // backend returns UserResponse object
        setUser(me);
      } catch (err) {
        // token invalid or request failed
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    initialize();
  }, []);

  const login = async (credentials) => {
    const data = await authLogin(credentials);
    // authService stores tokens in localStorage and returns user
    setUser(data.user);
    return data;
  };

  const register = async (payload) => {
    const data = await authLogin.register ? await authLogin.register(payload) : null;
    // prefer using authService.register if available
    return data;
  };

  const logout = async () => {
    try {
      await authLogout();
    } catch (e) {
      // ignore
    }
    setUser(null);
  };

  const isAuthenticated = !!user;

  return (
    <AuthContext.Provider value={{ user, loading, isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
