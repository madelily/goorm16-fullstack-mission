import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [status, setStatus] = useState("loading"); // loading | guest | authenticated
  const [me, setMe] = useState(null);

  const refresh = useCallback(async () => {
    try {
      const res = await fetch("/api/auth/me", {
        credentials: "include",
        headers: { Accept: "application/json" },
      });

      if (res.status === 401) {
        setStatus("guest");
        setMe(null);
        return;
      }

      if (!res.ok) {
        setStatus("guest");
        setMe(null);
        return;
      }

      const data = await res.json();
      setStatus("authenticated");
      setMe(data);
    } catch {
      setStatus("guest");
      setMe(null);
    }
  }, []);

  const logout = useCallback(async () => {
    await fetch("/logout", {
      method: "POST",
      credentials: "include",
      headers: { Accept: "application/json" },
    }).catch(() => {});
    await refresh();
  }, [refresh]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const value = useMemo(() => ({ status, me, refresh, logout }), [status, me, refresh, logout]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const value = useContext(AuthContext);
  if (!value) throw new Error("useAuth must be used within AuthProvider");
  return value;
}

