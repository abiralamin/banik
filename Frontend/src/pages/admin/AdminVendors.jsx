import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../lib/api";

export default function AdminVendors() {
  const [vendors, setVendors] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    api
      .get("/api/admin/vendors")
      .then((res) => setVendors(res.data))
      .catch(() => {});
  }, []);

  const filtered = vendors.filter((v) => {
    const q = search.toLowerCase();
    return (
      (v.fullName || "").toLowerCase().includes(q) ||
      v.email.toLowerCase().includes(q)
    );
  });

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-lg font-semibold text-slate-900">
          Vendors ({vendors.length})
        </h2>
        <input
          placeholder="Search by name or email"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="input max-w-xs"
        />
      </div>

      {/* Desktop Table */}
      <div className="mt-6 hidden rounded-xl border border-slate-200 bg-white md:block">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 text-xs uppercase text-slate-500">
            <tr>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Licenses</th>
              <th className="px-4 py-3">Applications</th>
              <th className="px-4 py-3">Complaints</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((v) => (
              <tr key={v.id} className="border-t border-slate-100">
                <td className="px-4 py-3">{v.fullName || "—"}</td>
                <td className="px-4 py-3">{v.email}</td>
                <td className="px-4 py-3">
                  {v.activeLicenses}/{v.totalLicenses} active
                </td>
                <td className="px-4 py-3">{v.totalApplications}</td>
                <td className="px-4 py-3">{v.totalComplaints}</td>
                <td className="px-4 py-3">
                  <Link
                    to={`/admin/vendors/${v.id}`}
                    className="text-brand-600 hover:underline"
                  >
                    View Profile
                  </Link>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td
                  colSpan={6}
                  className="px-4 py-6 text-center text-slate-500"
                >
                  No vendors found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile Card Layout */}
      <div className="mt-6 space-y-4 md:hidden">
        {filtered.map((v) => (
          <div key={v.id} className="rounded-xl border border-slate-200 bg-white p-4">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-semibold text-slate-900">{v.fullName || "—"}</h3>
                <p className="text-sm text-slate-500">{v.email}</p>
              </div>
              <Link
                to={`/admin/vendors/${v.id}`}
                className="rounded-lg bg-brand-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-brand-700"
              >
                View Profile
              </Link>
            </div>
            <div className="mt-3 grid grid-cols-2 gap-2 text-sm">
              <div>
                <span className="text-slate-500">Licenses:</span>
                <span className="ml-1 font-medium">{v.activeLicenses}/{v.totalLicenses} active</span>
              </div>
              <div>
                <span className="text-slate-500">Applications:</span>
                <span className="ml-1 font-medium">{v.totalApplications}</span>
              </div>
              <div>
                <span className="text-slate-500">Complaints:</span>
                <span className="ml-1 font-medium">{v.totalComplaints}</span>
              </div>
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <p className="text-center text-slate-500">No vendors found.</p>
        )}
      </div>
    </div>
  );
}
