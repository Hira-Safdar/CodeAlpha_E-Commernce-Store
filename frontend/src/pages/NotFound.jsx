import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <section className="container-pad grid min-h-[60vh] place-items-center py-12 text-center">
      <div>
        <p className="text-sm font-bold uppercase text-brand">404</p>
        <h1 className="mt-2 text-5xl font-black">Page not found</h1>
        <p className="mt-4 text-slate-500">The page you are looking for does not exist.</p>
        <Link className="btn-primary mt-6" to="/">Go home</Link>
      </div>
    </section>
  );
}
