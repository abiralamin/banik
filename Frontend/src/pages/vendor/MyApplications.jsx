import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../lib/api";
import Badge from "../../components/Badge";

const statusTone = {
  SUBMITTED: "blue",
  UNDER_REVIEW: "amber",
  MORE_INFO_REQUESTED: "amber",
  APPROVED: "green",
  REJECTED: "red",
  WITHDRAWN: "slate",
};

const stepper = ["SUBMITTED", "UNDER_REVIEW", "APPROVED"];

export default function MyApplications() {
  const [apps, setApps] = useState([]);

  const load = () =>
    api
      .get("/api/vendor/applications")
      .then((res) => setApps(res.data))
      .catch(() => {});
  useEffect(() => {
    load();
  }, []);

  const withdraw = async (id) => {
    await api.post(`/api/vendor/applications/${id}/withdraw`);
    load();
  };

  return (
    <div>
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-slate-900">
          My Applications
        </h2>
        <Link
          to="/vendor/applications/new"
          className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-700"
        >
          New Application
        </Link>
      </div>

      <div className="mt-6 space-y-4">
        {apps.map((a) => (
          <div
            key={a.id}
            className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="font-semibold text-slate-900">{a.businessName}</p>
                <p className="text-xs text-slate-500">
                  Zone: {a.primaryZoneName} · Type: {a.licenseType}
                </p>
              </div>
              <Badge tone={statusTone[a.status] || "slate"}>
                {a.status.replace("_", " ")}
              </Badge>
            </div>

            {a.status !== "REJECTED" && a.status !== "WITHDRAWN" && (
              <div className="mt-3 flex items-center gap-2 text-xs overflow-x-auto">
                {stepper.map((s, i) => (
                  <span
                    key={s}
                    className={`flex items-center gap-2 flex-shrink-0 ${i > 0 ? "ml-2" : ""}`}
                  >
                    {i > 0 && <span className="h-px w-6 bg-slate-300 flex-shrink-0" />}
                    <span
                      className={`rounded-full px-2 py-0.5 whitespace-nowrap ${stepper.indexOf(a.status) >= i || a.status === "APPROVED" ? "bg-brand-600 text-white" : "bg-slate-100 text-slate-500"}`}
                    >
                      {s.replace("_", " ")}
                    </span>
                  </span>
                ))}
              </div>
            )}

            {a.rejectionReason && (
              <p className="mt-2 text-xs text-red-600">
                Reason: {a.rejectionReason}
              </p>
            )}
            {a.adminNotes && (
              <p className="mt-1 text-xs text-slate-500">
                Admin notes: {a.adminNotes}
              </p>
            )}

            {(a.status === "SUBMITTED" || a.status === "UNDER_REVIEW") && (
              <button
                onClick={() => withdraw(a.id)}
                className="mt-3 rounded-lg border border-red-300 px-3 py-1.5 text-xs font-semibold text-red-600"
              >
                Withdraw Application
              </button>
            )}
          </div>
        ))}
        {apps.length === 0 && (
          <p className="text-sm text-slate-500">No applications yet.</p>
        )}
      </div>
    </div>
  );
}
