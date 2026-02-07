import { createContext, useContext, useEffect, useMemo, useState } from "react";
import {
  addToCart,
  cartKey,
  clearCart,
  loadCart,
  removeFromCart,
  setCartQuantity,
} from "./storage.js";

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [cart, setCart] = useState(() => loadCart());

  useEffect(() => {
    function onStorage(e) {
      if (e.key === cartKey()) setCart(loadCart());
    }
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const api = useMemo(() => {
    const totalQuantity = cart.items.reduce((sum, it) => sum + it.quantity, 0);
    return {
      cart,
      itemCount: cart.items.length,
      totalQuantity,
      add(productId, qty = 1) {
        setCart(addToCart(productId, qty));
      },
      remove(productId) {
        setCart(removeFromCart(productId));
      },
      setQuantity(productId, qty) {
        setCart(setCartQuantity(productId, qty));
      },
      clear() {
        clearCart();
        setCart(loadCart());
      },
    };
  }, [cart]);

  return <CartContext.Provider value={api}>{children}</CartContext.Provider>;
}

export function useCart() {
  const v = useContext(CartContext);
  if (!v) throw new Error("useCart must be used within CartProvider");
  return v;
}
