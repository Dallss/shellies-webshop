"use client";

import { useState } from "react";
import { PageTitle, Pill, Toast, coralBtn, dangerBtn, inputClass, labelClass } from "@/components/admin/ui";
import { Bracelet } from "@/components/art";
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
              setToast("New listing added. It stays hidden until you switch on Show in the shop.");
            }}
          >
            + Add a Shellie
          </button>
        }
      />

      <div className="flex flex-wrap items-start gap-6">
        <div className="grid min-w-0 flex-[999_1_480px] grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-4">
          {products.map((p) => {
            const st = stateOf(p);
            return (
              <button
                key={p.id}
                type="button"
                onClick={() => setSelId(p.id)}
                className={`flex flex-col items-center gap-2 rounded-[28px] border-[3px] bg-white p-[18px] ${p.id === selId ? "border-navy" : "border-transparent"} ${p.shown ? "" : "opacity-60"}`}
              >
                <Bracelet hex={p.hex} className="w-full max-w-[150px]" />
                <span className="text-[19px] font-bold">{p.name}</span>
                <span className="text-[15px]">
                  {formatPeso(p.price)} · {p.stock} in stock
                </span>
                <Pill className={`py-1! text-xs! ${st.className}`}>{st.label}</Pill>
              </button>
            );
          })}
        </div>

        {sel && (
          <form aria-label="Edit listing" onSubmit={(e) => e.preventDefault()} className="flex min-w-0 flex-[1_1_340px] flex-col gap-3.5 rounded-[32px] bg-periwinkle p-[26px]">
            <h2 className="font-display text-[28px] font-extrabold tracking-[-0.02em]">Edit {sel.name}</h2>
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
                    className="h-11 w-11 rounded-full border-4 border-white"
                    style={{ background: hex, boxShadow: sel.hex === hex ? "0 0 0 3px #0B2A5B" : undefined }}
                  />
                ))}
              </div>
            </fieldset>
            <div className="flex flex-col gap-1.5">
              <label htmlFor="l-desc" className={labelClass}>Description</label>
              <textarea id="l-desc" rows={3} value={sel.description} onChange={(e) => patch({ description: e.target.value })} className="resize-y rounded-[14px] bg-field px-3.5 py-3 text-[15px] text-ink" />
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
