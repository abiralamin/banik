import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useEffect, useState } from "react";
import api from "../../lib/api";

export default function DashboardLayout({ title, links }) {
  const { auth, logout } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [filteredLinks, setFilteredLinks] = useState(links);
  const [unreadCount, setUnreadCount] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (auth && auth.role === "VENDOR") {
      api.get("/api/vendor/profile")
        .then((res) => {
          setProfile(res.data);
          // Filter links based on gender
          const genderBasedLinks = links.filter(link => {
            if (link.womenOnly) {
              return res.data.gender === "FEMALE";
            }
            if (link.excludeForWomen) {
              return res.data.gender !== "FEMALE";
            }
            return true;
          });
          setFilteredLinks(genderBasedLinks);
        })
        .catch(() => {
          setFilteredLinks(links);
        });

      // Load unread notification count
      const loadUnreadCount = () => {
        api.get("/api/announcements/unread-count")
          .then((res) => setUnreadCount(res.data.count))
          .catch(() => {});
      };

      loadUnreadCount();

      // Listen for custom event to refresh unread count
      const handleUnreadCountUpdate = () => {
        loadUnreadCount();
      };

      window.addEventListener('refreshUnreadCount', handleUnreadCountUpdate);

      return () => {
        window.removeEventListener('refreshUnreadCount', handleUnreadCountUpdate);
      };
    } else {
      setFilteredLinks(links);
    }
  }, [auth, links]);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* Desktop Sidebar */}
      <aside className="sticky top-0 hidden h-screen w-64 shrink-0 overflow-y-auto border-r border-indigo-900/20 bg-gradient-to-b from-indigo-900 to-indigo-800 md:block">
        <div className="flex h-16 items-center border-b border-indigo-700/50 px-5">
          <span className="text-lg font-bold text-white">Banik</span>
          <span className="ml-2 text-xs text-indigo-200">{title}</span>
        </div>
        <nav className="flex flex-col gap-1 p-3">
          {filteredLinks.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.end}
              className={({ isActive }) =>
                `rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? "bg-white/20 text-white shadow-lg"
                    : "text-indigo-100 hover:bg-white/10 hover:text-white"
                }`
              }
            >
              <div className="flex items-center justify-between">
                <span>{l.label}</span>
                {l.to === "/vendor/notifications" && unreadCount > 0 && (
                  <span className="rounded-full bg-red-500 px-2 py-0.5 text-xs font-semibold text-white shadow-md">
                    {unreadCount}
                  </span>
                )}
              </div>
            </NavLink>
          ))}
        </nav>
      </aside>

      {/* Mobile Sidebar */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div
            className="fixed inset-0 bg-black/50"
            onClick={() => setMobileMenuOpen(false)}
          />
          <aside className="fixed left-0 top-0 h-full w-64 overflow-y-auto border-r border-indigo-900/20 bg-gradient-to-b from-indigo-900 to-indigo-800">
            <div className="flex h-16 items-center justify-between border-b border-indigo-700/50 px-5">
              <span className="text-lg font-bold text-white">Banik</span>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="text-white hover:text-indigo-200"
              >
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <nav className="flex flex-col gap-1 p-3">
              {filteredLinks.map((l) => (
                <NavLink
                  key={l.to}
                  to={l.to}
                  end={l.end}
                  onClick={() => setMobileMenuOpen(false)}
                  className={({ isActive }) =>
                    `rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200 ${
                      isActive
                        ? "bg-white/20 text-white shadow-lg"
                        : "text-indigo-100 hover:bg-white/10 hover:text-white"
                    }`
                  }
                >
                  <div className="flex items-center justify-between">
                    <span>{l.label}</span>
                    {l.to === "/vendor/notifications" && unreadCount > 0 && (
                      <span className="rounded-full bg-red-500 px-2 py-0.5 text-xs font-semibold text-white shadow-md">
                        {unreadCount}
                      </span>
                    )}
                  </div>
                </NavLink>
              ))}
            </nav>
          </aside>
        </div>
      )}

      <div className="flex-1">
        <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b border-slate-200 bg-white/95 backdrop-blur-sm px-4 sm:px-6 shadow-sm">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="md:hidden rounded-lg p-2 text-slate-600 hover:bg-slate-100"
              aria-label="Open menu"
            >
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <span className="text-lg font-bold text-indigo-900">Banik</span>
            <h1 className="text-base font-semibold text-slate-800">{title}</h1>
          </div>
          <div className="flex items-center gap-3">
            <span className="hidden text-sm text-slate-600 sm:block">{auth?.email}</span>
            <button
              onClick={handleLogout}
              className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 shadow-sm transition-all hover:bg-slate-50 hover:shadow"
            >
              Logout
            </button>
          </div>
        </header>
        <main className="p-4 sm:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
