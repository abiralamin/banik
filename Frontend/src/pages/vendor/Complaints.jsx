import { useEffect, useState } from "react";
import {
  useNavigate,
  Link,
  useParams,
  useSearchParams,
} from "react-router-dom";
import api from "../../lib/api";
import Badge from "../../components/Badge";

const statusTone = {
  OPEN: "blue",
  IN_PROGRESS: "amber",
  RESOLVED: "green",
  CLOSED: "slate",
};

export function ComplaintList() {
  const [complaints, setComplaints] = useState([]);

  useEffect(() => {
    api
      .get("/api/vendor/complaints")
      .then((res) => setComplaints(res.data))
      .catch(() => {});
  }, []);

  return (
    <div>
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-slate-900">My Complaints</h2>
        <Link
          to="/vendor/complaints/new"
          className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-700"
        >
          File a Complaint
        </Link>
      </div>
      <div className="mt-6 space-y-3">
        {complaints.map((c) => (
          <Link
            key={c.id}
            to={`/vendor/complaints/${c.id}`}
            className="block rounded-xl border border-slate-200 bg-white p-4 shadow-sm hover:border-brand-400"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-slate-900">{c.subject}</p>
                <p className="text-xs text-slate-500">
                  Tracking #: {c.trackingNumber} · {c.category}
                  {c.licenseNumber && <> · License: {c.licenseNumber}</>}
                </p>
              </div>
              <Badge tone={statusTone[c.status] || "slate"}>
                {c.status.replace("_", " ")}
              </Badge>
            </div>
          </Link>
        ))}
        {complaints.length === 0 && (
          <p className="text-sm text-slate-500">No complaints filed yet.</p>
        )}
      </div>
    </div>
  );
}

export function NewComplaint() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [licenses, setLicenses] = useState([]);
  const [form, setForm] = useState({
    licenseId: searchParams.get("licenseId") || "",
    subject: "",
    category: "ZONE_ISSUE",
    description: "",
    priority: "MEDIUM",
    anonymous: false,
  });
  const [error, setError] = useState("");
  const [tracking, setTracking] = useState(null);

  useEffect(() => {
    api
      .get("/api/vendor/licenses")
      .then((res) => {
        setLicenses(res.data);
        setForm((f) => ({
          ...f,
          licenseId: f.licenseId || (res.data[0] ? String(res.data[0].id) : ""),
        }));
      })
      .catch(() => {});
  }, []);

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    if (!form.licenseId) {
      setError("Please select the license this complaint relates to");
      return;
    }
    try {
      const res = await api.post("/api/vendor/complaints", {
        ...form,
        licenseId: Number(form.licenseId),
      });
      setTracking(res.data.trackingNumber);
    } catch (err) {
      setError(err.friendlyMessage || "Failed to submit complaint");
    }
  };

  if (tracking) {
    return (
      <div className="mx-auto max-w-md rounded-xl border border-emerald-200 bg-emerald-50 p-6 text-center">
        <h2 className="font-semibold text-emerald-800">Complaint Submitted</h2>
        <p className="mt-2 text-sm text-emerald-700">
          Your tracking number is <strong>{tracking}</strong>.
        </p>
        <button
          onClick={() => navigate("/vendor/complaints")}
          className="mt-4 rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white"
        >
          View My Complaints
        </button>
      </div>
    );
  }

  return (
    <form
      onSubmit={submit}
      className="mx-auto max-w-lg space-y-4 rounded-xl border border-slate-200 bg-white p-6"
    >
      <h2 className="font-semibold text-slate-900">File a Complaint</h2>
      {error && (
        <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}
        </p>
      )}
      <select
        required
        value={form.licenseId}
        onChange={(e) => setForm((f) => ({ ...f, licenseId: e.target.value }))}
        className="input"
      >
        <option value="">Select the license this complaint relates to</option>
        {licenses.map((l) => (
          <option key={l.id} value={l.id}>
            {l.licenseNumber} — {l.zoneName}
          </option>
        ))}
      </select>
      <input
        required
        placeholder="Subject / Title"
        value={form.subject}
        onChange={(e) => setForm((f) => ({ ...f, subject: e.target.value }))}
        className="input"
      />
      <select
        value={form.category}
        onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
        className="input"
      >
        <option value="ZONE_ISSUE">Zone Issue</option>
        <option value="LICENSE_PROBLEM">License Problem</option>
        <option value="PAYMENT_ISSUE">Payment Issue</option>
        <option value="HARASSMENT">Harassment</option>
        <option value="ILLEGAL_EVICTION">Illegal Eviction</option>
        <option value="OTHERS">Others</option>
      </select>
      <textarea
        required
        rows={4}
        placeholder="Detailed description"
        value={form.description}
        onChange={(e) =>
          setForm((f) => ({ ...f, description: e.target.value }))
        }
        className="input"
      />
      <select
        value={form.priority}
        onChange={(e) => setForm((f) => ({ ...f, priority: e.target.value }))}
        className="input"
      >
        <option value="LOW">Low</option>
        <option value="MEDIUM">Medium</option>
        <option value="HIGH">High</option>
      </select>
      <label className="flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          checked={form.anonymous}
          onChange={(e) =>
            setForm((f) => ({ ...f, anonymous: e.target.checked }))
          }
        />
        Submit anonymously
      </label>
      <button
        type="submit"
        className="w-full rounded-lg bg-brand-600 py-2.5 text-sm font-semibold text-white hover:bg-brand-700"
      >
        Submit Complaint
      </button>
    </form>
  );
}

