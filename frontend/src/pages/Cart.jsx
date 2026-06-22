import { Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import QuantityControl from "../components/QuantityControl.jsx";
import { useCart } from "../context/CartContext.jsx";
import { DELIVERY_FEE, formatCurrency } from "../utils/format.js";

export default function Cart() {
  const { items, subtotal, updateItem, removeItem } = useCart();
  const shipping = subtotal > 0 ? DELIVERY_FEE : 0;
  const total = subtotal + shipping;

  return (
    <section className="container-pad py-10">
      <h1 className="mb-7 text-4xl font-black">Shopping cart</h1>
      {items.length === 0 ? (
        <div className="panel p-8 text-center">
          <p className="mb-4 font-semibold">Your cart is empty.</p>
          <Link className="btn-primary" to="/products">Shop products</Link>
        </div>
      ) : (
        <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
          <div className="grid gap-4">
            {items.map(({ product, quantity }) => (
              <div key={product._id} className="panel grid gap-4 p-4 sm:grid-cols-[120px_1fr_auto] sm:items-center">
                <img className="h-28 w-full rounded-md object-cover sm:w-28" src={product.image} alt={product.title} />
                <div>
                  <h2 className="font-black">{product.title}</h2>
                  <p className="text-sm text-slate-500">{formatCurrency(product.price)}</p>
                </div>
                <div className="flex items-center gap-3">
                  <QuantityControl
                    value={quantity}
                    max={product.stock}
                    onDecrease={() => (quantity === 1 ? removeItem(product._id) : updateItem(product._id, quantity - 1))}
                    onIncrease={() => updateItem(product._id, quantity + 1)}
                  />
                  <button className="btn-secondary h-10 w-10 p-0" onClick={() => removeItem(product._id)} aria-label="Remove item"><Trash2 size={17} /></button>
                </div>
              </div>
            ))}
          </div>
          <aside className="panel h-fit p-5">
            <h2 className="text-xl font-black">Order summary</h2>
            <div className="mt-5 grid gap-3 text-sm">
              <div className="flex justify-between"><span>Subtotal</span><span>{formatCurrency(subtotal)}</span></div>
              <div className="flex justify-between"><span>Shipping</span><span>{formatCurrency(shipping)}</span></div>
              <div className="border-t border-slate-200 pt-3 text-lg font-black dark:border-slate-800 flex justify-between"><span>Total</span><span>{formatCurrency(total)}</span></div>
            </div>
            <Link className="btn-primary mt-5 w-full" to="/checkout">Checkout</Link>
          </aside>
        </div>
      )}
    </section>
  );
}
