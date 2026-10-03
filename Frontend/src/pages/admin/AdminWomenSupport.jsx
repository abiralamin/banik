import { useEffect, useState } from "react";
import api from "../../lib/api";

export default function AdminWomenSupport() {
  const [schemes, setSchemes] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingScheme, setEditingScheme] = useState(null);
  const [form, setForm] = useState({
    title: "",
    description: "",
    benefits: "",
    eligibilityCriteria: "",
    applicationProcess: "",
    deadline: "",
    contactInfo: "",
  });

  useEffect(() => {
    loadSchemes();
  }, []);

  const loadSchemes = () => {
    api
      .get("/api/admin/women-support/schemes")
      .then((res) => setSchemes(res.data))
      .catch(() => {});
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const request = editingScheme
      ? api.put(`/api/admin/women-support/schemes/${editingScheme.id}`, form)
      : api.post("/api/admin/women-support/schemes", form);

    request
      .then((res) => {
        setShowForm(false);
        setEditingScheme(null);
        setForm({
          title: "",
          description: "",
          benefits: "",
          eligibilityCriteria: "",
          applicationProcess: "",
          deadline: "",
          contactInfo: "",
        });
        loadSchemes();
        alert(editingScheme ? "Scheme updated successfully!" : "Scheme created successfully!");
      })
      .catch((err) => {
        console.error("Error saving scheme:", err);
        alert("Failed to save scheme: " + (err.response?.data || err.message));
      });
  };

  const handleEdit = (scheme) => {
    setEditingScheme(scheme);
    setForm({
      title: scheme.title,
      description: scheme.description,
      benefits: scheme.benefits,
      eligibilityCriteria: scheme.eligibilityCriteria,
      applicationProcess: scheme.applicationProcess,
      deadline: scheme.deadline,
      contactInfo: scheme.contactInfo,
    });
    setShowForm(true);
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this scheme?")) {
      api
        .delete(`/api/admin/women-support/schemes/${id}`)
        .then(() => loadSchemes())
        .catch(() => {});
    }
  };

  const handleToggleActive = (id, currentStatus) => {
    api
      .patch(`/api/admin/women-support/schemes/${id}/toggle-active`)
      .then(() => loadSchemes())
      .catch(() => {});
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingScheme(null);
    setForm({
      title: "",
      description: "",
      benefits: "",
      eligibilityCriteria: "",
      applicationProcess: "",
      deadline: "",
      contactInfo: "",
    });
  };

  return (
    <div>
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-slate-900">
          Women's Support - Schemes & Grants
        </h2>
        <button
          onClick={() => {
            setShowForm(true);
            setEditingScheme(null);
            setForm({
              title: "",
              description: "",
              benefits: "",
              eligibilityCriteria: "",
              applicationProcess: "",
              deadline: "",
              contactInfo: "",
            });
          }}
          className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-700"
        >
          Add New Scheme
        </button>
      </div>

      {showForm && (
        <div className="mt-6 rounded-xl border border-slate-200 bg-white p-6">
          <h3 className="font-semibold text-slate-900">
            {editingScheme ? "Edit Scheme" : "Add New Scheme"}
          </h3>
          <form onSubmit={handleSubmit} className="mt-4 space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700">
                Scheme Title/Name *
              </label>
              <input
                required
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                className="input mt-1"
                placeholder="e.g., Women Vendor Startup Grant"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700">
                Description *
              </label>
              <textarea
                required
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                className="input mt-1"
                rows={3}
                placeholder="Describe the scheme's purpose and objectives"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700">
                Benefits / Subsidy Amount *
              </label>
              <textarea
                required
                value={form.benefits}
                onChange={(e) => setForm({ ...form, benefits: e.target.value })}
                className="input mt-1"
                rows={2}
                placeholder="e.g., $500 grant, 50% subsidy on equipment, etc."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700">
                Eligibility Criteria
              </label>
              <textarea
                value={form.eligibilityCriteria}
                onChange={(e) => setForm({ ...form, eligibilityCriteria: e.target.value })}
                className="input mt-1"
                rows={2}
                placeholder="Who is eligible for this scheme?"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700">
                Application Process
              </label>
              <textarea
                value={form.applicationProcess}
                onChange={(e) => setForm({ ...form, applicationProcess: e.target.value })}
                className="input mt-1"
                rows={2}
                placeholder="How to apply for this scheme"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700">
                Application Deadline
              </label>
              <input
                type="date"
                value={form.deadline}
                onChange={(e) => setForm({ ...form, deadline: e.target.value })}
                className="input mt-1"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700">
                Contact Information
              </label>
              <input
                value={form.contactInfo}
                onChange={(e) => setForm({ ...form, contactInfo: e.target.value })}
                className="input mt-1"
                placeholder="e.g., email, phone number, or office address"
              />
            </div>
            <div className="flex gap-2">
              <button
                type="submit"
                className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-700"
              >
                {editingScheme ? "Update" : "Create"}
              </button>
              <button
                type="button"
                onClick={handleCancel}
                className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="mt-6 space-y-4">
        {schemes.map((scheme) => (
          <div
            key={scheme.id}
            className={`rounded-xl border bg-white p-5 shadow-sm ${
              scheme.isActive ? "border-slate-200" : "border-slate-300 opacity-60"
            }`}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-slate-900">{scheme.title}</h3>
                  {!scheme.isActive && (
                    <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-semibold text-slate-600">
                      Inactive
                    </span>
                  )}
                </div>
                <p className="mt-2 text-sm text-slate-600">{scheme.description}</p>
                
                <div className="mt-4 space-y-2">
                  <div>
                    <p className="text-xs font-medium text-slate-500">Benefits:</p>
                    <p className="text-sm text-slate-700">{scheme.benefits}</p>
                  </div>
                  {scheme.eligibilityCriteria && (
                    <div>
                      <p className="text-xs font-medium text-slate-500">Eligibility:</p>
                      <p className="text-sm text-slate-700">{scheme.eligibilityCriteria}</p>
                    </div>
                  )}
                  {scheme.applicationProcess && (
                    <div>
                      <p className="text-xs font-medium text-slate-500">Application Process:</p>
                      <p className="text-sm text-slate-700">{scheme.applicationProcess}</p>
                    </div>
                  )}
                  {scheme.deadline && (
                    <div>
                      <p className="text-xs font-medium text-slate-500">Deadline:</p>
                      <p className="text-sm text-slate-700">{scheme.deadline}</p>
                    </div>
                  )}
                  {scheme.contactInfo && (
                    <div>
                      <p className="text-xs font-medium text-slate-500">Contact:</p>
                      <p className="text-sm text-slate-700">{scheme.contactInfo}</p>
                    </div>
                  )}
                </div>
                
                <p className="mt-3 text-xs text-slate-500">
                  Created: {new Date(scheme.createdAt).toLocaleString()}
                </p>
              </div>
              
              <div className="ml-4 flex flex-col gap-2">
                <button
                  onClick={() => handleEdit(scheme)}
                  className="rounded-lg border border-brand-300 px-3 py-1.5 text-xs font-semibold text-brand-600 hover:bg-brand-50"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleToggleActive(scheme.id, scheme.isActive)}
                  className={`rounded-lg border px-3 py-1.5 text-xs font-semibold ${
                    scheme.isActive
                      ? "border-amber-300 text-amber-600 hover:bg-amber-50"
                      : "border-green-300 text-green-600 hover:bg-green-50"
                  }`}
                >
                  {scheme.isActive ? "Deactivate" : "Activate"}
                </button>
                <button
                  onClick={() => handleDelete(scheme.id)}
                  className="rounded-lg border border-red-300 px-3 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-50"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
        {schemes.length === 0 && (
          <p className="text-sm text-slate-500">No schemes found. Click "Add New Scheme" to create one.</p>
        )}
      </div>
    </div>
  );
}
