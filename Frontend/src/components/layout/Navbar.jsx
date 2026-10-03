import { Link, NavLink } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useEffect, useState } from "react";
import api from "../../lib/api";

const publicLinks = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About" },
  { to: "/features", label: "Features" },
  { to: "/zones", label: "Vending Zones" },
  { to: "/faq", label: "FAQ" },
];

export default function Navbar() {
  const { auth, logout } = useAuth();
  const [unreadCount, setUnreadCount] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (auth && auth.role === "VENDOR") {
      api
        .get("/api/notifications/unread-count")
        .then((res) => setUnreadCount(res.data.count))
        .catch(() => {});
    }
  }, [auth]);

  return (
    <header className="sticky top-0 z-40 border-b border-indigo-900/10 bg-white/95 backdrop-blur-sm shadow-sm">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        <Link to="/" className="text-xl font-bold text-indigo-900">
          Banik
        </Link>
        
        {/* Desktop Navigation */}
        <div className="hidden gap-6 md:flex">
          {publicLinks.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              className={({ isActive }) =>
                `text-sm font-medium transition-colors ${isActive ? "text-indigo-600" : "text-slate-600 hover:text-indigo-600"}`
              }
              end={l.to === "/"}
            >
              {l.label}
            </NavLink>
          ))}
        </div>

        {/* Desktop Auth Buttons */}
        <div className="hidden items-center gap-3 md:flex">
          {!auth && (
            <>
              <Link
                to="/admin/login"
                className="text-sm font-medium text-slate-700 hover:text-indigo-600 transition-colors"
              >
                Admin Login
              </Link>
              <Link
                to="/login"
                className="text-sm font-medium text-slate-700 hover:text-indigo-600 transition-colors"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-md transition-all hover:bg-indigo-700 hover:shadow-lg"
              >
                Register as Vendor
              </Link>
            </>
          )}
          {auth && auth.role === "VENDOR" && (
            <>
              <Link
                to="/vendor/dashboard"
                className="text-sm font-medium text-slate-700 hover:text-indigo-600 transition-colors"
              >
                Dashboard
              </Link>
              <Link
                to="/vendor/notifications"
                className="relative text-sm font-medium text-slate-700 hover:text-indigo-600 transition-colors"
              >
                Notifications
                {unreadCount > 0 && (
                  <span className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-semibold text-white shadow-md">
                    {unreadCount}
                  </span>
                )}
              </Link>
              <button
                onClick={logout}
                className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 shadow-sm transition-all hover:bg-slate-50 hover:shadow"
              >
                Logout
              </button>
            </>
          )}
          {auth && auth.role === "ADMIN" && (
            <>
              <Link
                to="/admin/dashboard"
                className="text-sm font-medium text-slate-700 hover:text-indigo-600 transition-colors"
              >
                Admin Panel
              </Link>
              <button
                onClick={logout}
                className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 shadow-sm transition-all hover:bg-slate-50 hover:shadow"
              >
                Logout
              </button>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden rounded-lg p-2 text-slate-600 hover:bg-slate-100"
          aria-label="Toggle menu"
        >
          <svg
            className="h-6 w-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            {mobileMenuOpen ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            )}
          </svg>
        </button>
      </nav>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 py-4 space-y-3">
          {publicLinks.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              onClick={() => setMobileMenuOpen(false)}
              className={({ isActive }) =>
                `block py-2 text-sm font-medium transition-colors ${isActive ? "text-indigo-600" : "text-slate-600 hover:text-indigo-600"}`
              }
              end={l.to === "/"}
            >
              {l.label}
            </NavLink>
          ))}
          <div className="border-t border-slate-200 pt-3 space-y-3">
            {!auth && (
              <>
                <Link
                  to="/admin/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block py-2 text-sm font-medium text-slate-700 hover:text-indigo-600"
                >
                  Admin Login
                </Link>
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block py-2 text-sm font-medium text-slate-700 hover:text-indigo-600"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block rounded-lg bg-indigo-600 px-4 py-2 text-center text-sm font-semibold text-white shadow-md"
                >
                  Register as Vendor
                </Link>
              </>
            )}
            {auth && auth.role === "VENDOR" && (
              <>
                <Link
                  to="/vendor/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block py-2 text-sm font-medium text-slate-700 hover:text-indigo-600"
                >
                  Dashboard
                </Link>
                <Link
                  to="/vendor/notifications"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block py-2 text-sm font-medium text-slate-700 hover:text-indigo-600"
                >
                  Notifications
                  {unreadCount > 0 && (
                    <span className="ml-2 inline-flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-semibold text-white">
                      {unreadCount}
                    </span>
                  )}
                </Link>
                <button
                  onClick={() => {
                    logout();
                    setMobileMenuOpen(false);
                  }}
                  className="block w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700 shadow-sm"
                >
                  Logout
                </button>
              </>
            )}
            {auth && auth.role === "ADMIN" && (
              <>
                <Link
                  to="/admin/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block py-2 text-sm font-medium text-slate-700 hover:text-indigo-600"
                >
                  Admin Panel
                </Link>
                <button
                  onClick={() => {
                    logout();
                    setMobileMenuOpen(false);
                  }}
                  className="block w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700 shadow-sm"
                >
                  Logout
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
