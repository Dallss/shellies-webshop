import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { listOrdersFor } from "@/lib/db";
import { AccountView } from "./AccountView";

export const metadata: Metadata = { title: "My account" };
export const dynamic = "force-dynamic";

export default async function AccountPage({ searchParams }: { searchParams: Promise<{ placed?: string }> }) {
  const session = await auth();
  const email = session?.user?.email;
  if (!email) redirect("/login?next=/account");

  const [orders, { placed }] = await Promise.all([listOrdersFor(email), searchParams]);
  // Only celebrate an order number that really belongs to this shopper.
  const justPlaced = placed && orders.some((o) => o.id === placed) ? placed : null;

  return <AccountView orders={orders} justPlaced={justPlaced} />;
}
