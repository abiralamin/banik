import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../../lib/api";
import { useAuth } from "../../context/AuthContext";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await api.post("/api/auth/login", { email, password });
      login(res.data);
      navigate("/vendor/dashboard");
    } catch (err) {
      setError(err.friendlyMessage || "Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto flex min-h-[80vh] max-w-md items-center px-4 py-12">
      <div className="w-full rounded-2xl border border-slate-200 p-8 shadow-sm">
        <h1 className="text-2xl font-bold text-slate-900">Vendor Login</h1>

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
          <div className="flex justify-end">
            <Link
              to="/forgot-password"
              className="text-sm font-medium text-brand-600 hover:underline"
            >
              Forgot password?
            </Link>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-brand-600 py-2.5 text-sm font-semibold text-white hover:bg-brand-700 disabled:opacity-60"
          >
            {loading ? "Logging in…" : "Login"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-600">
          No account yet?{" "}
          <Link to="/register" className="font-semibold text-brand-600">
            Register
          </Link>
        </p>
        <p className="mt-2 text-center text-sm text-slate-600">
          Are you an administrator?{" "}
          <Link to="/admin/login" className="font-semibold text-brand-600">
            Admin Login
          </Link>
        </p>
      </div>
    </div>
  );
}
