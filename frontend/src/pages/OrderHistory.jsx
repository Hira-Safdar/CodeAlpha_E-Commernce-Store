import { useEffect, useState } from "react";
import api from "../api/axios.js";
import { formatCurrency, formatDate } from "../utils/format.js";

export default function OrderHistory() {
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    api.get("/orders")
      .then(({ data }) => setOrders(data))
      .catch((err) => setError(err.response?.data?.message || "Unable to load orders"));
  }, []);

  return (
    <section className="container-pad py-10">
      <h1 className="mb-7 text-4xl font-black">Order history</h1>
      {error && <p className="panel p-4 text-red-600">{error}</p>}
      <div className="grid gap-4">
        {orders.map((order) => (
          <article key={order._id} className="panel p-5">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="font-black">Order #{order._id.slice(-8).toUpperCase()}</p>
                <p className="text-sm text-slate-500">{formatDate(order.createdAt)}</p>
              </div>
              <div className="text-sm font-bold capitalize">{order.orderStatus} / {order.paymentStatus}</div>
            </div>
            <div className="mt-4 grid gap-2">
              {order.products.map((item) => <p key={item.product} className="text-sm">{item.title} x {item.quantity}</p>)}
            </div>
            <p className="mt-4 text-lg font-black">{formatCurrency(order.totalAmount)}</p>
          </article>
        ))}
      </div>
      {orders.length === 0 && !error && <p className="panel p-8 text-center">No orders yet.</p>}
    </section>
  );
}
