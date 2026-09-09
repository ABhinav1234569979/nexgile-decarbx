import React, { createContext, useContext, useState } from "react";
import api from "../api/axios.js";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem("decarbx_user");
    return stored ? JSON.parse(stored) : null;
  });

  const login = async (email, password) => {
    const res = await api.post("/auth/login", { email, password });
    localStorage.setItem("decarbx_token", res.data.token);
    localStorage.setItem("decarbx_user", JSON.stringify(res.data.user));
    setUser(res.data.user);
    return res.data.user;
  };

  const logout = () => {
    localStorage.removeItem("decarbx_token");
    localStorage.removeItem("decarbx_user");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}

// Role names must match backend/middleware/authorize.js exactly.
export const ROLES = {
  ADMIN: "Admin",
  MANAGER: "Sustainability Manager",
  ANALYST: "Analyst",
};

// Mirrors backend/middleware/authorize.js's CAN_MANAGE — used purely for
// UI affordances (hiding buttons an Analyst's request would be rejected for
// anyway). The backend is the actual source of truth for permissions.
export function useCanManage() {
  const { user } = useAuth();
  return user?.role === ROLES.ADMIN || user?.role === ROLES.MANAGER;
}
