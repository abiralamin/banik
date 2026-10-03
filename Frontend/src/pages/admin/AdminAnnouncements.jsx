import { useEffect, useState } from "react";
import api from "../../lib/api";

export default function AdminAnnouncements() {
  const [announcements, setAnnouncements] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: "", message: "" });

  useEffect(() => {
    loadAnnouncements();
  }, []);

  const loadAnnouncements = () => {
    api
      .get("/api/announcements")
      .then((res) => setAnnouncements(res.data))
      .catch(() => {});
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    api
      .post("/api/announcements", form)
      .then((res) => {
        console.log("Announcement created:", res.data);
        setShowForm(false);
        setForm({ title: "", message: "" });
        loadAnnouncements();
        alert("Announcement created successfully!");
      })
      .catch((err) => {
        console.error("Error creating announcement:", err);
        console.error("Error response:", err.response);
        alert("Failed to create announcement: " + (err.response?.data || err.message));
      });
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this announcement?")) {
      api
        .delete(`/api/announcements/${id}`)
        .then(() => loadAnnouncements())
        .catch(() => {});
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-slate-900">
          Manage Announcements
        </h2>
        <button
          onClick={() => {
            setShowForm(true);
            setForm({ title: "", message: "" });
          }}
          className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-700"
        >
          Create Announcement
        </button>
      </div>

      {showForm && (
        <div className="mt-6 rounded-xl border border-slate-200 bg-white p-6">
          <h3 className="font-semibold text-slate-900">Create Announcement</h3>
          <form onSubmit={handleSubmit} className="mt-4 space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700">
                Title
              </label>
              <input
                required
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                className="input mt-1"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700">
                Message
              </label>
              <textarea
                required
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                className="input mt-1"
                rows={4}
              />
            </div>
            <div className="flex gap-2">
              <button
                type="submit"
                className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-700"
              >
                Create
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="mt-6 space-y-4">
        {announcements.map((a) => (
          <div
            key={a.id}
            className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className="font-semibold text-slate-900">{a.title}</h3>
                <p className="mt-2 text-sm text-slate-600 whitespace-pre-line">
                  {a.message || a.body}
                </p>
                <p className="mt-3 text-xs text-slate-500">
                  {new Date(a.createdAt).toLocaleString()}
                </p>
              </div>
              <button
                onClick={() => handleDelete(a.id)}
                className="ml-4 rounded-lg border border-red-300 px-2 py-1 text-xs font-semibold text-red-600 hover:bg-red-50"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
        {announcements.length === 0 && (
          <p className="text-sm text-slate-500">No announcements found.</p>
        )}
      </div>
    </div>
  );
}
