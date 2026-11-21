import type { Metadata } from "next";
import Link from "next/link";
import { auth, signOut } from "@/auth";
import { Mascot } from "@/components/art";
import { SiteFooter, SiteHeader } from "@/components/SiteHeader";

export const metadata: Metadata = { title: "Admins only", robots: { index: false } };

// Shown (with a 403) when a signed-in account that isn't on ADMIN_EMAILS opens /admin.
export default async function NotAllowedPage() {
  const session = await auth();

  async function switchAccount() {
    "use server";
    await signOut({ redirectTo: "/login?next=/admin" });
  }

  return (
    <div className="relative overflow-hidden">
      <SiteHeader />
      <main className="relative mx-auto flex max-w-[1240px] justify-center px-6 pb-24 pt-14">
        <section className="flex w-full max-w-[460px] flex-col gap-6 rounded-[40px] bg-white p-[clamp(26px,5vw,44px)] text-center shadow-[0_10px_30px_rgba(0,64,160,0.08)]">
          <Mascot className="mx-auto h-[60px] w-[72px]" />
          <h1 className="font-display text-[clamp(30px,5vw,40px)] font-extrabold leading-none tracking-[-0.03em] text-navy">Admins only</h1>
          <p className="text-[17px] leading-relaxed text-muted">
            {session?.user?.email ? (
              <>
                <b className="text-ink">{session.user.email}</b> doesn&apos;t have access to the shop admin.
              </>
            ) : (
              <>This account doesn&apos;t have access to the shop admin.</>
            )}
          </p>
          <form action={switchAccount}>
            <button type="submit" className="bubbly h-14 w-full rounded-[18px] bg-navy text-[17px] font-semibold text-white">
              Use a different account
            </button>
          </form>
          <Link href="/shop" className="font-semibold text-navy underline underline-offset-4">Back to the shop</Link>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
