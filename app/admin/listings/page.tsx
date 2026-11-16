"use client";

import { useState } from "react";
import { PageTitle, Pill, Toast, coralBtn, dangerBtn, inputClass, labelClass, revealIfOffscreen } from "@/components/admin/ui";
import { ProductPhoto } from "@/components/ProductPhoto";
import { Switch } from "@/components/Switch";
import { useAdmin } from "@/lib/admin-store";
import { type Product, formatPeso } from "@/lib/data";

const SWATCHES = [
  ["Gold", "#C9973A"],
  ["Pink", "#FF6EC7"],
  ["Blue", "#4C8EF0"],
  ["Yellow", "#FFD23F"],
  ["Charcoal", "#4A4A4A"],
  ["White", "#D4D4D4"],
  ["Lilac", "#C985DB"],
  ["Lime", "#9BDB4C"],
];

function stateOf(p: Product) {
  if (!p.shown) return { label: "Hidden", className: "bg-[#E6E6E6] text-[#555]" };
  if (p.stock === 0) return { label: "Sold out", className: "bg-[#FDDADA] text-crimson" };
  if (p.stock < 10) return { label: "Low stock", className: "bg-[#FFF1C7] text-[#7A5200]" };
  return { label: "In the shop", className: "bg-[#D7F2E2] text-[#14663D]" };
}

