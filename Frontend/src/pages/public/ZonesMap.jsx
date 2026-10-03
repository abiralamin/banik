import { useEffect, useState } from "react";
import api from "../../lib/api";
import Badge from "../../components/Badge";

export default function ZonesMap() {
  const [zones, setZones] = useState([]);
  const [area, setArea] = useState("");
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);

  const load = (areaFilter) => {
    setLoading(true);
    api
      .get("/api/public/zones", {
        params: areaFilter ? { area: areaFilter } : {},
      })
      .then((res) => setZones(res.data))
      .catch(() => setZones([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load("");
  }, []);

  const statusTone = { AVAILABLE: "green", PARTIAL: "amber", FULL: "red" };

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-slate-900">Vending Zones</h1>
      <p className="mt-2 text-slate-600">
        Browse available vending zones across the city and check occupancy in
        real time.
      </p>

      <div className="mt-6 flex gap-3">
        <input
          value={area}
          onChange={(e) => setArea(e.target.value)}
          placeholder="Filter by area (e.g. Mirpur)"
          className="w-full max-w-xs rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none"
        />
        <button
          onClick={() => load(area)}
          className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-700"
        >
          Search
        </button>
      </div>

      {loading && <p className="mt-8 text-slate-500">Loading zones…</p>}
      {!loading && zones.length === 0 && (
        <p className="mt-8 text-slate-500">
          No zones found. Try a different area.
        </p>
      )}

      <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2">
        {zones.map((z) => (
          <button
            key={z.id}
            onClick={() => setSelected(z)}
            className="rounded-xl border border-slate-200 bg-white p-5 text-left shadow-sm transition hover:shadow-md"
          >
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-semibold text-slate-900">{z.name}</h3>
                <p className="text-sm text-slate-500">{z.area}</p>
              </div>
              <Badge tone={statusTone[z.status] || "slate"}>{z.status}</Badge>
            </div>
            <p className="mt-3 text-sm text-slate-600">{z.description}</p>
            <div className="mt-3 flex flex-wrap gap-2 text-xs text-slate-500">
              <span>
                Spots: {z.occupiedSpots}/{z.totalSpots}
              </span>
              {z.hasElectricity && <span>⚡ Electricity</span>}
              {z.hasWater && <span>💧 Water</span>}
              {z.hasShade && <span>⛱ Shade</span>}
            </div>
          </button>
        ))}
      </div>

      {selected && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 sm:items-center sm:p-4"
          onClick={() => setSelected(null)}
        >
          <div
            className="w-full max-w-lg rounded-t-2xl bg-white p-6 shadow-xl sm:rounded-xl sm:p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between">
              <h2 className="text-lg font-bold text-slate-900">
                {selected.name}
              </h2>
              <button
                onClick={() => setSelected(null)}
                className="text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            </div>
            <p className="mt-1 text-sm text-slate-500">
              {selected.area} · {selected.zoneType}
            </p>
            <p className="mt-3 text-sm text-slate-600">
              {selected.description}
            </p>
            <dl className="mt-4 grid grid-cols-2 gap-3 text-sm">
              <div>
                <dt className="text-slate-500">Dimensions</dt>
                <dd className="font-medium">{selected.dimensionsSqm} sqm</dd>
              </div>
              <div>
                <dt className="text-slate-500">Operating Hours</dt>
                <dd className="font-medium">{selected.operatingHours}</dd>
              </div>
              <div>
                <dt className="text-slate-500">Nearby Landmarks</dt>
                <dd className="font-medium">{selected.nearbyLandmarks}</dd>
              </div>
              <div>
                <dt className="text-slate-500">Supervisor</dt>
                <dd className="font-medium">
                  {selected.supervisorName} ({selected.supervisorContact})
                </dd>
              </div>
              <div>
                <dt className="text-slate-500">Daily Fee</dt>
                <dd className="font-medium">৳{selected.priceDaily}</dd>
              </div>
              <div>
                <dt className="text-slate-500">Monthly Fee</dt>
                <dd className="font-medium">৳{selected.priceMonthly}</dd>
              </div>
            </dl>
            {selected.latitude && selected.longitude && (
              <a
                className="mt-4 inline-block text-sm font-semibold text-brand-600 hover:underline"
                target="_blank"
                rel="noreferrer"
                href={`https://www.google.com/maps/search/?api=1&query=${selected.latitude},${selected.longitude}`}
              >
                Get Directions →
              </a>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
