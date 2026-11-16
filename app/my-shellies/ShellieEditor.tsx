"use client";

import Link from "next/link";
import { useState } from "react";
import { Crab, NfcIcon } from "@/components/art";
import { Switch } from "@/components/Switch";
import { SAMPLE_SHELLIES, SHELLIE_COLORS, type Shellie, colorHex, sharedRows } from "@/lib/data";

const clone = (xs: Shellie[]) => structuredClone(xs);

export function ShellieEditor() {
  const [saved, setSaved] = useState(clone(SAMPLE_SHELLIES));
  const [draft, setDraft] = useState(clone(SAMPLE_SHELLIES));
  const [activeId, setActiveId] = useState(SAMPLE_SHELLIES[1].tagId);
  const [status, setStatus] = useState("");

  const idx = draft.findIndex((s) => s.tagId === activeId);
  const cur = draft[idx];
  const rows = sharedRows(cur);

  function edit(fn: (s: Shellie) => void) {
    setDraft((d) => {
      const next = clone(d);
      fn(next[idx]);
      return next;
    });
    setStatus("");
  }

  return (
    <div className="flex min-h-screen flex-wrap bg-ice text-ink">
      <aside className="flex min-w-0 flex-[1_1_240px] flex-col gap-7 bg-navy px-5 py-7 text-white">
        <Link href="/" className="flex items-center gap-2.5 text-white no-underline">
          <Crab className="h-8 w-[42px]" />
          <span className="font-display text-[22px] font-extrabold">Perle &amp; Co.</span>
        </Link>
        <nav aria-label="App" className="flex flex-col gap-1.5">
          <Link href="/" className="flex h-[52px] items-center rounded-2xl px-4 font-medium text-sky no-underline">Home</Link>
          <Link href="/my-shellies" aria-current="page" className="flex h-[52px] items-center rounded-2xl bg-periwinkle px-4 font-bold text-ink no-underline">My Shellies</Link>
          <Link href="/#shop" className="flex h-[52px] items-center rounded-2xl px-4 font-medium text-sky no-underline">Shop</Link>
        </nav>
        <div className="mt-auto flex items-center gap-3 rounded-[18px] bg-ink p-3">
          <span aria-hidden className="flex h-11 w-11 flex-none items-center justify-center rounded-full bg-maroon text-lg font-bold">M</span>
          <span className="min-w-0">
            <span className="block font-bold">Mom</span>
            <span className="text-[13px] text-sky-2">{draft.length} Shellies</span>
          </span>
        </div>
      </aside>

      <main className="min-w-0 flex-[999_1_640px] p-[clamp(20px,3vw,40px)]">
        <div className="mx-auto flex max-w-[1120px] flex-col gap-[26px]">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <h1 className="font-display text-[clamp(38px,4.4vw,56px)] font-extrabold leading-none tracking-[-0.03em] text-navy">Edit my Shellie</h1>
              <p className="mt-2 text-[17px]">Choose what people see when they tap it.</p>
            </div>
            <div role="tablist" aria-label="Your Shellies" className="flex flex-wrap gap-2.5">
              {draft.map((s) => {
                const on = s.tagId === activeId;
                return (
                  <button
                    key={s.tagId}
                    type="button"
                    role="tab"
                    aria-selected={on}
                    onClick={() => {
                      setActiveId(s.tagId);
                      setStatus("");
                    }}
                    className={`inline-flex h-[52px] items-center gap-2.5 rounded-[18px] pl-2 pr-[18px] text-[15px] ${on ? "bg-[#1F56A8] font-bold text-white" : "bg-sky-2 font-semibold text-ink"}`}
                  >
                    <span aria-hidden className="h-9 w-9 rounded-full border-[3px] border-white" style={{ background: colorHex(s.color) }} />
                    {s.name}&apos;s Shellie
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex flex-wrap items-start gap-[26px]">
            <form
              aria-label="Shellie details"
              className="flex min-w-0 flex-[999_1_460px] flex-col gap-[18px] rounded-[36px] bg-periwinkle p-[clamp(20px,2.6vw,34px)]"
              onSubmit={(e) => {
                e.preventDefault();
                setSaved(clone(draft));
                setStatus(`Saved! ${cur.name}'s Shellie now shows the new info.`);
              }}
            >
              <fieldset>
                <legend className="mb-3 text-[15px] font-bold">Shellie color</legend>
                <div className="flex flex-wrap gap-2.5">
                  {SHELLIE_COLORS.map((c) => (
                    <button
                      key={c.id}
                      type="button"
                      aria-pressed={c.id === cur.color}
                      aria-label={c.name}
                      onClick={() => edit((s) => (s.color = c.id))}
                      className="h-[52px] w-[52px] rounded-full border-4 border-white"
                      style={{ background: c.hex, boxShadow: c.id === cur.color ? "0 0 0 3px #0B2A5B" : undefined }}
                    />
                  ))}
                </div>
              </fieldset>
              <p className="text-[15px] font-semibold">{cur.fields.filter((f) => f.shared).length} fields shared</p>

              <div className="grid grid-cols-[repeat(auto-fit,minmax(280px,1fr))] gap-x-[22px] gap-y-3.5">
                {cur.fields.map((f, i) => (
                  <div key={f.key} className="flex flex-col gap-1.5">
                    <label htmlFor={`f-${f.key}`} className="pl-1.5 text-[15px] font-bold">{f.label}</label>
                    <div className="flex items-center gap-3">
                      <input
                        id={`f-${f.key}`}
                        type="text"
                        value={f.value}
                        onChange={(e) => edit((s) => (s.fields[i].value = e.target.value))}
                        className="h-[52px] min-w-0 flex-1 rounded-[14px] bg-field px-4 text-base text-ink"
                      />
                      <Switch checked={f.shared} label={`Share ${f.label}`} onChange={() => edit((s) => (s.fields[i].shared = !s.fields[i].shared))} />
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-2 flex flex-wrap gap-3.5">
                <button type="submit" className="h-[60px] flex-[1_1_180px] rounded-[18px] bg-sky text-xl font-bold text-navy">Save</button>
                <button
                  type="button"
                  onClick={() => {
                    setDraft(clone(saved));
                    setStatus("");
                  }}
                  className="h-[60px] flex-[1_1_180px] rounded-[18px] border-[3px] border-[#E86A6A] bg-[#F4D6DC] text-xl font-bold text-crimson"
                >
                  Cancel
                </button>
              </div>
              {status && (
                <p role="status" className="rounded-[14px] bg-white px-4 py-3 text-[15px] font-semibold">{status}</p>
              )}
            </form>

            <div className="flex min-w-0 flex-[1_1_320px] flex-col gap-[18px]">
              <section aria-labelledby="pv-h" className="relative overflow-hidden rounded-[36px] bg-blush p-6 text-maroon">
                <div aria-hidden className="absolute -right-[50px] -top-[60px] h-[150px] w-[150px] rounded-full bg-coral" />
                <p id="pv-h" className="relative text-[13px] font-bold uppercase tracking-[0.06em] text-wine">Live preview · what a finder sees</p>
                <div className="relative mt-[18px] flex items-center gap-3">
                  <span aria-hidden className="h-[54px] w-[54px] flex-none rounded-full border-4 border-white" style={{ background: colorHex(cur.color) }} />
                  <span className="font-display text-[28px] font-extrabold leading-none tracking-[-0.02em]">{cur.name}&apos;s Shellie</span>
                </div>
                <div className="relative mt-4 rounded-[22px] bg-white px-[18px] py-1.5">
                  {rows.length === 0 && <p className="py-3.5 text-[15px]">Nothing is shared yet. Switch on a field to show it.</p>}
                  {rows.map((r) => (
                    <div key={r.label} className="flex justify-between gap-3.5 border-b-2 border-blush py-[11px] text-[15px] last:border-b-0">
                      <span className="text-wine">{r.label}</span>
                      <span className="text-right font-semibold [overflow-wrap:anywhere]">{r.value}</span>
                    </div>
                  ))}
                </div>
                <Link href={`/s/${cur.tagId}`} className="relative mt-3.5 inline-block text-[15px] font-semibold">
                  Open full scan page →
                </Link>
              </section>

              <section aria-labelledby="ls-h" className="flex items-center gap-4 rounded-[28px] bg-white px-[22px] py-5">
                <span aria-hidden className="flex h-[52px] w-[52px] flex-none items-center justify-center rounded-full bg-sky">
                  <NfcIcon className="h-[26px] w-[26px]" stroke="#0040A0" />
                </span>
                <div>
                  <h2 id="ls-h" className="text-[15px] font-bold">Last scanned</h2>
                  <p className="mt-0.5 text-[15px]">{cur.lastScan}</p>
                </div>
              </section>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
