import { Menu, Moon, ShoppingBag, ShoppingCart, Sun, UserRound, X } from "lucide-react";
import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { useCart } from "../context/CartContext.jsx";
import { useTheme } from "../context/ThemeContext.jsx";

const linkClass = ({ isActive }) =>
  `text-sm font-semibold transition ${isActive ? "text-brand" : "text-slate-700 hover:text-brand dark:text-slate-200"}`;

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const { user, isAdmin, logout } = useAuth();
  const { totalItems } = useCart();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const nav = (
    <>
      <NavLink className={linkClass} to="/">Home</NavLink>
      <NavLink className={linkClass} to="/products">Products</NavLink>
      {user && <NavLink className={linkClass} to="/orders">Orders</NavLink>}
      {user && <NavLink className={linkClass} to="/dashboard">Dashboard</NavLink>}
      {isAdmin && <NavLink className={linkClass} to="/admin">Admin</NavLink>}
    </>
  );

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/90 backdrop-blur dark:border-slate-800 dark:bg-slate-950/90">
      <div className="container-pad flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-2 text-lg font-black tracking-normal">
          <span className="grid h-9 w-9 place-items-center rounded-md bg-brand text-white"><ShoppingBag size={20} /></span>
          CodeAlpha Store
        </Link>
        <nav className="hidden items-center gap-7 md:flex">{nav}</nav>
        <div className="flex items-center gap-2">
          <button className="btn-secondary h-10 w-10 p-0" onClick={toggleTheme} aria-label="Toggle theme">
            {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
          </button>
          <Link className="btn-secondary relative h-10 w-10 p-0" to="/cart" aria-label="Cart">
            <ShoppingCart size={18} />
            {totalItems > 0 && <span className="absolute -right-1 -top-1 rounded-full bg-coral px-1.5 text-xs text-white">{totalItems}</span>}
          </Link>
          {user ? (
            <button className="btn-secondary hidden md:inline-flex" onClick={handleLogout}>Logout</button>
          ) : (
            <Link className="btn-primary hidden md:inline-flex" to="/login"><UserRound size={16} /> Login</Link>
          )}
          <button className="btn-secondary h-10 w-10 p-0 md:hidden" onClick={() => setOpen((value) => !value)} aria-label="Menu">
            {open ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>
      {open && (
        <div className="container-pad grid gap-4 border-t border-slate-200 py-4 dark:border-slate-800 md:hidden">
          {nav}
          {user ? <button className="btn-secondary" onClick={handleLogout}>Logout</button> : <Link className="btn-primary" to="/login">Login</Link>}
        </div>
      )}
    </header>
  );
}
