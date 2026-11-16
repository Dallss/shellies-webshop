import type { Metadata } from "next";
import { SiteFooter, SiteHeader } from "@/components/SiteHeader";
import { ShopSection } from "@/components/shop/ShopSection";

export const metadata: Metadata = { title: "Shop" };

export default function ShopPage() {
  return (
    <div className="relative overflow-hidden">
      <div aria-hidden className="float-slow absolute -right-40 -top-[220px] h-[420px] w-[420px] rounded-full bg-coral" />
      <div aria-hidden className="float absolute right-[260px] top-24 h-[70px] w-[70px] rounded-full bg-sky" />
      <SiteHeader current="/shop" />
      <main className="relative">
        <ShopSection />
      </main>
      <SiteFooter />
    </div>
  );
}
