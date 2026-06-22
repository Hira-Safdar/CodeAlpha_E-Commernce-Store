import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios.js";
import QuantityControl from "../components/QuantityControl.jsx";
import { useCart } from "../context/CartContext.jsx";
import { DELIVERY_FEE, formatCurrency } from "../utils/format.js";

const initial = { fullName: "", phone: "", address: "", city: "", postalCode: "", country: "" };

export default function Checkout() {
  const [form, setForm] = useState(initial);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const { items, subtotal, clearCart, updateItem, removeItem } = useCart();
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    try {
      await api.post("/orders", { shippingAddress: form });
      clearCart();
      navigate("/orders");
    } catch (err) {
      setError(err.response?.data?.message || "Unable to place order");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="container-pad grid gap-6 py-10 lg:grid-cols-[1fr_360px]">
      <form className="panel grid gap-4 p-6" onSubmit={submit}>
        <h1 className="text-3xl font-black">Shipping information</h1>
        {error && <p className="rounded-md bg-red-50 p-3 text-sm text-red-700">{error}</p>}
        {Object.keys(initial).map((key) => (
          <label key={key} className="grid gap-1 text-sm font-semibold capitalize">
            {key.replace(/([A-Z])/g, " $1")}
            <input className="input" required value={form[key]} onChange={(e) => setForm({ ...form, [key]: e.target.value })} />
          </label>
        ))}
        <button className="btn-primary" disabled={submitting || items.length === 0}>{submitting ? "Placing order..." : "Place order"}</button>
      </form>
      <aside className="panel h-fit p-5">
        <h2 className="text-xl font-black">Order summary</h2>
        <div className="mt-4 grid gap-3">
          {items.map((item) => (
            <div key={item.product._id} className="grid gap-2 border-b border-slate-200 pb-3 text-sm last:border-0 last:pb-0 dark:border-slate-800">
              <div className="flex justify-between gap-4">
                <span className="font-semibold">{item.product.title}</span>
                <span>{formatCurrency(item.product.price * item.quantity)}</span>
              </div>
              <QuantityControl
                value={item.quantity}
                max={item.product.stock}
                onDecrease={() => (item.quantity === 1 ? removeItem(item.product._id) : updateItem(item.product._id, item.quantity - 1))}
                onIncrease={() => updateItem(item.product._id, item.quantity + 1)}
                disabled={submitting}
              />
            </div>
          ))}
        </div>
        <div className="mt-5 border-t border-slate-200 pt-4 text-lg font-black dark:border-slate-800 flex justify-between">
          <span>Total</span><span>{formatCurrency(subtotal + (subtotal > 0 ? DELIVERY_FEE : 0))}</span>
        </div>
      </aside>
    </section>
  );
}
