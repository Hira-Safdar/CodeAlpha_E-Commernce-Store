import { Search } from "lucide-react";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import api from "../api/axios.js";
import LoadingSkeleton from "../components/LoadingSkeleton.jsx";
import ProductCard from "../components/ProductCard.jsx";

export default function Products() {
  const [params, setParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const search = params.get("search") || "";
  const category = params.get("category") || "all";
  const sort = params.get("sort") || "newest";

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError("");
      try {
        const { data } = await api.get("/products", { params: { search, category, sort, limit: 50 } });
        setProducts(data.products);
        setCategories(data.categories);
      } catch (err) {
        setError(err.response?.data?.message || "Unable to load products");
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [search, category, sort]);

  const setFilter = (key, value) => {
    const next = new URLSearchParams(params);
    value ? next.set(key, value) : next.delete(key);
    setParams(next);
  };

  return (
    <section className="container-pad py-10">
      <div className="mb-7 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-sm font-bold uppercase text-brand">Catalog</p>
          <h1 className="text-4xl font-black">Find your next favorite</h1>
        </div>
        <div className="grid gap-3 sm:grid-cols-[1fr_180px_180px]">
          <label className="relative">
            <Search className="absolute left-3 top-2.5 text-slate-400" size={18} />
            <input className="input pl-10" placeholder="Search products" value={search} onChange={(e) => setFilter("search", e.target.value)} />
          </label>
          <select className="input" value={category} onChange={(e) => setFilter("category", e.target.value)}>
            <option value="all">All categories</option>
            {categories.map((item) => <option key={item} value={item}>{item}</option>)}
          </select>
          <select className="input" value={sort} onChange={(e) => setFilter("sort", e.target.value)}>
            <option value="newest">Newest</option>
            <option value="price_asc">Price: low to high</option>
            <option value="price_desc">Price: high to low</option>
            <option value="rating">Top rated</option>
          </select>
        </div>
      </div>
      {error && <p className="panel p-4 text-red-600">{error}</p>}
      {loading ? <LoadingSkeleton /> : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {products.map((product) => <ProductCard key={product._id} product={product} />)}
        </div>
      )}
      {!loading && products.length === 0 && <p className="panel p-8 text-center">No products found.</p>}
    </section>
  );
}
