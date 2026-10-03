import { useState } from "react";
import api from "../../lib/api";

export default function IssueLicense() {
  const [applicationId, setApplicationId] = useState("");
  const [category, setCategory] = useState("");
  const [authorizedGoods, setAuthorizedGoods] = useState("");
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  const issue = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const res = await api.post("/api/admin/licenses/issue", {
        applicationId: Number(applicationId),
        category,
        authorizedGoods,
      });
      setResult(res.data);
    } catch (err) {
      setError(err.friendlyMessage || "Failed to issue license");
    }
  };

  return (
    <div className="mx-auto max-w-lg">
      <h2 className="text-lg font-semibold text-slate-900">
        Issue Digital License
      </h2>
      <form
        onSubmit={issue}
        className="mt-4 space-y-4 rounded-xl border border-slate-200 bg-white p-6"
      >
        {error && (
          <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
            {error}
          </p>
        )}
        <div>
          <label className="text-sm font-medium text-slate-700">
            Approved Application ID
          </label>
          <input
            required
            value={applicationId}
            onChange={(e) => setApplicationId(e.target.value)}
            className="input"
          />
        </div>
        <div>
          <label className="text-sm font-medium text-slate-700">Category</label>
          <input
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="input"
            placeholder="e.g. Food Stall"
          />
        </div>
        <div>
          <label className="text-sm font-medium text-slate-700">
            Authorized Goods
          </label>
          <input
            value={authorizedGoods}
            onChange={(e) => setAuthorizedGoods(e.target.value)}
            className="input"
            placeholder="e.g. Tea, snacks"
          />
        </div>
        <button
          type="submit"
          className="w-full rounded-lg bg-brand-600 py-2.5 text-sm font-semibold text-white hover:bg-brand-700"
        >
          Issue License
        </button>
      </form>

      {result && (
        <div className="mt-6 rounded-xl border border-emerald-200 bg-emerald-50 p-6 text-center">
          <p className="font-semibold text-emerald-800">
            License Issued: {result.licenseNumber}
          </p>
          {result.qrCodeData && (
            <img
              src={result.qrCodeData}
              alt="QR"
              className="mx-auto mt-3 h-32 w-32"
            />
          )}
        </div>
      )}
    </div>
  );
}
