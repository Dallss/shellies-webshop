"use client";

import Link from "next/link";
import { useCart } from "@/lib/cart";
import { BagIcon, Crab } from "./art";

const LINKS = [
  { href: "/", label: "Home" },
  { href: "/shop", label: "Shop" },
  { href: "/news", label: "News" },
];

export function SiteHeader({ tone = "light", current }: { tone?: "light" | "blue"; current?: string }) {
  if (tone === "light") {
    return (
      <header className="relative z-10 text-ink">
        <HeaderBar blue={false} current={current} />
      </header>
    );
  }

  // Blue header: the light header stays in place underneath, and the blue
  // version grows over it from the center, so the text never disappears.
  return (
    <header className="relative z-10">
      <div aria-hidden inert className="text-ink">
        <HeaderBar blue={false} current={current} />
      </div>
      <div className="nav-bubble absolute inset-0 bg-navy text-white">
        <HeaderBar blue current={current} />
      </div>
    </header>
  );
}

function HeaderBar({ blue, current }: { blue: boolean; current?: string }) {
  const { count } = useCart();

  return (
      <div className="mx-auto flex max-w-[1240px] flex-wrap items-center justify-between gap-4 px-6 py-5">
        <Link href="/" className="wiggle-host flex items-center gap-2.5 no-underline">
          <Crab smile className="h-[34px] w-[44px]" />
          <span className="font-display text-2xl font-extrabold tracking-tight">Perle &amp; Co.</span>
        </Link>

        <nav aria-label="Main" className="flex flex-wrap items-center gap-7 text-[15px] font-medium">
          {LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              aria-current={current === l.href ? "page" : undefined}
              className={`nav-link no-underline ${blue ? (current === l.href ? "font-bold text-white" : "text-sky") : current === l.href ? "font-bold text-navy" : "text-ink"}`}
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="flex flex-wrap gap-3">
          <Link
            href="/my-shellies"
            className={`bubbly inline-flex h-12 items-center rounded-2xl border-[2.5px] px-5 font-semibold no-underline ${blue ? "border-sky text-sky" : "border-red text-red"}`}
          >
            Log in
          </Link>
          <Link
            href="/shop#cart"
            aria-label={`Cart, ${count} items`}
            className={`bubbly inline-flex h-12 items-center gap-2.5 rounded-2xl px-[18px] font-bold no-underline ${blue ? "bg-sky text-navy" : "bg-navy text-sky"}`}
          >
            <BagIcon className="h-[22px] w-[22px]" />
            <span key={count} className={count > 0 ? "jelly" : undefined}>
              {count}
            </span>
          </Link>
        </div>
      </div>
  );
}

export function SiteFooter() {
  return (
    <footer className="bg-maroon px-6 py-10 text-rose">
      <div className="mx-auto flex max-w-[1240px] flex-wrap justify-between gap-4 text-[15px]">
        <span className="font-display text-xl font-extrabold text-white">Perle &amp; Co.</span>
        <span>
          Order on our IG!{" "}
          <a href="https://instagram.com/perle.and.company" className="font-semibold text-white">
            @perle.and.company
          </a>
        </span>
      </div>
    </footer>
  );
}
