"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { SiteFooter, SiteHeader } from "@/components/SiteHeader";
import { DEMO_CUSTOMER, ORDER_STEPS, PRODUCTS, SAMPLE_ORDERS, formatPeso, type Order, type OrderStatus } from "@/lib/data";
import { useSession } from "@/lib/session";

const STEP_LABEL: Record<(typeof ORDER_STEPS)[number], string> = {
  new: "Placed",
  confirmed: "Confirmed",
  packed: "Packed",
  shipped: "On the way",
  delivered: "Delivered",
};

const STATUS_LINE: Record<OrderStatus, string> = {
  new: "We got your order and will confirm it soon.",
  confirmed: "Confirmed! We're getting your Shellies ready.",
  packed: "Packed and waiting for the courier.",
  shipped: "Your Shellies are on the way.",
  delivered: "Delivered. Enjoy your Shellies!",
  cancelled: "This order was cancelled.",
};

const product = (id: string) => PRODUCTS.find((p) => p.id === id) ?? { name: "Shellie", hex: "#ccc", price: 0 };
const total = (o: Order) => o.items.reduce((a, it) => a + product(it.productId).price * it.qty, 0);
const isOpen = (o: Order) => o.status !== "delivered" && o.status !== "cancelled";

export function AccountView() {
  const { status, user, signOut } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") router.replace("/login?next=/account");
  }, [status, router]);

  if (!user) {
    return (
      <div className="relative overflow-hidden">
        <SiteHeader current="/account" />
        <main className="mx-auto min-h-[60vh] max-w-[960px] px-6 pt-16" aria-busy="true" />
        <SiteFooter />
      </div>
    );
  }

  // Sample data has no account ids yet, so the sample shopper's orders are matched by phone.
  // With real login, fetch the orders that belong to the signed-in account instead.
  const orders = SAMPLE_ORDERS.filter((o) => o.phone === DEMO_CUSTOMER.phone);
  const active = orders.filter(isOpen);
  const past = orders.filter((o) => !isOpen(o));
  const firstName = user.name.split(" ")[0];
  const via = "Google";

  return (
    <div className="relative overflow-hidden">
      <div aria-hidden className="float-slow absolute -right-40 -top-[220px] h-[420px] w-[420px] rounded-full bg-sky" />
      <SiteHeader current="/account" />

      <main className="relative mx-auto flex max-w-[960px] flex-col gap-10 px-6 pb-24 pt-16">
        <header>
          <p className="rise rise-1 text-[15px] font-bold uppercase tracking-[0.06em] text-crimson">My account</p>
          <h1 className="rise rise-2 mt-2.5 font-display text-[clamp(42px,6vw,72px)] font-extrabold leading-[0.95] tracking-[-0.035em] text-navy">
            Hi, {firstName}!
          </h1>
          <p className="rise rise-3 mt-3 text-[19px]">Track your orders here. We&apos;ll update each one as we pack and ship it.</p>
          <p className="rise rise-3 mt-4 flex flex-wrap items-center gap-x-3 gap-y-1 text-[15px] text-muted">
            <span>
              Signed in with {via} as <b className="text-ink">{user.email}</b>
            </span>
            <button type="button" onClick={signOut} className="font-semibold text-crimson underline underline-offset-4">
              Log out
            </button>
          </p>
        </header>

        {orders.length === 0 ? (
          <div className="rise rise-4 rounded-[32px] bg-white p-10 text-center">
            <p className="text-lg font-semibold">No orders yet.</p>
            <Link href="/shop" className="bubbly mt-5 inline-flex h-14 items-center rounded-[18px] bg-navy px-7 font-semibold text-sky no-underline">
              Visit the shop
            </Link>
          </div>
        ) : (
          <>
            <OrderGroup title="In progress" orders={active} empty="Nothing on the way right now." />
            <OrderGroup title="Past orders" orders={past} empty="Your finished orders will show up here." />
          </>
        )}

        <p className="text-center text-[15px] text-muted">
          Questions about an order? Message us on IG <a href="https://instagram.com/perle.and.company">@perle.and.company</a> with your order number.
        </p>
      </main>

      <SiteFooter />
    </div>
  );
}

function OrderGroup({ title, orders, empty }: { title: string; orders: Order[]; empty: string }) {
  return (
    <section aria-label={title} className="rise rise-4 flex flex-col gap-4">
      <h2 className="font-display text-[30px] font-extrabold tracking-[-0.02em]">{title}</h2>
      {orders.length === 0 ? <p className="rounded-[24px] bg-white p-6 text-center text-muted">{empty}</p> : orders.map((o) => <OrderCard key={o.id} order={o} />)}
    </section>
  );
}

function OrderCard({ order }: { order: Order }) {
  const stepIdx = ORDER_STEPS.indexOf(order.status as (typeof ORDER_STEPS)[number]);
  const cancelled = order.status === "cancelled";

  return (
    <article className="flex flex-col gap-5 rounded-[32px] bg-white p-[clamp(20px,3vw,30px)] shadow-[0_10px_30px_rgba(0,64,160,0.06)]">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-sm text-muted">
            Order {order.id} · {order.placed}
          </p>
          <p className="mt-1 text-lg font-bold">{STATUS_LINE[order.status]}</p>
        </div>
        <p className="font-display text-[26px] font-extrabold">{formatPeso(total(order))}</p>
      </div>

      {!cancelled && (
        <ol aria-label="Order progress" className="flex gap-1.5">
          {ORDER_STEPS.map((st, i) => {
            const done = i <= stepIdx;
            return (
              <li
                key={st}
                aria-current={i === stepIdx ? "step" : undefined}
                className={`flex flex-1 flex-col gap-1.5 text-xs font-semibold ${done ? "text-ink" : "text-[#6B7A99]"}`}
              >
                <span aria-hidden className={`h-2 rounded-full ${done ? "bg-navy" : "bg-sky"}`} />
                <span className="hidden sm:inline">{STEP_LABEL[st]}</span>
                {i === stepIdx && <span className="sm:hidden">{STEP_LABEL[st]}</span>}
              </li>
            );
          })}
        </ol>
      )}

      <ul className="flex flex-col rounded-[20px] bg-ice px-4 py-1.5">
        {order.items.map((it) => {
          const p = product(it.productId);
          return (
            <li key={it.productId} className="flex items-center gap-3 border-b-2 border-white py-2.5 last:border-b-0">
              <span aria-hidden className="h-[30px] w-[30px] flex-none rounded-full border-[3px] border-white" style={{ background: p.hex }} />
              <span className="min-w-0 flex-1 font-semibold">{p.name}</span>
              <span className="text-sm text-muted">
                {it.qty} × {formatPeso(p.price)}
              </span>
            </li>
          );
        })}
      </ul>

      <dl className="flex flex-wrap gap-x-8 gap-y-2 text-[15px]">
        <div>
          <dt className="inline text-muted">Deliver to: </dt>
          <dd className="inline font-semibold">{order.address}</dd>
        </div>
        <div>
          <dt className="inline text-muted">Payment: </dt>
          <dd className="inline font-semibold">{order.payment}</dd>
        </div>
      </dl>
    </article>
  );
}
