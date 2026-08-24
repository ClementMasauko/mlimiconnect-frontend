import { createContext, useContext, useEffect, useMemo, useState } from "react";

export type ProductCategory = "produce" | "seed" | "seeds" | "chemical" | "tool" | "tools" | "farm-inputs" | "equipment" | "machinery" | "other";

export interface CartProduct {
  id: string | number;
  name: string;
  price: number;
  category: ProductCategory;
  image?: string;
}

export interface CartItem {
  product: CartProduct;
  quantity: number;
}

interface CartContextValue {
  items: CartItem[];
  addItem: (product: CartProduct, quantity?: number) => void;
  updateQuantity: (productId: CartProduct["id"], quantity: number) => void;
  removeItem: (productId: CartProduct["id"]) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextValue | undefined>(undefined);
const CART_STORAGE_KEY = "mc_cart";

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem(CART_STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  const value = useMemo<CartContextValue>(() => ({
    items,
    addItem: (product, quantity = 1) => setItems((current) => {
      const existing = current.find((item) => item.product.id === product.id);
      if (!existing) return [...current, { product, quantity }];
      return current.map((item) => item.product.id === product.id
        ? { ...item, quantity: item.quantity + quantity }
        : item);
    }),
    updateQuantity: (productId, quantity) => setItems((current) => quantity < 1
      ? current.filter((item) => item.product.id !== productId)
      : current.map((item) => item.product.id === productId ? { ...item, quantity } : item)),
    removeItem: (productId) => setItems((current) => current.filter((item) => item.product.id !== productId)),
    clearCart: () => setItems([]),
  }), [items]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within a CartProvider");
  return context;
}
