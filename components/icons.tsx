// Line icons for the phone tab bars. They draw in the current text color.

type P = { className?: string };

function Svg({ className, children }: P & { children: React.ReactNode }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className={className}>
      {children}
    </svg>
  );
}

export const HomeIcon = (p: P) => (
  <Svg {...p}>
    <path d="M4 11 12 4l8 7" />
    <path d="M6 9.5V20h12V9.5" />
    <path d="M10 20v-5h4v5" />
  </Svg>
);

/** A shell, for the Shop tab. */
export const ShellIcon = (p: P) => (
  <Svg {...p}>
    <path d="M12 4C7 4 3.5 8.5 3.5 13.5 3.5 17 6 19.5 8 20h8c2-.5 4.5-3 4.5-6.5C20.5 8.5 17 4 12 4Z" />
    <path d="M12 4v16M8.2 5.4 9.5 20M15.8 5.4 14.5 20" />
  </Svg>
);

export const NewsIcon = (p: P) => (
  <Svg {...p}>
    <rect x="4" y="4.5" width="16" height="15" rx="3" />
    <path d="M8 9h8M8 12.5h8M8 16h5" />
  </Svg>
);

export const UserIcon = (p: P) => (
  <Svg {...p}>
    <circle cx="12" cy="8.5" r="3.8" />
    <path d="M4.8 20c.9-3.6 3.7-5.5 7.2-5.5s6.3 1.9 7.2 5.5" />
  </Svg>
);

export const OrdersIcon = (p: P) => (
  <Svg {...p}>
    <path d="M6 3.5h12v17l-3-2-3 2-3-2-3 2z" />
    <path d="M9 8.5h6M9 12h6" />
  </Svg>
);

export const TagIcon = (p: P) => (
  <Svg {...p}>
    <path d="M3.5 12.5V4.5a1 1 0 0 1 1-1h8l8 8-9 9z" />
    <circle cx="8.3" cy="8.3" r="1.4" />
  </Svg>
);

export const PostIcon = (p: P) => (
  <Svg {...p}>
    <path d="M4 20h4L19 9a2.8 2.8 0 0 0-4-4L4 16z" />
    <path d="m13.5 6.5 4 4" />
  </Svg>
);
