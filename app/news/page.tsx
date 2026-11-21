import type { Metadata } from "next";
import Link from "next/link";
import { Bracelet, Mascot, Wordmark } from "@/components/art";
import { ProductPhoto } from "@/components/ProductPhoto";
import { SiteHeader } from "@/components/SiteHeader";
import { TAB_BAR_SPACE } from "@/components/TabBar";
import { listPosts, listProducts } from "@/lib/db";

export const metadata: Metadata = { title: "News & notes" };
export const dynamic = "force-dynamic";

export default async function NewsPage() {
  const [posts, products] = await Promise.all([listPosts({ onlyPublished: true }), listProducts({ onlyShown: true })]);
  const [featured, ...rest] = posts;

  return (
    <div className="min-h-screen overflow-hidden bg-blush">
      <SiteHeader tone="blue" current="/news" />

      <section className="relative mx-auto max-w-[1240px] px-5 pb-6 pt-10 sm:px-6 sm:pb-8 sm:pt-16">
        <div aria-hidden className="float-slow absolute -right-[90px] -top-24 h-[160px] w-[160px] rounded-full bg-coral sm:-right-[60px] sm:-top-20 sm:h-[220px] sm:w-[220px]" />
        <div aria-hidden className="float absolute right-[200px] top-10 hidden sm:block h-[60px] w-[60px] rounded-full bg-sky" />
        <p className="rise rise-1 relative text-[15px] font-bold uppercase tracking-[0.06em] text-crimson">From the Perle &amp; Co. team</p>
        <h1 className="rise rise-2 relative mt-2.5 font-display text-[clamp(44px,6.4vw,84px)] font-extrabold leading-[0.95] tracking-[-0.035em] text-maroon">
          News &amp; notes
        </h1>
        <p className="rise rise-3 relative mt-3.5 max-w-[560px] text-[17px] text-maroon sm:text-[19px]">New drops, setup tips and what we&apos;re working on.</p>
      </section>

      {featured && (
        <section className="rise rise-4 mx-auto max-w-[1240px] px-5 py-4 sm:px-6">
          <article className="flex flex-wrap overflow-hidden rounded-[32px] bg-navy text-white sm:rounded-[40px]">
            {products.length > 0 && products.every((p) => p.image) ? (
              <div className="grid min-w-0 flex-[1_1_min(420px,100%)] grid-cols-3">
                {products.slice(0, 6).map((p) => (
                  <ProductPhoto key={p.id} product={p} decorative rounded="" sizes="(max-width: 640px) 33vw, 210px" />
                ))}
              </div>
            ) : (
              <div className="flex min-h-56 min-w-0 flex-[1_1_min(420px,100%)] flex-wrap items-center justify-center gap-1 bg-sky p-6 sm:min-h-80 sm:p-8">
                {products.map((p) => (
                  <Bracelet key={p.id} hex={p.hex} className="bob w-[30%] max-w-40" />
                ))}
              </div>
            )}
            <div className="flex min-w-0 flex-[1_1_min(420px,100%)] flex-col gap-4 p-[clamp(26px,3.4vw,48px)]">
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

      <section className="mx-auto max-w-[1240px] px-5 pb-12 pt-8 sm:px-6">
        <h2 className="mb-5 font-display text-[34px] font-extrabold tracking-[-0.02em] text-maroon">More posts</h2>
        <div className="reveal grid grid-cols-[repeat(auto-fit,minmax(min(300px,100%),1fr))] gap-4 sm:gap-[22px]">
          {rest.map((p) => (
            <article key={p.id} className="lift flex flex-col gap-3 rounded-[28px] bg-white p-6 text-maroon sm:rounded-[32px] sm:p-7">
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
              <Mascot deep className="bob block w-[150px]" />
            </div>
          </article>
        </div>
      </section>

      <footer className={`bg-ink px-5 pt-9 text-sky sm:px-6 md:pb-9 ${TAB_BAR_SPACE}`}>
        <div className="mx-auto flex max-w-[1240px] flex-wrap justify-between gap-3 text-[15px]">
          <Wordmark light className="h-[20px]" />
          <span>A little closer to everyone.</span>
        </div>
      </footer>
    </div>
  );
}
