import type { Metadata } from "next";
import { SiteFooter, SiteHeader } from "@/components/v1/SiteHeader";
import { ShopSection } from "@/components/v1/ShopSection";
import { listProducts } from "@/lib/db";

export const metadata: Metadata = { title: "Shop" };
// Prices and stock come straight from the database on every visit.
export const dynamic = "force-dynamic";

export default async function ShopPage() {
  const products = await listProducts({ onlyShown: true });
  return (
    <div className="relative overflow-hidden">
      <div aria-hidden className="float-slow absolute -right-44 -top-[230px] h-[300px] w-[300px] rounded-full bg-coral sm:-right-40 sm:-top-[220px] sm:h-[420px] sm:w-[420px]" />
      <div aria-hidden className="float absolute right-[260px] top-24 hidden sm:block h-[70px] w-[70px] rounded-full bg-sky" />
      <SiteHeader current="/v1/shop" />
      <main className="relative">
        <ShopSection products={products} />
      </main>
      <SiteFooter />
    </div>
  );
}
