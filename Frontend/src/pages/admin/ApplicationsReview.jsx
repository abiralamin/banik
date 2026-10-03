import { useEffect, useState } from "react";
import api from "../../lib/api";
import Badge from "../../components/Badge";
import MapSelector from "../../components/MapSelector";

const baseURL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";

// Ensure baseURL always has the correct format
const formatBaseURL = (url) => {
  if (!url.startsWith('http://') && !url.startsWith('https://')) {
    return 'http://' + url;
  }
  return url;
};

const formattedBaseURL = formatBaseURL(baseURL);

const PDFViewer = ({ url, onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 sm:items-center sm:p-4" onClick={onClose}>
      <div className="w-full max-w-5xl max-h-[90vh] bg-white rounded-t-2xl overflow-hidden sm:rounded-xl" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between p-4 border-b border-slate-200">
          <h3 className="font-semibold text-slate-900">Document Viewer</h3>
          <button
            onClick={onClose}
            className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="h-[calc(90vh-80px)]">
          <iframe
            src={url}
            className="w-full h-full"
            title="PDF Viewer"
          />
        </div>
      </div>
    </div>
  );
};

const statusTone = {
  SUBMITTED: "blue",
  UNDER_REVIEW: "amber",
  MORE_INFO_REQUESTED: "amber",
  APPROVED: "green",
  REJECTED: "red",
  WITHDRAWN: "slate",
};

