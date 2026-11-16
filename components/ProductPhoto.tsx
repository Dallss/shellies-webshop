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
}: {
  product: Pick<Product, "name" | "hex" | "tint" | "image">;
  className?: string;
  sizes?: string;
  decorative?: boolean;
  priority?: boolean;
}) {
  const alt = decorative ? "" : `${product.name} Shellie`;

  if (!product.image) {
    return <Bracelet hex={product.hex} label={decorative ? undefined : alt} className={`w-full ${className}`} />;
  }

  return (
    <span className={`relative block aspect-square w-full overflow-hidden rounded-[24px] ${className}`} style={{ background: product.tint }}>
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
