"use client";

import Image from "next/image";
import { useState } from "react";
import { NfcIcon } from "@/components/art";
import { PageTitle, Toast, labelClass } from "@/components/admin/ui";
import { useAdmin } from "@/lib/admin-store";
import { removeHeroPhotoAction, setHeroPhotoAction } from "../actions";

export function HeroEditor({ initialHero }: { initialHero: string | null }) {
  const { products } = useAdmin();
  const [hero, setHero] = useState(initialHero);
  const [busy, setBusy] = useState(false);
  const [toast, setToast] = useState("");

  // Same rule as the homepage: without an uploaded photo it shows the first shown listing that has one.
  const fallback = products.find((p) => p.shown && p.image);
  const shown = hero ?? fallback?.image ?? null;

  async function run<T>(fn: () => Promise<T>, done: string, failed: string) {
    setBusy(true);
    setToast("");
    try {
      const r = await fn();
      setToast(done);
      return r;
    } catch {
      setToast(failed);
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      <PageTitle title="Homepage" intro="The big photo at the top of the homepage, next to the headline." />
      <Toast message={toast} />

      <section className="rise rise-2 flex flex-wrap items-start gap-6 rounded-[28px] bg-white p-5 sm:rounded-[32px] sm:p-7">
        {/* Preview, framed like the homepage: square, rounded, with the tap card over the corner. */}
        <div className="relative aspect-square w-full max-w-[360px] flex-none overflow-hidden rounded-[28px] bg-sky">
          {shown ? (
            <Image key={shown} src={shown} alt="Homepage photo preview" fill sizes="360px" className="pop object-cover" />
          ) : (
            <span className="absolute inset-0 flex items-center justify-center p-8 text-center font-semibold text-ink">
              No photo yet. The homepage shows the bracelet illustration.
            </span>
          )}
          <div aria-hidden className="absolute bottom-[6%] right-[5%] flex w-[66%] items-center gap-2.5 rounded-2xl bg-white px-3 py-2.5 shadow-[0_12px_28px_rgba(11,42,91,0.18)]">
            <span className="flex h-9 w-9 flex-none items-center justify-center rounded-full bg-red">
              <NfcIcon className="h-[18px] w-[18px]" stroke="#fff" />
            </span>
            <span className="text-[12px] leading-tight text-ink">
              <b className="block text-[13px]">Anne Reyes</b>
              0912 345 6789
            </span>
          </div>
        </div>

        <div className="flex min-w-0 flex-[1_1_260px] flex-col gap-4">
          <div>
            <span className={labelClass}>Showing now</span>
            <p className="mt-1 text-base">
              {hero
                ? "Your uploaded photo."
                : fallback
                  ? `The ${fallback.name} listing photo. Upload a photo to use your own, or reorder listings to feature another color.`
                  : "The bracelet illustration, until you upload a photo or a listing has one."}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <label htmlFor="hero-photo" className={`bubbly inline-flex h-[52px] cursor-pointer items-center justify-center rounded-[18px] bg-navy px-[22px] text-[17px] font-bold text-white ${busy ? "pointer-events-none opacity-60" : ""}`}>
              {busy ? "Working…" : hero ? "Replace photo" : "Upload photo"}
            </label>
            <input
              id="hero-photo"
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
                const url = await run(() => setHeroPhotoAction(form), "Homepage photo updated.", "Couldn't upload that photo. Try again.");
                if (url) setHero(url);
              }}
            />
            {hero && (
              <button
                type="button"
                disabled={busy}
                onClick={async () => {
                  const ok = await run(async () => { await removeHeroPhotoAction(); return true; }, "Homepage photo removed. Showing a listing photo instead.", "Couldn't remove the photo. Try again.");
                  if (ok) setHero(null);
                }}
                className="text-[15px] font-semibold text-crimson disabled:opacity-60"
              >
                Remove and use a listing photo
              </button>
            )}
          </div>
          <p className="text-[13px] text-muted">JPG, PNG or WebP, up to 4 MB. Square photos fit best; the tap card covers the bottom-right corner.</p>
        </div>
      </section>
    </>
  );
}
