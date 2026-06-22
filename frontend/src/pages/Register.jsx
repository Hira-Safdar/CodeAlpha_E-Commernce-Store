import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export default function Register() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const { register } = useAuth();
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    try {
      await register(form);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <section className="container-pad grid place-items-center py-12">
      <form className="panel grid w-full max-w-md gap-4 p-6" onSubmit={submit}>
        <h1 className="text-3xl font-black">Create account</h1>
        {error && <p className="rounded-md bg-red-50 p-3 text-sm text-red-700">{error}</p>}
        <input className="input" placeholder="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
        <input className="input" type="email" placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
        <input className="input" type="password" placeholder="Password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
        <button className="btn-primary">Register</button>
        <p className="text-sm text-slate-500">Already registered? <Link className="font-bold text-brand" to="/login">Login</Link></p>
      </form>
    </section>
  );
}
