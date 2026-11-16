import type { Metadata } from "next";
import Link from "next/link";
import { Bracelet, Crab } from "@/components/art";
import { SiteHeader } from "@/components/SiteHeader";
import { PRODUCTS, SAMPLE_POSTS } from "@/lib/data";

export const metadata: Metadata = { title: "News & notes" };

export default function NewsPage() {
  const posts = SAMPLE_POSTS.filter((p) => p.status === "published");
  const [featured, ...rest] = posts;

  return (
    <div className="min-h-screen overflow-hidden bg-blush">
      <SiteHeader tone="blue" current="/news" />

      <section className="relative mx-auto max-w-[1240px] px-6 pb-8 pt-16">
        <div aria-hidden className="float-slow absolute -right-[60px] -top-20 h-[220px] w-[220px] rounded-full bg-coral" />
        <div aria-hidden className="float absolute right-[200px] top-10 h-[60px] w-[60px] rounded-full bg-sky" />
        <p className="rise rise-1 relative text-[15px] font-bold uppercase tracking-[0.06em] text-crimson">From the Perle &amp; Co. team</p>
        <h1 className="rise rise-2 relative mt-2.5 font-display text-[clamp(44px,6.4vw,84px)] font-extrabold leading-[0.95] tracking-[-0.035em] text-maroon">
          News &amp; notes
        </h1>
        <p className="rise rise-3 relative mt-3.5 max-w-[560px] text-[19px] text-maroon">New drops, setup tips and what we&apos;re working on.</p>
      </section>

      {featured && (
        <section className="rise rise-4 mx-auto max-w-[1240px] px-6 py-4">
          <article className="flex flex-wrap overflow-hidden rounded-[40px] bg-navy text-white">
            <div className="flex min-h-80 min-w-0 flex-[1_1_420px] flex-wrap items-center justify-center gap-1 bg-sky p-8">
              {PRODUCTS.map((p) => (
                <Bracelet key={p.id} hex={p.hex} className="bob w-[30%] max-w-40" />
              ))}
            </div>
            <div className="flex min-w-0 flex-[1_1_420px] flex-col gap-4 p-[clamp(26px,3.4vw,48px)]">
              <p className="text-sm font-semibold uppercase tracking-[0.06em] text-sky-2">
                {featured.category} · {featured.date}
              </p>
              <h2 className="font-display text-[clamp(34px,3.6vw,50px)] font-extrabold leading-none tracking-[-0.03em]">{featured.title}</h2>
              <p className="text-[17px] leading-relaxed text-sky">{featured.body}</p>
              <Link href="/shop" className="bubbly mt-2 inline-flex h-[54px] items-center self-start rounded-[18px] bg-salmon px-[22px] font-bold text-maroon no-underline">
                Shop the collection →
              </Link>
            </div>
          </article>
        </section>
      )}

      <section className="mx-auto max-w-[1240px] px-6 pb-12 pt-8">
        <h2 className="mb-5 font-display text-[34px] font-extrabold tracking-[-0.02em] text-maroon">More posts</h2>
        <div className="reveal grid grid-cols-[repeat(auto-fit,minmax(300px,1fr))] gap-[22px]">
          {rest.map((p) => (
            <article key={p.id} className="lift flex flex-col gap-3 rounded-[32px] bg-white p-7 text-maroon">
              <span className="self-start rounded-full bg-sky px-3 py-1 text-[13px] font-bold text-navy">
                {p.category} · {p.date}
              </span>
              <h3 className="font-display text-[28px] font-extrabold leading-[1.05] tracking-[-0.02em]">{p.title}</h3>
              <p className="text-base leading-relaxed">{p.body}</p>
            </article>
          ))}
          <article className="lift relative flex flex-col gap-3 overflow-hidden rounded-[32px] bg-coral px-7 pb-[110px] pt-7 text-white">
            <span className="self-start rounded-full bg-white px-3 py-1 text-[13px] font-bold text-crimson">Follow along</span>
            <h3 className="font-display text-[28px] font-extrabold leading-[1.05] tracking-[-0.02em]">See every drop first on Instagram</h3>
            <a href="https://instagram.com/perle.and.company" className="text-base font-bold text-white">
              @perle.and.company →
            </a>
            <div aria-hidden className="absolute bottom-0 left-7 h-[72px] w-[150px] overflow-hidden">
              <Crab color="#fff" className="bob block w-[150px]" />
            </div>
          </article>
        </div>
      </section>

      <footer className="bg-ink px-6 py-9 text-sky">
        <div className="mx-auto flex max-w-[1240px] flex-wrap justify-between gap-3 text-[15px]">
          <span className="font-display text-xl font-extrabold text-white">Perle &amp; Co.</span>
          <span>A little closer to peace of mind.</span>
        </div>
      </footer>
    </div>
  );
}
