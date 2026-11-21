"use client";

import Link from "next/link";
import { useCart } from "@/lib/cart";
import { useSession } from "@/lib/session";
import { BagIcon, Mascot, V1_BRANDMARK, Wordmark } from "@/components/art";
import { HomeIcon, NewsIcon, ShellIcon, UserIcon } from "@/components/icons";
import { TAB_BAR_SPACE, TabBar } from "@/components/TabBar";

const LINKS = [
  { href: "/v1", label: "Home" },
  { href: "/v1/shop", label: "Shop" },
  { href: "/v1/news", label: "News" },
];

export function SiteHeader({ tone = "light", current }: { tone?: "light" | "blue"; current?: string }) {
  if (tone === "light") {
    return (
      <>
        <header className="relative z-10 text-ink">
          <HeaderBar blue={false} current={current} />
        </header>
        <SiteTabBar current={current} />
      </>
    );
  }

  // Blue header: the light header stays in place underneath, and the blue
  // version grows over it from the center, so the text never disappears.
  return (
    <>
    <SiteTabBar current={current} />
    <header className="relative z-10">
      <div aria-hidden inert className="text-ink">
        <HeaderBar blue={false} current={current} />
      </div>
      <div className="nav-bubble absolute inset-0 bg-navy text-white">
        <HeaderBar blue current={current} />
      </div>
    </header>
    </>
  );
}

function HeaderBar({ blue, current }: { blue: boolean; current?: string }) {
  const { count } = useCart();

  return (
      <div className="mx-auto flex max-w-[1240px] flex-wrap items-center justify-between gap-4 px-5 py-4 sm:px-6 md:py-5">
        <Link href="/v1" className="wiggle-host flex items-center gap-2.5 no-underline">
          <Mascot priority className="h-[30px] w-[36px] sm:h-[36px] sm:w-[44px]" />
          <Wordmark src={V1_BRANDMARK} light={blue} className="h-[20px] sm:h-[24px]" />
        </Link>

        <nav aria-label="Main" className="hidden flex-wrap items-center gap-7 text-[15px] font-medium md:flex">
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

        <div className="hidden gap-3 md:flex">
          <AccountButton blue={blue} current={current} />
          <Link
            href="/v1/shop#cart"
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

/** Signed in: the shopper's initial and first name, linking to their orders. Signed out: Log in.
 *  Solid fill so it stays readable over the coral and navy shapes behind the header. */
function AccountButton({ blue, current }: { blue: boolean; current?: string }) {
  const { status, user } = useSession();
  const base = "bubbly inline-flex h-12 items-center gap-2.5 rounded-2xl font-semibold no-underline";
  const tone = blue ? "bg-white/15 text-white ring-2 ring-inset ring-sky/60" : "bg-white text-navy shadow-[0_6px_20px_rgba(0,64,160,0.18)]";

  if (status === "loading") {
    return <span aria-hidden className={`${base} ${tone} invisible px-5`}>Log in</span>;
  }

  if (!user) {
    return (
      <Link href="/login" aria-current={current === "/login" ? "page" : undefined} className={`${base} ${tone} px-5`}>
        Log in
      </Link>
    );
  }

  const first = user.name.split(" ")[0];
  return (
    <Link
      href="/account"
      aria-current={current === "/account" ? "page" : undefined}
      aria-label={`Your account, signed in as ${user.name}`}
      className={`${base} ${tone} pl-1.5 pr-4`}
    >
      <span aria-hidden className={`flex h-9 w-9 items-center justify-center rounded-xl font-display text-lg font-extrabold ${blue ? "bg-sky text-navy" : "bg-navy text-white"}`}>
        {first[0]}
      </span>
      <span className="max-w-[9ch] truncate">{first}</span>
    </Link>
  );
}

function SiteTabBar({ current }: { current?: string }) {
  const { count } = useCart();
  const { status, user } = useSession();
  const first = user?.name.split(" ")[0];

  return (
    <TabBar
      label="Main"
      tabs={[
        { href: "/v1", label: "Home", icon: <HomeIcon className="h-6 w-6" />, active: current === "/v1" },
        { href: "/v1/shop", label: "Shop", icon: <ShellIcon className="h-6 w-6" />, active: current === "/v1/shop" },
        { href: "/v1/news", label: "News", icon: <NewsIcon className="h-6 w-6" />, active: current === "/v1/news" },
        { href: "/v1/shop#cart", label: "Cart", icon: <BagIcon className="h-6 w-6" />, badge: count, ariaLabel: `Cart, ${count} items` },
        user
          ? {
              href: "/account",
              label: first ?? "Account",
              ariaLabel: `Your account, signed in as ${user.name}`,
              active: current === "/account",
              icon: (
                <span aria-hidden className={`flex h-6 w-6 items-center justify-center rounded-full font-display text-[13px] font-extrabold ${current === "/account" ? "bg-white text-navy" : "bg-navy text-white"}`}>
                  {first?.[0]}
                </span>
              ),
            }
          : { href: "/login", label: status === "loading" ? "Account" : "Log in", icon: <UserIcon className="h-6 w-6" />, active: current === "/login" },
      ]}
    />
  );
}

export function SiteFooter() {
  return (
    <footer className={`bg-maroon px-5 pt-10 text-rose sm:px-6 md:pb-10 ${TAB_BAR_SPACE}`}>
      <div className="mx-auto flex max-w-[1240px] flex-wrap justify-between gap-4 text-[15px]">
        <Wordmark src={V1_BRANDMARK} light className="h-[20px]" />
        <ul className="flex flex-wrap gap-x-6 gap-y-2">
          <li>
            Facebook: <span className="font-semibold text-white">Perle &amp; Co.</span>
          </li>
          <li>
            Instagram:{" "}
            <a href="https://instagram.com/perle.and.company" className="font-semibold text-white">
              @perle.and.company
            </a>
          </li>
          <li>
            Email:{" "}
            <a href="mailto:perleandco.ph@gmail.com" className="font-semibold text-white">
              perleandco.ph@gmail.com
            </a>
          </li>
        </ul>
      </div>
    </footer>
  );
}
