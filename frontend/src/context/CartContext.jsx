import { createContext, useContext, useEffect, useMemo, useState } from "react";
import api from "../api/axios.js";
import { useAuth } from "./AuthContext.jsx";

const CartContext = createContext(null);

const localCartKey = "codealpha_guest_cart";
const normalizeItems = (products = []) =>
  products.map((item) => ({
    product: item.product,
    quantity: item.quantity
  }));

export function CartProvider({ children }) {
  const { user } = useAuth();
  const [items, setItems] = useState(() => JSON.parse(localStorage.getItem(localCartKey) || "[]"));
  const [loading, setLoading] = useState(false);

  const fetchCart = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const { data } = await api.get("/cart");
      setItems(normalizeItems(data.products));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) fetchCart();
  }, [user?.id]);

  useEffect(() => {
    if (!user) localStorage.setItem(localCartKey, JSON.stringify(items));
  }, [items, user]);

  const addItem = async (product, quantity = 1) => {
    if (user) {
      const { data } = await api.post("/cart/add", { productId: product._id, quantity });
      setItems(normalizeItems(data.products));
      return;
    }
    setItems((current) => {
      const exists = current.find((item) => item.product._id === product._id);
      if (exists) {
        return current.map((item) =>
          item.product._id === product._id
            ? { ...item, quantity: Math.min(item.quantity + quantity, product.stock) }
            : item
        );
      }
      return [...current, { product, quantity }];
    });
  };

  const updateItem = async (productId, quantity) => {
    if (user) {
      const { data } = await api.put("/cart/update", { productId, quantity });
      setItems(normalizeItems(data.products));
      return;
    }
    setItems((current) => current.map((item) => (item.product._id === productId ? { ...item, quantity } : item)));
  };

  const removeItem = async (productId) => {
    if (user) {
      const { data } = await api.delete("/cart/remove", { data: { productId } });
      setItems(normalizeItems(data.products));
      return;
    }
    setItems((current) => current.filter((item) => item.product._id !== productId));
  };

  const clearCart = () => setItems([]);
  const subtotal = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

  const value = useMemo(
    () => ({ items, loading, subtotal, totalItems, addItem, updateItem, removeItem, clearCart, fetchCart }),
    [items, loading, subtotal, totalItems]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export const useCart = () => useContext(CartContext);
