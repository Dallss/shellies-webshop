import { Mascot } from "@/components/art";

/* The iPhone banner that appears when a phone taps a Shellie's NFC tag:
   frosted dark glass, black NFC app icon on the left, "now" and the target
   icon on the right. `compact` is the smaller copy in the admin preview. */

function NfcWaves({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="#fff" strokeLinecap="round" aria-hidden="true" className={className}>
      <path d="M6.2 9.6a3.4 3.4 0 0 1 0 4.8" strokeWidth="1.9" />
      <path d="M9.3 7.6a6.6 6.6 0 0 1 0 8.8" strokeWidth="1.9" />
      <path d="M12.5 5.4a9.8 9.8 0 0 1 0 13.2" strokeWidth="1.9" />
      <path d="M15.8 3.2a13 13 0 0 1 0 17.6" strokeWidth="2.1" />
    </svg>
  );
}

export function TapNotification({
  title = "Shellie NFC Tag",
  lines,
  compact = false,
  className = "",
}: {
  title?: string;
  lines: string[];
  compact?: boolean;
  className?: string;
}) {
  const s = compact
    ? { box: "gap-2.5 rounded-[18px] px-2.5 py-2.5", icon: "h-9 w-9 rounded-[9px]", wave: "h-6 w-6", text: "text-[11.5px] leading-[1.3]", now: "text-[10px]", app: "h-7 w-7 rounded-[7px]" }
    : { box: "gap-3 rounded-[24px] px-3.5 py-3 sm:gap-3.5 sm:px-4 sm:py-3.5", icon: "h-[44px] w-[44px] rounded-[10px] sm:h-[50px] sm:w-[50px] sm:rounded-[12px]", wave: "h-7 w-7 sm:h-8 sm:w-8", text: "text-[14px] leading-[1.32] sm:text-[16px]", now: "text-[12px] sm:text-[13px]", app: "h-9 w-9 rounded-[9px] sm:h-10 sm:w-10 sm:rounded-[10px]" };

  return (
    <div
      className={`flex items-center bg-[rgba(28,28,30,0.78)] text-white shadow-[0_14px_36px_rgba(0,0,0,0.28)] ring-1 ring-white/10 backdrop-blur-xl backdrop-saturate-150 ${s.box} ${className}`}
      style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Helvetica Neue", system-ui, sans-serif' }}
    >
      <span className={`flex flex-none items-center justify-center bg-black ring-1 ring-white/15 ${s.icon}`}>
        <NfcWaves className={s.wave} />
      </span>
      <span className={`min-w-0 flex-1 ${s.text}`}>
        <b className="block truncate font-semibold">{title}</b>
        {lines.map((l) => (
          <span key={l} className="block truncate">
            {l}
          </span>
        ))}
      </span>
      <span className="flex flex-none flex-col items-end gap-1 self-stretch">
        <span className={`text-white/55 ${s.now}`}>now</span>
        <span className={`mt-auto flex items-center justify-center overflow-hidden bg-red ${s.app}`}>
          <Mascot deep className="w-[78%]" />
        </span>
      </span>
    </div>
  );
}
