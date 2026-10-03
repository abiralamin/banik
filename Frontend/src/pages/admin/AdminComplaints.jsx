import { useEffect, useState } from "react";
import api from "../../lib/api";
import Badge from "../../components/Badge";

const statusTone = {
  OPEN: "blue",
  IN_PROGRESS: "amber",
  RESOLVED: "green",
  CLOSED: "slate",
};

export default function AdminComplaints() {
  const [complaints, setComplaints] = useState([]);
  const [status, setStatus] = useState("");
  const [selected, setSelected] = useState(null);
  const [comment, setComment] = useState("");

  const load = () => {
    api
      .get("/api/admin/complaints", {
        params: { status: status || undefined, size: 50 },
      })
      .then((res) => setComplaints(res.data.content))
      .catch(() => setComplaints([]));
  };
  useEffect(() => {
    load();
  }, [status]);

  const act = async (action) => {
    await api.post(`/api/admin/complaints/${selected.id}/action`, {
      action,
      comment,
    });
    setSelected(null);
    setComment("");
    load();
  };

  return (
    <div>
      <div className="flex items-center gap-3">
        <h2 className="text-lg font-semibold text-slate-900">
          Complaint Management
        </h2>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="input max-w-xs"
        >
          <option value="">All</option>
          <option value="OPEN">Open</option>
          <option value="IN_PROGRESS">In Progress</option>
          <option value="RESOLVED">Resolved</option>
          <option value="CLOSED">Closed</option>
        </select>
      </div>

      <div className="mt-6 space-y-3">
        {complaints.map((c) => (
          <div
            key={c.id}
            className="flex items-center justify-between rounded-xl border border-slate-200 bg-white p-4"
          >
            <div>
              <p className="font-medium text-slate-900">{c.subject}</p>
              <p className="text-xs text-slate-500">
                {c.trackingNumber} · {c.category} · Priority: {c.priority}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Badge tone={statusTone[c.status] || "slate"}>
                {c.status.replace("_", " ")}
              </Badge>
              <button
                onClick={() => setSelected(c)}
                className="text-sm font-medium text-brand-600 hover:underline"
              >
                Manage
              </button>
            </div>
          </div>
        ))}
        {complaints.length === 0 && (
          <p className="text-sm text-slate-500">No complaints found.</p>
        )}
      </div>

      {selected && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 sm:items-center sm:p-4"
          onClick={() => setSelected(null)}
        >
          <div
            className="w-full max-w-lg rounded-t-2xl bg-white p-6 sm:rounded-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="font-semibold text-slate-900">{selected.subject}</h3>
            <p className="mt-1 text-sm text-slate-600">
              {selected.description}
            </p>
            <textarea
              placeholder="Response / comment"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="input mt-3"
              rows={3}
            />
            <div className="mt-4 flex flex-wrap gap-2">
              <button
                onClick={() => act("IN_PROGRESS")}
                className="rounded-lg border border-amber-300 px-3 py-1.5 text-xs font-semibold text-amber-700"
              >
                In Progress
              </button>
              <button
                onClick={() => act("RESPOND")}
                className="rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-semibold"
              >
                Add Response
              </button>
              <button
                onClick={() => act("RESOLVE")}
                className="rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white"
              >
                Resolve
              </button>
              <button
                onClick={() => act("CLOSE")}
                className="rounded-lg bg-slate-700 px-3 py-1.5 text-xs font-semibold text-white"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
