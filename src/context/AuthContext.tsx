"use client";

import {
  createContext,
  useContext,
  useState,
  ReactNode,
} from "react";

interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (access: string, refresh: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [authSate, setAuthState] = useState<{
    isAuthenticated: boolean;
    isLoading: boolean;
  }>(() => {
  if (typeof window === "undefined") {
    return { isAuthenticated: false, isLoading: true };
  }
  const token = localStorage.getItem("access_token");
  return { isAuthenticated: !!token, isLoading: false };
});


  const login = (access: string, refresh: string) => {
    localStorage.setItem("access_token", access);
    localStorage.setItem("refresh_token", refresh);
    setAuthState({isAuthenticated: true, isLoading: false})
  };

  const logout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    setAuthState({isAuthenticated: true, isLoading: false})
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated: authSate.isAuthenticated, isLoading: authSate.isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
