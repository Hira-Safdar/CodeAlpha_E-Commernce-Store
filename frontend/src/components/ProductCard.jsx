import { Star } from "lucide-react";
import { Link } from "react-router-dom";
import QuantityControl from "./QuantityControl.jsx";
import { useCart } from "../context/CartContext.jsx";
import { formatCurrency } from "../utils/format.js";

export default function ProductCard({ product }) {
  const { addItem, getItemQuantity, removeItem, updateItem } = useCart();
  const quantity = getItemQuantity(product._id);

  return (
    <article className="group overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-soft dark:border-slate-800 dark:bg-slate-900">
      <Link to={`/products/${product._id}`} className="block aspect-[4/3] overflow-hidden bg-slate-100 dark:bg-slate-800">
        <img className="h-full w-full object-cover transition duration-500 group-hover:scale-105" src={product.image} alt={product.title} />
      </Link>
      <div className="grid gap-3 p-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase text-brand">{product.category}</p>
            <Link to={`/products/${product._id}`} className="mt-1 line-clamp-2 font-bold hover:text-brand">{product.title}</Link>
          </div>
          <p className="font-black">{formatCurrency(product.price)}</p>
        </div>
        <div className="flex items-center justify-between text-sm text-slate-500 dark:text-slate-400">
          <span className="inline-flex items-center gap-1"><Star className="fill-amber-400 text-amber-400" size={16} /> {product.ratings?.average || 0}</span>
          <span>{product.stock > 0 ? `${product.stock} in stock` : "Out of stock"}</span>
        </div>
        {quantity > 0 ? (
          <QuantityControl
            value={quantity}
            max={product.stock}
            onDecrease={() => (quantity === 1 ? removeItem(product._id) : updateItem(product._id, quantity - 1))}
            onIncrease={() => updateItem(product._id, quantity + 1)}
          />
        ) : (
          <button className="btn-primary" disabled={product.stock === 0} onClick={() => addItem(product, 1)}>
            Add to cart
          </button>
        )}
      </div>
    </article>
  );
}
