import { useEffect, useState } from "react";
import api from "../../lib/api";
import Badge from "../../components/Badge";

const statusTone = { AVAILABLE: "green", PARTIAL: "amber", FULL: "red" };

const emptyForm = {
  name: "",
  area: "",
  zoneType: "",
  description: "",
  totalSpots: 10,
  hasElectricity: false,
  hasWater: false,
  hasShade: false,
  nearbyLandmarks: "",
  operatingHours: "",
  rules: "",
  supervisorName: "",
  supervisorContact: "",
  priceDaily: 0,
  priceWeekly: 0,
  priceMonthly: 0,
  priceAnnual: 0,
};

export default function AdminZones() {
  const [zones, setZones] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);

  const load = () =>
    api
      .get("/api/admin/zones")
      .then((res) => setZones(res.data))
      .catch(() => {});
  useEffect(() => {
    load();
  }, []);

  const openCreate = () => {
    setForm(emptyForm);
    setEditingId(null);
    setShowForm(true);
  };
  const openEdit = (z) => {
    setForm(z);
    setEditingId(z.id);
    setShowForm(true);
  };

  const save = async (e) => {
    e.preventDefault();
    if (editingId) {
      await api.put(`/api/admin/zones/${editingId}`, form);
    } else {
      await api.post("/api/admin/zones", form);
    }
    setShowForm(false);
    load();
  };

  const markUnavailable = async (id) => {
    await api.delete(`/api/admin/zones/${id}`);
    load();
  };

  const field = (label, key, type = "text") => (
    <div>
      <label className="text-xs font-medium text-slate-600">{label}</label>
      <input
        type={type}
        value={form[key]}
        onChange={(e) =>
          setForm((f) => ({
            ...f,
            [key]: type === "number" ? Number(e.target.value) : e.target.value,
          }))
        }
        className="input"
      />
    </div>
  );

  return (
    <div>
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-slate-900">
          Zone &amp; Location Management
        </h2>
        <button
          onClick={openCreate}
          className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white"
        >
          Add Zone
        </button>
      </div>

      {/* Desktop Table */}
      <div className="mt-6 hidden rounded-xl border border-slate-200 bg-white md:block">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 text-xs uppercase text-slate-500">
            <tr>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Area</th>
              <th className="px-4 py-3">Total</th>
              <th className="px-4 py-3">Occupied</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {zones.map((z) => (
              <tr key={z.id} className="border-t border-slate-100">
                <td className="px-4 py-3">{z.name}</td>
                <td className="px-4 py-3">{z.area}</td>
                <td className="px-4 py-3">{z.totalSpots}</td>
                <td className="px-4 py-3">{z.occupiedSpots}</td>
                <td className="px-4 py-3">
                  <Badge tone={statusTone[z.status] || "slate"}>
                    {z.status}
                  </Badge>
                </td>
                <td className="px-4 py-3 space-x-2">
                  <button
                    onClick={() => openEdit(z)}
                    className="text-brand-600 hover:underline"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => markUnavailable(z.id)}
                    className="text-red-600 hover:underline"
                  >
                    Deactivate
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Card Layout */}
      <div className="mt-6 space-y-4 md:hidden">
        {zones.map((z) => (
          <div key={z.id} className="rounded-xl border border-slate-200 bg-white p-4">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-semibold text-slate-900">{z.name}</h3>
                <p className="text-sm text-slate-500">{z.area}</p>
              </div>
              <Badge tone={statusTone[z.status] || "slate"}>
                {z.status}
              </Badge>
            </div>
            <div className="mt-3 grid grid-cols-2 gap-2 text-sm">
              <div>
                <span className="text-slate-500">Total Spots:</span>
                <span className="ml-1 font-medium">{z.totalSpots}</span>
              </div>
              <div>
                <span className="text-slate-500">Occupied:</span>
                <span className="ml-1 font-medium">{z.occupiedSpots}</span>
              </div>
            </div>
            <div className="mt-3 flex gap-2">
              <button
                onClick={() => openEdit(z)}
                className="flex-1 rounded-lg bg-brand-600 px-3 py-2 text-sm font-semibold text-white hover:bg-brand-700"
              >
                Edit
              </button>
              <button
                onClick={() => markUnavailable(z.id)}
                className="flex-1 rounded-lg border border-red-300 px-3 py-2 text-sm font-semibold text-red-600 hover:bg-red-50"
              >
                Deactivate
              </button>
            </div>
          </div>
        ))}
      </div>

      {showForm && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 sm:items-center sm:p-4"
          onClick={() => setShowForm(false)}
        >
          <form
            onSubmit={save}
            className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-t-2xl bg-white p-6 sm:rounded-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="font-semibold text-slate-900">
              {editingId ? "Edit Zone" : "Add Zone"}
            </h3>
            <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
              {field("Name", "name")}
              {field("Area", "area")}
              {field("Zone Type", "zoneType")}
              {field("Total Spots", "totalSpots", "number")}
              {field("Operating Hours", "operatingHours")}
              {field("Nearby Landmarks", "nearbyLandmarks")}
              {field("Supervisor Name", "supervisorName")}
              {field("Supervisor Contact", "supervisorContact")}
              {field("Price Daily", "priceDaily", "number")}
              {field("Price Weekly", "priceWeekly", "number")}
              {field("Price Monthly", "priceMonthly", "number")}
              {field("Price Annual", "priceAnnual", "number")}
            </div>
            <div className="mt-3">
              <label className="text-xs font-medium text-slate-600">
                Description
              </label>
              <textarea
                value={form.description}
                onChange={(e) =>
                  setForm((f) => ({ ...f, description: e.target.value }))
                }
                className="input"
                rows={2}
              />
            </div>
            <div className="mt-3 flex gap-4 text-sm">
              <label className="flex items-center gap-1">
                <input
                  type="checkbox"
                  checked={form.hasElectricity}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, hasElectricity: e.target.checked }))
                  }
                />{" "}
                Electricity
              </label>
              <label className="flex items-center gap-1">
                <input
                  type="checkbox"
                  checked={form.hasWater}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, hasWater: e.target.checked }))
                  }
                />{" "}
                Water
              </label>
              <label className="flex items-center gap-1">
                <input
                  type="checkbox"
                  checked={form.hasShade}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, hasShade: e.target.checked }))
                  }
                />{" "}
                Shade
              </label>
            </div>
            <div className="mt-6 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="rounded-lg border border-slate-300 px-4 py-2 text-sm"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white"
              >
                Save
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
