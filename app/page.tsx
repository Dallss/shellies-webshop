import Link from "next/link";
import { Bracelet, Crab, NfcIcon } from "@/components/art";
import { SiteFooter, SiteHeader } from "@/components/SiteHeader";
import { PRODUCTS } from "@/lib/data";

const STEPS = [
  { n: 1, title: "Set up your Shellie", body: "Add a name, a contact number and anything else you want a helper to know.", card: "bg-white", badge: "bg-sky text-navy", text: "text-muted" },
  { n: 2, title: "Someone taps it", body: "A teacher, a guard or a kind stranger holds their phone to the shell-shaped tag.", card: "bg-white", badge: "bg-rose text-crimson", text: "text-muted" },
  { n: 3, title: "They reach you", body: "Your shared info opens in their browser, with one tap to call you.", card: "bg-navy text-white", badge: "bg-white text-navy", text: "text-sky" },
];

const PREVIEW_FIELDS = [
  { label: "Contact number", value: "(+63) 912 345 6789", on: true },
  { label: "Age", value: "12", on: true },
  { label: "Home address", value: "House No., Talisay, Cebu", on: true },
  { label: "Instagram", value: "@anne.reyes", on: false },
];

export default function Home() {
  return (
    <div className="relative overflow-hidden">
      <SiteHeader current="/" />

      {/* HERO */}
      <section id="top" className="relative mx-auto flex max-w-[1240px] flex-wrap items-center gap-12 px-6 pt-14">
        <div aria-hidden className="float-slow absolute -right-40 -top-[200px] h-[520px] w-[520px] rounded-full bg-coral" />
        <div aria-hidden className="float absolute left-[46%] top-0 h-[110px] w-[110px] rounded-full bg-sky" />
        <div aria-hidden className="float-late absolute -right-[60px] top-[420px] h-[220px] w-[220px] rounded-full bg-navy" />

        <div className="relative min-w-0 flex-[1_1_460px]">
          <p className="rise rise-1 mb-5 inline-flex items-center gap-2 rounded-full bg-white px-3.5 py-2 text-sm font-semibold text-navy">
            <NfcIcon className="h-[18px] w-[18px]" />
            NFC bracelets made for the little ones
          </p>
          <h1 className="rise rise-2 font-display text-[clamp(48px,7vw,92px)] font-extrabold leading-[0.95] tracking-[-0.035em] text-balance">
            A little closer to peace of mind.
          </h1>
          <p className="rise rise-3 mt-6 max-w-[460px] text-[21px] italic leading-[1.45]">
            Say goodbye to the what-ifs. A Shellie is a bracelet with an NFC tag. Tap it with a phone and the info you chose to share shows up.
          </p>
          <div className="rise rise-4 mt-9 flex flex-wrap gap-3.5">
            <Link href="/shop" className="bubbly inline-flex h-16 items-center rounded-[20px] bg-navy px-9 text-[19px] font-semibold text-sky no-underline">
              Get your Shellie · ₱149
            </Link>
            <Link href="#how" className="bubbly inline-flex h-16 items-center rounded-[20px] border-[3px] border-red px-7 text-[19px] font-semibold text-red no-underline">
              See how it works
            </Link>
          </div>
        </div>

        <div className="rise rise-3 relative flex min-w-0 flex-[1_1_440px] justify-center">
          <div className="relative aspect-square w-full max-w-[520px] overflow-hidden rounded-[40px] bg-salmon">
            <div aria-hidden className="float-slow absolute -left-[120px] -top-[90px] h-[380px] w-[380px] rounded-full border-[36px] border-[#FF8A87]" />
            <div aria-hidden className="float-late absolute -bottom-10 -right-[110px] h-[300px] w-[300px] rounded-full border-[36px] border-[#FF8A87]" />
            <Bracelet hex="#C9973A" label="Classic Shellie bracelet with an NFC tag" className="absolute left-[8%] top-[10%] w-[84%]" />
            <div className="bob absolute bottom-[7%] right-[6%] flex w-[62%] items-center gap-3.5 rounded-3xl bg-white px-5 py-[18px] shadow-[0_18px_40px_rgba(77,5,5,0.18)]">
              <div className="flex h-[52px] w-[52px] flex-none items-center justify-center rounded-full bg-red">
                <NfcIcon className="h-[26px] w-[26px]" stroke="#fff" />
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
      <section id="how" className="mx-auto max-w-[1240px] scroll-mt-6 px-6 pb-20 pt-36">
        <h2 className="reveal font-display text-[clamp(38px,5vw,60px)] font-extrabold leading-none tracking-[-0.03em]">Wear it. Tap it. Done.</h2>
        <p className="reveal mt-3.5 max-w-[560px] text-[19px] italic">No app needed for whoever taps it. Any phone with NFC opens your Shellie&apos;s page.</p>
        <div className="reveal mt-12 grid grid-cols-[repeat(auto-fit,minmax(260px,1fr))] gap-6">
          {STEPS.map((s) => (
            <div key={s.n} className={`lift flex flex-col gap-3.5 rounded-[32px] p-8 ${s.card}`}>
              <div className={`flex h-16 w-16 items-center justify-center rounded-full font-display text-[28px] font-extrabold ${s.badge}`}>{s.n}</div>
              <h3 className="text-2xl font-bold">{s.title}</h3>
              <p className={`text-base leading-[1.55] ${s.text}`}>{s.body}</p>
            </div>
          ))}
        </div>

        {/* You choose what gets shared */}
        <div className="reveal mt-16 flex flex-wrap items-center gap-14 overflow-hidden rounded-[48px] bg-sky p-[clamp(28px,5vw,72px)]">
          <div className="min-w-0 flex-[1_1_380px]">
            <h2 className="font-display text-[clamp(36px,4.6vw,56px)] font-extrabold leading-none tracking-[-0.03em]">You choose what gets shared.</h2>
            <p className="mt-[18px] max-w-[460px] text-lg leading-[1.55] text-muted">
              Every field has its own switch. Share just a phone number, or add an address and socials. Change it any time and the bracelet updates straight away.
            </p>
            <Link href="/my-shellies" className="bubbly mt-7 inline-flex h-14 items-center rounded-[18px] bg-navy px-7 font-semibold text-sky no-underline">
              Try the editor
            </Link>
          </div>
          <div className="flex min-w-0 flex-[1_1_380px] flex-col gap-3 rounded-[32px] bg-periwinkle p-7">
            {PREVIEW_FIELDS.map((f) => (
              <div key={f.label} className="flex items-center justify-between gap-3 rounded-2xl bg-[#CFE0FB] px-[18px] py-3.5">
                <span>
                  <span className="block text-[13px] font-bold">{f.label}</span>
                  <span className="text-[17px]">{f.value}</span>
                </span>
                <span aria-hidden className={`relative h-[30px] w-14 flex-none rounded-full border-[3px] border-ink ${f.on ? "bg-ink" : ""}`}>
                  <span className={`absolute top-[3px] h-[18px] w-[18px] rounded-full ${f.on ? "right-[3px] bg-white" : "left-[3px] bg-ink"}`} />
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* COLLECTION TEASER */}
      <section className="mx-auto max-w-[1240px] px-6 pb-24 pt-4">
        <div className="reveal flex flex-wrap items-end justify-between gap-5">
          <div>
            <h2 className="font-display text-[clamp(36px,4.6vw,56px)] font-extrabold leading-none tracking-[-0.03em]">The Signature Collection</h2>
            <p className="mt-2.5 text-lg italic">The original edition. Six colors, one for every kind of kid.</p>
          </div>
          <Link href="/shop" className="text-[17px] font-semibold">
            Shop the collection →
          </Link>
        </div>
        <div className="reveal mt-10 grid grid-cols-[repeat(auto-fit,minmax(170px,1fr))] gap-5">
          {PRODUCTS.filter((p) => p.shown).map((p) => (
            <Link key={p.id} href="/shop" className="lift wiggle-host flex flex-col items-center gap-2 rounded-[28px] bg-white px-4 pb-[22px] pt-5 no-underline">
              <Bracelet hex={p.hex} label={`${p.name} Shellie`} className="w-full max-w-[170px]" />
              <span className="text-[19px] font-bold text-[#111]">{p.name}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="relative overflow-hidden bg-coral px-6 pt-[110px]">
        <div aria-hidden className="float absolute left-[8%] top-10 h-[140px] w-[140px] rounded-full bg-sky" />
        <div aria-hidden className="float-late absolute -right-20 -top-[90px] h-[260px] w-[260px] rounded-full bg-navy" />
        <div className="reveal relative mx-auto max-w-[900px] text-center text-white">
          <h2 className="font-display text-[clamp(44px,6.4vw,84px)] font-extrabold leading-[0.95] tracking-[-0.035em]">
            Small charm.
            <br />
            Big peace of mind.
          </h2>
          <p className="mt-[22px] text-xl italic">Shellie, it&apos;s what you deserve!</p>
          <Link href="/shop" className="bubbly mt-8 inline-flex h-16 items-center rounded-[20px] bg-maroon px-10 text-[19px] font-semibold text-white no-underline">
            Set up your Shellie!
          </Link>
        </div>
        <div aria-hidden className="relative mx-auto mt-[70px] h-[230px] max-w-[620px] overflow-hidden">
          <Crab color="#C40F0B" className="bob block w-full" />
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
