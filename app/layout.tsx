import type { Metadata, Viewport } from "next";
import { Bricolage_Grotesque, Lexend } from "next/font/google";
import { CartProvider } from "@/lib/cart";
import { SessionProvider } from "@/lib/session";
import "./globals.css";

const bricolage = Bricolage_Grotesque({
  variable: "--font-bricolage",
  subsets: ["latin"],
  weight: ["700", "800"],
});

const lexend = Lexend({
  variable: "--font-lexend",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: {
    default: "Perle & Co. · Shellie NFC bracelets",
    template: "%s · Perle & Co.",
  },
  description:
    "A Shellie is a bracelet with an NFC tag. Tap it with a phone and the info you chose to share shows up.",
};

// "cover" lets the phone tab bar sit above the home indicator via env(safe-area-inset-bottom).
export const viewport: Viewport = { width: "device-width", initialScale: 1, viewportFit: "cover" };

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${bricolage.variable} ${lexend.variable} antialiased`}>
        <SessionProvider>
          <CartProvider>{children}</CartProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
