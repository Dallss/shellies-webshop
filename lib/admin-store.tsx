"use client";

import { createContext, useContext, useState } from "react";
import type { Order, Post, Product } from "./data";

// Admin screens' working copy of the shop data. The admin layout loads it from Supabase on the
// server and passes it in; pages update it locally after each server action succeeds
// (see app/admin/actions.ts), so the UI stays snappy without refetching everything.

type AdminStore = {
  orders: Order[];
  setOrders: React.Dispatch<React.SetStateAction<Order[]>>;
  products: Product[];
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
  posts: Post[];
  setPosts: React.Dispatch<React.SetStateAction<Post[]>>;
};

const Ctx = createContext<AdminStore | null>(null);

export function AdminProvider({
  initial,
  children,
}: {
  initial: { orders: Order[]; products: Product[]; posts: Post[] };
  children: React.ReactNode;
}) {
  const [orders, setOrders] = useState(initial.orders);
  const [products, setProducts] = useState(initial.products);
  const [posts, setPosts] = useState(initial.posts);
  return <Ctx.Provider value={{ orders, setOrders, products, setProducts, posts, setPosts }}>{children}</Ctx.Provider>;
}

export function useAdmin() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useAdmin must be used inside AdminProvider");
  return ctx;
}
