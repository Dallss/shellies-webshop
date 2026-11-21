import "server-only";
import type { Order, OrderStatus, Payment, Post, PostCategory, Product } from "./data";

// Server-side access to Supabase over HTTPS (PostgREST + Storage) with the service role key.
// The key bypasses row level security, so this module must never be imported by client code.

const BASE = process.env.SUPABASE_URL!;
const KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;
export const PHOTO_BUCKET = "product-photos";

function headers(extra: Record<string, string> = {}) {
  return { apikey: KEY, Authorization: `Bearer ${KEY}`, ...extra };
}

export class DbError extends Error {
  constructor(message: string, readonly code?: string) {
    super(message);
  }
}

async function rest<T>(path: string, init: RequestInit & { prefer?: string } = {}): Promise<T> {
  const { prefer, ...rest } = init;
  const res = await fetch(`${BASE}/rest/v1/${path}`, {
    ...rest,
    cache: "no-store",
    headers: headers({
      "Content-Type": "application/json",
      ...(prefer ? { Prefer: prefer } : {}),
    }),
  });
  const text = await res.text();
  if (!res.ok) {
    let msg = text;
    let code: string | undefined;
    try {
      const j = JSON.parse(text);
      msg = j.message ?? text;
      code = j.code;
    } catch {}
    throw new DbError(msg, code);
  }
  return (text ? JSON.parse(text) : null) as T;
}

// ---------- formatting ----------

const MANILA = "Asia/Manila";

function placedLabel(iso: string) {
  const d = new Date(iso);
  const day = (x: Date) => x.toLocaleDateString("en-CA", { timeZone: MANILA });
  const time = d.toLocaleTimeString("en-US", { timeZone: MANILA, hour: "numeric", minute: "2-digit" });
  const now = new Date();
  if (day(d) === day(now)) return `Today, ${time}`;
  if (day(d) === day(new Date(now.getTime() - 86_400_000))) return `Yesterday, ${time}`;
  const sameYear = d.toLocaleDateString("en-US", { timeZone: MANILA, year: "numeric" }) === now.toLocaleDateString("en-US", { timeZone: MANILA, year: "numeric" });
  return d.toLocaleDateString("en-US", { timeZone: MANILA, month: "short", day: "numeric", ...(sameYear ? {} : { year: "numeric" }) }) + `, ${time}`;
}

function postDate(iso: string | null) {
  return iso ? new Date(iso).toLocaleDateString("en-US", { timeZone: MANILA, month: "short", day: "numeric" }) : "Not published";
}

// ---------- products ----------

type ProductRow = Product & { sort: number };

const toProduct = ({ id, name, hex, tint, price, stock, shown, description, image }: ProductRow): Product => ({
  id, name, hex, tint, price, stock, shown, description, image,
});

export async function listProducts(opts: { onlyShown?: boolean } = {}) {
  const filter = opts.onlyShown ? "&shown=eq.true" : "";
  const rows = await rest<ProductRow[]>(`products?select=*${filter}&order=sort.asc,created_at.asc`);
  return rows.map(toProduct);
}

export async function createProduct(p: Omit<Product, "id">) {
  const id = `${p.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "shellie"}-${Date.now().toString(36)}`;
  const [last] = await rest<{ sort: number }[]>("products?select=sort&order=sort.desc&limit=1");
  const [row] = await rest<ProductRow[]>("products", {
    method: "POST",
    prefer: "return=representation",
    body: JSON.stringify({ ...p, id, sort: (last?.sort ?? 0) + 1 }),
  });
  return toProduct(row);
}

export async function updateProduct(id: string, patch: Partial<Omit<Product, "id">>) {
  const [row] = await rest<ProductRow[]>(`products?id=eq.${encodeURIComponent(id)}`, {
    method: "PATCH",
    prefer: "return=representation",
    body: JSON.stringify(patch),
  });
  if (!row) throw new DbError("Listing not found");
  return toProduct(row);
}

export async function deleteProduct(id: string) {
  await rest(`products?id=eq.${encodeURIComponent(id)}`, { method: "DELETE" });
}

