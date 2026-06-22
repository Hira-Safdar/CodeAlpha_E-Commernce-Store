import { Edit, Plus, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import api from "../api/axios.js";
import StatCard from "../components/StatCard.jsx";
import { formatCurrency } from "../utils/format.js";

const emptyProduct = { title: "", description: "", image: "", category: "", price: "", stock: "" };

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [products, setProducts] = useState([]);
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState(emptyProduct);
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState("");

  const loadAdminData = async () => {
    const [statsRes, productsRes, usersRes] = await Promise.all([
      api.get("/admin/stats"),
      api.get("/products", { params: { limit: 100 } }),
      api.get("/users")
    ]);
    setStats(statsRes.data);
    setProducts(productsRes.data.products);
    setUsers(usersRes.data);
  };

  useEffect(() => {
    loadAdminData().catch((err) => setError(err.response?.data?.message || "Unable to load admin data"));
  }, []);

  const submitProduct = async (e) => {
    e.preventDefault();
    const payload = { ...form, price: Number(form.price), stock: Number(form.stock) };
    if (editingId) await api.put(`/products/${editingId}`, payload);
    else await api.post("/products", payload);
    setForm(emptyProduct);
    setEditingId(null);
    await loadAdminData();
  };

  const editProduct = (product) => {
    setEditingId(product._id);
    setForm({
      title: product.title,
      description: product.description,
      image: product.image,
      category: product.category,
      price: product.price,
      stock: product.stock
    });
  };

  const uploadImage = (file) => {
    if (!file) return;
    if (file.size > 1500000) {
      setError("Image size should be less than 1.5 MB");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setForm((current) => ({ ...current, image: reader.result }));
      setError("");
    };
    reader.onerror = () => setError("Unable to read image file");
    reader.readAsDataURL(file);
  };

  const deleteProduct = async (id) => {
    await api.delete(`/products/${id}`);
    await loadAdminData();
  };

  return (
    <section className="container-pad grid gap-8 py-10">
      <div>
        <p className="text-sm font-bold uppercase text-brand">Admin</p>
        <h1 className="text-4xl font-black">Store dashboard</h1>
      </div>
      {error && <p className="panel p-4 text-red-600">{error}</p>}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Users" value={stats?.totalUsers ?? "..."} />
        <StatCard label="Products" value={stats?.totalProducts ?? "..."} />
        <StatCard label="Orders" value={stats?.totalOrders ?? "..."} />
        <StatCard label="Revenue" value={formatCurrency(stats?.revenue || 0)} />
      </div>
      <div className="grid gap-6 lg:grid-cols-[420px_1fr]">
        <form className="panel grid gap-3 p-5" onSubmit={submitProduct}>
          <h2 className="text-2xl font-black">{editingId ? "Edit product" : "Add product"}</h2>
          {Object.keys(emptyProduct).map((key) =>
            key === "image" ? (
              <div key={key} className="grid gap-2">
                <input
                  className="input"
                  type="file"
                  accept="image/png,image/jpeg,image/jpg,image/webp"
                  onChange={(e) => uploadImage(e.target.files?.[0])}
                  required={!form.image}
                />
                {form.image && (
                  <img src={form.image} alt="Product preview" className="h-32 w-full rounded-md object-cover" />
                )}
              </div>
            ) : (
              <input
                key={key}
                className="input"
                placeholder={key}
                type={["price", "stock"].includes(key) ? "number" : "text"}
                value={form[key]}
                onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                required
              />
            )
          )}
          <button className="btn-primary"><Plus size={17} /> {editingId ? "Save product" : "Add product"}</button>
        </form>
        <div className="panel overflow-hidden">
          <div className="border-b border-slate-200 p-5 dark:border-slate-800">
            <h2 className="text-2xl font-black">Product management</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-100 dark:bg-slate-800">
                <tr><th className="p-3">Product</th><th className="p-3">Price</th><th className="p-3">Stock</th><th className="p-3">Actions</th></tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product._id} className="border-t border-slate-200 dark:border-slate-800">
                    <td className="p-3 font-semibold">{product.title}</td>
                    <td className="p-3">{formatCurrency(product.price)}</td>
                    <td className="p-3">{product.stock}</td>
                    <td className="flex gap-2 p-3">
                      <button className="btn-secondary h-9 w-9 p-0" onClick={() => editProduct(product)}><Edit size={15} /></button>
                      <button className="btn-secondary h-9 w-9 p-0" onClick={() => deleteProduct(product._id)}><Trash2 size={15} /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <div className="panel overflow-hidden">
        <div className="border-b border-slate-200 p-5 dark:border-slate-800">
          <h2 className="text-2xl font-black">User management</h2>
        </div>
        <div className="grid divide-y divide-slate-200 dark:divide-slate-800">
          {users.map((user) => (
            <div key={user._id} className="flex flex-col gap-1 p-4 sm:flex-row sm:items-center sm:justify-between">
              <span className="font-semibold">{user.name} <span className="text-slate-500">({user.email})</span></span>
              <span className="text-sm font-bold capitalize text-brand">{user.role}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
