"use client";

import { useRef, useState } from "react";
import { PageTitle, Pill, Toast, coralBtn, dangerBtn, inputClass, labelClass, revealIfOffscreen } from "@/components/admin/ui";
import { ProductPhoto } from "@/components/ProductPhoto";
import { Switch } from "@/components/Switch";
import { useAdmin } from "@/lib/admin-store";
import { type Product, formatPeso } from "@/lib/data";
import { createProductAction, deleteProductAction, removeProductPhotoAction, setProductPhotoAction, updateProductAction } from "../actions";

type Editable = Partial<Pick<Product, "name" | "hex" | "tint" | "price" | "stock" | "shown" | "description">>;

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
  const [selId, setSelId] = useState<string | null>(products[0]?.id ?? null);
  const [toast, setToast] = useState("");
  const [saveState, setSaveState] = useState<"" | "saving" | "saved" | "error">("");
  const [busy, setBusy] = useState(false);
  const sel = products.find((p) => p.id === selId);

  // Field edits show immediately and are saved together shortly after typing stops.
  const queued = useRef(new Map<string, Editable>());
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  function flush() {
    timer.current = null;
    const batch = [...queued.current];
    queued.current.clear();
    if (!batch.length) return;
    setSaveState("saving");
    Promise.all(batch.map(([id, changes]) => updateProductAction(id, changes)))
      .then(() => setSaveState(queued.current.size ? "saving" : "saved"))
      .catch(() => setSaveState("error"));
  }

  function patch(changes: Editable) {
    if (!selId) return;
    setProducts((ps) => ps.map((p) => (p.id === selId ? { ...p, ...changes } : p)));
    queued.current.set(selId, { ...queued.current.get(selId), ...changes });
    setSaveState("saving");
    setToast("");
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(flush, 700);
  }

  async function run<T>(work: () => Promise<T>, failMsg: string) {
    setBusy(true);
    try {
      return await work();
    } catch (e) {
      setToast(e instanceof Error && e.message && !e.message.includes("digest") ? e.message : failMsg);
    } finally {
      setBusy(false);
    }
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
            disabled={busy}
            onClick={async () => {
              const p = await run(createProductAction, "Couldn't add a listing. Try again.");
              if (!p) return;
              setProducts((ps) => [...ps, p]);
              setSelId(p.id);
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
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <h2 className="font-display text-[28px] font-extrabold tracking-[-0.02em]">Edit {sel.name}</h2>
              <span aria-live="polite" className={`text-sm font-semibold ${saveState === "error" ? "text-crimson" : "text-muted"}`}>
                {saveState === "saving" ? "Saving…" : saveState === "saved" ? "All changes saved" : saveState === "error" ? "Couldn't save. Try again." : ""}
              </span>
            </div>
            <div className="flex flex-col gap-2">
              <span className={labelClass}>Photo</span>
              <div className="flex items-center gap-4 rounded-2xl bg-sky p-3">
                <span key={sel.image ?? "none"} className="pop block w-24 flex-none">
                  <ProductPhoto product={sel} decorative sizes="96px" />
                </span>
                <div className="flex min-w-0 flex-col gap-2">
                  <label htmlFor="l-photo" className="bubbly inline-flex h-11 cursor-pointer items-center justify-center rounded-[14px] bg-navy px-4 text-[15px] font-bold text-white">
                    {busy ? "Working…" : sel.image ? "Replace photo" : "Upload photo"}
                  </label>
                  <input
                    id="l-photo"
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    className="sr-only"
                    disabled={busy}
                    onChange={async (e) => {
                      const file = e.target.files?.[0];
                      e.target.value = "";
                      if (!file) return;
                      if (file.size > 4 * 1024 * 1024) {
                        setToast("That photo is over 4 MB. Choose a smaller one.");
                        return;
                      }
                      const form = new FormData();
                      form.set("photo", file);
                      const id = sel.id;
                      const p = await run(() => setProductPhotoAction(id, form), "Couldn't upload that photo. Try again.");
                      if (p) setProducts((ps) => ps.map((x) => (x.id === id ? { ...x, image: p.image } : x)));
                    }}
                  />
                  {sel.image ? (
                    <button
                      type="button"
                      disabled={busy}
                      onClick={async () => {
                        const id = sel.id;
                        const p = await run(() => removeProductPhotoAction(id), "Couldn't remove the photo. Try again.");
                        if (p) setProducts((ps) => ps.map((x) => (x.id === id ? { ...x, image: null } : x)));
                      }}
                      className="text-left text-sm font-semibold text-crimson"
                    >
                      Remove photo
                    </button>
                  ) : (
                    <span className="text-[13px] text-muted">JPG, PNG or WebP, up to 4 MB. Square photos look best.</span>
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
              disabled={busy}
              onClick={async () => {
                const { id, name } = sel;
                if (!window.confirm(`Remove ${name} from your listings? Past orders keep their details.`)) return;
                queued.current.delete(id);
                const ok = await run(async () => (await deleteProductAction(id), true), "Couldn't remove that listing. Try again.");
                if (!ok) return;
                const rest = products.filter((p) => p.id !== id);
                setProducts(rest);
                setSelId(rest[0]?.id ?? null);
                setToast(`${name} was removed from your listings.`);
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
