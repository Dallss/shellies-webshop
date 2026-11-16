"use client";

import { createContext, useContext, useState } from "react";
import { PRODUCTS, SAMPLE_ORDERS, SAMPLE_POSTS, type Order, type Post, type Product } from "./data";

// In-memory admin state. Swap for API calls when the backend is ready.

type AdminStore = {
  orders: Order[];
  setOrders: React.Dispatch<React.SetStateAction<Order[]>>;
  products: Product[];
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
  posts: Post[];
  setPosts: React.Dispatch<React.SetStateAction<Post[]>>;
};

const Ctx = createContext<AdminStore | null>(null);

export function AdminProvider({ children }: { children: React.ReactNode }) {
  const [orders, setOrders] = useState(SAMPLE_ORDERS);
  const [products, setProducts] = useState(PRODUCTS);
  const [posts, setPosts] = useState(SAMPLE_POSTS);
  return <Ctx.Provider value={{ orders, setOrders, products, setProducts, posts, setPosts }}>{children}</Ctx.Provider>;
}

export function useAdmin() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useAdmin must be used inside AdminProvider");
  return ctx;
}

export function orderTotal(o: Order, products: Product[]) {
  return o.items.reduce((a, it) => a + (products.find((p) => p.id === it.productId)?.price ?? 0) * it.qty, 0);
}
