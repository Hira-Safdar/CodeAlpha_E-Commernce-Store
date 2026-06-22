import { ArrowRight, ShieldCheck, Truck, WalletCards } from "lucide-react";
import { Link } from "react-router-dom";

const categories = ["Electronics", "Fashion", "Home", "Beauty"];

export default function Home() {
  return (
    <>
      <section className="bg-white dark:bg-slate-950">
        <div className="container-pad grid min-h-[78vh] items-center gap-10 py-10 lg:grid-cols-[1fr_0.9fr]">
          <div className="max-w-2xl">
            <p className="text-sm font-bold uppercase text-brand">CodeAlpha Ecommerce Store</p>
            <h1 className="mt-4 text-4xl font-black leading-tight sm:text-6xl">
              Shop polished essentials from one fast, secure storefront.
            </h1>
            <p className="mt-5 text-lg leading-8 text-slate-600 dark:text-slate-300">
              Discover curated products, manage your cart, place orders, and track purchases from a responsive MERN commerce platform.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link className="btn-primary" to="/products">Browse products <ArrowRight size={17} /></Link>
              <Link className="btn-secondary" to="/register">Create account</Link>
            </div>
          </div>
          <div className="relative">
            <img
              className="h-[440px] w-full rounded-lg object-cover shadow-soft"
              src="https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?auto=format&fit=crop&w=1200&q=80"
              alt="Modern store display"
            />
          </div>
        </div>
      </section>
      <section className="container-pad py-12">
        <div className="grid gap-4 md:grid-cols-3">
          {[["Fast delivery", Truck], ["Secure accounts", ShieldCheck], ["Simple checkout", WalletCards]].map(([label, Icon]) => (
            <div key={label} className="panel flex items-center gap-4 p-5">
              <span className="grid h-12 w-12 place-items-center rounded-md bg-teal-50 text-brand dark:bg-teal-950"><Icon /></span>
              <p className="font-bold">{label}</p>
            </div>
          ))}
        </div>
      </section>
      <section className="container-pad pb-16">
        <div className="mb-6 flex items-end justify-between">
          <div>
            <p className="text-sm font-bold uppercase text-brand">Featured categories</p>
            <h2 className="text-3xl font-black">Start with what you need</h2>
          </div>
          <Link className="hidden text-sm font-bold text-brand sm:block" to="/products">View all</Link>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {categories.map((category) => (
            <Link key={category} className="panel p-6 text-xl font-black transition hover:border-brand" to={`/products?category=${category}`}>
              {category}
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
