export default function StatCard({ label, value, accent = "brand", onClick }) {
  const colors = {
    brand: "text-brand-700 bg-brand-50",
    green: "text-emerald-700 bg-emerald-50",
    amber: "text-amber-700 bg-amber-50",
    red: "text-red-700 bg-red-50",
  };
  return (
    <div 
      className={`rounded-xl border border-slate-200 bg-white p-4 shadow-sm ${onClick ? 'cursor-pointer hover:border-brand-400 hover:shadow-md transition-all' : ''}`}
      onClick={onClick}
    >
      <p className="text-sm text-slate-500">{label}</p>
      <p
        className={`mt-2 inline-block rounded-md px-2 py-1 text-2xl font-bold ${colors[accent] || colors.brand}`}
      >
        {value}
      </p>
    </div>
  );
}
