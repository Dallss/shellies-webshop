// Small shared pieces for the admin screens.

/** On phones the editor sits below the list. After picking an item, bring the
 *  editor into view if it's off screen; on wide screens it's already visible. */
export function revealIfOffscreen(id: string) {
  requestAnimationFrame(() => {
    const el = document.getElementById(id);
    if (!el) return;
    const r = el.getBoundingClientRect();
    if (r.top < window.innerHeight * 0.6 && r.bottom > 0) return;
    const smooth = !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    el.scrollIntoView({ behavior: smooth ? "smooth" : "auto", block: "start" });
  });
}

export function PageTitle({ title, intro, action }: { title: string; intro: string; action?: React.ReactNode }) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-4">
      <div className="rise rise-1">
        <h1 className="font-display text-[clamp(34px,4.4vw,56px)] font-extrabold leading-none tracking-[-0.03em] text-navy">{title}</h1>
        <p className="mt-2 text-base sm:text-[17px]">{intro}</p>
      </div>
      {action}
    </div>
  );
}

export function Pill({ children, className }: { children: React.ReactNode; className: string }) {
  return <span className={`inline-block whitespace-nowrap rounded-full px-3 py-1.5 text-center text-[13px] font-bold ${className}`}>{children}</span>;
}

export function Toast({ message }: { message: string }) {
  if (!message) return null;
  return (
    <p key={message} role="status" className="pop rounded-2xl bg-ink px-[18px] py-3.5 font-semibold text-white">
      {message}
    </p>
  );
}

export const inputClass = "h-[50px] min-w-0 rounded-[14px] bg-field px-3.5 text-base text-ink";
export const labelClass = "text-[15px] font-bold";
export const primaryBtn = "bubbly h-[52px] sm:h-14 rounded-[18px] bg-navy px-[22px] text-[17px] font-bold text-white";
export const coralBtn = "bubbly h-[52px] sm:h-14 rounded-[18px] bg-coral px-[22px] text-[17px] font-bold text-white";
export const dangerBtn = "bubbly h-[52px] sm:h-14 rounded-[18px] border-[3px] border-[#E86A6A] bg-[#F4D6DC] px-5 text-base font-bold text-crimson";
