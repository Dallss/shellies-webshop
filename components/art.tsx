// Brand illustrations: the crab mascot and the Shellie bracelet.

export function Crab({
  color = "#F2312E",
  className,
  smile = false,
}: {
  color?: string;
  className?: string;
  smile?: boolean;
}) {
  return (
    <svg viewBox="0 0 120 90" aria-hidden="true" className={className}>
      <g className="claw-l">
        <path d="M22 24 L30 10.1 A16 16 0 1 1 14 10.1 Z" fill={color} />
        <path d="M26 38 L42 58" stroke={color} strokeWidth="7" strokeLinecap="round" />
      </g>
      <g className="claw-r">
        <path d="M98 24 L106 10.1 A16 16 0 1 1 90 10.1 Z" fill={color} />
        <path d="M94 38 L78 58" stroke={color} strokeWidth="7" strokeLinecap="round" />
      </g>
      <ellipse cx="60" cy="66" rx="36" ry="22" fill={color} />
      <circle cx="50" cy="58" r="5.5" fill="#1A0000" />
      <circle cx="70" cy="58" r="5.5" fill="#1A0000" />
      <circle cx="51.6" cy="56.4" r="1.8" fill="#fff" />
      <circle cx="71.6" cy="56.4" r="1.8" fill="#fff" />
      <ellipse cx="41" cy="69" rx="6" ry="3.5" fill="#FF9C9C" />
      <ellipse cx="79" cy="69" rx="6" ry="3.5" fill="#FF9C9C" />
      {smile && <path d="M55 69 q5 4.5 10 0" stroke="#1A0000" strokeWidth="2.2" fill="none" strokeLinecap="round" />}
    </svg>
  );
}

export function Bracelet({ hex, label, className }: { hex: string; label?: string; className?: string }) {
  return (
    <svg
      viewBox="0 0 200 160"
      className={className}
      role={label ? "img" : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
    >
      <path d="M40 112 C 8 62, 40 20, 100 20 C 160 20, 192 62, 160 112" stroke={hex} strokeWidth="7" fill="none" strokeLinecap="round" />
      <rect x="88" y="13" width="24" height="13" rx="4" fill={hex} />
      <path d="M100 26 L84 52 M100 26 L116 52" stroke={hex} strokeWidth="4" strokeLinecap="round" />
      <circle cx="84" cy="54" r="5" fill={hex} />
      <circle cx="116" cy="54" r="5" fill={hex} />
      <circle cx="40" cy="112" r="5.5" fill={hex} />
      <circle cx="160" cy="112" r="5.5" fill={hex} />
      <ellipse cx="100" cy="118" rx="44" ry="27" fill="#F7F5F2" stroke="#D6D3CF" strokeWidth="2" />
      <rect x="78" y="106" width="44" height="24" rx="3" fill="none" stroke="#A9A6A2" strokeWidth="2" />
      <rect x="90" y="113" width="20" height="10" fill="none" stroke="#A9A6A2" strokeWidth="2" />
      <rect x="96" y="116" width="8" height="4" fill="#8E8B87" />
    </svg>
  );
}

export function NfcIcon({ className, stroke = "currentColor" }: { className?: string; stroke?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth="2.2" strokeLinecap="round" aria-hidden="true" className={className}>
      <path d="M8 8.5a5 5 0 0 1 0 7" />
      <path d="M11.5 5.5a9.5 9.5 0 0 1 0 13" />
      <path d="M15 3a13.5 13.5 0 0 1 0 18" />
    </svg>
  );
}

export function BagIcon({ className, stroke = "currentColor" }: { className?: string; stroke?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className={className}>
      <path d="M5 8h14l-1.2 12H6.2L5 8z" />
      <path d="M9 8V6a3 3 0 0 1 6 0v2" />
      <path d="M9.5 13q2.5 2.5 5 0" />
    </svg>
  );
}
