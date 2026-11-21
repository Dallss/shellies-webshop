"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { useCart } from "@/lib/cart";
import { PAYMENTS, formatPeso, type Payment, type Product } from "@/lib/data";
import { ProductThumb } from "@/components/ProductPhoto";
import { placeOrderAction, type CheckoutInput } from "./actions";

type Fields = Pick<CheckoutInput, "name" | "phone" | "city" | "address" | "payment">;

const field = "h-14 w-full min-w-0 rounded-[16px] bg-ice px-4 text-base text-ink outline-none ring-navy focus:ring-2";
const label = "text-[15px] font-bold";

const PAY_HINT: Record<Payment, string> = {
  GCash: "We'll send our GCash number when we confirm your order.",
  "Cash on delivery": "Pay the rider when your Shellies arrive.",
};

export function CheckoutForm({ products, email, defaults }: { products: Product[]; email: string; defaults: Fields }) {
  const { cart, ready, remove, clear } = useCart();
  const router = useRouter();
  const [form, setForm] = useState<Fields & { note: string }>({ ...defaults, note: "" });
  const [error, setError] = useState<{ msg: string; field?: string } | null>(null);
  const [pending, startTransition] = useTransition();

  const lines = products.filter((p) => (cart[p.id] ?? 0) > 0).map((p) => ({ p, qty: cart[p.id] }));
  const gone = Object.keys(cart).filter((id) => cart[id] > 0 && !products.some((p) => p.id === id));
  const subtotal = lines.reduce((a, l) => a + l.p.price * l.qty, 0);
  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm((f) => ({ ...f, [k]: e.target.value }));
    if (error?.field === k) setError(null);
  };

  if (!ready) return <div aria-busy="true" className="mt-8 min-h-[50vh]" />;

  if (lines.length === 0) {
    return (
      <div className="pop mt-10 rounded-[32px] bg-white p-10 text-center">
        <p className="text-lg font-semibold">Your cart is empty.</p>
        <Link href="/shop" className="bubbly mt-5 inline-flex h-14 items-center rounded-[18px] bg-navy px-7 font-semibold text-sky no-underline">
          Visit the shop
        </Link>
      </div>
    );
  }

  function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const order: Record<string, number> = {};
    for (const l of lines) order[l.p.id] = l.qty;
    startTransition(async () => {
      const res = await placeOrderAction({ ...form, cart: order }).catch(() => null);
      if (!res) return setError({ msg: "We couldn't reach the shop. Check your connection and try again." });
      if (!res.ok) return setError({ msg: res.error, field: res.field });
      clear();
      router.push(`/account?placed=${encodeURIComponent(res.orderId)}`);
    });
  }

  const invalid = (k: string) => (error?.field === k ? { "aria-invalid": true, "aria-describedby": "checkout-error" } : {});

  return (
    <form onSubmit={submit} className="rise rise-3 mt-8 flex flex-wrap items-start gap-6" noValidate>
      <section aria-label="Delivery details" className="flex min-w-0 flex-[999_1_min(480px,100%)] flex-col gap-4 rounded-[32px] bg-white p-[clamp(20px,3vw,32px)]">
        <h2 className="font-display text-[28px] font-extrabold tracking-[-0.02em]">Delivery details</h2>
        <p className="-mt-2 text-[15px] text-muted">
          Ordering as <b className="text-ink">{email}</b>
        </p>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="c-name" className={label}>Full name</label>
          <input id="c-name" autoComplete="name" value={form.name} onChange={set("name")} className={field} {...invalid("name")} />
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="c-phone" className={label}>Mobile number</label>
          <input id="c-phone" type="tel" inputMode="tel" autoComplete="tel" placeholder="0917 123 4567" value={form.phone} onChange={set("phone")} className={field} {...invalid("phone")} />
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="c-address" className={label}>Address</label>
          <input id="c-address" autoComplete="street-address" placeholder="House no., street, barangay" value={form.address} onChange={set("address")} className={field} {...invalid("address")} />
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="c-city" className={label}>City or municipality</label>
          <input id="c-city" autoComplete="address-level2" placeholder="e.g. Cebu City" value={form.city} onChange={set("city")} className={field} {...invalid("city")} />
        </div>
        <fieldset className="flex flex-col gap-2">
          <legend className={`${label} mb-2`}>Payment</legend>
          {PAYMENTS.map((p) => (
            <label key={p} className={`flex cursor-pointer items-start gap-3 rounded-[16px] border-[3px] px-4 py-3 ${form.payment === p ? "border-navy bg-ice" : "border-transparent bg-ice/60"}`}>
              <input type="radio" name="payment" value={p} checked={form.payment === p} onChange={() => setForm((f) => ({ ...f, payment: p }))} className="mt-1 h-5 w-5 accent-navy" />
              <span>
                <span className="block font-bold">{p}</span>
                <span className="block text-sm text-muted">{PAY_HINT[p]}</span>
              </span>
            </label>
          ))}
        </fieldset>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="c-note" className={label}>
            Note <span className="font-normal text-muted">(optional)</span>
          </label>
          <textarea id="c-note" rows={3} maxLength={500} placeholder="Anything we should know, like gift wrapping" value={form.note} onChange={set("note")} className="resize-y rounded-[16px] bg-ice px-4 py-3 text-base text-ink outline-none ring-navy focus:ring-2" />
        </div>
      </section>

      <aside aria-label="Order summary" className="flex min-w-0 flex-[1_1_min(320px,100%)] flex-col gap-4 rounded-[32px] bg-white p-[clamp(20px,3vw,28px)]">
        <h2 className="font-display text-[28px] font-extrabold tracking-[-0.02em]">Your order</h2>
        {lines.map(({ p, qty }) => (
          <div key={p.id} className="flex items-center gap-3.5 rounded-[20px] bg-ice px-3.5 py-3">
            <ProductThumb product={p} className="h-12 w-12" />
            <div className="min-w-0 flex-1">
              <div className="font-bold">{p.name}</div>
              <div className="text-sm text-muted">
                {qty} × {formatPeso(p.price)}
                {qty > p.stock && <span className="ml-1 font-semibold text-crimson">· only {p.stock} left</span>}
              </div>
            </div>
            <div className="font-bold">{formatPeso(qty * p.price)}</div>
            <button type="button" onClick={() => remove(p.id)} aria-label={`Remove ${p.name}`} className="bubbly h-10 w-10 flex-none rounded-[10px] text-xl text-crimson">
              ×
            </button>
          </div>
        ))}
        {gone.length > 0 && (
          <p className="rounded-2xl bg-mist px-4 py-3 text-sm text-ink">
            {gone.length === 1 ? "One item" : `${gone.length} items`} in your cart {gone.length === 1 ? "is" : "are"} no longer sold and won&apos;t be ordered.{" "}
            <button type="button" className="font-semibold underline" onClick={() => gone.forEach(remove)}>Remove</button>
          </p>
        )}
        <div className="flex flex-col gap-2 border-t-2 border-sky pt-4 text-[15px]">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span className="font-bold">{formatPeso(subtotal)}</span>
          </div>
          <div className="flex justify-between text-muted">
            <span>Shipping</span>
            <span>We&apos;ll confirm it with you</span>
          </div>
        </div>
        {error && (
          <p id="checkout-error" role="alert" className="jelly rounded-2xl bg-blush px-4 py-3 text-[15px] font-semibold text-crimson">
            {error.msg}
          </p>
        )}
        <button type="submit" disabled={pending} className="bubbly h-[60px] rounded-[18px] bg-navy text-lg font-bold text-sky disabled:opacity-60">
          {pending ? "Placing your order…" : `Place order · ${formatPeso(subtotal)}`}
        </button>
        <Link href="/shop" className="text-center text-[15px] font-semibold text-navy">
          ← Keep shopping
        </Link>
      </aside>
    </form>
  );
}
