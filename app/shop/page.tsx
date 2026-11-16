import type { Metadata } from "next";
import { SiteFooter, SiteHeader } from "@/components/SiteHeader";
import { ShopSection } from "@/components/shop/ShopSection";

export const metadata: Metadata = { title: "Shop" };

export default function ShopPage() {
  return (
    <div className="relative overflow-hidden">
      <div aria-hidden className="float-slow absolute -right-44 -top-[230px] h-[300px] w-[300px] rounded-full bg-coral sm:-right-40 sm:-top-[220px] sm:h-[420px] sm:w-[420px]" />
      <div aria-hidden className="float absolute right-[260px] top-24 hidden sm:block h-[70px] w-[70px] rounded-full bg-sky" />
      <SiteHeader current="/shop" />
      <main className="relative">
        <ShopSection />
      </main>
      <SiteFooter />
    </div>
  );
}
