import Link from "next/link";
import { Bracelet, Crab, NfcIcon } from "@/components/art";
import { ProductPhoto } from "@/components/ProductPhoto";
import { SiteFooter, SiteHeader } from "@/components/SiteHeader";
import { BubbleField } from "@/components/BubbleField";
import { PRODUCTS } from "@/lib/data";

const STEPS = [
  { n: 1, title: "Set up your Shellie", body: "Add a name, a contact number and anything else you want a helper to know.", card: "bg-white", badge: "bg-sky text-navy", text: "text-muted" },
  { n: 2, title: "Someone taps it", body: "A teacher, a guard or a kind stranger holds their phone to the shell-shaped tag.", card: "bg-white", badge: "bg-rose text-crimson", text: "text-muted" },
  { n: 3, title: "They reach you", body: "Your shared info opens in their browser, with one tap to call you.", card: "bg-navy text-white", badge: "bg-white text-navy", text: "text-sky" },
];

const PREVIEW_FIELDS: { label: string; value: string; on: boolean; demo?: boolean }[] = [
  { label: "Contact number", value: "(+63) 912 345 6789", on: true },
  { label: "Age", value: "12", on: true },
  { label: "Home address", value: "House No., Talisay, Cebu", on: true },
  { label: "Instagram", value: "@anne.reyes", on: false, demo: true },
];

