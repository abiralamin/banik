import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../../lib/api";

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (password !== confirm) {
      setError("Passwords do not match");
      return;
    }
    setLoading(true);
    try {
      await api.post("/api/auth/register", { email, password });
      navigate("/verify-otp", { state: { email, purpose: "REGISTER_VERIFY" } });
    } catch (err) {
      setError(err.friendlyMessage || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto flex min-h-[80vh] max-w-md items-center px-4 py-12">
      <div className="w-full rounded-2xl border border-slate-200 p-8 shadow-sm">
        <h1 className="text-2xl font-bold text-slate-900">
          Vendor Registration
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Create your account to start applying for licenses.
        </p>

        {error && (
          <p className="mt-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
            {error}
          </p>
        )}

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
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
              Password
            </label>
            <div className="mt-1 flex items-center rounded-lg border border-slate-300 focus-within:border-brand-500">
              <input
                type={showPassword ? "text" : "password"}
                required
                minLength={8}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-lg px-3 py-2 text-sm focus:outline-none"
              />
              <button
                type="button"
                onClick={() => setShowPassword((s) => !s)}
                className="px-3 text-xs text-slate-500"
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
          </div>
          <div>
            <label className="text-sm font-medium text-slate-700">
              Confirm Password
            </label>
            <input
              type={showPassword ? "text" : "password"}
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
            {loading ? "Creating account…" : "Register"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-600">
          Already have an account?{" "}
          <Link to="/login" className="font-semibold text-brand-600">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
