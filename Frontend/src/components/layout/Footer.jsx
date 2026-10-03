import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-slate-50">
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-8 px-4 py-10 sm:px-6 md:grid-cols-4 lg:px-8">
        <div>
          <h3 className="text-lg font-bold text-brand-700">Banik</h3>
          <p className="mt-2 text-sm text-slate-600">
            Streamlining Street Vending For A Better Tomorrow.
          </p>
        </div>
        <div>
          <h4 className="text-sm font-semibold text-slate-800">Platform</h4>
          <ul className="mt-2 space-y-1 text-sm text-slate-600">
            <li>
              <Link to="/features" className="hover:text-brand-600">
                Features
              </Link>
            </li>
            <li>
              <Link to="/zones" className="hover:text-brand-600">
                Vending Zones
              </Link>
            </li>
            <li>
              <Link to="/faq" className="hover:text-brand-600">
                FAQ &amp; Help
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <h4 className="text-sm font-semibold text-slate-800">Account</h4>
          <ul className="mt-2 space-y-1 text-sm text-slate-600">
            <li>
              <Link to="/register" className="hover:text-brand-600">
                Register as Vendor
              </Link>
            </li>
            <li>
              <Link to="/login" className="hover:text-brand-600">
                Vendor Login
              </Link>
            </li>
            <li>
              <Link to="/admin/login" className="hover:text-brand-600">
                Admin Login
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <h4 className="text-sm font-semibold text-slate-800">Contact</h4>
          <ul className="mt-2 space-y-1 text-sm text-slate-600">
            <li>support@banik.gov.bd</li>
            <li>+880 1700-000000</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-slate-200 py-4 text-center text-xs text-slate-500">
        © {new Date().getFullYear()} Banik Street Vendor Management System.
      </div>
    </footer>
  );
}
