"use client";

import {
  SessionProvider as AuthSessionProvider,
  signIn as authSignIn,
  signOut as authSignOut,
  useSession as useAuthSession,
} from "next-auth/react";

// Thin wrapper over Auth.js so pages keep one simple shape: status / user / signIn / signOut.
// Sign-in is Google only (see auth.ts).

export type Provider = "google";
export type SessionUser = { name: string; email: string; image: string | null; provider: string; isAdmin: boolean };
type Status = "loading" | "authenticated" | "unauthenticated";

export function SessionProvider({ children }: { children: React.ReactNode }) {
  return <AuthSessionProvider>{children}</AuthSessionProvider>;
}

export function useSession(): {
  status: Status;
  user: SessionUser | null;
  signIn: (provider: Provider, redirectTo?: string) => void;
  signOut: () => void;
} {
  const { data, status } = useAuthSession();
  const u = data?.user;
  const user: SessionUser | null = u
    ? {
        name: u.name || u.email?.split("@")[0] || "Shopper",
        email: u.email ?? "",
        image: u.image ?? null,
        provider: u.provider,
        isAdmin: u.isAdmin,
      }
    : null;

  return {
    status,
    user,
    signIn: (provider, redirectTo = "/account") => void authSignIn(provider, { redirectTo }),
    signOut: () => void authSignOut({ redirectTo: "/" }),
  };
}
