"use server";

import { revalidatePath } from "next/cache";
import { auth, isAdminEmail } from "@/auth";
import * as db from "@/lib/db";
import { ORDER_STEPS, POST_CATEGORIES, type OrderStatus, type PostCategory, type Product } from "@/lib/data";

// Every admin write goes through here. Each action re-checks the caller is on ADMIN_EMAILS,
// because server actions are reachable by POST from anywhere, not just from /admin pages.

async function requireAdmin() {
  const session = await auth();
  if (!isAdminEmail(session?.user?.email)) throw new Error("Not allowed");
}

/** Pages that show listings or posts to shoppers. */
function refreshShop() {
  revalidatePath("/", "layout");
}

// ---------- orders ----------

const STATUSES: OrderStatus[] = [...ORDER_STEPS, "cancelled"];

export async function setOrderStatusAction(id: string, status: OrderStatus) {
  await requireAdmin();
  if (!STATUSES.includes(status)) throw new Error("Unknown status");
  return db.setOrderStatus(id, status);
}

export async function refreshOrdersAction() {
  await requireAdmin();
  return db.listOrders();
}

// ---------- listings ----------

type ProductPatch = Partial<Pick<Product, "name" | "hex" | "tint" | "price" | "stock" | "shown" | "description">>;

function cleanPatch(patch: ProductPatch): ProductPatch {
  const out: ProductPatch = {};
  if (patch.name !== undefined) out.name = String(patch.name).slice(0, 60);
  if (patch.hex !== undefined && /^#[0-9a-f]{6}$/i.test(patch.hex)) out.hex = patch.hex;
  if (patch.tint !== undefined && /^#[0-9a-f]{6}$/i.test(patch.tint)) out.tint = patch.tint;
  if (patch.price !== undefined) out.price = Math.max(0, Math.min(1_000_000, Math.round(Number(patch.price) || 0)));
  if (patch.stock !== undefined) out.stock = Math.max(0, Math.min(1_000_000, Math.round(Number(patch.stock) || 0)));
  if (patch.shown !== undefined) out.shown = !!patch.shown;
  if (patch.description !== undefined) out.description = String(patch.description).slice(0, 1000);
  return out;
}

export async function createProductAction() {
  await requireAdmin();
  const p = await db.createProduct({ name: "New Shellie", hex: "#C985DB", tint: "#F1E4F5", price: 149, stock: 0, shown: false, description: "", image: null });
  refreshShop();
  return p;
}

export async function updateProductAction(id: string, patch: ProductPatch) {
  await requireAdmin();
  const p = await db.updateProduct(id, cleanPatch(patch));
  refreshShop();
  return p;
}

export async function deleteProductAction(id: string) {
  await requireAdmin();
  const current = (await db.listProducts()).find((p) => p.id === id);
  await db.deleteProduct(id);
  await db.removeProductPhoto(current?.image);
  refreshShop();
}

const PHOTO_TYPES = ["image/jpeg", "image/png", "image/webp"];
const MAX_PHOTO_BYTES = 4 * 1024 * 1024;

export async function setProductPhotoAction(id: string, form: FormData) {
  await requireAdmin();
  const file = form.get("photo");
  if (!(file instanceof File)) throw new Error("No photo");
  if (!PHOTO_TYPES.includes(file.type)) throw new Error("Use a JPG, PNG or WebP photo.");
  if (file.size > MAX_PHOTO_BYTES) throw new Error("That photo is over 4 MB.");
  const before = (await db.listProducts()).find((p) => p.id === id);
  const url = await db.uploadProductPhoto(id, file);
  const p = await db.updateProduct(id, { image: url });
  await db.removeProductPhoto(before?.image);
  refreshShop();
  return p;
}

export async function removeProductPhotoAction(id: string) {
  await requireAdmin();
  const before = (await db.listProducts()).find((p) => p.id === id);
  const p = await db.updateProduct(id, { image: null });
  await db.removeProductPhoto(before?.image);
  refreshShop();
  return p;
}

// ---------- posts ----------

export async function savePostAction(input: { id?: string; title: string; category: PostCategory; body: string; status: "published" | "draft" }) {
  await requireAdmin();
  if (!POST_CATEGORIES.includes(input.category)) throw new Error("Unknown post type");
  if (input.status !== "published" && input.status !== "draft") throw new Error("Unknown status");
  const post = await db.savePost({
    id: input.id,
    title: String(input.title).slice(0, 200),
    category: input.category,
    body: String(input.body).slice(0, 20_000),
    status: input.status,
  });
  refreshShop();
  return post;
}

export async function deletePostAction(id: string) {
  await requireAdmin();
  await db.deletePost(id);
  refreshShop();
}
