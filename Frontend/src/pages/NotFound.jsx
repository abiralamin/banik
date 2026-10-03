import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center px-4 text-center">
      <p className="text-6xl font-bold text-brand-600">404</p>
      <h1 className="mt-4 text-xl font-semibold text-slate-900">
        Page not found
      </h1>
      <p className="mt-2 text-slate-600">
        The page you're looking for doesn't exist or has moved.
      </p>
      <Link
        to="/"
        className="mt-6 rounded-lg bg-brand-600 px-5 py-2 text-sm font-semibold text-white hover:bg-brand-700"
      >
        Back to Home
      </Link>
    </div>
  );
}
