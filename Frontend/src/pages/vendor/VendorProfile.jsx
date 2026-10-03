import { useEffect, useState } from "react";
import api from "../../lib/api";

export default function VendorProfile() {
  const [profile, setProfile] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [msg, setMsg] = useState("");
  const [passwords, setPasswords] = useState({
    currentPassword: "",
    newPassword: "",
  });

  const load = () =>
    api
      .get("/api/vendor/profile")
      .then((res) => setProfile(res.data))
      .catch(() => {});
  useEffect(() => {
    load();
  }, []);

  const save = async (e) => {
    e.preventDefault();
    setMsg("");
    try {
      await api.put("/api/vendor/profile", profile);
      setEditMode(false);
      setMsg("Profile updated successfully.");
    } catch (err) {
      setMsg(err.friendlyMessage || "Failed to update profile");
    }
  };

  const changePassword = async (e) => {
    e.preventDefault();
    setMsg("");
    try {
      await api.post("/api/vendor/profile/change-password", passwords);
      setMsg("Password changed successfully.");
      setPasswords({ currentPassword: "", newPassword: "" });
    } catch (err) {
      setMsg(err.friendlyMessage || "Failed to change password");
    }
  };

  const requestDeactivation = async () => {
    await api.post("/api/vendor/profile/deactivate");
    setMsg(
      "Account deactivation requested. An admin will review your request.",
    );
  };

  if (!profile) return <p className="text-sm text-slate-500">Loading…</p>;

  const field = (label, key, type = "text", disabled = false) => (
    <div>
      <label className="text-sm font-medium text-slate-700">{label}</label>
      <input
        type={type}
        disabled={!editMode || disabled}
        value={profile[key] || ""}
        onChange={(e) => setProfile((p) => ({ ...p, [key]: e.target.value }))}
        className="input mt-1 disabled:bg-slate-50"
      />
    </div>
  );

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      {msg && (
        <p className="rounded-lg bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
          {msg}
        </p>
      )}

      <form
        onSubmit={save}
        className="rounded-xl border border-slate-200 bg-white p-6"
      >
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-semibold text-slate-900">Profile</h2>
            <p className="text-xs text-slate-500">
              Completion: {profile.profileCompletion}%
              {profile.profileCompletion < 100 && (
                <span className="ml-2 text-amber-600">
                  (Complete profile to apply for license)
                </span>
              )}
            </p>
          </div>
          <button
            type="button"
            onClick={() => setEditMode((e) => !e)}
            className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm font-medium"
          >
            {editMode ? "Cancel" : "Edit"}
          </button>
        </div>
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
          {field("Full Name", "fullName")}
          <div>
            <label className="text-sm font-medium text-slate-700">Gender</label>
            <select
              disabled={!editMode || profile.genderLocked}
              value={profile.gender || ""}
              onChange={(e) => setProfile((p) => ({ ...p, gender: e.target.value }))}
              className="input mt-1 disabled:bg-slate-50"
            >
              <option value="">Select Gender</option>
              <option value="MALE">Male</option>
              <option value="FEMALE">Female</option>
              <option value="OTHER">Other</option>
            </select>
            {profile.genderLocked && (
              <p className="mt-1 text-xs text-slate-500">Gender cannot be changed after selection</p>
            )}
          </div>
          {field("Date of Birth", "dateOfBirth", "date")}
          {field("Phone", "phone")}
          {field("Address", "address")}
          {field("National ID Number", "nationalIdNumber")}
        </div>
        {editMode && (
          <button
            type="submit"
            className="mt-4 rounded-lg bg-brand-600 px-5 py-2 text-sm font-semibold text-white hover:bg-brand-700"
          >
            Save Changes
          </button>
        )}
      </form>

      <form
        onSubmit={changePassword}
        className="rounded-xl border border-slate-200 bg-white p-6"
      >
        <h2 className="font-semibold text-slate-900">Change Password</h2>
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <input
            type="password"
            placeholder="Current password"
            required
            value={passwords.currentPassword}
            onChange={(e) =>
              setPasswords((p) => ({ ...p, currentPassword: e.target.value }))
            }
            className="input"
          />
          <input
            type="password"
            placeholder="New password"
            required
            minLength={8}
            value={passwords.newPassword}
            onChange={(e) =>
              setPasswords((p) => ({ ...p, newPassword: e.target.value }))
            }
            className="input"
          />
        </div>
        <button
          type="submit"
          className="mt-4 rounded-lg bg-brand-600 px-5 py-2 text-sm font-semibold text-white hover:bg-brand-700"
        >
          Update Password
        </button>
      </form>

      <div className="rounded-xl border border-red-200 bg-red-50 p-6">
        <h2 className="font-semibold text-red-800">Deactivate Account</h2>
        <p className="mt-1 text-sm text-red-700">
          Request deactivation of your vendor account. An admin will process
          this request.
        </p>
        <button
          onClick={requestDeactivation}
          className="mt-3 rounded-lg border border-red-400 px-4 py-2 text-sm font-semibold text-red-700 hover:bg-red-100"
        >
          Request Deactivation
        </button>
      </div>
    </div>
  );
}
