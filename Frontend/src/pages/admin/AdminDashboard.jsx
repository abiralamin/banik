import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../lib/api";
import StatCard from "../../components/StatCard";

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    api
      .get("/api/admin/dashboard/stats")
      .then((res) => setStats(res.data))
      .catch(() => {});
  }, []);

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-semibold text-slate-900">Admin Dashboard</h2>
      {stats && (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          <Link to="/admin/vendors">
            <StatCard label="Total Vendors" value={stats.totalVendors} />
          </Link>
          <Link to="/admin/vendors">
            <StatCard
              label="Active Licenses"
              value={stats.activeLicenses}
              accent="green"
            />
          </Link>
          <Link to="/admin/vendors">
            <StatCard
              label="Expired Licenses"
              value={stats.expiredLicenses}
              accent="red"
            />
          </Link>
          <Link to="/admin/applications">
            <StatCard
              label="Pending Applications"
              value={stats.pendingApplications}
              accent="amber"
            />
          </Link>
          <Link to="/admin/zones">
            <StatCard label="Available Zones" value={stats.availableZones} />
          </Link>
          <Link to="/admin/complaints">
            <StatCard
              label="Pending Complaints"
              value={stats.pendingComplaints}
              accent="amber"
            />
          </Link>
        </div>
      )}
      <div className="flex flex-wrap gap-3">
        <Link
          to="/admin/applications"
          className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-700"
        >
          Review Applications
        </Link>
        <Link
          to="/admin/zones"
          className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
        >
          Manage Zones
        </Link>
        <Link
          to="/admin/complaints"
          className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
        >
          Manage Complaints
        </Link>
      </div>
    </div>
  );
}
