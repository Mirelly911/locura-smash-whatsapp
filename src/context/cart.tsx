import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

export type CartAddOn = {
  id: string;
  name: string;
  price: number;
};

export type CartLine = {
  key: string;
  itemId: string;
  name: string;
  category: string;
  basePrice: number;
  quantity: number;
  image?: string;
  addOns?: CartAddOn[];
};

type AddableItem = {
  id: string;
  name: string;
  price: number;
  category: string;
  image?: string;
};

type CartContextValue = {
  items: CartLine[];
  itemCount: number;
  addItem: (item: AddableItem, quantity?: number, addOns?: CartAddOn[]) => void;
  updateQuantity: (key: string, quantity: number) => void;
  removeItem: (key: string) => void;
  clear: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);

const STORAGE_KEY = "locura_smash_cart_v1";

function buildLineKey(itemId: string, addOns?: CartAddOn[]) {
  const addOnKey =
    addOns && addOns.length > 0
      ? addOns
          .map((o) => o.id)
          .slice()
          .sort()
          .join("+")
      : "base";
  return `${itemId}__${addOnKey}`;
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartLine[]>([]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw) as CartLine[];
      if (Array.isArray(parsed)) setItems(parsed);
    } catch {
      // ignore corrupted storage
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      // ignore storage failures (private mode, quota)
    }
  }, [items]);

  const value = useMemo<CartContextValue>(() => {
    const itemCount = items.reduce((sum, line) => sum + line.quantity, 0);

    const addItem: CartContextValue["addItem"] = (item, quantity = 1, addOns = []) => {
      const safeQuantity = Math.max(1, Math.floor(quantity || 1));
      const key = buildLineKey(item.id, addOns);

      setItems((prev) => {
        const existing = prev.find((l) => l.key === key);
        if (!existing) {
          return [
            ...prev,
            {
              key,
              itemId: item.id,
              name: item.name,
              category: item.category,
              basePrice: item.price,
              quantity: safeQuantity,
              image: item.image,
              addOns,
            },
          ];
        }

        return prev.map((l) =>
          l.key === key ? { ...l, quantity: l.quantity + safeQuantity } : l,
        );
      });
    };

    const updateQuantity: CartContextValue["updateQuantity"] = (key, quantity) => {
      const safeQuantity = Math.max(1, Math.floor(quantity || 1));
      setItems((prev) => prev.map((l) => (l.key === key ? { ...l, quantity: safeQuantity } : l)));
    };

    const removeItem: CartContextValue["removeItem"] = (key) => {
      setItems((prev) => prev.filter((l) => l.key !== key));
    };

    const clear = () => setItems([]);

    return { items, itemCount, addItem, updateQuantity, removeItem, clear };
  }, [items]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within a CartProvider");
  return ctx;
}

