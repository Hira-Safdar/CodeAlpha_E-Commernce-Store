import { Star } from "lucide-react";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api/axios.js";
import QuantityControl from "../components/QuantityControl.jsx";
import { useCart } from "../context/CartContext.jsx";
import { formatCurrency } from "../utils/format.js";

export default function ProductDetails() {
  const { id } = useParams();
  const { addItem, getItemQuantity, removeItem, updateItem } = useCart();
  const [product, setProduct] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    api.get(`/products/${id}`)
      .then(({ data }) => setProduct(data))
      .catch((err) => setError(err.response?.data?.message || "Product not found"));
  }, [id]);

  if (error) return <section className="container-pad py-12"><p className="panel p-5 text-red-600">{error}</p></section>;
  if (!product) return <section className="container-pad py-12"><div className="h-96 animate-pulse rounded-lg bg-slate-200 dark:bg-slate-800" /></section>;
  const quantity = getItemQuantity(product._id);

  return (
    <section className="container-pad grid gap-10 py-10 lg:grid-cols-2">
      <img className="aspect-[4/3] w-full rounded-lg object-cover shadow-soft" src={product.image} alt={product.title} />
      <div>
        <p className="text-sm font-bold uppercase text-brand">{product.category}</p>
        <h1 className="mt-2 text-4xl font-black">{product.title}</h1>
        <div className="mt-4 flex items-center gap-3 text-sm text-slate-600 dark:text-slate-300">
          <span className="inline-flex items-center gap-1"><Star className="fill-amber-400 text-amber-400" size={18} /> {product.ratings?.average}</span>
          <span>{product.ratings?.count || 0} reviews</span>
          <span>{product.stock} in stock</span>
        </div>
        <p className="mt-6 text-3xl font-black">{formatCurrency(product.price)}</p>
        <p className="mt-6 leading-8 text-slate-600 dark:text-slate-300">{product.description}</p>
        <div className="mt-8 flex flex-wrap gap-3">
          {quantity > 0 ? (
            <QuantityControl
              value={quantity}
              max={product.stock}
              onDecrease={() => (quantity === 1 ? removeItem(product._id) : updateItem(product._id, quantity - 1))}
              onIncrease={() => updateItem(product._id, quantity + 1)}
            />
          ) : (
            <button className="btn-primary" disabled={!product.stock} onClick={() => addItem(product, 1)}>Add to cart</button>
          )}
        </div>
      </div>
    </section>
  );
}
