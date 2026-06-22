import { useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";

export default function UserDashboard() {
  const { user, updateProfile } = useAuth();
  const [form, setForm] = useState({ name: user?.name || "", email: user?.email || "", password: "" });
  const [message, setMessage] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    await updateProfile({ ...form, password: form.password || undefined });
    setMessage("Profile updated successfully");
  };

  return (
    <section className="container-pad grid gap-6 py-10 lg:grid-cols-[320px_1fr]">
      <aside className="panel h-fit p-6">
        <p className="text-sm font-bold uppercase text-brand">Account</p>
        <h1 className="mt-2 text-3xl font-black">{user?.name}</h1>
        <p className="mt-1 text-slate-500">{user?.email}</p>
      </aside>
      <form className="panel grid gap-4 p-6" onSubmit={submit}>
        <h2 className="text-2xl font-black">Edit profile</h2>
        {message && <p className="rounded-md bg-teal-50 p-3 text-sm text-teal-800">{message}</p>}
        <input className="input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
        <input className="input" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
        <input className="input" type="password" placeholder="New password (optional)" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
        <button className="btn-primary w-fit">Save changes</button>
      </form>
    </section>
  );
}
