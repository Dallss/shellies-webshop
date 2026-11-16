"use client";

import { useMemo, useState } from "react";
import { revealIfOffscreen } from "@/components/admin/ui";
import { orderTotal, useAdmin } from "@/lib/admin-store";
import { ORDER_STEPS, type Order, type OrderStatus, formatPeso } from "@/lib/data";

// A plain, table-first view for running the shop: scan, filter, act.

const LABEL: Record<OrderStatus, string> = {
  new: "New",
  confirmed: "Confirmed",
  packed: "Packed",
  shipped: "Shipped",
  delivered: "Delivered",
  cancelled: "Cancelled",
};

const NEXT_ACTION: Partial<Record<OrderStatus, string>> = {
  new: "Confirm order",
  confirmed: "Mark as packed",
  packed: "Mark as shipped",
  shipped: "Mark as delivered",
};

const BADGE: Record<OrderStatus, { box: string; dot: string }> = {
  new: { box: "bg-[#FDECEC] text-[#A11410]", dot: "bg-[#E5100C]" },
  confirmed: { box: "bg-[#EAF0FB] text-[#1F3F86]", dot: "bg-[#3A64C8]" },
  packed: { box: "bg-[#F1EDFB] text-[#4B2F8F]", dot: "bg-[#7A57D1]" },
  shipped: { box: "bg-[#E6F2FB] text-[#0B5584]", dot: "bg-[#1A8FD6]" },
  delivered: { box: "bg-[#E7F5EC] text-[#14663D]", dot: "bg-[#22A35A]" },
  cancelled: { box: "bg-[#F0F1F3] text-[#5B6170]", dot: "bg-[#9AA0AC]" },
};

const TABS: ("all" | OrderStatus)[] = ["all", ...ORDER_STEPS, "cancelled"];

