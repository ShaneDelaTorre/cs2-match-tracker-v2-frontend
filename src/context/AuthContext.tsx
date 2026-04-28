"use client";

import {
  createContext,
  useContext,
  useState,
  ReactNode,
} from "react";
import { logout as logoutApi} from "@/lib/endpoints";
import { useRouter } from "next/navigation"

interface AuthContextType {
  isAuthenticated: boolean;
  login: (access: string, refresh: string) => void;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children, initialAuth }: { children: ReactNode, initialAuth: boolean }) {
  const [isAuthenticated, setIsAuthenticated] = useState(initialAuth);
  const router = useRouter();

  const login = () => {
    setIsAuthenticated(true)
    };

  const logout = async () => {
    await logoutApi();
    setIsAuthenticated(false);
    router.push("/");
    router.refresh();
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
