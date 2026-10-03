import { useEffect, useState } from "react";
import api from "../../lib/api";

export default function AdminFeedback() {
  const [feedback, setFeedback] = useState([]);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    loadFeedback();
  }, []);

  const loadFeedback = () => {
    api
      .get("/api/feedback")
      .then((res) => setFeedback(res.data))
      .catch(() => setFeedback([]));
  };

  const filteredFeedback = feedback.filter((f) => {
    if (filter === "all") return true;
    if (filter === "anonymous") return f.isAnonymous;
    if (filter === "identified") return !f.isAnonymous;
    return true;
  });

  const renderStars = (rating) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <span
            key={star}
            className={`text-lg ${
              star <= rating ? "text-yellow-400" : "text-gray-300"
            }`}
          >
            ★
          </span>
        ))}
      </div>
    );
  };

  return (
    <div>
      <div className="flex flex-wrap items-center gap-3">
        <h2 className="text-lg font-semibold text-slate-900">Vendor Feedback</h2>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="input max-w-xs"
        >
          <option value="all">All Feedback</option>
          <option value="identified">Identified</option>
          <option value="anonymous">Anonymous</option>
        </select>
      </div>

      <div className="mt-6">
        {filteredFeedback.length === 0 ? (
          <div className="rounded-xl border border-slate-200 bg-white p-6 text-center">
            <p className="text-sm text-slate-500">No feedback found.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredFeedback.map((f) => (
              <div
                key={f.id}
                className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      {renderStars(f.rating)}
                      <span className="text-xs text-slate-500">
                        {new Date(f.createdAt).toLocaleString()}
                      </span>
                      {f.isAnonymous && (
                        <span className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded">
                          Anonymous
                        </span>
                      )}
                    </div>
                    
                    {!f.isAnonymous && (
                      <div className="mt-2 text-sm">
                        <span className="font-medium text-slate-900">
                          {f.vendorName}
                        </span>
                        <span className="text-slate-500 ml-2">
                          ({f.vendorEmail})
                        </span>
                      </div>
                    )}

                    {f.message && (
                      <p className="mt-3 text-sm text-slate-600">{f.message}</p>
                    )}

                    {f.featureRequest && (
                      <div className="mt-3 p-3 bg-brand-50 rounded-lg">
                        <p className="text-xs font-medium text-brand-700 mb-1">
                          Feature Request:
                        </p>
                        <p className="text-sm text-slate-700">{f.featureRequest}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}