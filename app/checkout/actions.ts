"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { DbError, listProducts, placeOrder } from "@/lib/db";
import { PAYMENTS, type Payment } from "@/lib/data";

export type CheckoutInput = {
  name: string;
  phone: string;
  city: string;
  address: string;
  payment: Payment;
  note: string;
  cart: Record<string, number>;
};

export type CheckoutResult = { ok: true; orderId: string } | { ok: false; error: string; field?: keyof CheckoutInput };

const clean = (v: unknown, max: number) => String(v ?? "").trim().replace(/\s+/g, " ").slice(0, max);

export async function placeOrderAction(input: CheckoutInput): Promise<CheckoutResult> {
  const session = await auth();
  const email = session?.user?.email;
  if (!email) return { ok: false, error: "Please log in again to place your order." };

  const name = clean(input.name, 80);
  const phone = clean(input.phone, 20);
  const city = clean(input.city, 80);
  const address = clean(input.address, 300);
  const note = String(input.note ?? "").trim().slice(0, 500);
  const payment = input.payment;

  if (name.length < 2) return { ok: false, error: "Add the name we should ship to.", field: "name" };
  if (phone.replace(/\D/g, "").length < 10) return { ok: false, error: "Add a mobile number we can reach you on, like 0917 123 4567.", field: "phone" };
  if (city.length < 2) return { ok: false, error: "Add your city or municipality.", field: "city" };
  if (address.length < 5) return { ok: false, error: "Add your full delivery address.", field: "address" };
  if (!PAYMENTS.includes(payment)) return { ok: false, error: "Choose how you'll pay.", field: "payment" };

  const items = Object.entries(input.cart ?? {})
    .map(([productId, qty]) => ({ productId: String(productId), qty: Math.floor(Number(qty)) }))
    .filter((it) => it.qty > 0);
  if (items.length === 0) return { ok: false, error: "Your cart is empty." };
  if (items.some((it) => it.qty > 50)) return { ok: false, error: "For more than 50 of one color, message us on Instagram." };

  try {
    const orderId = await placeOrder({ email, name, phone, city, address, payment, note, items });
    revalidatePath("/", "layout"); // stock changed
    return { ok: true, orderId };
  } catch (e) {
    const m = e instanceof DbError ? /OUT_OF_STOCK:(\S+)/.exec(e.message) : null;
    if (m) {
      const p = (await listProducts()).find((x) => x.id === m[1]);
      if (!p || !p.shown) return { ok: false, error: "One of the Shellies in your cart isn't available anymore. Remove it and try again." };
      return {
        ok: false,
        error: p.stock === 0 ? `Sorry, ${p.name} just sold out. Remove it from your cart to continue.` : `Only ${p.stock} ${p.name} left. Lower the quantity and try again.`,
      };
    }
    console.error("placeOrder failed", e);
    return { ok: false, error: "We couldn't place your order. Please try again in a moment." };
  }
}
