import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../../lib/api";
import StatCard from "../../components/StatCard";
import StatCardModal from "../../components/StatCardModal";
import MapView from "../../components/MapView";
import Badge from "../../components/Badge";

const statusTone = {
  ACTIVE: "green",
  EXPIRED: "red",
  REVOKED: "red",
  SUSPENDED: "amber",
};

export default function VendorDashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [licenses, setLicenses] = useState([]);
  const [profile, setProfile] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState({ title: "", children: null });
  const [selectedLicenseId, setSelectedLicenseId] = useState(null);
  const [selectedLicense, setSelectedLicense] = useState(null);

  useEffect(() => {
    api
      .get("/api/vendor/dashboard/stats")
      .then((res) => setStats(res.data))
      .catch(() => {});
    api
      .get("/api/vendor/licenses")
      .then((res) => {
        setLicenses(res.data);
        // Set selected license to the latest approved license (first in the list)
        const approvedLicenses = res.data.filter(l => l.status === "ACTIVE");
        if (approvedLicenses.length > 0) {
          setSelectedLicenseId(approvedLicenses[0].id);
        } else if (res.data.length > 0) {
          setSelectedLicenseId(res.data[0].id);
        }
      })
      .catch(() => {});
    api
      .get("/api/vendor/profile")
      .then((res) => setProfile(res.data))
      .catch(() => {});
  }, []);

  // Load selected license details when selectedLicenseId changes
  useEffect(() => {
    if (selectedLicenseId) {
      api
        .get(`/api/vendor/licenses/${selectedLicenseId}`)
        .then((res) => {
          console.log("Vendor dashboard loaded license:", res.data);
          setSelectedLicense(res.data);
        })
        .catch(() => {});
    }
  }, [selectedLicenseId]);

  const handleStatCardClick = (statType) => {
    let content = "";
    let title = "";

    switch (statType) {
      case "totalLicenses":
        title = "Total Licenses";
        content = `You have ${stats?.totalLicenses || 0} licenses in total. These include all your current and past licenses across different zones. Click to view all your licenses in detail.`;
        break;
      case "activeLicenses":
        title = "Active Licenses";
        content = `You have ${stats?.activeLicenses || 0} active licenses. These are currently valid and can be used for vending. Click to view your active licenses and their details.`;
        break;
      case "expiredLicenses":
        title = "Expired Licenses";
        content = `You have ${stats?.expiredLicenses || 0} expired licenses. These licenses are no longer valid. You may need to renew them if you wish to continue vending in those zones. Click to view expired licenses.`;
        break;
      case "zonesAvailable":
        title = "Zones Available";
        content = `There are ${stats?.totalZones || 0} zones available for vending. These zones have different facilities, prices, and availability. Click to view the zones map and find available spots.`;
        break;
      default:
        return;
    }

    setModalContent({ title, children: content });
    setModalOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="rounded-xl bg-brand-600 p-6 text-white">
        <h2 className="text-xl font-bold">
          Welcome back! {profile && profile.name ? profile.name : "Banik"}
        </h2>
        <p className="mt-1 text-brand-100">
          Manage your licenses, applications, and vendor profile from here.
        </p>
      </div>

      {stats && (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <StatCard 
            label="Total Licenses" 
            value={stats.totalLicenses} 
            onClick={() => handleStatCardClick("totalLicenses")}
          />
          <StatCard
            label="Active Licenses"
            value={stats.activeLicenses}
            accent="green"
            onClick={() => handleStatCardClick("activeLicenses")}
          />
          <StatCard
            label="Expired Licenses"
            value={stats.expiredLicenses}
            accent="red"
            onClick={() => handleStatCardClick("expiredLicenses")}
          />
          <StatCard
            label="Zones Available"
            value={stats.totalZones}
            accent="amber"
            onClick={() => handleStatCardClick("zonesAvailable")}
          />
        </div>
      )}

      <div className="flex flex-wrap gap-3">
        <Link
          to="/vendor/applications/new"
          className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-700"
        >
          Apply for License
        </Link>
        <Link
          to="/vendor/licenses"
          className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
        >
          View My Licenses
        </Link>
        <Link
          to="/vendor/complaints/new"
          className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
        >
          File a Complaint
        </Link>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-5">
        <h3 className="font-semibold text-slate-900">My Licenses</h3>
        {licenses.length === 0 && (
          <p className="mt-3 text-sm text-slate-500">
            You have no licenses yet. Apply for one to get started.
          </p>
        )}
        {licenses.length > 0 && (
          <>
            {/* License Selection Dropdown */}
            <div className="mt-3 flex items-center gap-3">
              <label className="text-sm font-medium text-slate-700">
                Select License:
              </label>
              <select
                value={selectedLicenseId || ""}
                onChange={(e) => setSelectedLicenseId(Number(e.target.value))}
                className="input max-w-xs"
              >
                {licenses.map((l) => (
                  <option key={l.id} value={l.id}>
                    {l.licenseNumber} — {l.zoneName} ({l.status})
                  </option>
                ))}
              </select>
            </div>

            {/* Detailed License View */}
            {selectedLicense && (
              <div className="mt-5 space-y-6">
                {/* License Card */}
                <div className="rounded-2xl border-2 border-brand-200 bg-gradient-to-br from-brand-50 to-white p-6 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs uppercase tracking-wide text-brand-600">
                        Digital Vending License
                      </p>
                      <h2 className="text-xl font-bold text-slate-900">
                        {selectedLicense.licenseNumber}
                      </h2>
                    </div>
                    {selectedLicense.qrCodeData && (
                      <img src={selectedLicense.qrCodeData} alt="QR code" className="h-20 w-20" />
                    )}
                  </div>
                  <dl className="mt-4 grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <dt className="text-slate-500">Business Name</dt>
                      <dd className="font-medium">{selectedLicense.businessName || "—"}</dd>
                    </div>
                    <div>
                      <dt className="text-slate-500">Vendor</dt>
                      <dd className="font-medium">{selectedLicense.vendorName}</dd>
                    </div>
                    <div>
                      <dt className="text-slate-500">Zone</dt>
                      <dd className="font-medium">{selectedLicense.zoneName}</dd>
                    </div>
                    <div>
                      <dt className="text-slate-500">Type</dt>
                      <dd className="font-medium">{selectedLicense.licenseType}</dd>
                    </div>
                    <div>
                      <dt className="text-slate-500">Status</dt>
                      <dd className="font-medium">
                        <Badge tone={statusTone[selectedLicense.status] || "slate"}>
                          {selectedLicense.status}
                        </Badge>
                      </dd>
                    </div>
                    <div>
                      <dt className="text-slate-500">Issue Date</dt>
                      <dd className="font-medium">{selectedLicense.issueDate}</dd>
                    </div>
                    <div>
                      <dt className="text-slate-500">Valid Until</dt>
                      <dd className="font-medium">{selectedLicense.validityEnd}</dd>
                    </div>
                    <div>
                      <dt className="text-slate-500">Authorized Goods</dt>
                      <dd className="font-medium">{selectedLicense.authorizedGoods || "—"}</dd>
                    </div>
                    <div>
                      <dt className="text-slate-500">Stall Size</dt>
                      <dd className="font-medium">{selectedLicense.stallDimensions || "—"}</dd>
                    </div>
                    <div>
                      <dt className="text-slate-500">Operating Hours</dt>
                      <dd className="font-medium">{selectedLicense.operatingHours || "—"}</dd>
                    </div>
                    <div>
                      <dt className="text-slate-500">Facilities</dt>
                      <dd className="font-medium">{selectedLicense.facilities || "—"}</dd>
                    </div>
                  </dl>
                </div>

                {/* Assigned Location Map */}
                {selectedLicense.location && (
                  <div className="rounded-xl border border-slate-200 bg-white p-5">
                    <h3 className="font-semibold text-slate-900 mb-3">Assigned Location</h3>
                    <MapView
                      center={[parseFloat(selectedLicense.location.lat), parseFloat(selectedLicense.location.lng)]}
                      position={[parseFloat(selectedLicense.location.lat), parseFloat(selectedLicense.location.lng)]}
                    />
                  </div>
                )}

                {/* View Full Details Link */}
                <div className="flex justify-center">
                  <Link
                    to={`/vendor/licenses/${selectedLicense.id}`}
                    className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                  >
                    View Full License Details
                  </Link>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      <StatCardModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={modalContent.title}
      >
        <div className="space-y-3">
          <p>{modalContent.children}</p>
          <div className="mt-4 flex gap-2">
            {(modalContent.title === "Total Licenses" || modalContent.title === "Active Licenses" || modalContent.title === "Expired Licenses") && (
              <button
                onClick={() => {
                  setModalOpen(false);
                  navigate("/vendor/licenses");
                }}
                className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-700"
              >
                View Licenses
              </button>
            )}
            {modalContent.title === "Zones Available" && (
              <button
                onClick={() => {
                  setModalOpen(false);
                  navigate("/zones");
                }}
                className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-700"
              >
                View Zones
              </button>
            )}
            <button
              onClick={() => setModalOpen(false)}
              className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
            >
              Close
            </button>
          </div>
        </div>
      </StatCardModal>
    </div>
  );
}
