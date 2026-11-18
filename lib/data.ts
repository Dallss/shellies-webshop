// Shop types shared by the server (lib/db.ts) and the pages. The data itself lives in Supabase.

export type Product = {
  id: string;
  name: string;
  hex: string;
  tint: string;
  price: number;
  stock: number;
  shown: boolean;
  description: string;
  /** Photo of the listing: a public Supabase Storage URL, a file in /public, or null. */
  image?: string | null;
};

export function formatPeso(n: number) {
  return "₱" + n.toLocaleString("en-PH");
}

// ---------- Orders ----------

export const ORDER_STEPS = ["new", "confirmed", "packed", "shipped", "delivered"] as const;
export type OrderStatus = (typeof ORDER_STEPS)[number] | "cancelled";
export const PAYMENTS = ["GCash", "Cash on delivery"] as const;
export type Payment = (typeof PAYMENTS)[number];

/** What was bought, frozen at checkout so later listing edits don't change old orders. */
export type OrderItem = { productId: string; name: string; hex: string; price: number; qty: number };

export type Order = {
  id: string;
  email: string;
  name: string;
  phone: string;
  city: string;
  address: string;
  items: OrderItem[];
  total: number;
  payment: Payment;
  status: OrderStatus;
  /** Display time in Manila, e.g. "Nov 18, 9:14 AM". */
  placed: string;
  note: string;
};

// ---------- Posts ----------

export type PostCategory = "News" | "New drop" | "Tips";
export const POST_CATEGORIES: PostCategory[] = ["News", "New drop", "Tips"];

export type Post = {
  id: string;
  title: string;
  category: PostCategory;
  status: "published" | "draft";
  /** "Nov 10" once published, otherwise "Not published". */
  date: string;
  body: string;
};

// ---------- A family's Shellies ----------

export const SHELLIE_COLORS = [
  { id: "peach", name: "Peach", hex: "#FFAA72" },
  { id: "pink", name: "Pink", hex: "#FF92D6" },
  { id: "lemon", name: "Lemon", hex: "#FFE992" },
  { id: "lime", name: "Lime", hex: "#BEFF70" },
  { id: "sky", name: "Sky", hex: "#7ACBFF" },
  { id: "lilac", name: "Lilac", hex: "#C985DB" },
  { id: "charcoal", name: "Charcoal", hex: "#555555" },
  { id: "cloud", name: "Cloud", hex: "#DADADA" },
];

export type FieldKey = "first" | "last" | "phone" | "age" | "address" | "instagram" | "facebook";

export type ShellieField = { key: FieldKey; label: string; value: string; shared: boolean };

export type Shellie = {
  tagId: string;
  name: string;
  color: string;
  lastScan: string;
  fields: ShellieField[];
};

function fields(first: string, age: string, ig: string, fb: string, on: boolean[]): ShellieField[] {
  return [
    { key: "first", label: "First name", value: first, shared: on[0] },
    { key: "last", label: "Last name", value: "Reyes", shared: on[1] },
    { key: "phone", label: "Contact number", value: "(+63) 912 345 6789", shared: on[2] },
    { key: "age", label: "Age", value: age, shared: on[3] },
    { key: "address", label: "Home address", value: "House No., Talisay, Cebu", shared: on[4] },
    { key: "instagram", label: "Instagram (URL)", value: ig, shared: on[5] },
    { key: "facebook", label: "Facebook (URL)", value: fb, shared: on[6] },
  ];
}

export const SAMPLE_SHELLIES: Shellie[] = [
  { tagId: "AB12CD", name: "Anne", color: "lilac", lastScan: "Today, 2:54 P.M.", fields: fields("Anne", "12", "", "Mom Reyes", [true, true, true, true, true, false, true]) },
  { tagId: "DN67XY", name: "Danny", color: "peach", lastScan: "Yesterday, 5:10 P.M.", fields: fields("Danny", "16", "@danny_67", "Danny Reyes", [true, true, true, true, true, true, true]) },
];

export function colorHex(id: string) {
  return (SHELLIE_COLORS.find((c) => c.id === id) ?? SHELLIE_COLORS[0]).hex;
}

/** The rows a finder sees: only fields the family switched on. */
export function sharedRows(s: Shellie) {
  const get = (k: FieldKey) => s.fields.find((f) => f.key === k)!;
  const rows: { label: string; value: string }[] = [];
  const name = [get("first"), get("last")].filter((f) => f.shared && f.value).map((f) => f.value).join(" ");
  if (name) rows.push({ label: "Name", value: name });
  const map: [FieldKey, string][] = [["phone", "Contact"], ["age", "Age"], ["address", "Home"], ["instagram", "Instagram"], ["facebook", "Facebook"]];
  for (const [k, label] of map) {
    const f = get(k);
    if (f.shared && f.value) rows.push({ label, value: k === "age" ? `${f.value} years old` : f.value });
  }
  return rows;
}
