import { createContext, useContext, useMemo, useState } from "react";
import api from "../api/axios.js";

const AuthContext = createContext(null);

const getStoredAuth = () => JSON.parse(localStorage.getItem("codealpha_auth") || "null");

export function AuthProvider({ children }) {
  const [auth, setAuth] = useState(getStoredAuth);

  const persistAuth = (payload) => {
    setAuth(payload);
    localStorage.setItem("codealpha_auth", JSON.stringify(payload));
  };

  const register = async (form) => {
    const { data } = await api.post("/auth/register", form);
    persistAuth(data);
    return data;
  };

  const login = async (form) => {
    const { data } = await api.post("/auth/login", form);
    persistAuth(data);
    return data;
  };

  const updateProfile = async (form) => {
    const { data } = await api.put("/users/profile", form);
    const nextAuth = { ...auth, user: data.user };
    persistAuth(nextAuth);
    return data;
  };

  const logout = () => {
    setAuth(null);
    localStorage.removeItem("codealpha_auth");
  };

  const value = useMemo(
    () => ({ auth, user: auth?.user, token: auth?.token, isAdmin: auth?.user?.role === "admin", register, login, updateProfile, logout }),
    [auth]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
