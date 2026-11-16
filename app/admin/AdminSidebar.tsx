"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Crab } from "@/components/art";
import { useAdmin } from "@/lib/admin-store";

// A sidebar on wide screens. On phones it becomes a short top bar with the
// three sections as tabs, so the page content starts on the first screen.

export function AdminSidebar() {
  const path = usePathname();
  const { orders } = useAdmin();
  const fresh = orders.filter((o) => o.status === "new").length;
  const items = [
    { href: "/admin/orders", label: "Orders", badge: fresh },
    { href: "/admin/listings", label: "Listings", badge: 0 },
    { href: "/admin/posts", label: "Posts", badge: 0 },
  ];

  return (
    <aside className="flex min-w-0 flex-col gap-3 bg-navy px-4 pb-3 pt-4 text-white md:sticky md:top-0 md:h-screen md:w-[260px] md:flex-none md:gap-7 md:px-5 md:py-7">
      <div className="flex items-center justify-between gap-3">
        <div className="wiggle-host flex items-center gap-2.5">
          <Crab className="h-7 w-9 md:h-8 md:w-[42px]" />
          <span className="flex flex-col">
            <span className="font-display text-xl font-extrabold leading-none md:text-[22px]">Perle &amp; Co.</span>
            <span className="text-[13px] text-sky-2">Shop admin</span>
          </span>
        </div>
        <Link href="/news" className="text-sm font-medium text-sky no-underline md:hidden">News page →</Link>
      </div>
      <nav aria-label="Admin" className="grid grid-cols-3 gap-1.5 md:flex md:flex-col">
        {items.map((n) => {
          const on = path.startsWith(n.href);
          return (
            <Link
              key={n.href}
              href={n.href}
              aria-current={on ? "page" : undefined}
              className={`nav-link flex h-11 items-center justify-center gap-2 rounded-xl px-2 text-[15px] no-underline md:h-[52px] md:justify-between md:gap-3 md:rounded-2xl md:px-4 md:text-base ${on ? "bg-periwinkle font-bold text-ink" : "font-medium text-sky"}`}
            >
              <span>{n.label}</span>
              {n.badge > 0 && (
                <span key={n.badge} className="jelly inline-flex h-[22px] min-w-[22px] items-center justify-center rounded-full bg-coral px-1.5 text-xs font-bold text-white md:h-[26px] md:min-w-[26px] md:px-2 md:text-[13px]">
                  {n.badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>
      <Link href="/news" className="hidden px-4 text-[15px] font-medium text-sky no-underline md:block">View public News page →</Link>
      <div className="hidden rounded-[18px] bg-ink p-3.5 text-[13px] leading-normal text-sky-2 md:mt-auto md:block">
        Sample data. Changes reset when the page reloads until the backend is connected.
      </div>
    </aside>
  );
}