export default function Home() {
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
          <p className="rise rise-1 mb-5 inline-flex items-center gap-2 rounded-full bg-white px-3.5 py-2 text-sm font-semibold text-navy">
            <NfcIcon className="h-[18px] w-[18px]" />
            NFC bracelets made for the little ones
          </p>
          <h1 aria-label="A little closer to peace of mind." className="font-display text-[clamp(48px,7vw,92px)] font-extrabold leading-[0.95] tracking-[-0.035em] text-balance">
            {["A", "little", "closer", "to"].map((w, i) => (
              <span key={w} aria-hidden>
                <span className="word" style={{ "--w": i } as React.CSSProperties}>
                  {w}
                </span>{" "}
              </span>
            ))}
            <span aria-hidden className="relative isolate inline-block">
              {["peace", "of", "mind."].map((w, i) => (
                <span key={w}>
                  <span className="word" style={{ "--w": i + 4 } as React.CSSProperties}>
                    {w}
                  </span>
                  {i < 2 ? " " : ""}
                </span>
              ))}
              <span className="highlight-grow absolute -left-[0.06em] -right-[0.06em] bottom-[0.06em] -z-10 h-[0.32em] rounded-full bg-salmon" />
            </span>
          </h1>
          <p className="rise rise-3 mt-6 max-w-[460px] text-lg italic leading-[1.45] sm:text-[21px]">
            Say goodbye to the what-ifs. A Shellie is a bracelet with an NFC tag. Tap it with a phone and the info you chose to share shows up.
          </p>
          <div className="rise rise-4 mt-8 flex flex-wrap gap-3 sm:mt-9 sm:gap-3.5">
            <Link href="/shop" className="bubbly inline-flex h-14 flex-[1_1_auto] items-center justify-center rounded-[20px] bg-navy px-7 text-lg sm:h-16 sm:flex-none sm:px-9 sm:text-[19px] font-semibold text-sky no-underline">
              Get your Shellie · ₱149
            </Link>
            <Link href="#how" className="bubbly inline-flex h-14 flex-[1_1_auto] items-center justify-center rounded-[20px] border-[3px] border-red px-7 text-lg sm:h-16 sm:flex-none sm:text-[19px] font-semibold text-red no-underline">
              See how it works
            </Link>
          </div>
        </div>

        <div className="rise rise-3 relative flex min-w-0 flex-[1_1_440px] justify-center">
          <div className="relative aspect-square w-full max-w-[520px] overflow-hidden rounded-[32px] bg-salmon sm:rounded-[40px]">
            <div aria-hidden className="float-slow absolute -left-[120px] -top-[90px] h-[380px] w-[380px] rounded-full border-[36px] border-[#FF8A87]" />
            <div aria-hidden className="float-late absolute -bottom-10 -right-[110px] h-[300px] w-[300px] rounded-full border-[36px] border-[#FF8A87]" />
            <Bracelet hex="#C9973A" label="Classic Shellie bracelet with an NFC tag" className="swing absolute left-[8%] top-[10%] w-[84%]" />
            <div className="bob absolute bottom-[6%] right-[5%] flex w-[78%] items-center gap-3 rounded-3xl bg-white px-4 py-3.5 sm:bottom-[7%] sm:right-[6%] sm:w-[62%] sm:gap-3.5 sm:px-5 sm:py-[18px] shadow-[0_18px_40px_rgba(77,5,5,0.18)]">
              <div className="relative flex h-[52px] w-[52px] flex-none items-center justify-center rounded-full bg-red">
                <span aria-hidden className="ripple absolute inset-0 rounded-full border-2 border-red" />
                <span aria-hidden className="ripple ripple-late absolute inset-0 rounded-full border-2 border-red" />
                <NfcIcon className="relative h-[26px] w-[26px]" stroke="#fff" />
              </div>
              <div className="min-w-0 text-sm leading-[1.35] text-maroon">
                <div className="text-base font-bold">Anne Reyes</div>
                <div>0912 345 6789</div>
                <div>12 years old · Talisay, Cebu</div>
              </div>
            </div>
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

        {/* You choose what gets shared */}
        <div className="reveal mt-12 flex flex-wrap items-center gap-8 overflow-hidden rounded-[32px] bg-sky p-[clamp(22px,5vw,72px)] sm:mt-16 sm:gap-14 sm:rounded-[48px]">
          <div className="min-w-0 flex-[1_1_min(380px,100%)]">
            <h2 className="font-display text-[clamp(36px,4.6vw,56px)] font-extrabold leading-none tracking-[-0.03em]">You choose what gets shared.</h2>
            <p className="mt-[18px] max-w-[460px] text-lg leading-[1.55] text-muted">
              Every field has its own switch. Share just a phone number, or add an address and socials. Change it any time and the bracelet updates straight away.
            </p>
          </div>
          <div className="flex min-w-0 flex-[1_1_min(380px,100%)] flex-col gap-3 rounded-[24px] bg-periwinkle p-4 sm:rounded-[32px] sm:p-7">
            {PREVIEW_FIELDS.map((f) => (
              <div key={f.label} className="flex items-center justify-between gap-3 rounded-2xl bg-[#CFE0FB] px-[18px] py-3.5">
                <span>
                  <span className="block text-[13px] font-bold">{f.label}</span>
                  <span className="text-[17px]">{f.value}</span>
                </span>
                <span aria-hidden className={`relative h-[30px] w-14 flex-none rounded-full border-[3px] border-ink ${f.on ? "bg-ink" : ""} ${f.demo ? "toggle-demo-track" : ""}`}>
                  <span className={`absolute top-[3px] h-[18px] w-[18px] rounded-full ${f.on ? "right-[3px] bg-white" : "left-[3px] bg-ink"} ${f.demo ? "toggle-demo-knob" : ""}`} />
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* COLLECTION TEASER */}
      <section className="mx-auto max-w-[1240px] px-5 pb-20 pt-4 sm:px-6 sm:pb-24">
        <div className="reveal flex flex-wrap items-end justify-between gap-5">
          <div>
            <h2 className="font-display text-[clamp(36px,4.6vw,56px)] font-extrabold leading-none tracking-[-0.03em]">The Signature Collection</h2>
            <p className="mt-2.5 text-lg italic">The original edition. Six colors, one for every kind of kid.</p>
          </div>
          <Link href="/shop" className="text-[17px] font-semibold">
            Shop the collection →
          </Link>
        </div>
        <div className="reveal mt-8 grid grid-cols-2 gap-3 sm:mt-10 sm:grid-cols-[repeat(auto-fit,minmax(170px,1fr))] sm:gap-5">
          {PRODUCTS.filter((p) => p.shown).map((p, i) => (
            <Link key={p.id} href="/shop" className="lift wiggle-host flex flex-col items-center gap-2 rounded-[24px] bg-white px-3 pb-4 pt-4 no-underline sm:rounded-[28px] sm:px-4 sm:pb-[22px] sm:pt-5">
              <span className="bob block w-full max-w-[170px]" style={{ animationDelay: `${i * -0.6}s` }}>
                <ProductPhoto product={p} />
              </span>
              <span className="text-[17px] font-bold text-[#111] sm:text-[19px]">{p.name}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="relative overflow-hidden bg-coral px-5 pt-20 sm:px-6 sm:pt-[110px]">
        <BubbleField rise={700} tone="dark" />
        <div aria-hidden className="float absolute -left-10 top-6 h-[90px] w-[90px] rounded-full bg-sky sm:left-[8%] sm:top-10 sm:h-[140px] sm:w-[140px]" />
        <div aria-hidden className="float-late absolute -right-24 -top-[110px] h-[200px] w-[200px] rounded-full bg-navy sm:-right-20 sm:-top-[90px] sm:h-[260px] sm:w-[260px]" />
        <div className="reveal relative mx-auto max-w-[900px] text-center text-white">
          <h2 className="font-display text-[clamp(44px,6.4vw,84px)] font-extrabold leading-[0.95] tracking-[-0.035em]">
            Small charm.
            <br />
            Big peace of mind.
          </h2>
          <p className="mt-[22px] text-lg italic sm:text-xl">Shellie, it&apos;s what you deserve!</p>
          <Link href="/shop" className="bubbly mt-8 inline-flex h-14 items-center rounded-[20px] bg-maroon px-8 text-lg sm:h-16 sm:px-10 sm:text-[19px] font-semibold text-white no-underline">
            Set up your Shellie!
          </Link>
        </div>
        <div aria-hidden className="relative mx-auto mt-12 h-[150px] max-w-[400px] overflow-hidden sm:mt-[70px] sm:h-[230px] sm:max-w-[620px]">
          <div className="peek">
            <Crab color="#C40F0B" className="crab-wave bob block w-full" />
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
