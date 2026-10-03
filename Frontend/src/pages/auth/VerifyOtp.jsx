import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import api from "../../lib/api";
import { useAuth } from "../../context/AuthContext";

export default function VerifyOtp() {
  const location = useLocation();
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState(location.state?.email || "");
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");
  const [loading, setLoading] = useState(false);

  const purpose = location.state?.purpose || "REGISTER_VERIFY";

  const handleVerify = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      if (purpose === "RESET_PASSWORD") {
        navigate("/reset-password", { state: { email, code } });
        return;
      }
      const res = await api.post("/api/auth/verify-otp", { email, code });
      login(res.data);
      navigate("/vendor/dashboard");
    } catch (err) {
      setError(err.friendlyMessage || "Invalid or expired code");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setError("");
    setInfo("");
    try {
      await api.post("/api/auth/resend-otp", { email, purpose });
      setInfo("A new code has been sent to your email.");
    } catch (err) {
      setError(err.friendlyMessage || "Failed to resend code");
    }
  };

  return (
    <div className="mx-auto flex min-h-[80vh] max-w-md items-center px-4 py-12">
      <div className="w-full rounded-2xl border border-slate-200 p-8 shadow-sm">
        <h1 className="text-2xl font-bold text-slate-900">Verify OTP</h1>
        <p className="mt-1 text-sm text-slate-500">
          Enter the 6-digit code sent to your email.
        </p>

        {error && (
          <p className="mt-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
            {error}
          </p>
        )}
        {info && (
          <p className="mt-4 rounded-lg bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
            {info}
          </p>
        )}

        <form onSubmit={handleVerify} className="mt-6 space-y-4">
          <div>
            <label className="text-sm font-medium text-slate-700">Email</label>
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
              maxLength={6}
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-center text-lg tracking-[0.5em] focus:border-brand-500 focus:outline-none"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-brand-600 py-2.5 text-sm font-semibold text-white hover:bg-brand-700 disabled:opacity-60"
          >
            {loading ? "Verifying…" : "Verify"}
          </button>
        </form>

        <button
          onClick={handleResend}
          className="mt-4 w-full text-center text-sm font-semibold text-brand-600 hover:underline"
        >
          Resend OTP
        </button>
      </div>
    </div>
  );
}
