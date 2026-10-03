import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../lib/api";

const steps = [
  "Personal Info",
  "Zone Selection",
  "License Type",
  "Documents",
  "Review & Submit",
  "Fee Payment",
];

const licensePrices = {
  DAILY: "priceDaily",
  WEEKLY: "priceDaily",
  MONTHLY: "priceMonthly",
  ANNUAL: "priceAnnual",
};

export default function ApplyLicense() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [zones, setZones] = useState([]);
  const [areaFilter, setAreaFilter] = useState("");
  const [applicationId, setApplicationId] = useState(null);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [idFile, setIdFile] = useState(null);
  const [vendorPhotoFile, setVendorPhotoFile] = useState(null);
  const [paymentChoice, setPaymentChoice] = useState("LATER");
  const [done, setDone] = useState(false);
  const [profile, setProfile] = useState(null);
  const [profileCheckDone, setProfileCheckDone] = useState(false);

  const [form, setForm] = useState({
    fullName: "",
    gender: "",
    dateOfBirth: "",
    address: "",
    primaryZoneId: "",
    alternateZoneId: "",
    businessName: "",
    licenseType: "MONTHLY",
    stallSize: "",
    operatingHour: "",
    facilities: [],
    businessType: "",
  });

  useEffect(() => {
    // Check profile completion first
    api
      .get("/api/vendor/profile")
      .then((res) => {
        setProfile(res.data);
        setProfileCheckDone(true);
        
        // Check if profile is 100% complete
        if (res.data.profileCompletion < 100) {
          setError("Please complete your profile 100% before applying for a license");
          return;
        }
        
        // Auto-fill form with profile data
        setForm((f) => ({
          ...f,
          fullName: res.data.fullName || "",
          gender: res.data.gender || "",
          dateOfBirth: res.data.dateOfBirth || "",
          address: res.data.address || "",
        }));
      })
      .catch(() => {
        setProfileCheckDone(true);
        setError("Failed to load profile information");
      });
  }, []);

  useEffect(() => {
    if (profileCheckDone && profile && profile.profileCompletion === 100) {
      api
        .get("/api/public/zones", {
          params: areaFilter ? { area: areaFilter } : {},
        })
        .then((res) => setZones(res.data))
        .catch(() => setZones([]));
    }
  }, [areaFilter, profileCheckDone, profile]);

  const update = (field) => (e) =>
    setForm((f) => ({ ...f, [field]: e.target.value }));

  const selectedPrimary = useMemo(
    () => zones.find((z) => String(z.id) === String(form.primaryZoneId)),
    [zones, form.primaryZoneId],
  );

  const validateStep = (currentStep) => {
    switch (currentStep) {
      case 0: // Personal Info
        if (!form.fullName.trim()) {
          setError("Full Name is required");
          return false;
        }
        if (!form.gender) {
          setError("Gender is required");
          return false;
        }
        if (!form.dateOfBirth) {
          setError("Date of Birth is required");
          return false;
        }
        if (!form.address.trim()) {
          setError("Address is required");
          return false;
        }
        return true;

      case 1: // Zone Selection
        if (!form.primaryZoneId) {
          setError("Please select a primary zone");
          return false;
        }
        if (!form.businessName.trim()) {
          setError("Please enter a business name");
          return false;
        }
        if (!form.businessType.trim()) {
          setError("Please enter a business type");
          return false;
        }
        if (!form.stallSize) {
          setError("Please select a stall size");
          return false;
        }
        if (!form.operatingHour) {
          setError("Please select an operating hour");
          return false;
        }
        return true;

      case 2: // License Type
        if (!form.licenseType) {
          setError("Please select a license type");
          return false;
        }
        return true;

      case 3: // Documents
        if (!idFile) {
          setError("National ID Proof is required");
          return false;
        }
        if (!vendorPhotoFile) {
          setError("Vendor Photo is required");
          return false;
        }
        return true;

      case 4: // Review & Submit
        // Validate that all required information is present
        if (!form.fullName.trim() || !form.gender || !form.dateOfBirth || !form.address.trim()) {
          setError("Personal information is incomplete");
          return false;
        }
        if (!form.primaryZoneId || !form.businessName.trim() || !form.businessType.trim() || !form.stallSize || !form.operatingHour) {
          setError("Zone selection is incomplete");
          return false;
        }
        if (!form.licenseType) {
          setError("License type is not selected");
          return false;
        }
        if (!idFile || !vendorPhotoFile) {
          setError("Required documents are missing");
          return false;
        }
        return true;

      default:
        return true;
    }
  };

  const next = () => {
    if (validateStep(step)) {
      setError("");
      setStep((s) => Math.min(s + 1, steps.length - 1));
    }
  };
  const back = () => setStep((s) => Math.max(s - 1, 0));

  // Show profile completion warning if not 100% complete
  if (!profileCheckDone) {
    return <p className="text-sm text-slate-500">Loading profile information...</p>;
  }

  if (profile && profile.profileCompletion < 100) {
    return (
      <div className="rounded-xl border border-amber-200 bg-amber-50 p-6">
        <h2 className="font-semibold text-amber-800">Profile Incomplete</h2>
        <p className="mt-2 text-sm text-amber-700">
          Your profile is {profile.profileCompletion}% complete. You need to complete your profile 100% before applying for a license.
        </p>
        <button
          onClick={() => navigate("/vendor/profile")}
          className="mt-4 rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-700"
        >
          Complete Profile
        </button>
      </div>
    );
  }

  const submitApplication = async () => {
    setError("");
    setSubmitting(true);
    try {
      const applicationData = {
        fullName: form.fullName,
        gender: form.gender,
        dateOfBirth: form.dateOfBirth,
        address: form.address,
        primaryZoneId: form.primaryZoneId,
        alternateZoneId: form.alternateZoneId,
        businessName: form.businessName,
        licenseType: form.licenseType,
        stallSize: form.stallSize,
        operatingHour: form.operatingHour,
        facilities: form.facilities.length > 0 ? form.facilities.join(", ") : "None",
        businessType: form.businessType,
      };
      const res = await api.post("/api/vendor/applications", applicationData);
      setApplicationId(res.data.id);
      // Don't call next() here - let user click Upload & Continue
    } catch (err) {
      setError(err.friendlyMessage || "Failed to submit application");
    } finally {
      setSubmitting(false);
    }
  };

  const uploadDocs = async () => {
    if (!applicationId) {
      setError("Application ID not available. Please try again.");
      return false;
    }
    
    try {
      // Upload National ID
      if (idFile) {
        const fd = new FormData();
        fd.append("file", idFile);
        fd.append("docType", "NATIONAL_ID");
        await api.post(
          `/api/vendor/applications/${applicationId}/documents`,
          fd
        );
      }
      
      // Upload Vendor Photo
      if (vendorPhotoFile) {
        const fd = new FormData();
        fd.append("file", vendorPhotoFile);
        fd.append("docType", "VENDOR_PHOTO");
        await api.post(
          `/api/vendor/applications/${applicationId}/documents`,
          fd
        );
      }
      
      return true;
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.friendlyMessage || "Failed to upload documents";
      setError(errorMessage);
      return false;
    }
  };

  const finalizeSubmission = async () => {
    setSubmitting(true);
    setError("");
    const ok = await uploadDocs();
    setSubmitting(false);
    if (ok) next();
  };

  const handlePayment = async () => {
    setSubmitting(true);
    setError("");
    try {
      if (paymentChoice === "PAY_NOW") {
        await api.post(`/api/vendor/applications/${applicationId}/pay`);
      }
      setDone(true);
    } catch (err) {
      setError(err.friendlyMessage || "Payment failed");
    } finally {
      setSubmitting(false);
    }
  };

  if (done) {
    return (
      <div className="mx-auto max-w-lg rounded-xl border border-emerald-200 bg-emerald-50 p-8 text-center">
        <h2 className="text-xl font-bold text-emerald-800">
          Application Submitted!
        </h2>
        <p className="mt-2 text-sm text-emerald-700">
          Your license application #{applicationId} has been submitted and is
          now under review.
        </p>
        <button
          onClick={() => navigate("/vendor/applications")}
          className="mt-6 rounded-lg bg-brand-600 px-5 py-2 text-sm font-semibold text-white hover:bg-brand-700"
        >
          Track My Applications
        </button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl">
      {/* Desktop Step Indicator */}
      <ol className="mb-8 hidden flex-wrap gap-2 text-xs font-medium md:flex">
        {steps.map((s, i) => (
          <li
            key={s}
            className={`rounded-full px-3 py-1 ${i === step ? "bg-brand-600 text-white" : i < step ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-500"}`}
          >
            {i + 1}. {s}
          </li>
        ))}
      </ol>
      {/* Mobile Step Indicator */}
      <div className="mb-6 flex items-center justify-between md:hidden">
        <span className="text-sm font-medium text-slate-600">
          Step {step + 1} of {steps.length}
        </span>
        <span className="text-xs text-slate-500">{steps[step]}</span>
      </div>

      {error && (
        <p className="mb-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}
        </p>
      )}

      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        {step === 0 && (
          <div className="space-y-4">
            <h2 className="font-semibold text-slate-900">
              Step 1 — Personal Information
            </h2>
            <p className="text-sm text-slate-500">
              Some fields are auto-filled from your profile. You can edit them if needed.
            </p>
            <Field label="Full Name">
              <input
                required
                value={form.fullName}
                onChange={update("fullName")}
                className="input"
              />
            </Field>
            <Field label="Gender">
              <select
                value={form.gender}
                onChange={update("gender")}
                className="input"
                disabled
              >
                <option value="">Select Gender</option>
                <option value="MALE">Male</option>
                <option value="FEMALE">Female</option>
                <option value="OTHER">Other</option>
              </select>
              <p className="mt-1 text-xs text-slate-500">Gender is locked from your profile</p>
            </Field>
            <Field label="Date of Birth">
              <input
                type="date"
                required
                value={form.dateOfBirth}
                onChange={update("dateOfBirth")}
                className="input"
              />
            </Field>
            <Field label="Address">
              <textarea
                value={form.address}
                onChange={update("address")}
                className="input"
                rows={2}
              />
            </Field>
          </div>
        )}

        {step === 1 && (
          <div className="space-y-4">
            <h2 className="font-semibold text-slate-900">
              Step 2 — Zone Selection
            </h2>
            <input
              placeholder="Filter by area"
              value={areaFilter}
              onChange={(e) => setAreaFilter(e.target.value)}
              className="input"
            />
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {zones.map((z) => (
                <label
                  key={z.id}
                  className={`cursor-pointer rounded-lg border p-3 text-sm ${String(form.primaryZoneId) === String(z.id) ? "border-brand-500 bg-brand-50" : "border-slate-200"}`}
                >
                  <input
                    type="radio"
                    name="primaryZone"
                    className="mr-2"
                    checked={String(form.primaryZoneId) === String(z.id)}
                    onChange={() =>
                      setForm((f) => ({ ...f, primaryZoneId: z.id }))
                    }
                  />
                  <span className="font-medium">{z.name}</span> — {z.area}
                  <p className="text-xs text-slate-500">
                    Status: {z.status} · {z.occupiedSpots}/{z.totalSpots} spots
                  </p>
                </label>
              ))}
            </div>
            <Field label="Alternate Zone (optional)">
              <select
                value={form.alternateZoneId}
                onChange={update("alternateZoneId")}
                className="input"
              >
                <option value="">None</option>
                {zones
                  .filter((z) => String(z.id) !== String(form.primaryZoneId))
                  .map((z) => (
                    <option key={z.id} value={z.id}>
                      {z.name} — {z.area}
                    </option>
                  ))}
              </select>
            </Field>

            <Field label="Business Name *">
              <input
                type="text"
                placeholder="Enter your business name"
                value={form.businessName}
                onChange={update("businessName")}
                className="input"
              />
              <p className="mt-1 text-xs text-slate-500">The name of your business as it should appear on the license</p>
            </Field>

            <div className="border-t border-slate-200 pt-4">
              <h3 className="font-medium text-slate-900 mb-3">Business Type</h3>
              <input
                type="text"
                placeholder="e.g., Food, Clothing, Electronics"
                value={form.businessType}
                onChange={update("businessType")}
                className="input"
              />
              <p className="mt-1 text-xs text-slate-500">Enter the type of business you want to operate</p>
            </div>
            
            <div className="border-t border-slate-200 pt-4">
              <h3 className="font-medium text-slate-900 mb-3">Stall Size</h3>
              <div className="flex flex-wrap gap-3">
                {["Small (3x3 ft)", "Medium (4x4 ft)", "Large (5x5 ft)", "Extra Large (6x6 ft)"].map((size) => (
                  <label key={size} className="flex items-center gap-2 text-sm">
                    <input
                      type="radio"
                      name="stallSize"
                      checked={form.stallSize === size}
                      onChange={() => setForm((f) => ({ ...f, stallSize: size }))}
                    />
                    {size}
                  </label>
                ))}
              </div>
            </div>

            <div className="border-t border-slate-200 pt-4">
              <h3 className="font-medium text-slate-900 mb-3">Operating Hour</h3>
              <div className="flex flex-wrap gap-3">
                {["08:00-12:00", "10:00-02:00", "12:00-04:00", "02:00-06:00", "06:00-10:00"].map((hour) => (
                  <label key={hour} className="flex items-center gap-2 text-sm">
                    <input
                      type="radio"
                      name="operatingHour"
                      checked={form.operatingHour === hour}
                      onChange={() => setForm((f) => ({ ...f, operatingHour: hour }))}
                    />
                    {hour}
                  </label>
                ))}
              </div>
            </div>

            <div className="border-t border-slate-200 pt-4">
              <h3 className="font-medium text-slate-900 mb-3">Facilities Required</h3>
              <div className="flex flex-wrap gap-3">
                {["Electricity", "Water", "Storage", "Shade"].map((facility) => (
                  <label key={facility} className="flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={form.facilities.includes(facility)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setForm((f) => ({ ...f, facilities: [...f.facilities, facility] }));
                        } else {
                          setForm((f) => ({ ...f, facilities: f.facilities.filter(f => f !== facility) }));
                        }
                      }}
                    />
                    {facility}
                  </label>
                ))}
              </div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <h2 className="font-semibold text-slate-900">
              Step 3 — License Type
            </h2>
            <div className="space-y-3">
              {["DAILY", "WEEKLY", "MONTHLY", "ANNUAL"].map((t) => {
                let price = "—";
                let discount = null;

                if (selectedPrimary && licensePrices[t]) {
                  if (t === "WEEKLY") {
                    price = `৳${selectedPrimary[licensePrices[t]] * 7}`;
                  } else if (t === "ANNUAL") {
                    const annualPrice = selectedPrimary[licensePrices[t]];
                    const discountAmount = Math.round(annualPrice * 0.1);
                    const discountedPrice = annualPrice - discountAmount;
                    price = `৳${discountedPrice}`;
                    discount = `10% off (Save ৳${discountAmount})`;
                  } else {
                    price = `৳${selectedPrimary[licensePrices[t]]}`;
                  }
                }

                return (
                  <label
                    key={t}
                    className={`flex cursor-pointer items-center justify-between rounded-lg border p-3 ${
                      form.licenseType === t
                        ? "border-brand-500 bg-brand-50"
                        : "border-slate-200"
                    }`}
                  >
                    <div>
                      <span className="font-medium">{t}</span>
                      <div className="text-sm text-slate-600">
                        {price}
                        {discount && (
                          <span className="ml-2 text-xs text-emerald-600 font-medium">
                            {discount}
                          </span>
                        )}
                      </div>
                    </div>
                    <input
                      type="radio"
                      name="licenseType"
                      value={t}
                      checked={form.licenseType === t}
                      onChange={(e) => {
                        setForm((f) => ({ ...f, licenseType: e.target.value }));
                      }}
                      className="h-5 w-5"
                    />
                  </label>
                );
              })}
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4">
            <h2 className="font-semibold text-slate-900">
              Step 4 — Document Upload
            </h2>
            <Field label="National ID Proof *">
              <input
                type="file"
                accept=".pdf"
                onChange={(e) => {
                  const file = e.target.files[0];
                  if (file) {
                    const fileType = file.type || file.name.split('.').pop().toLowerCase();
                    if (fileType !== 'application/pdf' && !file.name.toLowerCase().endsWith('.pdf')) {
                      setError("Only PDF files are allowed");
                      setIdFile(null);
                      return;
                    }
                    setIdFile(file);
                  }
                }}
                className="input"
              />
              <p className="mt-1 text-xs text-slate-500">Required document</p>
            </Field>
            <Field label="Vendor Photo *">
              <input
                type="file"
                accept=".pdf"
                onChange={(e) => {
                  const file = e.target.files[0];
                  if (file) {
                    const fileType = file.type || file.name.split('.').pop().toLowerCase();
                    if (fileType !== 'application/pdf' && !file.name.toLowerCase().endsWith('.pdf')) {
                      setError("Only PDF files are allowed");
                      setVendorPhotoFile(null);
                      return;
                    }
                    setVendorPhotoFile(file);
                  }
                }}
                className="input"
              />
              <p className="mt-1 text-xs text-slate-500">Required document</p>
            </Field>
            <p className="text-xs text-slate-500">
              Accepted: PDF only (max 10MB each).
            </p>
          </div>
        )}

        {step === 4 && (
          <div className="space-y-3 text-sm">
            <h2 className="font-semibold text-slate-900">
              Step 5 — Review &amp; Submit
            </h2>
            <ReviewRow label="Full Name" value={form.fullName} />
            <ReviewRow label="Gender" value={form.gender} />
            <ReviewRow label="Date of Birth" value={form.dateOfBirth} />
            <ReviewRow label="Address" value={form.address} />
            <ReviewRow label="Primary Zone" value={selectedPrimary?.name} />
            <ReviewRow label="Alternate Zone" value={zones.find(z => String(z.id) === String(form.alternateZoneId))?.name || "None"} />
            <ReviewRow label="Business Name" value={form.businessName} />
            <ReviewRow label="Business Type" value={form.businessType} />
            <ReviewRow label="Stall Size" value={form.stallSize} />
            <ReviewRow label="Operating Hour" value={form.operatingHour} />
            <ReviewRow label="Facilities" value={Array.isArray(form.facilities) ? form.facilities.join(", ") : form.facilities} />
            <ReviewRow label="License Type" value={form.licenseType} />
            <ReviewRow
              label="National ID Document"
              value={idFile?.name || "Not attached"}
            />
            <ReviewRow
              label="Vendor Photo"
              value={vendorPhotoFile?.name || "Not attached"}
            />
          </div>
        )}

        {step === 5 && (
          <div className="space-y-4">
            <h2 className="font-semibold text-slate-900">
              Step 6 — Fee Payment
            </h2>
            <label className="flex items-center gap-2 text-sm">
              <input
                type="radio"
                checked={paymentChoice === "LATER"}
                onChange={() => setPaymentChoice("LATER")}
              />
              Pay Later
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input
                type="radio"
                checked={paymentChoice === "PAY_NOW"}
                onChange={() => setPaymentChoice("PAY_NOW")}
              />
              Pay Now (dummy payment)
            </label>
          </div>
        )}

        <div className="mt-8 flex justify-between">
          <button
            onClick={back}
            disabled={step === 0}
            className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium disabled:opacity-40"
          >
            Back
          </button>
          {step < 3 && (
            <button
              onClick={next}
              className="rounded-lg bg-brand-600 px-5 py-2 text-sm font-semibold text-white hover:bg-brand-700"
            >
              Next
            </button>
          )}
          {step === 3 && applicationId && (
            <button
              onClick={finalizeSubmission}
              disabled={submitting}
              className="rounded-lg bg-brand-600 px-5 py-2 text-sm font-semibold text-white hover:bg-brand-700 disabled:opacity-60"
            >
              {submitting ? "Uploading…" : "Upload & Continue"}
            </button>
          )}
          {step === 3 && !applicationId && (
            <button
              onClick={submitApplication}
              disabled={submitting}
              className="rounded-lg bg-brand-600 px-5 py-2 text-sm font-semibold text-white hover:bg-brand-700 disabled:opacity-60"
            >
              {submitting ? "Submitting…" : "Submit Application"}
            </button>
          )}
          {step === 4 && (
            <button
              onClick={next}
              className="rounded-lg bg-brand-600 px-5 py-2 text-sm font-semibold text-white hover:bg-brand-700"
            >
              Continue to Payment
            </button>
          )}
          {step === 5 && (
            <button
              onClick={handlePayment}
              disabled={submitting}
              className="rounded-lg bg-brand-600 px-5 py-2 text-sm font-semibold text-white hover:bg-brand-700 disabled:opacity-60"
            >
              {submitting ? "Finishing…" : "Finish"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function Field({ label, children }) {
  return (
    <div>
      <label className="text-sm font-medium text-slate-700">{label}</label>
      <div className="mt-1">{children}</div>
    </div>
  );
}

function ReviewRow({ label, value }) {
  return (
    <div className="flex justify-between border-b border-slate-100 py-1">
      <span className="text-slate-500">{label}</span>
      <span className="font-medium text-slate-800">{value || "—"}</span>
    </div>
  );
}