/** Uploads a listing photo and returns its public URL. */
export async function uploadProductPhoto(productId: string, file: File) {
  const ext = file.type === "image/png" ? "png" : file.type === "image/webp" ? "webp" : "jpg";
  const path = `${productId}/${Date.now().toString(36)}.${ext}`;
  const res = await fetch(`${BASE}/storage/v1/object/${PHOTO_BUCKET}/${path}`, {
    method: "POST",
    headers: headers({ "Content-Type": file.type, "x-upsert": "true", "Cache-Control": "31536000" }),
    body: Buffer.from(await file.arrayBuffer()),
  });
  if (!res.ok) throw new DbError(`Photo upload failed (${res.status})`);
  return `${BASE}/storage/v1/object/public/${PHOTO_BUCKET}/${path}`;
}

// ---------- homepage hero photo ----------
// Kept as a file in the photo bucket (site/hero-<time>.<ext>) rather than a table row: the newest
// file is the current photo, and replacing it removes the older ones.

const HERO_DIR = "site";

async function listHeroFiles(): Promise<string[]> {
  const res = await fetch(`${BASE}/storage/v1/object/list/${PHOTO_BUCKET}`, {
    method: "POST",
    cache: "no-store",
    headers: headers({ "Content-Type": "application/json" }),
    body: JSON.stringify({ prefix: HERO_DIR, search: "hero-", limit: 20, sortBy: { column: "created_at", order: "desc" } }),
  });
  if (!res.ok) throw new DbError(`Couldn't list homepage photos (${res.status})`);
  const rows = (await res.json()) as { name: string; id: string | null }[];
  return rows.filter((r) => r.id && r.name.startsWith("hero-")).map((r) => `${HERO_DIR}/${r.name}`);
}

async function deleteObjects(paths: string[]) {
  if (!paths.length) return;
  await fetch(`${BASE}/storage/v1/object/${PHOTO_BUCKET}`, {
    method: "DELETE",
    headers: headers({ "Content-Type": "application/json" }),
    body: JSON.stringify({ prefixes: paths }),
  }).catch(() => {});
}

/** The uploaded homepage hero photo, or null when none is set (or storage can't be reached). */
export async function getHeroImage(): Promise<string | null> {
  try {
    const [newest] = await listHeroFiles();
    return newest ? `${BASE}/storage/v1/object/public/${PHOTO_BUCKET}/${newest}` : null;
  } catch {
    return null;
  }
}

/** Uploads a new homepage hero photo, removes the previous one, and returns the new public URL. */
export async function setHeroImage(file: File) {
  const before = await listHeroFiles().catch(() => [] as string[]);
  const ext = file.type === "image/png" ? "png" : file.type === "image/webp" ? "webp" : "jpg";
  const path = `${HERO_DIR}/hero-${Date.now().toString(36)}.${ext}`;
  const res = await fetch(`${BASE}/storage/v1/object/${PHOTO_BUCKET}/${path}`, {
    method: "POST",
    headers: headers({ "Content-Type": file.type, "Cache-Control": "31536000" }),
    body: Buffer.from(await file.arrayBuffer()),
  });
  if (!res.ok) throw new DbError(`Photo upload failed (${res.status})`);
  await deleteObjects(before);
  return `${BASE}/storage/v1/object/public/${PHOTO_BUCKET}/${path}`;
}

/** Removes the homepage hero photo, so the homepage falls back to a listing photo. */
export async function removeHeroImage() {
  await deleteObjects(await listHeroFiles());
}

/** Removes a photo we stored, if the URL points into our bucket. Failures are ignored. */
export async function removeProductPhoto(url: string | null | undefined) {
  const prefix = `${BASE}/storage/v1/object/public/${PHOTO_BUCKET}/`;
  if (!url?.startsWith(prefix)) return;
  await fetch(`${BASE}/storage/v1/object/${PHOTO_BUCKET}`, {
    method: "DELETE",
    headers: headers({ "Content-Type": "application/json" }),
    body: JSON.stringify({ prefixes: [url.slice(prefix.length)] }),
  }).catch(() => {});
}

