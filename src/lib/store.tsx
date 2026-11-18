import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import type { Role } from "./data";

export type User = {
  name: string;
  email: string;
  role: Role;
  company?: string;
  avatar?: string;
};

type Toast = { id: number; title: string; body?: string; tone: "success" | "info" | "warn" | "danger" };

type StoreShape = {
  user: User | null;
  login: (u: User) => void;
  logout: () => void;
  bookmarks: string[];
  toggleBookmark: (id: string) => void;
  toasts: Toast[];
  toast: (t: Omit<Toast, "id">) => void;
  dismiss: (id: number) => void;
  dark: boolean;
  setDark: (v: boolean) => void;
};

const StoreCtx = createContext<StoreShape | null>(null);

export const ROLE_HOME: Record<Role, string> = {
  organizer: "/admin",
  exhibitor: "/portal",
  attendee: "/attendee",
};

export const ROLE_LABEL: Record<Role, string> = {
  organizer: "Organizer / Admin",
  exhibitor: "Exhibitor",
  attendee: "Attendee",
};

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [bookmarks, setBookmarks] = useState<string[]>(["SS-01", "SS-04"]);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [dark, setDark] = useState(false);

  const toast = useCallback((t: Omit<Toast, "id">) => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { ...t, id }]);
    window.setTimeout(() => setToasts((prev) => prev.filter((x) => x.id !== id)), 4200);
  }, []);

  const dismiss = useCallback((id: number) => setToasts((p) => p.filter((x) => x.id !== id)), []);

  const login = useCallback((u: User) => {
    setUser(u);
    try {
      localStorage.setItem("es-user", JSON.stringify(u));
    } catch {
      /* ignore */
    }
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    try {
      localStorage.removeItem("es-user");
    } catch {
      /* ignore */
    }
  }, []);

  const toggleBookmark = useCallback(
    (id: string) => {
      setBookmarks((prev) => {
        const has = prev.includes(id);
        toast(
          has
            ? { title: "Removed from your agenda", tone: "info" }
            : { title: "Session bookmarked", body: "We'll remind you 45 minutes before it starts.", tone: "success" }
        );
        return has ? prev.filter((x) => x !== id) : [...prev, id];
      });
    },
    [toast]
  );

  useEffect(() => {
    try {
      const raw = localStorage.getItem("es-user");
      if (raw) setUser(JSON.parse(raw));
    } catch {
      /* ignore */
    }
  }, []);

  const value = useMemo(
    () => ({ user, login, logout, bookmarks, toggleBookmark, toasts, toast, dismiss, dark, setDark }),
    [user, login, logout, bookmarks, toggleBookmark, toasts, toast, dismiss, dark]
  );

  return <StoreCtx.Provider value={value}>{children}</StoreCtx.Provider>;
}

export function useStore() {
  const ctx = useContext(StoreCtx);
  if (!ctx) throw new Error("useStore must be used inside StoreProvider");
  return ctx;
}

/* ---------------- number helpers ---------------- */
export const fmt = (n: number) => {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1).replace(/\.0$/, "") + "M";
  if (n >= 1000) return (n / 1000).toFixed(1).replace(/\.0$/, "") + "K";
  return String(n);
};
export const money = (n: number) =>
  n >= 1000 ? "$" + (n / 1000).toFixed(n >= 10000 ? 0 : 1).replace(/\.0$/, "") + "K" : "$" + n;
