import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [status, setStatus] = useState("loading"); // loading | guest | authenticated
  const [me, setMe] = useState(null);
  const mountedRef = useRef(false);
  const requestIdRef = useRef(0);
  const controllerRef = useRef(null);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
      controllerRef.current?.abort();
    };
  }, []);

  const refresh = useCallback(async () => {
    const requestId = ++requestIdRef.current;
    try {
      controllerRef.current?.abort();
      const controller = new AbortController();
      controllerRef.current = controller;

      const res = await fetch("/api/auth/me", {
        credentials: "include",
        headers: { Accept: "application/json" },
        signal: controller.signal,
      });

      if (res.status === 204 || res.status === 401) {
        if (!mountedRef.current || requestId !== requestIdRef.current) return;
        setStatus("guest");
        setMe(null);
        return;
      }

      if (!res.ok) {
        if (res.status >= 500) {
          console.error("Auth check failed with server error:", res.status);
        }
        if (!mountedRef.current || requestId !== requestIdRef.current) return;
        setStatus("guest");
        setMe(null);
        return;
      }

      const data = await res.json();
      if (!mountedRef.current || requestId !== requestIdRef.current) return;
      setStatus("authenticated");
      setMe(data);
    } catch (e) {
      if (e?.name === "AbortError") return;
      if (!mountedRef.current || requestId !== requestIdRef.current) return;
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