// ---------- orders ----------

type OrderRow = Omit<Order, "email" | "placed"> & { user_email: string; created_at: string };

const toOrder = ({ user_email, created_at, ...o }: OrderRow): Order => ({ ...o, email: user_email, placed: placedLabel(created_at) });

export async function listOrders() {
  return (await rest<OrderRow[]>("orders?select=*&order=created_at.desc")).map(toOrder);
}

export async function listOrdersFor(email: string) {
  const rows = await rest<OrderRow[]>(`orders?select=*&user_email=eq.${encodeURIComponent(email.toLowerCase())}&order=created_at.desc`);
  return rows.map(toOrder);
}

/** The details from this shopper's most recent order, to prefill checkout. */
export async function lastShippingFor(email: string) {
  const [row] = await rest<Pick<OrderRow, "name" | "phone" | "city" | "address" | "payment">[]>(
    `orders?select=name,phone,city,address,payment&user_email=eq.${encodeURIComponent(email.toLowerCase())}&order=created_at.desc&limit=1`,
  );
  return row ?? null;
}

export async function setOrderStatus(id: string, status: OrderStatus) {
  const [row] = await rest<OrderRow[]>(`orders?id=eq.${encodeURIComponent(id)}`, {
    method: "PATCH",
    prefer: "return=representation",
    body: JSON.stringify({ status }),
  });
  if (!row) throw new DbError("Order not found");
  return toOrder(row);
}

export type NewOrder = {
  email: string;
  name: string;
  phone: string;
  city: string;
  address: string;
  payment: Payment;
  note: string;
  items: { productId: string; qty: number }[];
};

/** Places the order atomically in the database (stock check + decrement). Returns the order number. */
export async function placeOrder(o: NewOrder) {
  return rest<string>("rpc/place_order", {
    method: "POST",
    body: JSON.stringify({
      p_email: o.email,
      p_name: o.name,
      p_phone: o.phone,
      p_city: o.city,
      p_address: o.address,
      p_payment: o.payment,
      p_note: o.note,
      p_items: o.items,
    }),
  });
}

// ---------- posts ----------

type PostRow = Omit<Post, "date"> & { published_at: string | null; created_at: string };

const toPost = ({ id, title, category, status, body, published_at }: PostRow): Post => ({ id, title, category, status, body, date: postDate(published_at) });

export async function listPosts(opts: { onlyPublished?: boolean } = {}) {
  const rows = opts.onlyPublished
    ? await rest<PostRow[]>("posts?select=*&status=eq.published&order=published_at.desc")
    : await rest<PostRow[]>("posts?select=*&order=status.asc,published_at.desc.nullsfirst,created_at.desc");
  return rows.map(toPost);
}

export async function savePost(p: { id?: string; title: string; category: PostCategory; body: string; status: "published" | "draft" }) {
  // Editing a post that's already live keeps its original date.
  let publishedAt: string | null = null;
  if (p.status === "published" && p.id) {
    const [cur] = await rest<{ published_at: string | null }[]>(`posts?select=published_at&id=eq.${encodeURIComponent(p.id)}`);
    publishedAt = cur?.published_at ?? null;
  }
  const body = {
    title: p.title,
    category: p.category,
    body: p.body,
    status: p.status,
    published_at: p.status === "published" ? (publishedAt ?? new Date().toISOString()) : null,
  };
  const [row] = p.id
    ? await rest<PostRow[]>(`posts?id=eq.${encodeURIComponent(p.id)}`, { method: "PATCH", prefer: "return=representation", body: JSON.stringify(body) })
    : await rest<PostRow[]>("posts", { method: "POST", prefer: "return=representation", body: JSON.stringify(body) });
  if (!row) throw new DbError("Post not found");
  return toPost(row);
}

export async function deletePost(id: string) {
  await rest(`posts?id=eq.${encodeURIComponent(id)}`, { method: "DELETE" });
}
