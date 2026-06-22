import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const submit = async (e) => {
    e.preventDefault();
    try {
      await login(form);
      navigate(location.state?.from?.pathname || "/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <section className="container-pad grid place-items-center py-12">
      <form className="panel grid w-full max-w-md gap-4 p-6" onSubmit={submit}>
        <h1 className="text-3xl font-black">Welcome back</h1>
        {error && <p className="rounded-md bg-red-50 p-3 text-sm text-red-700">{error}</p>}
        <input className="input" type="email" placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
        <input className="input" type="password" placeholder="Password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
        <button className="btn-primary">Login</button>
        <p className="text-sm text-slate-500">No account? <Link className="font-bold text-brand" to="/register">Register</Link></p>
      </form>
    </section>
  );
}
