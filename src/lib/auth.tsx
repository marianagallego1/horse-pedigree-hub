import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { api, getToken, setToken } from "./api";
import type { AuthenticatedUser, LoginResponse } from "./types";

interface AuthCtx {
  user: AuthenticatedUser | null;
  loading: boolean;
  isAuthenticated: boolean;
  isAdmin: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refresh: () => Promise<void>;
}
const Ctx = createContext<AuthCtx | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthenticatedUser | null>(null);
  const [loading, setLoading] = useState(true);

  const refresh = async () => {
    if (!getToken()) { setUser(null); setLoading(false); return; }
    try {
      const u = await api<AuthenticatedUser>("/api/v1/auth/me");
      setUser(u);
    } catch {
      setUser(null);
      setToken(null);
    } finally { setLoading(false); }
  };

  useEffect(() => { refresh(); /* eslint-disable-next-line */ }, []);

  const login = async (username: string, password: string) => {
    const res = await api<LoginResponse>("/api/v1/auth/login", {
      method: "POST",
      body: JSON.stringify({ username, password }),
    });
    setToken(res.accessToken);
    setUser(res.user);
  };
  const logout = async () => {
    try { await api("/api/v1/auth/logout", { method: "POST" }); } catch { /* ignore */ }
    setToken(null);
    setUser(null);
  };

  return (
    <Ctx.Provider value={{
      user, loading,
      isAuthenticated: !!user,
      isAdmin: user?.rolId === 1,
      login, logout, refresh,
    }}>{children}</Ctx.Provider>
  );
}

export function useAuth() {
  const c = useContext(Ctx);
  if (!c) throw new Error("useAuth outside provider");
  return c;
}
