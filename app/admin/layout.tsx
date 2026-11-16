import type { Metadata } from "next";
import { AdminProvider } from "@/lib/admin-store";
import { TAB_BAR_SPACE } from "@/components/TabBar";
import { AdminSidebar } from "./AdminSidebar";

export const metadata: Metadata = { title: "Shop admin", robots: { index: false } };

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AdminProvider>
      <div className="flex min-h-screen flex-col bg-ice text-ink md:flex-row">
        <AdminSidebar />
        <main className={`min-w-0 flex-1 px-4 pt-5 sm:px-[clamp(20px,3vw,40px)] sm:pt-[clamp(20px,3vw,40px)] md:pb-[clamp(20px,3vw,40px)] ${TAB_BAR_SPACE}`}>
          <div className="mx-auto flex max-w-[1160px] flex-col gap-5 sm:gap-6">{children}</div>
        </main>
      </div>
    </AdminProvider>
  );
}