export function ComplaintDetail() {
  const { id } = useParams();
  const [complaint, setComplaint] = useState(null);
  const [comment, setComment] = useState("");

  const load = () =>
    api
      .get(`/api/vendor/complaints/${id}`)
      .then((res) => setComplaint(res.data))
      .catch(() => {});
  useEffect(() => {
    load();
  }, [id]);

  const followUp = async () => {
    await api.post(`/api/vendor/complaints/${id}/follow-up`, null, {
      params: { comment },
    });
    setComment("");
  };
  const close = async () => {
    await api.post(`/api/vendor/complaints/${id}/close`);
    load();
  };
  const escalate = async () => {
    await api.post(`/api/vendor/complaints/${id}/escalate`);
    load();
  };

  if (!complaint) return <p className="text-sm text-slate-500">Loading…</p>;

  return (
    <div className="mx-auto max-w-xl rounded-xl border border-slate-200 bg-white p-6">
      <div className="flex items-center justify-between">
        <h2 className="font-semibold text-slate-900">{complaint.subject}</h2>
        <Badge tone={statusTone[complaint.status] || "slate"}>
          {complaint.status.replace("_", " ")}
        </Badge>
      </div>
      <p className="mt-1 text-xs text-slate-500">
        Tracking #: {complaint.trackingNumber}
        {complaint.licenseNumber && (
          <>
            {" "}
            · License:{" "}
            <Link
              to={`/vendor/licenses/${complaint.licenseId}`}
              className="font-medium text-brand-600 hover:underline"
            >
              {complaint.licenseNumber} ({complaint.zoneName})
            </Link>
          </>
        )}
      </p>
      <p className="mt-3 text-sm text-slate-700">{complaint.description}</p>

      <div className="mt-5 flex gap-2">
        {complaint.status !== "CLOSED" && (
          <>
            <button
              onClick={close}
              className="rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-semibold"
            >
              Close
            </button>
            <button
              onClick={escalate}
              className="rounded-lg border border-amber-300 px-3 py-1.5 text-xs font-semibold text-amber-700"
            >
              Escalate
            </button>
          </>
        )}
      </div>

      <div className="mt-5">
        <label className="text-sm font-medium text-slate-700">
          Add follow-up
        </label>
        <div className="mt-1 flex gap-2">
          <input
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="input"
          />
          <button
            onClick={followUp}
            className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}