export default function ApplicationsReview() {
  const [apps, setApps] = useState([]);
  const [status, setStatus] = useState("");
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState(null);
  const [reason, setReason] = useState("");
  const [notes, setNotes] = useState("");
  const [documents, setDocuments] = useState([]);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [pdfViewerUrl, setPdfViewerUrl] = useState(null);
  const [locationPosition, setLocationPosition] = useState(null);

  const load = () => {
    api
      .get("/api/admin/applications", {
        params: {
          status: status || undefined,
          search: search || undefined,
          size: 50,
        },
      })
      .then((res) => setApps(res.data.content))
      .catch(() => setApps([]));
  };

  useEffect(() => {
    load();
  }, [status]);

  const decide = async (id, action) => {
    const location = locationPosition ? {
      lat: locationPosition[0],
      lng: locationPosition[1]
    } : null;

    console.log("Submitting location:", location);

    await api.post(`/api/admin/applications/${id}/decision`, {
      action,
      reason,
      notes,
      location,
    });
    setSelected(null);
    setReason("");
    setNotes("");
    setDocuments([]);
    setLocationPosition(null);
    load();
  };

  const loadApplicationDetails = async (application) => {
    setLoadingDetails(true);
    setSelected(application); // Set basic info immediately to show modal
    setLocationPosition(null); // Reset location position
    try {
      const detailsRes = await api.get(`/api/admin/applications/${application.id}`);
      const docsRes = await api.get(`/api/admin/applications/${application.id}/documents`);
      console.log("Loaded application details:", detailsRes.data);
      setSelected(detailsRes.data);
      setDocuments(docsRes.data);
      // If the application already has a location set, load it
      if (detailsRes.data.location) {
        console.log("Setting initial position from loaded location:", detailsRes.data.location);
        setLocationPosition([detailsRes.data.location.lat, detailsRes.data.location.lng]);
      }
    } catch (err) {
      console.error("Failed to load application details:", err);
      // Keep the basic application info even if detailed fetch fails
      setSelected(application);
    } finally {
      setLoadingDetails(false);
    }
  };

  return (
    <div>
      <div className="flex flex-wrap items-center gap-3">
        <h2 className="text-lg font-semibold text-slate-900">
          License Application Review
        </h2>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="input max-w-xs"
        >
          <option value="">All Statuses</option>
          <option value="SUBMITTED">Submitted</option>
          <option value="UNDER_REVIEW">Under Review</option>
          <option value="APPROVED">Approved</option>
          <option value="REJECTED">Rejected</option>
        </select>
        <input
          placeholder="Search by vendor name"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && load()}
          className="input max-w-xs"
        />
        <button
          onClick={load}
          className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white"
        >
          Search
        </button>
      </div>

      {/* Desktop Table */}
      <div className="mt-6 hidden rounded-xl border border-slate-200 bg-white md:block">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 text-xs uppercase text-slate-500">
            <tr>
              <th className="px-4 py-3">Applicant</th>
              <th className="px-4 py-3">Zone</th>
              <th className="px-4 py-3">Type</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Submitted</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {apps.map((a) => (
              <tr key={a.id} className="border-t border-slate-100">
                <td className="px-4 py-3">
                  {a.fullName}
                  <div className="text-xs text-slate-500">{a.businessName}</div>
                </td>
                <td className="px-4 py-3">{a.primaryZoneName}</td>
                <td className="px-4 py-3">{a.licenseType}</td>
                <td className="px-4 py-3">
                  <Badge tone={statusTone[a.status] || "slate"}>
                    {a.status}
                  </Badge>
                </td>
                <td className="px-4 py-3">
                  {new Date(a.submittedAt).toLocaleDateString()}
                </td>
                <td className="px-4 py-3">
                  <button
                    onClick={() => loadApplicationDetails(a)}
                    className="text-brand-600 hover:underline"
                  >
                    Review
                  </button>
                </td>
              </tr>
            ))}
            {apps.length === 0 && (
              <tr>
                <td
                  colSpan={6}
                  className="px-4 py-6 text-center text-slate-500"
                >
                  No applications found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile Card Layout */}
      <div className="mt-6 space-y-4 md:hidden">
        {apps.map((a) => (
          <div key={a.id} className="rounded-xl border border-slate-200 bg-white p-4">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-semibold text-slate-900">{a.fullName}</h3>
                <p className="text-sm text-slate-500">{a.businessName}</p>
              </div>
              <Badge tone={statusTone[a.status] || "slate"}>
                {a.status}
              </Badge>
            </div>
            <div className="mt-3 grid grid-cols-2 gap-2 text-sm">
              <div>
                <span className="text-slate-500">Zone:</span>
                <span className="ml-1 font-medium">{a.primaryZoneName}</span>
              </div>
              <div>
                <span className="text-slate-500">Type:</span>
                <span className="ml-1 font-medium">{a.licenseType}</span>
              </div>
              <div className="col-span-2">
                <span className="text-slate-500">Submitted:</span>
                <span className="ml-1 font-medium">{new Date(a.submittedAt).toLocaleDateString()}</span>
              </div>
            </div>
            <button
              onClick={() => loadApplicationDetails(a)}
              className="mt-3 w-full rounded-lg bg-brand-600 px-3 py-2 text-sm font-semibold text-white hover:bg-brand-700"
            >
              Review Application
            </button>
          </div>
        ))}
        {apps.length === 0 && (
          <p className="text-center text-slate-500">No applications found.</p>
        )}
      </div>

      {selected && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 sm:items-center sm:p-4"
          onClick={() => setSelected(null)}
        >
          <div
            className="w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-t-2xl bg-white p-6 sm:rounded-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-slate-900">
                Application #{selected.id}
              </h3>
              <button
                onClick={() => setSelected(null)}
                className="text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            </div>

            {loadingDetails ? (
              <p className="text-sm text-slate-500">Loading details...</p>
            ) : (
              <div className="space-y-6">
                {/* Step 1: Personal Information */}
                <div className="border-b border-slate-200 pb-4">
                  <h4 className="font-medium text-slate-900 mb-3">Step 1: Personal Information</h4>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <span className="text-slate-500">Full Name:</span>
                      <span className="ml-2 font-medium">{selected.fullName || "—"}</span>
                    </div>
                    <div>
                      <span className="text-slate-500">Gender:</span>
                      <span className="ml-2 font-medium">{selected.gender || "—"}</span>
                    </div>
                    <div>
                      <span className="text-slate-500">Date of Birth:</span>
                      <span className="ml-2 font-medium">{selected.dateOfBirth || "—"}</span>
                    </div>
                    <div className="col-span-2">
                      <span className="text-slate-500">Address:</span>
                      <span className="ml-2 font-medium">{selected.address || "—"}</span>
                    </div>
                  </div>
                </div>

                {/* Step 2: Zone Selection */}
                <div className="border-b border-slate-200 pb-4">
                  <h4 className="font-medium text-slate-900 mb-3">Step 2: Zone Selection</h4>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <span className="text-slate-500">Primary Zone:</span>
                      <span className="ml-2 font-medium">{selected.primaryZoneName || "—"}</span>
                    </div>
                    <div>
                      <span className="text-slate-500">Alternate Zone:</span>
                      <span className="ml-2 font-medium">{selected.alternateZoneName || "None"}</span>
                    </div>
                    <div className="col-span-2">
                      <span className="text-slate-500">Business Name:</span>
                      <span className="ml-2 font-medium">{selected.businessName || "—"}</span>
                    </div>
                    <div className="col-span-2">
                      <span className="text-slate-500">Business Type:</span>
                      <span className="ml-2 font-medium">{selected.businessType || "—"}</span>
                    </div>
                    <div>
                      <span className="text-slate-500">Stall Size:</span>
                      <span className="ml-2 font-medium">{selected.stallSize || "—"}</span>
                    </div>
                    <div>
                      <span className="text-slate-500">Operating Hour:</span>
                      <span className="ml-2 font-medium">{selected.operatingHour || "—"}</span>
                    </div>
                    <div className="col-span-2">
                      <span className="text-slate-500">Facilities:</span>
                      <span className="ml-2 font-medium">{selected.facilities || "—"}</span>
                    </div>
                  </div>
                </div>

                {/* Step 3: License Type */}
                <div className="border-b border-slate-200 pb-4">
                  <h4 className="font-medium text-slate-900 mb-3">Step 3: License Type</h4>
                  <div className="text-sm">
                    <span className="text-slate-500">License Type:</span>
                    <span className="ml-2 font-medium">{selected.licenseType || "—"}</span>
                  </div>
                </div>

                {/* Step 4: Documents */}
                <div className="border-b border-slate-200 pb-4">
                  <h4 className="font-medium text-slate-900 mb-3">Step 4: Documents</h4>
                  {documents.length > 0 ? (
                    <div className="space-y-3">
                      {documents.map((doc) => (
                        <div key={doc.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                          <div>
                            <p className="text-sm font-medium text-slate-900">
                              {doc.docType === 'NATIONAL_ID' ? 'National ID Proof' :
                               doc.docType === 'VENDOR_PHOTO' ? 'Vendor Photo' : doc.docType}
                            </p>
                            <p className="text-xs text-slate-500">{doc.originalName}</p>
                          </div>
                          <button
                            onClick={() => {
                              setPdfViewerUrl(`${formattedBaseURL}/uploads/${doc.filePath}`);
                            }}
                            className="text-sm text-brand-600 hover:underline"
                          >
                            View
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-slate-500">No documents uploaded</p>
                  )}
                </div>

                {/* Step 5: Location Assignment */}
                <div className="border-b border-slate-200 pb-4">
                  <h4 className="font-medium text-slate-900 mb-3">Step 5: Assign Vendor Location</h4>
                  <p className="text-sm text-slate-500 mb-3">
                    Select the exact location on the map where the vendor is permitted to operate.
                  </p>
                  <MapSelector
                    key={selected.id}
                    initialCenter={selected.zoneCenter ? [selected.zoneCenter.lat, selected.zoneCenter.lng] : null}
                    initialPosition={selected.location ? [selected.location.lat, selected.location.lng] : null}
                    onPositionChange={setLocationPosition}
                  />
                </div>

                {/* Admin Actions */}
                <div className="space-y-3">
                  <textarea
                    placeholder="Admin notes"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="input"
                    rows={2}
                  />
                  <input
                    placeholder="Rejection reason (if rejecting)"
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    className="input"
                  />
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => decide(selected.id, "UNDER_REVIEW")}
                      className="rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-semibold"
                    >
                      Mark Under Review
                    </button>
                    <button
                      onClick={() => decide(selected.id, "REQUEST_MORE_INFO")}
                      className="rounded-lg border border-amber-300 px-3 py-1.5 text-xs font-semibold text-amber-700"
                    >
                      Request More Info
                    </button>
                    <button
                      onClick={() => decide(selected.id, "APPROVE")}
                      className="rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => decide(selected.id, "REJECT")}
                      className="rounded-lg bg-red-600 px-3 py-1.5 text-xs font-semibold text-white"
                    >
                      Reject
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {pdfViewerUrl && (
        <PDFViewer
          url={pdfViewerUrl}
          onClose={() => setPdfViewerUrl(null)}
        />
      )}
    </div>
  );
}
