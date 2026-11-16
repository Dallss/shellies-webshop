"use client";

import { useState } from "react";
import { Bracelet, Crab } from "@/components/art";
import { useCart } from "@/lib/cart";
import { PRODUCTS, formatPeso } from "@/lib/data";

const FEATURES = ["Adjustable cord, fits most wrists", "NFC tag, no battery to charge", "Edit what it shows any time"];

export function ShopSection() {
  const products = PRODUCTS.filter((p) => p.shown);
  const { cart, add, remove, count } = useCart();
  const [selId, setSelId] = useState(products[0]?.id ?? "");
  const [qty, setQty] = useState(1);
  const [checkoutMsg, setCheckoutMsg] = useState(false);

  const sel = products.find((p) => p.id === selId) ?? products[0];
  const soldOut = sel.stock === 0;
  const lines = products.filter((p) => (cart[p.id] ?? 0) > 0);
  const subtotal = lines.reduce((a, p) => a + p.price * cart[p.id], 0);

  return (
    <>
      <section id="shop" className="mx-auto max-w-[1240px] scroll-mt-6 px-6 pb-6 pt-16">
        <h2 className="font-display text-[clamp(42px,6vw,76px)] font-extrabold leading-[0.95] tracking-[-0.035em] text-navy">
          The <i>Shellie</i> Collection
        </h2>
        <p className="mt-3 text-[19px]">Made to your taste. Every Shellie comes with its NFC tag ready to set up.</p>

        <div className="mt-10 flex flex-wrap items-stretch gap-8">
          <div className="relative flex min-h-[460px] min-w-0 flex-[1_1_480px] items-center justify-center overflow-hidden rounded-[40px] bg-white">
            <div aria-hidden className="absolute left-1/2 top-1/2 h-[340px] w-[340px] -translate-x-1/2 -translate-y-1/2 rounded-full" style={{ background: sel.tint }} />
            <Bracelet hex={sel.hex} label={`${sel.name} Shellie`} className="relative w-[78%] max-w-[440px]" />
            <div aria-hidden className="absolute bottom-0 left-9 h-[62px] w-[130px] overflow-hidden">
              <Crab className="block w-[130px]" />
            </div>
          </div>

          <div className="flex min-w-0 flex-[1_1_380px] flex-col gap-[22px] rounded-[40px] bg-navy p-[clamp(24px,3.4vw,44px)] text-white">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.06em] text-sky-2">Signature Collection · Original edition</p>
              <h3 className="mt-2 font-display text-[54px] font-extrabold leading-none tracking-[-0.03em]">{sel.name}</h3>
              <p className="mt-2.5 text-[30px] font-bold">{formatPeso(sel.price)}</p>
            </div>
            <div>
              <p className="mb-3 text-[15px] font-semibold">Color: {sel.name}</p>
              <div role="radiogroup" aria-label="Bracelet color" className="flex flex-wrap gap-3">
                {products.map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    role="radio"
                    aria-checked={p.id === sel.id}
                    aria-label={p.name}
                    onClick={() => setSelId(p.id)}
                    className="h-[52px] w-[52px] rounded-full border-4 border-white p-0"
                    style={{ background: p.hex, boxShadow: p.id === sel.id ? "0 0 0 3px #F2312E" : undefined }}
                  />
                ))}
              </div>
            </div>
            <ul className="flex flex-col gap-2.5 text-[15px] text-sky">
              {FEATURES.map((f) => (
                <li key={f} className="flex items-center gap-2.5">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#BCD5FA" strokeWidth="2.5" strokeLinecap="round" aria-hidden>
                    <path d="M5 12.5l4.5 4.5L19 7.5" />
                  </svg>
                  {f}
                </li>
              ))}
            </ul>
            <div className="mt-auto flex flex-wrap gap-3.5">
              <div className="flex h-[60px] items-center rounded-[18px] bg-sky text-navy">
                <button type="button" aria-label="Decrease quantity" onClick={() => setQty((q) => Math.max(1, q - 1))} className="h-[60px] w-[52px] text-[26px] font-bold">
                  −
                </button>
                <span aria-live="polite" className="min-w-7 text-center text-xl font-bold">
                  {qty}
                </span>
                <button type="button" aria-label="Increase quantity" onClick={() => setQty((q) => Math.min(20, q + 1))} className="h-[60px] w-[52px] text-[26px] font-bold">
                  +
                </button>
              </div>
              <button
                type="button"
                disabled={soldOut}
                onClick={() => {
                  add(sel.id, qty);
                  setQty(1);
                }}
                className="h-[60px] flex-[1_1_200px] rounded-[18px] bg-salmon text-[19px] font-bold text-maroon disabled:cursor-not-allowed disabled:opacity-60"
              >
                {soldOut ? "Sold out" : `Add to cart · ${formatPeso(sel.price * qty)}`}
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto flex max-w-[1240px] flex-wrap items-start gap-8 px-6 pb-24 pt-12">
        <div className="min-w-0 flex-[999_1_600px]">
          <h3 className="text-center font-display text-[40px] font-extrabold tracking-[-0.03em]">The Signature Collection</h3>
          <p className="mt-1.5 text-center font-semibold text-navy">The original edition</p>
          <div className="mt-8 grid grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-[22px]">
            {products.map((p) => (
              <div key={p.id} className="flex flex-col items-center gap-2.5 rounded-[30px] bg-white px-[18px] py-[22px] shadow-[0_10px_30px_rgba(0,64,160,0.06)]">
                <button type="button" onClick={() => setSelId(p.id)} aria-label={`View ${p.name}`} className="w-full">
                  <Bracelet hex={p.hex} className="mx-auto w-full max-w-[180px]" />
                </button>
                <div className="text-xl font-bold text-[#111]">{p.name}</div>
                <div className="flex items-center gap-2">
                  <span className="inline-flex h-11 items-center rounded-xl bg-sky-2 px-4 font-bold text-navy">{formatPeso(p.price)}</span>
                  <button
                    type="button"
                    disabled={p.stock === 0}
                    onClick={() => add(p.id, 1)}
                    aria-label={p.stock === 0 ? `${p.name} is sold out` : `Add ${p.name} to cart`}
                    className="h-11 w-11 rounded-xl bg-navy text-2xl font-semibold text-white disabled:opacity-40"
                  >
                    +
                  </button>
                </div>
                {p.stock === 0 && <span className="text-[13px] font-semibold text-crimson">Sold out</span>}
              </div>
            ))}
          </div>
          <p className="mt-10 text-center text-[17px]">That&apos;s it… for now! :3</p>
        </div>

        <aside id="cart" aria-label="Cart" className="flex min-w-0 flex-[1_1_320px] scroll-mt-6 flex-col gap-4 rounded-[32px] bg-white p-7">
          <h3 className="font-display text-[32px] font-extrabold tracking-[-0.02em]">Your cart</h3>
          {lines.length === 0 && (
            <div className="rounded-[20px] bg-blush p-6 text-center text-maroon">
              <p className="font-semibold">No Shellies yet.</p>
              <p className="mt-1.5 text-sm">Pick a color and tap &ldquo;Add to cart&rdquo;.</p>
            </div>
          )}
          {lines.map((p) => (
            <div key={p.id} className="flex items-center gap-3.5 rounded-[20px] bg-ice px-3.5 py-3">
              <span aria-hidden className="h-11 w-11 flex-none rounded-full border-[3px] border-white" style={{ background: p.hex }} />
              <div className="min-w-0 flex-1">
                <div className="font-bold">{p.name}</div>
                <div className="text-sm text-muted">
                  {cart[p.id]} × {formatPeso(p.price)}
                </div>
              </div>
              <div className="font-bold">{formatPeso(cart[p.id] * p.price)}</div>
              <button type="button" onClick={() => remove(p.id)} aria-label={`Remove ${p.name}`} className="h-9 w-9 rounded-[10px] text-xl text-crimson">
                ×
              </button>
            </div>
          ))}
          <div className="flex flex-col gap-2 border-t-2 border-sky pt-4 text-[15px]">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span className="font-bold">{formatPeso(subtotal)}</span>
            </div>
            <div className="flex justify-between text-muted">
              <span>Shipping</span>
              <span>Calculated at checkout</span>
            </div>
          </div>
          <button
            type="button"
            disabled={count === 0}
            onClick={() => setCheckoutMsg(true)}
            className="h-[60px] rounded-[18px] bg-navy text-lg font-bold text-sky disabled:opacity-50"
          >
            Checkout
          </button>
          {checkoutMsg && (
            <p role="status" className="rounded-2xl bg-blush px-4 py-3 text-sm text-maroon">
              Online checkout is coming soon. For now, please order on our Instagram.
            </p>
          )}
          <p className="text-center text-sm text-muted">
            Or order on our IG! <a href="https://instagram.com/perle.and.company">@perle.and.company</a>
          </p>
        </aside>
      </section>
    </>
  );
}
