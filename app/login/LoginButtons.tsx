"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { useSession, type Provider } from "@/lib/session";

export function LoginButtons() {
  const { status, signIn } = useSession();
  const router = useRouter();
  const params = useSearchParams();
  // Only allow in-site redirects.
  const raw = params.get("next") ?? "/account";
  const next = raw.startsWith("/") && !raw.startsWith("//") ? raw : "/account";

  useEffect(() => {
    if (status === "authenticated") router.replace(next);
  }, [status, next, router]);

  function go(provider: Provider) {
    signIn(provider);
    router.replace(next);
  }

  return (
    <div className="flex flex-col gap-3">
      <button
        type="button"
        onClick={() => go("google")}
        className="bubbly flex h-14 items-center justify-center gap-3 rounded-[18px] border-2 border-[#DADCE0] bg-white text-[17px] font-semibold text-[#1F1F1F]"
      >
        <GoogleMark />
        Continue with Google
      </button>
      <button
        type="button"
        onClick={() => go("facebook")}
        className="bubbly flex h-14 items-center justify-center gap-3 rounded-[18px] bg-[#1877F2] text-[17px] font-semibold text-white"
      >
        <FacebookMark />
        Continue with Facebook
      </button>
    </div>
  );
}

function GoogleMark() {
  return (
    <svg aria-hidden width="22" height="22" viewBox="0 0 48 48">
      <path fill="#EA4335" d="M24 9.5c3.5 0 6.6 1.2 9.1 3.6l6.8-6.8C35.8 2.4 30.3 0 24 0 14.6 0 6.6 5.4 2.7 13.3l7.9 6.1C12.5 13.6 17.8 9.5 24 9.5z" />
      <path fill="#4285F4" d="M46.5 24.5c0-1.6-.1-3.1-.4-4.5H24v9h12.7c-.6 3-2.3 5.5-4.8 7.2l7.7 6c4.5-4.2 6.9-10.3 6.9-17.7z" />
      <path fill="#FBBC05" d="M10.6 28.6c-.5-1.4-.8-3-.8-4.6s.3-3.2.8-4.6l-7.9-6.1C1 16.6 0 20.2 0 24s1 7.4 2.7 10.7l7.9-6.1z" />
      <path fill="#34A853" d="M24 48c6.5 0 11.9-2.1 15.9-5.8l-7.7-6c-2.1 1.4-4.9 2.3-8.2 2.3-6.2 0-11.5-4.1-13.4-9.9l-7.9 6.1C6.6 42.6 14.6 48 24 48z" />
    </svg>
  );
}

function FacebookMark() {
  return (
    <svg aria-hidden width="22" height="22" viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="12" fill="#fff" />
      <path fill="#1877F2" d="M15.1 24v-9.3h3.1l.5-3.6h-3.6V8.8c0-1 .3-1.8 1.8-1.8h1.9V3.8c-.3 0-1.5-.1-2.8-.1-2.8 0-4.6 1.7-4.6 4.8v2.6H8.3v3.6h3.1V24h3.7z" />
    </svg>
  );
}
