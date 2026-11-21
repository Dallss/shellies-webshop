import type { Metadata } from "next";

// Archived first version of the public pages (the peach design), kept viewable at /v1.
// It shares the live shop data, cart, checkout and login with the current site.
export const metadata: Metadata = {
  title: { default: "Perle & Co. (v1)", template: "%s · Perle & Co. (v1)" },
  robots: { index: false, follow: false },
};

export default function V1Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {/* v1 used the peach page background instead of the current pale blue. */}
      <style>{`body { background: var(--color-blush); }`}</style>
      {children}
    </>
  );
}
