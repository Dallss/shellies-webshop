"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";

type Cart = Record<string, number>;

type CartValue = {
  cart: Cart;
  count: number;
  /** False until the saved cart has been read from this browser. */
  ready: boolean;
  add: (productId: string, qty?: number) => void;
  remove: (productId: string) => void;
  clear: () => void;
};

const CartContext = createContext<CartValue | null>(null);
const KEY = "perle-cart";

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<Cart>({});
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(KEY);
      if (saved) setCart(JSON.parse(saved));
    } catch {
      /* storage unavailable: start empty */
    }
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return; // don't overwrite the saved cart before it's loaded
    try {
      localStorage.setItem(KEY, JSON.stringify(cart));
    } catch {
      /* ignore */
    }
  }, [cart, ready]);

  const value = useMemo<CartValue>(
    () => ({
      cart,
      count: Object.values(cart).reduce((a, n) => a + n, 0),
      ready,
      add: (id, qty = 1) => setCart((c) => ({ ...c, [id]: (c[id] ?? 0) + qty })),
      remove: (id) =>
        setCart((c) => {
          const next = { ...c };
          delete next[id];
          return next;
        }),
      clear: () => setCart({}),
    }),
    [cart, ready],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside CartProvider");
  return ctx;
}
