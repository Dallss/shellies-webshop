"use client";

import { useState } from "react";
import { PageTitle, Pill, Toast, dangerBtn, primaryBtn } from "@/components/admin/ui";
import { orderTotal, useAdmin } from "@/lib/admin-store";
import { ORDER_STEPS, type OrderStatus, formatPeso } from "@/lib/data";

const LABEL: Record<OrderStatus, string> = { new: "New", confirmed: "Confirmed", packed: "Packed", shipped: "Shipped", delivered: "Delivered", cancelled: "Cancelled" };
const NEXT_LABEL: Partial<Record<OrderStatus, string>> = { new: "Confirm order", confirmed: "Mark as packed", packed: "Mark as shipped", shipped: "Mark as delivered" };
const PILL: Record<OrderStatus, string> = {
  new: "bg-coral text-white",
  confirmed: "bg-sky text-navy",
  packed: "bg-sky-2 text-ink",
  shipped: "bg-navy text-white",
  delivered: "bg-[#D7F2E2] text-[#14663D]",
  cancelled: "bg-[#E6E6E6] text-[#555]",
};
const FILTERS: ("all" | OrderStatus)[] = ["all", ...ORDER_STEPS];

export default function OrdersPage() {
  const { orders, setOrders, products } = useAdmin();
  const [filter, setFilter] = useState<"all" | OrderStatus>("all");
  const [selId, setSelId] = useState(orders[0]?.id);
  const [toast, setToast] = useState("");

  const product = (id: string) => products.find((p) => p.id === id) ?? { name: "Removed Shellie", hex: "#ccc", price: 0 };
  const live = orders.filter((o) => o.status !== "cancelled");
  const shown = orders.filter((o) => filter === "all" || o.status === filter);
  const order = orders.find((o) => o.id === selId);

  function setStatus(id: string, status: OrderStatus) {
    setOrders((os) => os.map((o) => (o.id === id ? { ...o, status } : o)));
    setToast(status === "cancelled" ? `${id} was cancelled.` : `${id} is now ${LABEL[status].toLowerCase()}.`);
  }

  const stats = [
    { label: "New, need confirming", value: orders.filter((o) => o.status === "new").length, hot: true },
    { label: "To pack or ship", value: orders.filter((o) => o.status === "confirmed" || o.status === "packed").length },
    { label: "Shellies sold", value: live.reduce((a, o) => a + o.items.reduce((b, it) => b + it.qty, 0), 0) },
    { label: "Sales", value: formatPeso(live.reduce((a, o) => a + orderTotal(o, products), 0)) },
  ];

  const stepIdx = order ? ORDER_STEPS.indexOf(order.status as (typeof ORDER_STEPS)[number]) : -1;

  return (
    <>
      <Toast message={toast} />
      <PageTitle title="Orders" intro="Confirm new orders, then move each one along as you pack and ship it." />

      <div className="grid grid-cols-[repeat(auto-fit,minmax(190px,1fr))] gap-3.5">
        {stats.map((s) => (
          <div key={s.label} className={`rounded-[26px] p-5 ${s.hot ? "bg-coral text-white" : "bg-white"}`}>
            <p className={`text-sm font-semibold ${s.hot ? "" : "text-muted"}`}>{s.label}</p>
            <p className="mt-1.5 font-display text-[44px] font-extrabold leading-none">{s.value}</p>
          </div>
        ))}
      </div>

      <div role="group" aria-label="Filter orders" className="flex flex-wrap gap-2">
        {FILTERS.map((f) => (
          <button
            key={f}
            type="button"
            aria-pressed={filter === f}
            onClick={() => setFilter(f)}
            className={`h-11 rounded-full px-4 text-[15px] font-semibold ${filter === f ? "bg-ink text-white" : "bg-white text-ink"}`}
          >
            {f === "all" ? "All" : LABEL[f]} · {f === "all" ? orders.length : orders.filter((o) => o.status === f).length}
          </button>
        ))}
      </div>

      <div className="flex flex-wrap items-start gap-6">
        <div className="flex min-w-0 flex-[999_1_480px] flex-col gap-2.5">
          {shown.length === 0 && <p className="rounded-[22px] bg-white p-6 text-center">No orders here right now.</p>}
          {shown.map((o) => (
            <button
              key={o.id}
              type="button"
              onClick={() => setSelId(o.id)}
              className={`flex w-full flex-wrap items-center gap-x-4 gap-y-3 rounded-[22px] border-[3px] bg-white px-[18px] py-4 text-left ${o.id === selId ? "border-navy" : "border-transparent"}`}
            >
              <span className="flex min-w-0 flex-[1_1_200px] flex-col gap-0.5">
                <span className="text-base font-bold">{o.name}</span>
                <span className="text-sm text-muted">
                  {o.id} · {o.placed} · {o.city}
                </span>
              </span>
              <span className="flex gap-1" aria-label={o.items.map((it) => `${it.qty} ${product(it.productId).name}`).join(", ")}>
                {o.items.map((it) => (
                  <span key={it.productId} aria-hidden className="h-[22px] w-[22px] rounded-full border-[3px] border-white shadow-[0_0_0_1px_#DCE8FD]" style={{ background: product(it.productId).hex }} />
                ))}
              </span>
              <span className="min-w-16 text-right font-bold">{formatPeso(orderTotal(o, products))}</span>
              <Pill className={`min-w-24 ${PILL[o.status]}`}>{LABEL[o.status]}</Pill>
            </button>
          ))}
        </div>

        {order && (
          <section aria-label="Order details" className="flex min-w-0 flex-[1_1_340px] flex-col gap-[18px] rounded-[32px] bg-white p-[26px]">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-sm text-muted">
                  {order.id} · {order.placed}
                </p>
                <h2 className="mt-1 font-display text-[30px] font-extrabold leading-[1.05] tracking-[-0.02em]">{order.name}</h2>
              </div>
              <Pill className={PILL[order.status]}>{LABEL[order.status]}</Pill>
            </div>

            <ol className="flex gap-1.5">
              {ORDER_STEPS.map((st, i) => {
                const done = order.status !== "cancelled" && i <= stepIdx;
                return (
                  <li key={st} className={`flex flex-1 flex-col gap-1.5 text-xs font-semibold ${done ? "text-ink" : "text-[#6B7A99]"}`}>
                    <span aria-hidden className={`h-2 rounded-full ${order.status === "cancelled" ? "bg-[#E6E6E6]" : done ? "bg-navy" : "bg-sky"}`} />
                    {LABEL[st]}
                  </li>
                );
              })}
            </ol>

            <dl className="flex flex-col gap-2.5 text-[15px]">
              {[
                ["Phone", order.phone],
                ["Deliver to", order.address],
                ["Payment", order.payment],
              ].map(([k, v]) => (
                <div key={k} className="flex justify-between gap-4">
                  <dt className="text-muted">{k}</dt>
                  <dd className="text-right font-semibold">{v}</dd>
                </div>
              ))}
            </dl>

            <div className="rounded-[20px] bg-ice px-4 py-1.5">
              {order.items.map((it) => {
                const p = product(it.productId);
                return (
                  <div key={it.productId} className="flex items-center gap-3 border-b-2 border-white py-2.5">
                    <span aria-hidden className="h-[30px] w-[30px] flex-none rounded-full border-[3px] border-white" style={{ background: p.hex }} />
                    <span className="min-w-0 flex-1 font-semibold">{p.name}</span>
                    <span className="text-sm text-muted">
                      {it.qty} × {formatPeso(p.price)}
                    </span>
                    <span className="min-w-14 text-right font-bold">{formatPeso(p.price * it.qty)}</span>
                  </div>
                );
              })}
              <div className="flex justify-between py-3 text-[17px] font-bold">
                <span>Total</span>
                <span>{formatPeso(orderTotal(order, products))}</span>
              </div>
            </div>

            {order.note && (
              <p className="rounded-2xl bg-blush px-3.5 py-3 text-sm text-maroon">
                <b>Customer note:</b> {order.note}
              </p>
            )}

            <div className="flex flex-wrap gap-2.5">
              {NEXT_LABEL[order.status] && (
                <button type="button" onClick={() => setStatus(order.id, ORDER_STEPS[stepIdx + 1])} className={`flex-[1_1_200px] ${primaryBtn}`}>
                  {NEXT_LABEL[order.status]}
                </button>
              )}
              {(order.status === "new" || order.status === "confirmed") && (
                <button type="button" onClick={() => setStatus(order.id, "cancelled")} className={dangerBtn}>
                  Cancel order
                </button>
              )}
              {(order.status === "delivered" || order.status === "cancelled") && (
                <p className="text-sm text-muted">This order is finished. Nothing left to do.</p>
              )}
            </div>
          </section>
        )}
      </div>
    </>
  );
}
