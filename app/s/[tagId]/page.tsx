import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Crab } from "@/components/art";
import { SAMPLE_SHELLIES, colorHex, sharedRows } from "@/lib/data";

// The page a finder sees after tapping a Shellie. Each sticker holds a link like /s/AB12CD.

type Props = { params: Promise<{ tagId: string }> };

function findShellie(tagId: string) {
  return SAMPLE_SHELLIES.find((s) => s.tagId.toLowerCase() === tagId.toLowerCase());
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const s = findShellie((await params).tagId);
  return { title: s ? `${s.name}'s Shellie` : "Shellie not found", robots: { index: false } };
}

export default async function ScanPage({ params }: Props) {
  const shellie = findShellie((await params).tagId);
  if (!shellie) notFound();

  const rows = sharedRows(shellie);
  const phone = shellie.fields.find((f) => f.key === "phone")!;
  const address = shellie.fields.find((f) => f.key === "address")!;
  const facebook = shellie.fields.find((f) => f.key === "facebook")!;
  const instagram = shellie.fields.find((f) => f.key === "instagram")!;
  const tel = phone.value.replace(/[^\d+]/g, "");
  const socials = [facebook, instagram].filter((f) => f.shared && f.value);

  return (
    <main className="relative min-h-screen overflow-hidden bg-blush text-maroon">
      <div aria-hidden className="absolute -left-[110px] -top-[170px] h-[300px] w-[300px] rounded-full bg-coral" />
      <div aria-hidden className="absolute right-[120px] top-10 h-[74px] w-[74px] rounded-full bg-sky" />
      <div aria-hidden className="absolute -right-[70px] top-[90px] h-[150px] w-[150px] rounded-full bg-navy" />

      <div className="relative mx-auto flex max-w-[480px] flex-col gap-[18px] px-5 pb-8 pt-[150px]">
        <div className="flex items-center gap-4">
          <div className="h-[76px] w-[76px] flex-none rounded-full border-[5px] border-white shadow-[0_6px_18px_rgba(77,5,5,0.12)]" style={{ background: colorHex(shellie.color) }} />
          <div>
            <p className="text-[15px] italic">Hi! You found</p>
            <h1 className="font-display text-[42px] font-extrabold leading-none tracking-[-0.03em]">{shellie.name}&apos;s Shellie</h1>
          </div>
        </div>
        <p className="text-base leading-normal">
          If {shellie.name} needs help or seems lost, please call their family. Thank you for stopping to help.
        </p>

        {phone.shared && phone.value && (
          <>
            <a href={`tel:${tel}`} className="flex h-[68px] items-center justify-center gap-3 rounded-[22px] bg-navy text-xl font-bold text-white no-underline">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                <path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2" />
              </svg>
              Call family · {phone.value.replace("(+63) ", "0")}
            </a>
            <a href={`sms:${tel}`} className="flex h-14 items-center justify-center gap-2.5 rounded-[20px] border-[3px] border-red text-[17px] font-bold text-red no-underline">
              Send a text
            </a>
          </>
        )}

        <section aria-labelledby="info-h" className="mt-1.5 flex flex-col gap-1 rounded-[28px] bg-white p-[22px]">
          <h2 id="info-h" className="mb-2 font-display text-2xl font-extrabold">
            About {shellie.name}
          </h2>
          {rows.length === 0 ? (
            <p>The family hasn&apos;t shared any details yet.</p>
          ) : (
            <dl className="flex flex-col">
              {rows.map((r, i) => (
                <div key={r.label} className={`flex justify-between gap-4 py-3 ${i < rows.length - 1 ? "border-b-2 border-blush" : ""}`}>
                  <dt className="text-sm text-wine">{r.label}</dt>
                  <dd className="text-right font-semibold [overflow-wrap:anywhere]">{r.value}</dd>
                </div>
              ))}
            </dl>
          )}
          {address.shared && address.value && (
            <a
              href={`https://maps.google.com/?q=${encodeURIComponent(address.value)}`}
              className="mt-2 inline-flex h-12 items-center justify-center gap-2 rounded-2xl bg-rose text-[15px] font-semibold text-maroon no-underline"
            >
              Open address in Maps
            </a>
          )}
        </section>

        {socials.length > 0 && (
          <section aria-labelledby="soc-h" className="rounded-[28px] bg-sky px-[22px] py-5 text-ink">
            <h2 id="soc-h" className="mb-3 text-[15px] font-bold">
              Also reach the family on
            </h2>
            <div className="flex flex-wrap gap-2.5">
              {socials.map((f) => (
                <span key={f.key} className="inline-flex h-[46px] items-center rounded-[14px] bg-white px-4 text-[15px] font-semibold text-navy">
                  {f.key === "facebook" ? "Facebook" : "Instagram"} · {f.value}
                </span>
              ))}
            </div>
          </section>
        )}

        <p className="mt-1 text-[13px] leading-normal text-wine">Only the details {shellie.name}&apos;s family chose to share are shown here.</p>

        <div className="relative mt-7 min-h-[92px] overflow-hidden rounded-[28px] bg-white py-[22px] pl-[140px] pr-[22px]">
          <div aria-hidden className="absolute bottom-0 left-[18px] h-14 w-[104px] overflow-hidden">
            <Crab className="block w-[104px]" />
          </div>
          <p className="font-display text-[17px] font-extrabold text-ink">Perle &amp; Co.</p>
          <Link href="/" className="text-sm font-semibold">
            Get a Shellie for your family →
          </Link>
        </div>
      </div>
    </main>
  );
}
