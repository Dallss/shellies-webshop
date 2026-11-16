"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { DEMO_CUSTOMER } from "./data";

// Stand-in for real login. Shoppers will sign in with Google or Facebook only; the shape here
// (status / user / signIn(provider) / signOut) mirrors Auth.js's useSession so pages won't need
// to change when the real providers are wired up. For now signing in just remembers the sample
// shopper in this browser.

export type Provider = "google" | "facebook";
export type SessionUser = { name: string; email: string; image: string | null; provider: Provider };
type Status = "loading" | "authenticated" | "unauthenticated";

type SessionValue = {
  status: Status;
  user: SessionUser | null;
  signIn: (provider: Provider) => void;
  signOut: () => void;
};

const SessionContext = createContext<SessionValue | null>(null);
const KEY = "perle-session";

export function SessionProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<SessionUser | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(KEY);
      if (saved) setUser(JSON.parse(saved));
    } catch {
      /* storage unavailable: signed out */
    }
    setLoaded(true);
  }, []);

  const value = useMemo<SessionValue>(
    () => ({
      status: !loaded ? "loading" : user ? "authenticated" : "unauthenticated",
      user,
      signIn: (provider) => {
        const u: SessionUser = { name: DEMO_CUSTOMER.name, email: DEMO_CUSTOMER.email, image: null, provider };
        setUser(u);
        try {
          localStorage.setItem(KEY, JSON.stringify(u));
        } catch {
          /* ignore */
        }
      },
      signOut: () => {
        setUser(null);
        try {
          localStorage.removeItem(KEY);
        } catch {
          /* ignore */
        }
      },
    }),
    [user, loaded],
  );

  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>;
}

export function useSession() {
  const ctx = useContext(SessionContext);
  if (!ctx) throw new Error("useSession must be used inside SessionProvider");
  return ctx;
}
