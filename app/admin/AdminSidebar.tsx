"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Crab } from "@/components/art";
import { useAdmin } from "@/lib/admin-store";

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
    <aside className="flex min-w-0 flex-[1_1_240px] flex-col gap-7 bg-navy px-5 py-7 text-white">
      <div className="flex items-center gap-2.5">
        <Crab className="h-8 w-[42px]" />
        <span className="flex flex-col">
          <span className="font-display text-[22px] font-extrabold leading-none">Perle &amp; Co.</span>
          <span className="text-[13px] text-sky-2">Shop admin</span>
        </span>
      </div>
      <nav aria-label="Admin" className="flex flex-col gap-1.5">
        {items.map((n) => {
          const on = path.startsWith(n.href);
          return (
            <Link
              key={n.href}
              href={n.href}
              aria-current={on ? "page" : undefined}
              className={`flex h-[52px] items-center justify-between gap-3 rounded-2xl px-4 no-underline ${on ? "bg-periwinkle font-bold text-ink" : "font-medium text-sky"}`}
            >
              <span>{n.label}</span>
              {n.badge > 0 && (
                <span className="inline-flex h-[26px] min-w-[26px] items-center justify-center rounded-full bg-coral px-2 text-[13px] font-bold text-white">{n.badge}</span>
              )}
            </Link>
          );
        })}
      </nav>
      <Link href="/news" className="px-4 text-[15px] font-medium text-sky no-underline">View public News page →</Link>
      <div className="mt-auto rounded-[18px] bg-ink p-3.5 text-[13px] leading-normal text-sky-2">
        Sample data. Changes reset when the page reloads until the backend is connected.
      </div>
    </aside>
  );
}