function StatusBadge({ status }: { status: OrderStatus }) {
  const b = BADGE[status];
  return (
    <span className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-md px-2 py-0.5 text-[13px] font-medium ${b.box}`}>
      <span aria-hidden className={`h-1.5 w-1.5 rounded-full ${b.dot}`} />
      {LABEL[status]}
    </span>
  );
}

export default function OrdersPage() {
  const { orders, setOrders, products } = useAdmin();
  const [tab, setTab] = useState<"all" | OrderStatus>("all");
  const [query, setQuery] = useState("");
  const [selId, setSelId] = useState<string | undefined>(orders[0]?.id);
  const [notice, setNotice] = useState("");

  const product = (id: string) => products.find((p) => p.id === id) ?? { name: "Removed Shellie", hex: "#ccc", price: 0 };
  const itemSummary = (o: Order) => o.items.map((it) => `${it.qty} × ${product(it.productId).name}`).join(", ");

  const shown = useMemo(() => {
    const q = query.trim().toLowerCase();
    return orders.filter(
      (o) =>
        (tab === "all" || o.status === tab) &&
        (!q || [o.id, o.name, o.city, o.phone].some((v) => v.toLowerCase().includes(q))),
    );
  }, [orders, tab, query]);

  const order = orders.find((o) => o.id === selId);
  const live = orders.filter((o) => o.status !== "cancelled");
  const summary = [
    { label: "Awaiting confirmation", value: String(orders.filter((o) => o.status === "new").length) },
    { label: "To pack or ship", value: String(orders.filter((o) => o.status === "confirmed" || o.status === "packed").length) },
    { label: "Units sold", value: String(live.reduce((a, o) => a + o.items.reduce((b, it) => b + it.qty, 0), 0)) },
    { label: "Gross sales", value: formatPeso(live.reduce((a, o) => a + orderTotal(o, products), 0)) },
  ];

  function setStatus(id: string, status: OrderStatus) {
    setOrders((os) => os.map((o) => (o.id === id ? { ...o, status } : o)));
    setNotice(status === "cancelled" ? `Order ${id} was cancelled.` : `Order ${id} marked as ${LABEL[status].toLowerCase()}.`);
  }

  function select(id: string) {
    setSelId(id);
    revealIfOffscreen("order-detail");
  }

  const stepIdx = order ? ORDER_STEPS.indexOf(order.status as (typeof ORDER_STEPS)[number]) : -1;

  return (
    <div className="flex flex-col gap-5 text-[#1B2333]">
      <header className="flex flex-wrap items-end justify-between gap-3 border-b border-[#DCE2EC] pb-4">
        <div>
          <h1 className="text-2xl font-semibold sm:text-[28px] tracking-[-0.01em] text-ink">Orders</h1>
          <p className="mt-1 text-[15px] text-[#5B6578]">Review incoming orders and update their fulfilment status.</p>
        </div>
        <p className="text-sm text-[#5B6578]">{orders.length} orders in total</p>
      </header>

      {notice && (
        <p role="status" className="flex items-center justify-between gap-3 rounded-lg border border-[#B9D3F5] bg-[#EEF5FF] px-4 py-2.5 text-sm text-[#1F3F86]">
          {notice}
          <button type="button" onClick={() => setNotice("")} className="text-sm font-medium underline">
            Dismiss
          </button>
        </p>
      )}

      <dl className="grid grid-cols-2 gap-px overflow-hidden rounded-lg border border-[#DCE2EC] bg-[#DCE2EC] lg:grid-cols-4">
        {summary.map((s) => (
          <div key={s.label} className="bg-white px-4 py-3 sm:px-5 sm:py-4">
            <dt className="text-[11px] font-medium sm:text-xs uppercase tracking-[0.06em] text-[#5B6578]">{s.label}</dt>
            <dd className="mt-1 text-xl font-semibold sm:text-2xl tabular-nums text-ink">{s.value}</dd>
          </div>
        ))}
      </dl>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div role="tablist" aria-label="Filter by status" className="-mx-4 flex gap-1 overflow-x-auto border-y border-[#DCE2EC] bg-white p-1 [scrollbar-width:none] sm:mx-0 sm:flex-wrap sm:rounded-lg sm:border">
          {TABS.map((t) => {
            const count = t === "all" ? orders.length : orders.filter((o) => o.status === t).length;
            const on = tab === t;
            return (
              <button
                key={t}
                type="button"
                role="tab"
                aria-selected={on}
                onClick={() => setTab(t)}
                className={`flex-none whitespace-nowrap rounded-md px-3 py-2 text-sm font-medium transition-colors sm:py-1.5 ${on ? "bg-ink text-white" : "text-[#3A4456] hover:bg-[#F1F4F9]"}`}
              >
                {t === "all" ? "All" : LABEL[t]} <span className={`tabular-nums ${on ? "text-white/70" : "text-[#8A93A5]"}`}>{count}</span>
              </button>
            );
          })}
        </div>
        <label className="relative w-full sm:w-auto">
          <span className="sr-only">Search orders</span>
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search order no., customer or city"
            className="h-11 w-full rounded-lg border border-[#DCE2EC] bg-white px-3 text-base placeholder:text-[#8A93A5] sm:h-10 sm:w-72 sm:text-sm"
          />
        </label>
      </div>

      <div className="flex flex-wrap items-start gap-5">
        {/* Orders table */}
        <section aria-label="Orders" className="min-w-0 flex-[999_1_min(560px,100%)] overflow-hidden rounded-lg border border-[#DCE2EC] bg-white">
          <ul className="divide-y divide-[#E8ECF2] sm:hidden">
            {shown.length === 0 && <li className="px-4 py-10 text-center text-[#5B6578]">No orders match this filter.</li>}
            {shown.map((o) => {
              const on = o.id === selId;
              return (
                <li key={o.id}>
                  <button
                    type="button"
                    onClick={() => select(o.id)}
                    aria-current={on ? "true" : undefined}
                    className={`flex w-full flex-col gap-1.5 px-4 py-3.5 text-left transition-colors ${on ? "bg-[#EEF3FC] shadow-[inset_3px_0_0_#0040A0]" : "active:bg-[#F8FAFC]"}`}
                  >
                    <span className="flex items-center justify-between gap-3">
                      <span className="font-semibold tabular-nums text-navy">{o.id}</span>
                      <StatusBadge status={o.status} />
                    </span>
                    <span className="flex items-baseline justify-between gap-3">
                      <span className="min-w-0 truncate font-medium">{o.name} <span className="font-normal text-[#5B6578]">· {o.city}</span></span>
                      <span className="flex-none font-semibold tabular-nums">{formatPeso(orderTotal(o, products))}</span>
                    </span>
                    <span className="text-[13px] text-[#5B6578]">{o.placed} · {itemSummary(o)} · {o.payment}</span>
                  </button>
                </li>
              );
            })}
          </ul>
          <div className="hidden overflow-x-auto sm:block">
            <table className="w-full min-w-[720px] border-collapse text-sm">
              <thead className="bg-[#F6F8FB] text-left text-xs font-medium uppercase tracking-[0.06em] text-[#5B6578]">
                <tr>
                  <th scope="col" className="px-4 py-3">Order</th>
                  <th scope="col" className="px-4 py-3">Placed</th>
                  <th scope="col" className="px-4 py-3">Customer</th>
                  <th scope="col" className="px-4 py-3">Items</th>
                  <th scope="col" className="px-4 py-3">Payment</th>
                  <th scope="col" className="px-4 py-3 text-right">Total</th>
                  <th scope="col" className="px-4 py-3">Status</th>
                </tr>
              </thead>
              <tbody>
                {shown.length === 0 && (
                  <tr>
                    <td colSpan={7} className="px-4 py-10 text-center text-[#5B6578]">
                      No orders match this filter.
                    </td>
                  </tr>
                )}
                {shown.map((o) => {
                  const on = o.id === selId;
                  return (
                    <tr
                      key={o.id}
                      onClick={() => select(o.id)}
                      aria-selected={on}
                      className={`cursor-pointer border-t border-[#E8ECF2] transition-colors ${on ? "bg-[#EEF3FC]" : "hover:bg-[#F8FAFC]"}`}
                    >
                      <td className={`px-4 py-3 ${on ? "shadow-[inset_3px_0_0_#0040A0]" : ""}`}>
                        <button type="button" onClick={() => select(o.id)} className="whitespace-nowrap font-semibold tabular-nums text-navy hover:underline">
                          {o.id}
                        </button>
                      </td>
                      <td className="whitespace-nowrap px-4 py-3 text-[#3A4456]">{o.placed}</td>
                      <td className="px-4 py-3">
                        <div className="font-medium">{o.name}</div>
                        <div className="text-xs text-[#5B6578]">{o.city}</div>
                      </td>
                      <td className="px-4 py-3 text-[#3A4456]">{itemSummary(o)}</td>
                      <td className="whitespace-nowrap px-4 py-3 text-[#3A4456]">{o.payment}</td>
                      <td className="px-4 py-3 text-right font-medium tabular-nums">{formatPeso(orderTotal(o, products))}</td>
                      <td className="px-4 py-3">
                        <StatusBadge status={o.status} />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <p className="border-t border-[#E8ECF2] px-4 py-2.5 text-xs text-[#5B6578]">
            Showing {shown.length} of {orders.length} orders
          </p>
        </section>

        {/* Order details */}
        {order && (
          <section id="order-detail" aria-label={`Order ${order.id}`} className="min-w-0 flex-[1_1_min(340px,100%)] scroll-mt-4 rounded-lg border border-[#DCE2EC] bg-white">
            <div className="flex items-start justify-between gap-3 border-b border-[#E8ECF2] px-5 py-4">
              <div>
                <p className="text-xs font-medium uppercase tracking-[0.06em] text-[#5B6578]">Order</p>
                <h2 className="text-xl font-semibold tabular-nums text-ink">{order.id}</h2>
                <p className="text-sm text-[#5B6578]">Placed {order.placed}</p>
              </div>
              <StatusBadge status={order.status} />
            </div>

            {/* Fulfilment progress */}
            <ol aria-label="Fulfilment progress" className="flex gap-1 border-b border-[#E8ECF2] px-5 py-4">
              {ORDER_STEPS.map((st, i) => {
                const done = order.status !== "cancelled" && i <= stepIdx;
                return (
                  <li key={st} className="flex flex-1 flex-col gap-1.5" aria-current={i === stepIdx ? "step" : undefined}>
                    <span aria-hidden className={`h-1 rounded-full transition-colors duration-300 ${done ? "bg-navy" : "bg-[#E1E6EE]"}`} />
                    <span className={`hidden text-[11px] font-medium sm:inline ${done ? "text-ink" : "text-[#8A93A5]"}`}>{LABEL[st]}</span>
                    {i === stepIdx && <span className="text-[11px] font-medium text-ink sm:hidden">{LABEL[st]}</span>}
                  </li>
                );
              })}
            </ol>

            <dl className="grid grid-cols-[84px_minmax(0,1fr)] gap-x-4 sm:grid-cols-[110px_minmax(0,1fr)] gap-y-2.5 border-b border-[#E8ECF2] px-5 py-4 text-sm">
              <dt className="text-[#5B6578]">Customer</dt>
              <dd className="font-medium">{order.name}</dd>
              <dt className="text-[#5B6578]">Phone</dt>
              <dd className="tabular-nums">{order.phone}</dd>
              <dt className="text-[#5B6578]">Ship to</dt>
              <dd>{order.address}</dd>
              <dt className="text-[#5B6578]">Payment</dt>
              <dd>{order.payment}</dd>
            </dl>

            <div className="border-b border-[#E8ECF2] px-5 py-4">
              <table className="w-full text-sm">
                <caption className="mb-2 text-left text-xs font-medium uppercase tracking-[0.06em] text-[#5B6578]">Items</caption>
                <thead className="sr-only">
                  <tr>
                    <th scope="col">Item</th>
                    <th scope="col">Quantity and unit price</th>
                    <th scope="col">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {order.items.map((it) => {
                    const p = product(it.productId);
                    return (
                      <tr key={it.productId} className="border-b border-[#F0F2F6] last:border-b-0">
                        <td className="py-2">
                          <span className="flex items-center gap-2">
                            <span aria-hidden className="h-3 w-3 rounded-full ring-1 ring-black/10" style={{ background: p.hex }} />
                            {p.name}
                          </span>
                        </td>
                        <td className="py-2 text-right tabular-nums text-[#5B6578]">
                          {it.qty} × {formatPeso(p.price)}
                        </td>
                        <td className="w-24 py-2 text-right font-medium tabular-nums">{formatPeso(p.price * it.qty)}</td>
                      </tr>
                    );
                  })}
                </tbody>
                <tfoot>
                  <tr className="border-t border-[#DCE2EC]">
                    <th scope="row" colSpan={2} className="pt-3 text-left font-semibold">
                      Total
                    </th>
                    <td className="pt-3 text-right font-semibold tabular-nums">{formatPeso(orderTotal(order, products))}</td>
                  </tr>
                </tfoot>
              </table>
            </div>

            {order.note && (
              <div className="border-b border-[#E8ECF2] px-5 py-4 text-sm">
                <p className="text-xs font-medium uppercase tracking-[0.06em] text-[#5B6578]">Customer note</p>
                <p className="mt-1">{order.note}</p>
              </div>
            )}

            <div className="flex flex-wrap gap-2 px-5 py-4">
              {NEXT_ACTION[order.status] && (
                <button
                  type="button"
                  onClick={() => setStatus(order.id, ORDER_STEPS[stepIdx + 1])}
                  className="h-11 flex-1 whitespace-nowrap rounded-lg bg-navy px-4 sm:h-10 text-sm font-semibold text-white transition-colors hover:bg-ink"
                >
                  {NEXT_ACTION[order.status]}
                </button>
              )}
              {(order.status === "new" || order.status === "confirmed") && (
                <button
                  type="button"
                  onClick={() => setStatus(order.id, "cancelled")}
                  className="h-11 whitespace-nowrap rounded-lg border border-[#E3B4B2] sm:h-10 bg-white px-4 text-sm font-semibold text-[#A11410] transition-colors hover:bg-[#FDF3F3]"
                >
                  Cancel order
                </button>
              )}
              {(order.status === "delivered" || order.status === "cancelled") && (
                <p className="text-sm text-[#5B6578]">This order is closed. No further action is needed.</p>
              )}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
