import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../../lib/api";
import Badge from "../../components/Badge";

const licenseStatusTone = {
  ACTIVE: "green",
  EXPIRED: "red",
  REVOKED: "red",
  SUSPENDED: "amber",
};
const complaintStatusTone = {
  OPEN: "blue",
  IN_PROGRESS: "amber",
  RESOLVED: "green",
  CLOSED: "slate",
};

export default function AdminVendorDetail() {
  const { id } = useParams();
  const [detail, setDetail] = useState(null);
  const [selectedLicense, setSelectedLicense] = useState(null);
  const [revokeReason, setRevokeReason] = useState("");
  const [error, setError] = useState("");

  const load = () =>
    api
      .get(`/api/admin/vendors/${id}`)
      .then((res) => setDetail(res.data))
      .catch(() => {});

  useEffect(() => {
    load();
  }, [id]);

  const complaintsForLicense = (licenseId) =>
    (detail?.complaints || []).filter((c) => c.licenseId === licenseId);

  const revoke = async () => {
    setError("");
    try {
      await api.post(`/api/admin/licenses/${selectedLicense.id}/revoke`, {
        reason: revokeReason,
      });
      setSelectedLicense(null);
      setRevokeReason("");
      load();
    } catch (err) {
      setError(err.friendlyMessage || "Failed to revoke license");
    }
  };

  if (!detail) return <p className="text-sm text-slate-500">Loading…</p>;

  const { profile, licenses, complaints } = detail;

  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-slate-200 bg-white p-6">
        <h2 className="text-lg font-semibold text-slate-900">
          {profile.fullName || profile.email}
        </h2>
        <dl className="mt-3 grid grid-cols-2 gap-2 text-sm sm:grid-cols-3">
          <div>
            <dt className="text-slate-500">Email</dt>
            <dd>{profile.email}</dd>
          </div>
          <div>
            <dt className="text-slate-500">Phone</dt>
            <dd>{profile.phone || "—"}</dd>
          </div>
          <div>
            <dt className="text-slate-500">Address</dt>
            <dd>{profile.address || "—"}</dd>
          </div>
          <div>
            <dt className="text-slate-500">Business</dt>
            <dd>{profile.businessName || "—"}</dd>
          </div>
          <div>
            <dt className="text-slate-500">Business Type</dt>
            <dd>{profile.businessType || "—"}</dd>
          </div>
          <div>
            <dt className="text-slate-500">National ID</dt>
            <dd>{profile.nationalIdNumber || "—"}</dd>
          </div>
        </dl>
      </div>

      <div>
        <h3 className="font-semibold text-slate-900">
          Licenses ({licenses.length})
        </h3>
        <div className="mt-3 grid grid-cols-1 gap-4 sm:grid-cols-2">
          {licenses.map((l) => (
            <button
              key={l.id}
              onClick={() => setSelectedLicense(l)}
              className="rounded-xl border border-slate-200 bg-white p-4 text-left shadow-sm hover:border-brand-400"
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-semibold text-slate-900">
                    {l.licenseNumber}
                  </p>
                  <p className="text-xs text-slate-500">
                    {l.zoneName} · {l.licenseType}
                  </p>
                </div>
                <Badge tone={licenseStatusTone[l.status] || "slate"}>
                  {l.status}
                </Badge>
              </div>
              <p className="mt-2 text-xs text-slate-500">
                Valid: {l.issueDate} → {l.validityEnd} · Complaints:{" "}
                {complaintsForLicense(l.id).length}
              </p>
            </button>
          ))}
          {licenses.length === 0 && (
            <p className="text-sm text-slate-500">No licenses issued yet.</p>
          )}
        </div>
      </div>

      <div>
        <h3 className="font-semibold text-slate-900">
          Complaints ({complaints.length})
        </h3>
        <div className="mt-3 space-y-2">
          {complaints.map((c) => (
            <div
              key={c.id}
              className="flex items-center justify-between rounded-lg border border-slate-200 bg-white p-3 text-sm"
            >
              <div>
                <p className="font-medium text-slate-800">{c.subject}</p>
                <p className="text-xs text-slate-500">
                  {c.trackingNumber} · License: {c.licenseNumber || "—"}
                </p>
              </div>
              <Badge tone={complaintStatusTone[c.status] || "slate"}>
                {c.status.replace("_", " ")}
              </Badge>
            </div>
          ))}
          {complaints.length === 0 && (
            <p className="text-sm text-slate-500">No complaints filed.</p>
          )}
        </div>
      </div>

      {selectedLicense && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 sm:items-center sm:p-4"
          onClick={() => setSelectedLicense(null)}
        >
          <div
            className="w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-t-2xl bg-white p-6 sm:rounded-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between">
              <h3 className="font-semibold text-slate-900">
                {selectedLicense.licenseNumber}
              </h3>
              {selectedLicense.qrCodeData && (
                <img
                  src={selectedLicense.qrCodeData}
                  alt="QR"
                  className="h-20 w-20"
                />
              )}
            </div>
            {error && (
              <p className="mt-2 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
                {error}
              </p>
            )}
            <dl className="mt-3 grid grid-cols-2 gap-2 text-sm">
              <div>
                <dt className="text-slate-500">Zone</dt>
                <dd>{selectedLicense.zoneName}</dd>
              </div>
              <div>
                <dt className="text-slate-500">Type</dt>
                <dd>{selectedLicense.licenseType}</dd>
              </div>
              <div>
                <dt className="text-slate-500">Status</dt>
                <dd>{selectedLicense.status}</dd>
              </div>
              <div>
                <dt className="text-slate-500">Category</dt>
                <dd>{selectedLicense.category || "—"}</dd>
              </div>
              <div>
                <dt className="text-slate-500">Issue Date</dt>
                <dd>{selectedLicense.issueDate}</dd>
              </div>
              <div>
                <dt className="text-slate-500">Valid Until</dt>
                <dd>{selectedLicense.validityEnd}</dd>
              </div>
              <div>
                <dt className="text-slate-500">Authorized Goods</dt>
                <dd>{selectedLicense.authorizedGoods || "—"}</dd>
              </div>
            </dl>

            {selectedLicense.status === "ACTIVE" && (
              <div className="mt-4 border-t border-slate-200 pt-4">
                <label className="text-sm font-medium text-slate-700">
                  Revoke License
                </label>
                <input
                  placeholder="Reason for revocation"
                  value={revokeReason}
                  onChange={(e) => setRevokeReason(e.target.value)}
                  className="input mt-1"
                />
                <button
                  onClick={revoke}
                  disabled={!revokeReason}
                  className="mt-2 rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-50"
                >
                  Revoke License
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
