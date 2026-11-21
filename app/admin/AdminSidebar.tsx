"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Mascot, Wordmark } from "@/components/art";
import { HomeIcon, OrdersIcon, PostIcon, TagIcon } from "@/components/icons";
import { TabBar } from "@/components/TabBar";
import { useAdmin } from "@/lib/admin-store";

// A sidebar on wide screens. On phones it shrinks to a slim top bar, and the
// sections move to a tab bar at the bottom of the screen.

export function AdminSidebar() {
  const path = usePathname();
  const { orders } = useAdmin();
  const fresh = orders.filter((o) => o.status === "new").length;
  const items = [
    { href: "/admin/orders", label: "Orders", badge: fresh, icon: <OrdersIcon className="h-6 w-6" /> },
    { href: "/admin/listings", label: "Listings", badge: 0, icon: <TagIcon className="h-6 w-6" /> },
    { href: "/admin/posts", label: "Posts", badge: 0, icon: <PostIcon className="h-6 w-6" /> },
    { href: "/admin/homepage", label: "Homepage", badge: 0, icon: <HomeIcon className="h-6 w-6" /> },
  ];

  return (
    <aside className="flex min-w-0 flex-col gap-3 bg-navy px-4 py-3.5 text-white md:sticky md:top-0 md:h-screen md:w-[260px] md:flex-none md:gap-7 md:px-5 md:py-7">
      <div className="flex items-center justify-between gap-3">
        <div className="wiggle-host flex items-center gap-2.5">
          <Mascot className="h-8 w-[38px] md:h-9 md:w-[44px]" />
          <span className="flex flex-col gap-1">
            <Wordmark light className="h-[18px] md:h-[20px]" />
            <span className="text-[13px] text-sky-2">Shop admin</span>
          </span>
        </div>
        <Link href="/news" className="text-sm font-medium text-sky no-underline md:hidden">News page →</Link>
      </div>
      <nav aria-label="Admin" className="hidden flex-col gap-1.5 md:flex">
        {items.map((n) => {
          const on = path.startsWith(n.href);
          return (
            <Link
              key={n.href}
              href={n.href}
              aria-current={on ? "page" : undefined}
              className={`nav-link flex h-[52px] items-center justify-between gap-3 rounded-2xl px-4 no-underline ${on ? "bg-periwinkle font-bold text-ink" : "font-medium text-sky"}`}
            >
              <span>{n.label}</span>
              {n.badge > 0 && (
                <span key={n.badge} className="jelly inline-flex h-[26px] min-w-[26px] items-center justify-center rounded-full bg-coral px-2 text-[13px] font-bold text-white">
                  {n.badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>
      <Link href="/news" className="hidden px-4 text-[15px] font-medium text-sky no-underline md:block">View public News page →</Link>
      <TabBar
        label="Admin"
        tabs={items.map((n) => ({
          href: n.href,
          label: n.label,
          icon: n.icon,
          badge: n.badge,
          active: path.startsWith(n.href),
          ariaLabel: n.badge ? `${n.label}, ${n.badge} new` : undefined,
        }))}
      />
    </aside>
  );
}
