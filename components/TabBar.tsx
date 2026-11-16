import Link from "next/link";

// The phone navigation: a floating bar at the bottom of the screen, within
// thumb reach. Hidden from md up, where the regular header or sidebar is used.
// Pages that show it need bottom room on phones (see TAB_BAR_SPACE).

export type Tab = {
  href: string;
  label: string;
  icon: React.ReactNode;
  active?: boolean;
  badge?: number;
  /** Accessible name when the visible label isn't enough (e.g. "Cart, 2 items"). */
  ariaLabel?: string;
};

/** Bottom padding for the last block on a page, so the bar never covers it.
 *  Pair it with an md:pb-* value for wider screens, where the bar is hidden. */
export const TAB_BAR_SPACE = "pb-[calc(112px+env(safe-area-inset-bottom))]";

export function TabBar({ label, tabs }: { label: string; tabs: Tab[] }) {
  return (
    <nav aria-label={label} className="fixed inset-x-3 bottom-[calc(10px+env(safe-area-inset-bottom))] z-50 md:hidden">
      <ul className="flex gap-1 rounded-[26px] bg-white/95 p-1.5 shadow-[0_12px_34px_rgba(11,42,91,0.22)] ring-1 ring-navy/5 backdrop-blur-md">
        {tabs.map((t) => (
          <li key={t.label} className="min-w-0 flex-1">
            <Link
              href={t.href}
              aria-current={t.active ? "page" : undefined}
              aria-label={t.ariaLabel}
              className={`bubbly relative flex h-[58px] flex-col items-center justify-center gap-0.5 rounded-[20px] text-[11px] font-semibold no-underline ${t.active ? "text-white" : "text-muted"}`}
            >
              {t.active && <span aria-hidden className="pop absolute inset-0 rounded-[20px] bg-navy" />}
              <span className="relative flex h-6 w-6 items-center justify-center">
                {t.icon}
                {!!t.badge && (
                  <span
                    key={t.badge}
                    aria-hidden={!!t.ariaLabel}
                    className="jelly absolute -right-2.5 -top-1.5 inline-flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-coral px-1 text-[11px] font-bold leading-none text-white ring-2 ring-white"
                  >
                    {t.badge}
                  </span>
                )}
              </span>
              <span className="relative max-w-full truncate px-1">{t.label}</span>
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
