import Image from "next/image";
import Link from "next/link";
import { Bracelet, Mascot } from "@/components/art";
import { TapNotification } from "@/components/TapNotification";
import { ProductPhoto } from "@/components/ProductPhoto";
import { SiteFooter, SiteHeader } from "@/components/SiteHeader";
import { BubbleField } from "@/components/BubbleField";
import { getHeroImage, listProducts } from "@/lib/db";

const STEPS = [
  { n: 1, title: "Set up your Shellie", body: "Add a name, a contact number and anything else you want a helper to know.", card: "bg-white", badge: "bg-sky text-navy", text: "text-muted" },
  { n: 2, title: "Someone taps it", body: "A teacher, a guard or a kind stranger holds their phone to the shell-shaped tag.", card: "bg-white", badge: "bg-coral text-white", text: "text-muted" },
  { n: 3, title: "They reach you", body: "Your shared info opens in their browser, with one tap to call you.", card: "bg-navy text-white", badge: "bg-white text-navy", text: "text-sky" },
];

export const dynamic = "force-dynamic";

export default async function Home() {
  const [products, heroUpload] = await Promise.all([listProducts({ onlyShown: true }), getHeroImage()]);
  // The hero shows the photo uploaded in Admin → Homepage, or else the first listing that has a photo.
  const featured = products.find((p) => p.image);
  const hero = heroUpload
    ? { src: heroUpload, alt: "A Shellie bracelet with an NFC tag" }
    : featured?.image
      ? { src: featured.image, alt: `${featured.name} Shellie bracelet with an NFC tag` }
      : null;
  return (
    <div className="relative overflow-hidden">
      <SiteHeader current="/" />

      {/* HERO */}
      <section id="top" className="relative mx-auto flex max-w-[1240px] flex-wrap items-center gap-10 px-5 pt-8 sm:gap-12 sm:px-6 sm:pt-14">
        <div aria-hidden className="drift-a absolute -right-44 -top-[230px] h-[300px] w-[300px] rounded-full bg-coral sm:-right-40 sm:-top-[200px] sm:h-[520px] sm:w-[520px]" />
        <div aria-hidden className="drift-b absolute left-[46%] top-0 hidden sm:block h-[110px] w-[110px] rounded-full bg-sky" />
        <div aria-hidden className="drift-c absolute -right-[60px] top-[420px] hidden h-[220px] w-[220px] rounded-full bg-navy sm:block" />
        <BubbleField rise={1000} />

        <div className="relative min-w-0 flex-[1_1_460px]">
          <h1 aria-label="A little closer to everyone." className="font-display text-[clamp(48px,7vw,92px)] font-extrabold leading-[0.95] tracking-[-0.035em] text-balance">
            {["A", "little", "closer", "to"].map((w, i) => (
              <span key={w} aria-hidden>
                <span className="word" style={{ "--w": i } as React.CSSProperties}>
                  {w}
                </span>{" "}
              </span>
            ))}
            <span aria-hidden className="relative isolate inline-block">
              <span className="word" style={{ "--w": 4 } as React.CSSProperties}>
                everyone.
              </span>
              <span className="highlight-grow absolute -left-[0.06em] -right-[0.06em] bottom-[0.06em] -z-10 h-[0.32em] rounded-full bg-sky-2" />
            </span>
          </h1>
          <p className="rise rise-3 mt-6 max-w-[460px] text-lg italic leading-[1.45] sm:text-[21px]">
            A little tap, a lot to share. Shellie is a bracelet with an NFC tag that makes connecting easier. Simply tap it with a phone, and the information, profiles, and links you&apos;ve chosen to share are ready to discover.
          </p>
          <div className="rise rise-4 mt-8 flex flex-wrap gap-3 sm:mt-9 sm:gap-3.5">
            <Link href="/shop" className="bubbly inline-flex h-14 flex-[1_1_auto] items-center justify-center rounded-[20px] bg-navy px-7 text-lg sm:h-16 sm:flex-none sm:px-9 sm:text-[19px] font-semibold text-white no-underline">
              Get your Shellie · ₱149
            </Link>
            <Link href="#how" className="bubbly inline-flex h-14 flex-[1_1_auto] items-center justify-center rounded-[20px] border-[3px] border-red px-7 text-lg sm:h-16 sm:flex-none sm:text-[19px] font-semibold text-red no-underline">
              See how it works
            </Link>
          </div>
        </div>

        <div className="rise rise-3 relative flex min-w-0 flex-[1_1_440px] justify-center">
          <div className="relative aspect-square w-full max-w-[520px] overflow-hidden rounded-[32px] bg-sky sm:rounded-[40px]">
            {hero ? (
              <Image
                src={hero.src}
                alt={hero.alt}
                fill
                priority
                sizes="(max-width: 640px) 100vw, 520px"
                className="object-cover"
              />
            ) : (
              <>
                <div aria-hidden className="float-slow absolute -left-[120px] -top-[90px] h-[380px] w-[380px] rounded-full border-[36px] border-[#9DBEF8]" />
                <div aria-hidden className="float-late absolute -bottom-10 -right-[110px] h-[300px] w-[300px] rounded-full border-[36px] border-[#9DBEF8]" />
                <Bracelet hex="#C9973A" label="Shellie bracelet with an NFC tag" className="swing absolute left-[8%] top-[10%] w-[84%]" />
              </>
            )}
            <TapNotification
              lines={["Anne Reyes", "0912 345 6789"]}
              className="bob absolute inset-x-[4%] bottom-[5%] sm:inset-x-[6%] sm:bottom-[6%]"
            />
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how" className="mx-auto max-w-[1240px] scroll-mt-6 px-5 pb-16 pt-20 sm:px-6 sm:pb-20 sm:pt-36">
        <h2 className="reveal font-display text-[clamp(38px,5vw,60px)] font-extrabold leading-none tracking-[-0.03em]">Wear it. Tap it. Done.</h2>
        <p className="reveal mt-3.5 max-w-[560px] text-[19px] italic">No app needed for whoever taps it. Any phone with NFC opens your Shellie&apos;s page.</p>
        <div className="mt-10 grid grid-cols-[repeat(auto-fit,minmax(min(260px,100%),1fr))] gap-4 sm:mt-12 sm:gap-6">
          {STEPS.map((s, i) => (
            <div key={s.n} className={`reveal ${["", "reveal-2", "reveal-3"][i]}`}>
            <div className={`lift flex h-full flex-col gap-3 rounded-[28px] p-6 sm:gap-3.5 sm:rounded-[32px] sm:p-8 ${s.card}`}>
              <div className={`reveal-pop flex h-16 w-16 items-center justify-center rounded-full font-display text-[28px] font-extrabold ${s.badge}`}>{s.n}</div>
              <h3 className="text-2xl font-bold">{s.title}</h3>
              <p className={`text-base leading-[1.55] ${s.text}`}>{s.body}</p>
            </div>
            </div>
          ))}
        </div>
      </section>

      {/* COLLECTION TEASER */}
      <section className="mx-auto max-w-[1240px] px-5 pb-20 pt-4 sm:px-6 sm:pb-24">
        <div className="reveal flex flex-wrap items-end justify-between gap-5">
          <div>
            <h2 className="font-display text-[clamp(36px,4.6vw,56px)] font-extrabold leading-none tracking-[-0.03em]">The Signature Collection</h2>
            <p className="mt-2.5 text-lg italic">The original edition. Six colors, one for every style.</p>
          </div>
          <Link href="/shop" className="text-[17px] font-semibold">
            Shop the collection →
          </Link>
        </div>
        <div className="reveal mt-8 grid grid-cols-2 gap-3 sm:mt-10 sm:grid-cols-[repeat(auto-fit,minmax(170px,1fr))] sm:gap-5">
          {products.map((p, i) => (
            <Link key={p.id} href="/shop" className="lift group flex flex-col gap-2.5 no-underline">
              {p.image ? (
                <ProductPhoto product={p} rounded="rounded-[22px] sm:rounded-[28px]" className="shadow-[0_10px_24px_rgba(11,42,91,0.10)]" />
              ) : (
                <span className="wiggle-host flex aspect-square items-center rounded-[22px] bg-white p-4 sm:rounded-[28px]">
                  <span className="bob block w-full" style={{ animationDelay: `${i * -0.6}s` }}>
                    <ProductPhoto product={p} />
                  </span>
                </span>
              )}
              <span className="px-1 text-[17px] font-bold text-navy sm:text-[19px]">{p.name}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="relative overflow-hidden bg-navy px-5 pt-20 sm:px-6 sm:pt-[110px]">
        <BubbleField rise={700} tone="dark" />
        <div aria-hidden className="float absolute -left-10 top-6 h-[90px] w-[90px] rounded-full bg-sky sm:left-[8%] sm:top-10 sm:h-[140px] sm:w-[140px]" />
        <div aria-hidden className="float-late absolute -right-24 -top-[110px] h-[200px] w-[200px] rounded-full bg-coral sm:-right-20 sm:-top-[90px] sm:h-[260px] sm:w-[260px]" />
        <div className="reveal relative mx-auto max-w-[900px] text-center text-white">
          <h2 className="font-display text-[clamp(44px,6.4vw,84px)] font-extrabold leading-[0.95] tracking-[-0.035em]">
            Small charm.
            <br />
            Big peace of mind.
          </h2>
          <p className="mt-[22px] text-lg italic sm:text-xl">One little buddy. Endless possibilities.</p>
          <Link href="/shop" className="bubbly mt-8 inline-flex h-14 items-center rounded-[20px] bg-white px-8 text-lg sm:h-16 sm:px-10 sm:text-[19px] font-semibold text-navy no-underline">
            Build your Shellie collection
          </Link>
        </div>
        <div aria-hidden className="relative mx-auto mt-12 h-[150px] max-w-[400px] overflow-hidden sm:mt-[70px] sm:h-[230px] sm:max-w-[620px]">
          <div className="peek">
            <Mascot className="bob block w-full" />
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
