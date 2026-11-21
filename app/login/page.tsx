import type { Metadata } from "next";
import { Suspense } from "react";
import { Mascot } from "@/components/art";
import { SiteFooter, SiteHeader } from "@/components/SiteHeader";
import { LoginButtons } from "./LoginButtons";

export const metadata: Metadata = { title: "Log in" };

export default function LoginPage() {
  return (
    <div className="relative overflow-hidden">
      <div aria-hidden className="float-slow absolute -right-40 -top-[220px] h-[420px] w-[420px] rounded-full bg-coral" />
      <div aria-hidden className="float absolute -left-16 top-[420px] h-[160px] w-[160px] rounded-full bg-sky" />
      <SiteHeader current="/login" />

      <main className="relative mx-auto flex max-w-[1240px] justify-center px-6 pb-24 pt-14">
        <section className="rise rise-1 flex w-full max-w-[460px] flex-col gap-6 rounded-[40px] bg-white p-[clamp(26px,5vw,44px)] shadow-[0_10px_30px_rgba(0,64,160,0.08)]">
          <Mascot className="mx-auto h-[60px] w-[72px]" />
          <div className="text-center">
            <h1 className="font-display text-[clamp(34px,5vw,44px)] font-extrabold leading-none tracking-[-0.03em] text-navy">Log in or sign up</h1>
            <p className="mt-3 text-[17px] leading-relaxed text-muted">
              Use your Google account. New here? Continuing creates your Perle &amp; Co. account. No new password to remember.
            </p>
          </div>

          <Suspense>
            <LoginButtons />
          </Suspense>

          <p className="text-center text-sm leading-relaxed text-muted">
            We only use your name and email to keep track of your orders. We never post anything to your account.
          </p>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
