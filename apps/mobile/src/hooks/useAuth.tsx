import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import type { UserRole } from "@dvc/shared";
import { apiRequest, getToken, setToken } from "../api/client";

export type AuthUser = {
  id: string;
  name: string;
  email: string | null;
  mobile: string | null;
  role: UserRole;
};

type AuthContextValue = {
  user: AuthUser | null;
  bootstrapping: boolean;
  signIn: (identifier: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  refreshMe: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [bootstrapping, setBootstrapping] = useState(true);

  const refreshMe = useCallback(async () => {
    const token = await getToken();
    if (!token) {
      setUser(null);
      return;
    }
    const me = await apiRequest<AuthUser>("/auth/me");
    setUser(me);
  }, []);

  useEffect(() => {
    (async () => {
      try {
        await refreshMe();
      } catch {
        await setToken(null);
        setUser(null);
      } finally {
        setBootstrapping(false);
      }
    })();
  }, [refreshMe]);

  const signIn = useCallback(async (identifier: string, password: string) => {
    const result = await apiRequest<{
      accessToken: string;
      user: AuthUser;
    }>("/auth/login", {
      method: "POST",
      body: JSON.stringify({ identifier, password }),
    });
    await setToken(result.accessToken);
    // Role is whatever the backend returned — never selected by the client.
    setUser(result.user);
  }, []);

  const signOut = useCallback(async () => {
    await setToken(null);
    setUser(null);
  }, []);

  const value = useMemo(
    () => ({ user, bootstrapping, signIn, signOut, refreshMe }),
    [user, bootstrapping, signIn, signOut, refreshMe],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
