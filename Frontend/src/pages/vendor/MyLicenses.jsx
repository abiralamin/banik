import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import api from "../../lib/api";
import Badge from "../../components/Badge";
import MapView from "../../components/MapView";

const statusTone = {
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

export default function MyLicenses() {
  const [licenses, setLicenses] = useState([]);

  useEffect(() => {
    api
      .get("/api/vendor/licenses")
      .then((res) => setLicenses(res.data))
      .catch(() => {});
  }, []);

  return (
    <div>
      <h2 className="text-lg font-semibold text-slate-900">My Licenses</h2>
      <p className="text-sm text-slate-500">
        You can hold multiple licenses across different zones.
      </p>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
        {licenses.map((l) => (
          <Link
            key={l.id}
            to={`/vendor/licenses/${l.id}`}
            className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm hover:border-brand-400"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="font-semibold text-slate-900">{l.zoneName}</p>
                <p className="text-xs text-slate-500">{l.licenseNumber}</p>
              </div>
              <Badge tone={statusTone[l.status] || "slate"}>{l.status}</Badge>
            </div>
            <p className="mt-3 text-xs text-slate-500">
              Valid until {l.validityEnd}{" "}
              {l.daysUntilExpiry <= 30 && l.daysUntilExpiry >= 0 && (
                <span className="font-semibold text-amber-600">
                  {" "}
                  (expires in {l.daysUntilExpiry} days)
                </span>
              )}
            </p>
          </Link>
        ))}
        {licenses.length === 0 && (
          <p className="text-sm text-slate-500">No licenses yet.</p>
        )}
      </div>
    </div>
  );
}

export function LicenseDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [license, setLicense] = useState(null);
  const [allLicenses, setAllLicenses] = useState([]);
  const [complaints, setComplaints] = useState([]);
  const [renewalPeriod, setRenewalPeriod] = useState("ONE_MONTH");
  const [pendingRenewal, setPendingRenewal] = useState(null);
  const [msg, setMsg] = useState("");

  const load = () =>
    api
      .get(`/api/vendor/licenses/${id}`)
      .then((res) => {
        console.log("Vendor loaded license:", res.data);
        setLicense(res.data);
      })
      .catch(() => {});

  useEffect(() => {
    load();
    setPendingRenewal(null);
  }, [id]);

  // Licenses for the switcher - fetched once, independent of which license is selected.
  useEffect(() => {
    api
      .get("/api/vendor/licenses")
      .then((res) => setAllLicenses(res.data))
      .catch(() => {});
  }, []);

  // Complaints scoped to this specific license - reloads whenever the selected license changes.
  useEffect(() => {
    api
      .get("/api/vendor/complaints", { params: { licenseId: id } })
      .then((res) => setComplaints(res.data))
      .catch(() => setComplaints([]));
  }, [id]);

  const requestRenewal = async () => {
    setMsg("");
    try {
      const res = await api.post(`/api/vendor/licenses/${id}/renewals`, {
        period: renewalPeriod,
      });
      setPendingRenewal(res.data);
    } catch (err) {
      setMsg(err.friendlyMessage || "Failed to request renewal");
    }
  };

  const payRenewal = async () => {
    try {
      await api.post(
        `/api/vendor/licenses/${id}/renewals/${pendingRenewal.id}/pay`,
      );
      setPendingRenewal(null);
      setMsg("Renewal payment confirmed. License extended.");
      load();
    } catch (err) {
      setMsg(err.friendlyMessage || "Payment failed");
    }
  };

  const reportLost = async () => {
    await api.post(`/api/vendor/licenses/${id}/report-lost`);
    load();
  };

  const toggleAutoRenew = async () => {
    await api.post(`/api/vendor/licenses/${id}/auto-renew`, null, {
      params: { enabled: !license.autoRenew },
    });
    load();
  };

  if (!license) return <p className="text-sm text-slate-500">Loading…</p>;

  return (
    <div className="mx-auto max-w-xl">
      {allLicenses.length > 1 && (
        <div className="mb-4 flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-3">
          <label className="text-sm font-medium text-slate-700">
            My Licenses
          </label>
          <select
            value={id}
            onChange={(e) => navigate(`/vendor/licenses/${e.target.value}`)}
            className="input max-w-xs"
          >
            {allLicenses.map((l) => (
              <option key={l.id} value={l.id}>
                {l.licenseNumber} — {l.zoneName} ({l.status})
              </option>
            ))}
          </select>
        </div>
      )}

      <div className="rounded-2xl border-2 border-brand-200 bg-gradient-to-br from-brand-50 to-white p-6 shadow-sm print:border-black">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-wide text-brand-600">
              Digital Vending License
            </p>
            <h2 className="text-xl font-bold text-slate-900">
              {license.licenseNumber}
            </h2>
          </div>
          {license.qrCodeData && (
            <img src={license.qrCodeData} alt="QR code" className="h-20 w-20" />
          )}
        </div>
        <dl className="mt-4 grid grid-cols-2 gap-3 text-sm">
          <div>
            <dt className="text-slate-500">Vendor</dt>
            <dd className="font-medium">{license.vendorName}</dd>
          </div>
          <div>
            <dt className="text-slate-500">Zone</dt>
            <dd className="font-medium">{license.zoneName}</dd>
          </div>
          <div>
            <dt className="text-slate-500">Type</dt>
            <dd className="font-medium">{license.licenseType}</dd>
          </div>
          <div>
            <dt className="text-slate-500">Status</dt>
            <dd className="font-medium">{license.status}</dd>
          </div>
          <div>
            <dt className="text-slate-500">Issue Date</dt>
            <dd className="font-medium">{license.issueDate}</dd>
          </div>
          <div>
            <dt className="text-slate-500">Valid Until</dt>
            <dd className="font-medium">{license.validityEnd}</dd>
          </div>
          <div>
            <dt className="text-slate-500">Authorized Goods</dt>
            <dd className="font-medium">{license.authorizedGoods || "—"}</dd>
          </div>
        </dl>
        <div className="mt-5 flex flex-wrap gap-2 print:hidden">
          <button
            onClick={() => window.print()}
            className="rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-semibold"
          >
            Print
          </button>
          <a
            href={license.qrCodeData}
            download={`${license.licenseNumber}.png`}
            className="rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-semibold"
          >
            Download QR
          </a>
          <button
            onClick={reportLost}
            className="rounded-lg border border-red-300 px-3 py-1.5 text-xs font-semibold text-red-600"
          >
            Report Lost/Damaged
          </button>
        </div>
      </div>

      {/* Assigned Location Map */}
      {license.location && (
        <div className="mt-6 rounded-xl border border-slate-200 bg-white p-5">
          <h3 className="font-semibold text-slate-900 mb-3">Assigned Location</h3>
          {console.log("Vendor view location:", license.location)}
          <MapView
            center={[parseFloat(license.location.lat), parseFloat(license.location.lng)]}
            position={[parseFloat(license.location.lat), parseFloat(license.location.lng)]}
          />
        </div>
      )}

      <div className="mt-6 rounded-xl border border-slate-200 bg-white p-5">
        <h3 className="font-semibold text-slate-900">Renewal</h3>
        {msg && <p className="mt-2 text-sm text-emerald-700">{msg}</p>}
        <div className="mt-3 flex items-center gap-3">
          <select
            value={renewalPeriod}
            onChange={(e) => setRenewalPeriod(e.target.value)}
            className="input max-w-xs"
          >
            <option value="ONE_MONTH">1 Month</option>
            <option value="THREE_MONTHS">3 Months</option>
            <option value="SIX_MONTHS">6 Months</option>
            <option value="ONE_YEAR">1 Year</option>
          </select>
          <button
            onClick={requestRenewal}
            className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-700"
          >
            Calculate Renewal Fee
          </button>
        </div>
        {pendingRenewal && (
          <div className="mt-4 rounded-lg bg-slate-50 p-4 text-sm">
            <p>
              Fee: ৳{pendingRenewal.fee} — Discount: ৳{pendingRenewal.discount}
            </p>
            <p>New validity end: {pendingRenewal.newValidityEnd}</p>
            <button
              onClick={payRenewal}
              className="mt-3 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700"
            >
              Pay &amp; Confirm Renewal
            </button>
          </div>
        )}
        <label className="mt-4 flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={license.autoRenew}
            onChange={toggleAutoRenew}
          />
          Enable auto-renewal
        </label>
      </div>

      <div className="mt-6 rounded-xl border border-slate-200 bg-white p-5">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-slate-900">
            Complaints for this License
          </h3>
          <Link
            to={`/vendor/complaints/new?licenseId=${id}`}
            className="text-sm font-semibold text-brand-600 hover:underline"
          >
            File a Complaint
          </Link>
        </div>
        <div className="mt-3 space-y-2">
          {complaints.map((c) => (
            <Link
              key={c.id}
              to={`/vendor/complaints/${c.id}`}
              className="block rounded-lg border border-slate-200 p-3 text-sm hover:border-brand-400"
            >
              <div className="flex items-center justify-between">
                <span className="font-medium text-slate-800">{c.subject}</span>
                <Badge tone={complaintStatusTone[c.status] || "slate"}>
                  {c.status.replace("_", " ")}
                </Badge>
              </div>
              <p className="text-xs text-slate-500">
                Tracking #: {c.trackingNumber}
              </p>
            </Link>
          ))}
          {complaints.length === 0 && (
            <p className="text-sm text-slate-500">
              No complaints filed under this license.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
