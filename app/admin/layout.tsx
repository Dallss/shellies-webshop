import type { Metadata } from "next";
import { AdminProvider } from "@/lib/admin-store";
import { AdminSidebar } from "./AdminSidebar";

export const metadata: Metadata = { title: "Shop admin", robots: { index: false } };

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AdminProvider>
      <div className="flex min-h-screen flex-wrap bg-ice text-ink">
        <AdminSidebar />
        <main className="min-w-0 flex-[999_1_640px] p-[clamp(20px,3vw,40px)]">
          <div className="mx-auto flex max-w-[1160px] flex-col gap-6">{children}</div>
        </main>
      </div>
    </AdminProvider>
  );
}
