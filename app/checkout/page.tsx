import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { SiteFooter, SiteHeader } from "@/components/SiteHeader";
import { lastShippingFor, listProducts } from "@/lib/db";
import { CheckoutForm } from "./CheckoutForm";

export const metadata: Metadata = { title: "Checkout", robots: { index: false } };
export const dynamic = "force-dynamic";

export default async function CheckoutPage() {
  const session = await auth();
  const email = session?.user?.email;
  if (!email) redirect("/login?next=/checkout");

  const [products, last] = await Promise.all([listProducts({ onlyShown: true }), lastShippingFor(email)]);

  return (
    <div className="relative overflow-hidden">
      <div aria-hidden className="float-slow absolute -right-40 -top-[220px] h-[420px] w-[420px] rounded-full bg-coral" />
      <SiteHeader current="/checkout" />
      <main className="relative mx-auto max-w-[1080px] px-5 pb-24 pt-10 sm:px-6 sm:pt-14">
        <h1 className="rise rise-1 font-display text-[clamp(40px,6vw,68px)] font-extrabold leading-[0.95] tracking-[-0.035em] text-navy">Checkout</h1>
        <p className="rise rise-2 mt-3 text-[17px] sm:text-[19px]">Tell us where to send your Shellies. We&apos;ll message you to confirm the order and shipping fee.</p>
        <CheckoutForm
          products={products}
          email={email}
          defaults={{
            name: last?.name ?? session.user.name ?? "",
            phone: last?.phone ?? "",
            city: last?.city ?? "",
            address: last?.address ?? "",
            payment: last?.payment ?? "GCash",
          }}
        />
      </main>
      <SiteFooter />
    </div>
  );
}
