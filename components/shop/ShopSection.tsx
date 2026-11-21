"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Mascot } from "@/components/art";
import { ProductPhoto, ProductThumb } from "@/components/ProductPhoto";
import { useCart } from "@/lib/cart";
import { formatPeso, type Product } from "@/lib/data";

const FEATURES = ["Adjustable cord, fits most wrists", "NFC tag, no battery to charge", "Edit what it shows any time"];

export function ShopSection({ products }: { products: Product[] }) {
  const { cart, add, remove } = useCart();
  const [selId, setSelId] = useState(products[0]?.id ?? "");
  const [qty, setQty] = useState(1);

  const sel = products.find((p) => p.id === selId) ?? products[0];
  const lines = products.filter((p) => (cart[p.id] ?? 0) > 0);
  const subtotal = lines.reduce((a, p) => a + p.price * cart[p.id], 0);
  const lineCount = lines.reduce((a, p) => a + cart[p.id], 0);
  // How many more of a listing fit in the cart without going over what's in stock.
  const room = (p: Product) => Math.max(0, p.stock - (cart[p.id] ?? 0));

  if (!sel) {
    return (
      <section className="mx-auto max-w-[1240px] px-5 pb-24 pt-16 text-center sm:px-6">
        <h1 className="font-display text-[clamp(42px,6vw,76px)] font-extrabold leading-[0.95] tracking-[-0.035em] text-ink">Back soon!</h1>
        <p className="mt-4 text-[19px]">We&apos;re restocking. Follow <a href="https://instagram.com/perle.and.company">@perle.and.company</a> for the next drop.</p>
      </section>
    );
  }
  const soldOut = sel.stock === 0;
  const maxQty = room(sel);

  return (
    <>
      <section id="shop" className="mx-auto max-w-[1240px] scroll-mt-6 px-5 pb-6 pt-8 sm:px-6 sm:pt-16">
        <h1 className="rise rise-1 font-display text-[clamp(42px,6vw,76px)] font-extrabold leading-[0.95] tracking-[-0.035em] text-ink">
          The <i>Shellie</i> Collection
        </h1>
        <p className="rise rise-2 mt-3 text-[17px] sm:text-[19px]">Made to your taste. Every Shellie comes with its NFC tag ready to set up.</p>

        <div className="rise rise-3 mt-8 flex flex-wrap items-stretch gap-5 sm:mt-10 sm:gap-8">
          {sel.image ? (
            // The photo is the panel: its own studio backdrop fills the space edge to edge.
            <div className="relative min-h-[340px] min-w-0 flex-[1_1_min(480px,100%)] overflow-hidden rounded-[32px] sm:min-h-[460px] sm:rounded-[40px]" style={{ background: sel.tint }}>
              <Image key={sel.id} src={sel.image} alt={`${sel.name} Shellie`} fill priority sizes="(max-width: 640px) 100vw, 640px" className="fade-in object-cover" />
            </div>
          ) : (
            <div className="relative flex min-h-[320px] min-w-0 flex-[1_1_min(480px,100%)] items-center justify-center overflow-hidden rounded-[32px] bg-white py-8 sm:min-h-[460px] sm:rounded-[40px]">
              <div key={`tint-${sel.id}`} aria-hidden className="pop absolute left-1/2 top-1/2 h-[260px] w-[260px] -translate-x-1/2 -translate-y-1/2 rounded-full sm:h-[340px] sm:w-[340px]" style={{ background: sel.tint }} />
              <div key={sel.id} className="pop relative flex w-[72%] max-w-[440px] justify-center sm:w-[78%]">
                <ProductPhoto product={sel} priority sizes="(max-width: 640px) 80vw, 440px" className="bob" />
              </div>
              <div aria-hidden className="absolute bottom-0 left-6 h-[48px] w-[100px] overflow-hidden sm:left-9 sm:h-[62px] sm:w-[130px]">
                <Mascot className="bob block w-[100px] sm:w-[130px]" />
              </div>
            </div>
          )}

          <div className="flex min-w-0 flex-[1_1_min(380px,100%)] flex-col gap-[22px] rounded-[32px] bg-navy sm:rounded-[40px] p-[clamp(24px,3.4vw,44px)] text-white">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.06em] text-sky-2">Signature Collection · Original edition</p>
              <h3 key={sel.id} className="pop mt-2 font-display text-[44px] font-extrabold sm:text-[54px] leading-none tracking-[-0.03em]">{sel.name}</h3>
              <p className="mt-2 text-[26px] font-bold sm:mt-2.5 sm:text-[30px]">{formatPeso(sel.price)}</p>
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
                    className="bubbly h-12 w-12 rounded-full border-4 border-white p-0 sm:h-[52px] sm:w-[52px]"
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
                <button type="button" aria-label="Decrease quantity" onClick={() => setQty((q) => Math.max(1, q - 1))} className="bubbly h-[60px] w-[52px] text-[26px] font-bold">
                  −
                </button>
                <span aria-live="polite" className="min-w-7 text-center text-xl font-bold">
                  <span key={qty} className="jelly inline-block">{qty}</span>
                </span>
                <button type="button" aria-label="Increase quantity" onClick={() => setQty((q) => Math.min(Math.max(1, maxQty), 20, q + 1))} className="bubbly h-[60px] w-[52px] text-[26px] font-bold">
                  +
                </button>
              </div>
              <button
                type="button"
                disabled={soldOut || maxQty === 0}
                onClick={() => {
                  add(sel.id, Math.min(qty, maxQty));
                  setQty(1);
                }}
                className="bubbly h-[60px] flex-[1_1_200px] rounded-[18px] bg-sky text-[19px] font-bold text-ink disabled:cursor-not-allowed disabled:opacity-60"
              >
                {soldOut ? "Sold out" : maxQty === 0 ? "All in your cart" : `Add to cart · ${formatPeso(sel.price * Math.min(qty, maxQty))}`}
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto flex max-w-[1240px] flex-wrap items-start gap-8 px-5 pb-20 pt-10 sm:px-6 sm:pb-24 sm:pt-12">
        <div className="min-w-0 flex-[999_1_min(600px,100%)]">
          <h3 className="text-center font-display text-[32px] font-extrabold leading-tight tracking-[-0.03em] sm:text-[40px]">The Signature Collection</h3>
          <p className="mt-1.5 text-center font-semibold text-navy">The original edition</p>
          {/* Horizontal row: card widths leave the next card partly visible so it's clear the row scrolls.
              On phones it bleeds to the screen edge; py-4 keeps card shadows and hover lift from being clipped. */}
          <div
            role="list"
            aria-label="Signature Collection colors"
            className="reveal -mx-5 mt-4 flex snap-x snap-mandatory scroll-px-5 gap-[22px] overflow-x-auto overscroll-x-contain px-5 py-4 [scrollbar-width:none] sm:mx-0 sm:scroll-px-0 sm:px-0 sm:[scrollbar-width:thin]"
          >
            {products.map((p) => (
              <div key={p.id} role="listitem" className={`lift flex w-[72%] flex-none snap-start flex-col items-center gap-2.5 overflow-hidden rounded-[26px] bg-white pb-5 shadow-[0_10px_30px_rgba(0,64,160,0.06)] sm:w-[42%] sm:rounded-[30px] sm:pb-[22px] lg:w-[30%] ${p.image ? "" : "wiggle-host pt-5 sm:pt-[22px]"}`}>
                <button type="button" onClick={() => setSelId(p.id)} aria-label={`View ${p.name}`} className="w-full">
                  {p.image ? (
                    <ProductPhoto product={p} decorative rounded="" sizes="(max-width: 640px) 72vw, 300px" />
                  ) : (
                    <ProductPhoto product={p} decorative className="mx-auto max-w-[180px]" />
                  )}
                </button>
                <div className="mt-1 text-xl font-bold text-[#111]">{p.name}</div>
                <div className="flex items-center gap-2">
                  <span className="inline-flex h-11 items-center rounded-xl bg-sky-2 px-4 font-bold text-navy">{formatPeso(p.price)}</span>
                  <button
                    type="button"
                    disabled={room(p) === 0}
                    onClick={() => add(p.id, 1)}
                    aria-label={p.stock === 0 ? `${p.name} is sold out` : `Add ${p.name} to cart`}
                    className="bubbly h-11 w-11 rounded-xl bg-navy text-2xl font-semibold text-white disabled:opacity-40"
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

        <aside id="cart" aria-label="Cart" className="reveal flex min-w-0 flex-[1_1_min(320px,100%)] scroll-mt-6 flex-col gap-4 rounded-[28px] bg-white p-5 sm:rounded-[32px] sm:p-7">
          <h3 className="font-display text-[32px] font-extrabold tracking-[-0.02em]">Your cart</h3>
          {lines.length === 0 && (
            <div className="pop rounded-[20px] bg-mist p-6 text-center text-ink">
              <p className="font-semibold">No Shellies yet.</p>
              <p className="mt-1.5 text-sm">Pick a color and tap &ldquo;Add to cart&rdquo;.</p>
            </div>
          )}
          {lines.map((p) => (
            <div key={p.id} className="pop flex items-center gap-3.5 rounded-[20px] bg-ice px-3.5 py-3">
              <ProductThumb product={p} />
              <div className="min-w-0 flex-1">
                <div className="font-bold">{p.name}</div>
                <div className="text-sm text-muted">
                  {cart[p.id]} × {formatPeso(p.price)}
                </div>
              </div>
              <div key={cart[p.id]} className="jelly font-bold">{formatPeso(cart[p.id] * p.price)}</div>
              <button type="button" onClick={() => remove(p.id)} aria-label={`Remove ${p.name}`} className="bubbly h-10 w-10 flex-none rounded-[10px] text-xl text-crimson">
                ×
              </button>
            </div>
          ))}
          <div className="flex flex-col gap-2 border-t-2 border-sky pt-4 text-[15px]">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span key={subtotal} className="jelly font-bold">{formatPeso(subtotal)}</span>
            </div>
            <div className="flex justify-between text-muted">
              <span>Shipping</span>
              <span>We&apos;ll confirm it with you</span>
            </div>
          </div>
          {lineCount > 0 ? (
            <Link href="/checkout" className="bubbly flex h-[60px] items-center justify-center rounded-[18px] bg-navy text-lg font-bold text-sky no-underline">
              Checkout
            </Link>
          ) : (
            <button type="button" disabled className="h-[60px] rounded-[18px] bg-navy text-lg font-bold text-sky opacity-50">
              Checkout
            </button>
          )}
          <p className="text-center text-sm text-muted">
            Or order on our IG! <a href="https://instagram.com/perle.and.company">@perle.and.company</a>
          </p>
        </aside>
      </section>
    </>
  );
}