export default function ListingsPage() {
  const { products, setProducts } = useAdmin();
  const [selId, setSelId] = useState<string | null>("honey");
  const [toast, setToast] = useState("");
  const sel = products.find((p) => p.id === selId);

  function patch(changes: Partial<Product>) {
    setProducts((ps) => ps.map((p) => (p.id === selId ? { ...p, ...changes } : p)));
    setToast("");
  }
  const num = (v: string) => Math.max(0, parseInt(v, 10) || 0);

  return (
    <>
      <Toast message={toast} />
      <PageTitle
        title="Shellie listings"
        intro="Set prices and stock, and choose which colors show in the shop."
        action={
          <button
            type="button"
            className={coralBtn}
            onClick={() => {
              const id = `new-${Date.now()}`;
              setProducts((ps) => [...ps, { id, name: "New Shellie", hex: "#C985DB", tint: "#F1E4F5", price: 149, stock: 0, shown: false, description: "" }]);
              setSelId(id);
              revealIfOffscreen("listing-editor");
              setToast("New listing added. It stays hidden until you switch on Show in the shop.");
            }}
          >
            + Add a Shellie
          </button>
        }
      />

      <div className="rise rise-2 flex flex-wrap items-start gap-6">
        <div className="grid min-w-0 flex-[999_1_min(480px,100%)] grid-cols-2 gap-3 sm:grid-cols-[repeat(auto-fill,minmax(200px,1fr))] sm:gap-4">
          {products.map((p) => {
            const st = stateOf(p);
            return (
              <button
                key={p.id}
                type="button"
                onClick={() => {
                  setSelId(p.id);
                  revealIfOffscreen("listing-editor");
                }}
                className={`lift wiggle-host flex min-w-0 flex-col items-center gap-1.5 rounded-[24px] border-[3px] bg-white p-3 sm:gap-2 sm:rounded-[28px] sm:p-[18px] ${p.id === selId ? "border-navy" : "border-transparent"} ${p.shown ? "" : "opacity-60"}`}
              >
                <ProductPhoto product={p} decorative className="max-w-[150px]" />
                <span className="text-[17px] font-bold sm:text-[19px]">{p.name}</span>
                <span className="text-center text-sm sm:text-[15px]">
                  {formatPeso(p.price)} · {p.stock} in stock
                </span>
                <Pill key={st.label} className={`pop py-1! text-xs! ${st.className}`}>{st.label}</Pill>
              </button>
            );
          })}
        </div>

        {sel && (
          <form key={sel.id} id="listing-editor" aria-label="Edit listing" onSubmit={(e) => e.preventDefault()} className="pop flex min-w-0 flex-[1_1_min(340px,100%)] scroll-mt-4 flex-col gap-3.5 rounded-[28px] bg-periwinkle p-5 sm:rounded-[32px] sm:p-[26px]">
            <h2 className="font-display text-[28px] font-extrabold tracking-[-0.02em]">Edit {sel.name}</h2>
            <div className="flex flex-col gap-2">
              <span className={labelClass}>Photo</span>
              <div className="flex items-center gap-4 rounded-2xl bg-sky p-3">
                <span key={sel.image ?? "none"} className="pop block w-24 flex-none">
                  <ProductPhoto product={sel} decorative sizes="96px" />
                </span>
                <div className="flex min-w-0 flex-col gap-2">
                  <label htmlFor="l-photo" className="bubbly inline-flex h-11 cursor-pointer items-center justify-center rounded-[14px] bg-navy px-4 text-[15px] font-bold text-white">
                    {sel.image ? "Replace photo" : "Upload photo"}
                  </label>
                  <input
                    id="l-photo"
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    className="sr-only"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      e.target.value = "";
                      if (!file) return;
                      if (file.size > 5 * 1024 * 1024) {
                        setToast("That photo is over 5 MB. Choose a smaller one.");
                        return;
                      }
                      if (sel.image?.startsWith("blob:")) URL.revokeObjectURL(sel.image);
                      patch({ image: URL.createObjectURL(file) });
                    }}
                  />
                  {sel.image ? (
                    <button
                      type="button"
                      onClick={() => {
                        if (sel.image?.startsWith("blob:")) URL.revokeObjectURL(sel.image);
                        patch({ image: undefined });
                      }}
                      className="text-left text-sm font-semibold text-crimson"
                    >
                      Remove photo
                    </button>
                  ) : (
                    <span className="text-[13px] text-muted">JPG, PNG or WebP, up to 5 MB. Square photos look best.</span>
                  )}
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-1.5">
              <label htmlFor="l-name" className={labelClass}>Name</label>
              <input id="l-name" value={sel.name} onChange={(e) => patch({ name: e.target.value })} className={inputClass} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-1.5">
                <label htmlFor="l-price" className={labelClass}>Price (₱)</label>
                <input id="l-price" type="number" min={0} value={sel.price} onChange={(e) => patch({ price: num(e.target.value) })} className={inputClass} />
              </div>
              <div className="flex flex-col gap-1.5">
                <label htmlFor="l-stock" className={labelClass}>In stock</label>
                <input id="l-stock" type="number" min={0} value={sel.stock} onChange={(e) => patch({ stock: num(e.target.value) })} className={inputClass} />
              </div>
            </div>
            <fieldset>
              <legend className={`${labelClass} mb-2`}>Cord color</legend>
              <div className="flex flex-wrap gap-2">
                {SWATCHES.map(([name, hex]) => (
                  <button
                    key={hex}
                    type="button"
                    aria-label={name}
                    aria-pressed={sel.hex === hex}
                    onClick={() => patch({ hex })}
                    className="bubbly h-11 w-11 rounded-full border-4 border-white"
                    style={{ background: hex, boxShadow: sel.hex === hex ? "0 0 0 3px #0B2A5B" : undefined }}
                  />
                ))}
              </div>
            </fieldset>
            <div className="flex flex-col gap-1.5">
              <label htmlFor="l-desc" className={labelClass}>Description</label>
              <textarea id="l-desc" rows={3} value={sel.description} onChange={(e) => patch({ description: e.target.value })} className="resize-y rounded-[14px] bg-field px-3.5 py-3 text-base text-ink" />
            </div>
            <div className="flex items-center justify-between gap-3 rounded-2xl bg-sky px-3.5 py-3">
              <span className="font-semibold">Show in the shop</span>
              <Switch checked={sel.shown} label="Show in the shop" onChange={() => patch({ shown: !sel.shown })} />
            </div>
            <button
              type="button"
              className={dangerBtn}
              onClick={() => {
                const rest = products.filter((p) => p.id !== sel.id);
                setProducts(rest);
                setSelId(rest[0]?.id ?? null);
                setToast(`${sel.name} was removed from your listings.`);
              }}
            >
              Remove this listing
            </button>
          </form>
        )}
      </div>
    </>
  );
}
