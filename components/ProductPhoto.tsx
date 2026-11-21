import Image from "next/image";
import type { Product } from "@/lib/data";
import { Bracelet } from "./art";

// A listing's photo. Until a listing has one, the bracelet illustration in
// its cord color stands in, so the shop never shows an empty box.

export function ProductPhoto({
  product,
  className = "",
  sizes = "(max-width: 640px) 50vw, 240px",
  decorative = false,
  priority = false,
  rounded = "rounded-[24px]",
}: {
  product: Pick<Product, "name" | "hex" | "tint" | "image">;
  className?: string;
  sizes?: string;
  decorative?: boolean;
  priority?: boolean;
  /** Corner radius class; pass "" when the photo sits flush inside a rounded container. */
  rounded?: string;
}) {
  const alt = decorative ? "" : `${product.name} Shellie`;

  if (!product.image) {
    return <Bracelet hex={product.hex} label={decorative ? undefined : alt} className={`w-full ${className}`} />;
  }

  return (
    <span className={`relative block aspect-square w-full overflow-hidden ${rounded} ${className}`} style={{ background: product.tint }}>
      <Image
        src={product.image}
        alt={alt}
        fill
        sizes={sizes}
        priority={priority}
        // Photos picked in the admin are temporary browser links that Next.js can't optimize.
        unoptimized={product.image.startsWith("blob:")}
        className="object-cover"
      />
    </span>
  );
}

/** A small round-cornered photo for cart and order rows, or the cord color when there's no photo. */
export function ProductThumb({ product, className = "h-11 w-11" }: { product: Pick<Product, "hex" | "image">; className?: string }) {
  if (!product.image) {
    return <span aria-hidden className={`flex-none rounded-full border-[3px] border-white ${className}`} style={{ background: product.hex }} />;
  }
  return (
    <span aria-hidden className={`relative flex-none overflow-hidden rounded-[14px] ${className}`}>
      <Image src={product.image} alt="" fill sizes="64px" className="object-cover" />
    </span>
  );
}
