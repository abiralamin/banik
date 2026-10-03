import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import api from "../../lib/api";

export default function ResetPassword() {
  const location = useLocation();
  const navigate = useNavigate();
  const [email, setEmail] = useState(location.state?.email || "");
  const [code, setCode] = useState(location.state?.code || "");
  const [newPassword, setNewPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (newPassword !== confirm) {
      setError("Passwords do not match");
      return;
    }
    setLoading(true);
    try {
      await api.post("/api/auth/reset-password", { email, code, newPassword });
      setSuccess(true);
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      setError(err.friendlyMessage || "Failed to reset password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto flex min-h-[80vh] max-w-md items-center px-4 py-12">
      <div className="w-full rounded-2xl border border-slate-200 p-8 shadow-sm">
        <h1 className="text-2xl font-bold text-slate-900">Reset Password</h1>

        {error && (
          <p className="mt-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
            {error}
          </p>
        )}
        {success && (
          <p className="mt-4 rounded-lg bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
            Password reset successful. Redirecting to login…
          </p>
        )}

        {!success && (
          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div>
              <label className="text-sm font-medium text-slate-700">
                Email
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-slate-700">
                OTP Code
              </label>
              <input
                required
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-slate-700">
                New Password
              </label>
              <input
                type="password"
                required
                minLength={8}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-slate-700">
                Confirm Password
              </label>
              <input
                type="password"
                required
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-brand-600 py-2.5 text-sm font-semibold text-white hover:bg-brand-700 disabled:opacity-60"
            >
              {loading ? "Resetting…" : "Reset Password"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
