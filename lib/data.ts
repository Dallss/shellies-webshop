// Sample data for the frontend. Replace with real API calls once the backend exists.

export type Product = {
  id: string;
  name: string;
  hex: string;
  tint: string;
  price: number;
  stock: number;
  shown: boolean;
  description: string;
  /** Photo of the listing: a file in /public (e.g. "/shellies/classic.jpg") or a full URL. */
  image?: string;
};

export const PRODUCTS: Product[] = [
  { id: "classic", name: "Classic", hex: "#C9973A", tint: "#F6E8CC", price: 149, stock: 42, shown: true, description: "Golden cord with the original shell-shaped NFC tag." },
  { id: "flamingo", name: "Flamingo", hex: "#FF6EC7", tint: "#FFE0F3", price: 149, stock: 18, shown: true, description: "Bright pink cord, our best seller." },
  { id: "tide", name: "Tide", hex: "#4C8EF0", tint: "#DCE8FD", price: 149, stock: 35, shown: true, description: "Ocean-blue cord." },
  { id: "honey", name: "Honey", hex: "#FFD23F", tint: "#FFF4CC", price: 149, stock: 7, shown: true, description: "Sunny yellow cord." },
  { id: "onyx", name: "Onyx", hex: "#4A4A4A", tint: "#E4E4E4", price: 149, stock: 26, shown: true, description: "Charcoal cord that goes with everything." },
  { id: "pearl", name: "Pearl", hex: "#D4D4D4", tint: "#F1F1F1", price: 149, stock: 0, shown: true, description: "Soft white cord." },
];

export function formatPeso(n: number) {
  return "₱" + n.toLocaleString("en-PH");
}

// ---------- Orders ----------

export const ORDER_STEPS = ["new", "confirmed", "packed", "shipped", "delivered"] as const;
export type OrderStatus = (typeof ORDER_STEPS)[number] | "cancelled";

export type Order = {
  id: string;
  name: string;
  phone: string;
  city: string;
  address: string;
  items: { productId: string; qty: number }[];
  payment: "GCash" | "Cash on delivery";
  status: OrderStatus;
  placed: string;
  note: string;
};

export const SAMPLE_ORDERS: Order[] = [
  { id: "PC-1048", name: "Liza Santos", phone: "0917 123 4501", city: "Mandaue City", address: "Brgy. Bakilid, Mandaue City, Cebu", items: [{ productId: "flamingo", qty: 1 }, { productId: "tide", qty: 1 }], payment: "GCash", status: "new", placed: "Today, 9:14 AM", note: "For my twins, please pack separately." },
  { id: "PC-1047", name: "Mark Villanueva", phone: "0917 123 4502", city: "Cebu City", address: "Brgy. Lahug, Cebu City, Cebu", items: [{ productId: "classic", qty: 2 }], payment: "Cash on delivery", status: "new", placed: "Today, 8:02 AM", note: "" },
  { id: "PC-1046", name: "Joy Tan", phone: "0917 123 4503", city: "Lapu-Lapu City", address: "Brgy. Pusok, Lapu-Lapu City, Cebu", items: [{ productId: "honey", qty: 1 }], payment: "GCash", status: "confirmed", placed: "Yesterday, 6:40 PM", note: "" },
  { id: "PC-1045", name: "Ramon Cruz", phone: "0917 123 4504", city: "Talisay City", address: "Brgy. Lawaan, Talisay City, Cebu", items: [{ productId: "onyx", qty: 1 }, { productId: "pearl", qty: 1 }], payment: "Cash on delivery", status: "packed", placed: "Yesterday, 2:15 PM", note: "" },
  { id: "PC-1044", name: "Bea Dizon", phone: "0917 123 4505", city: "Consolacion", address: "Brgy. Pitogo, Consolacion, Cebu", items: [{ productId: "flamingo", qty: 3 }], payment: "GCash", status: "shipped", placed: "Nov 12", note: "" },
  { id: "PC-1043", name: "Carlo Ramos", phone: "0917 123 4506", city: "Minglanilla", address: "Brgy. Tunghaan, Minglanilla, Cebu", items: [{ productId: "tide", qty: 1 }], payment: "Cash on delivery", status: "delivered", placed: "Nov 11", note: "" },
  { id: "PC-1031", name: "Liza Santos", phone: "0917 123 4501", city: "Mandaue City", address: "Brgy. Bakilid, Mandaue City, Cebu", items: [{ productId: "classic", qty: 1 }], payment: "Cash on delivery", status: "delivered", placed: "Oct 28", note: "" },
];

/** The signed-in shopper on /account. Stand-in until real login exists. */
export const DEMO_CUSTOMER = { name: "Liza Santos", email: "liza.santos@example.com", phone: "0917 123 4501" };

// ---------- Posts ----------

export type PostCategory = "News" | "New drop" | "Tips";

export type Post = {
  id: string;
  title: string;
  category: PostCategory;
  status: "published" | "draft";
  date: string;
  body: string;
};

export const SAMPLE_POSTS: Post[] = [
  { id: "p3", title: "Holiday orders: last day to order", category: "News", status: "draft", date: "Not published", body: "Want a Shellie under the tree? Order by [DATE] so it arrives before Christmas." },
  { id: "p2", title: "Meet the Signature Collection", category: "New drop", status: "published", date: "Nov 10", body: "Six colors, one for every kind of kid. Classic, Flamingo, Tide, Honey, Onyx and Pearl are all ₱149 and come with the NFC tag ready to set up." },
  { id: "p1", title: "Set up your Shellie in 2 minutes", category: "Tips", status: "published", date: "Nov 3", body: "Open the app, tap the + button, and hold your phone to the bracelet. Then switch on the details you want a helper to see." },
];

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
