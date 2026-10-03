import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../lib/api";
import { useAuth } from "../../context/AuthContext";

export default function AdminLogin() {
  const [username, setUsername] = useState("");
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
      const res = await api.post("/api/auth/admin/login", {
        username,
        password,
      });
      login(res.data);
      navigate("/admin/dashboard");
    } catch (err) {
      setError(err.friendlyMessage || "Invalid admin credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto flex min-h-[80vh] max-w-md items-center px-4 py-12">
      <div className="w-full rounded-2xl border border-slate-200 bg-white p-8 text-slate-900 shadow-sm">
        <h1 className="text-2xl font-bold">Admin Login</h1>
        <p className="mt-1 text-sm text-slate-500">
          Authority access to manage the Banik platform.
        </p>

        {error && (
          <p className="mt-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">
            {error}
          </p>
        )}

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label className="text-sm font-medium text-slate-700">Username</label>
            <input
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="mt-1 w-full rounded-lg border border-slate-300 bg-blue-50 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-slate-700">Password</label>
            {/* password input + show/hide toggle button, side by side */}
            <div className="mt-1 flex items-center rounded-lg border border-slate-300 bg-blue-50">
              <input
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-transparent px-3 py-2 text-sm focus:outline-none"
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="px-3 text-sm font-medium text-blue-600"
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-blue-600 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-60"
          >
            {loading ? "Logging in…" : "Login"}
          </button>
        </form>
        <p className="mt-6 text-center text-xs text-slate-400">
          Demo credentials: admin / admin123
        </p>
      </div>
    </div>
  );
}