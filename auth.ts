import NextAuth from "next-auth";
import Google from "next-auth/providers/google";

// Shoppers: anyone with a Google account can sign in.
// Admin: only Google accounts whose email is listed in ADMIN_EMAILS (comma-separated).
// Sessions are signed JWT cookies, so no database is needed yet.

const adminEmails = (process.env.ADMIN_EMAILS ?? "")
  .split(",")
  .map((e) => e.trim().toLowerCase())
  .filter(Boolean);

export function isAdminEmail(email: string | null | undefined) {
  return !!email && adminEmails.includes(email.toLowerCase());
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [Google],
  pages: { signIn: "/login" },
  callbacks: {
    // Only accept Google accounts with a verified email, so ADMIN_EMAILS can't be spoofed.
    signIn({ account, profile }) {
      if (account?.provider === "google") return profile?.email_verified === true;
      return false;
    },
    jwt({ token, account }) {
      if (account) token.provider = account.provider;
      token.isAdmin = isAdminEmail(token.email);
      return token;
    },
    session({ session, token }) {
      session.user.provider = (token.provider as string) ?? "google";
      session.user.isAdmin = token.isAdmin === true;
      return session;
    },
  },
});

declare module "next-auth" {
  interface Session {
    user: { name?: string | null; email?: string | null; image?: string | null; provider: string; isAdmin: boolean };
  }
}
