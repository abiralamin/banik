import { useEffect, useState } from "react";
import api from "../../lib/api";

export default function Feedback() {
  const [myFeedback, setMyFeedback] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    rating: 5,
    message: "",
    featureRequest: "",
    isAnonymous: false,
  });

  useEffect(() => {
    loadMyFeedback();
  }, []);

  const loadMyFeedback = () => {
    api
      .get("/api/feedback/my")
      .then((res) => setMyFeedback(res.data))
      .catch(() => {});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post("/api/feedback", form);
      setShowForm(false);
      setForm({
        rating: 5,
        message: "",
        featureRequest: "",
        isAnonymous: false,
      });
      loadMyFeedback();
      alert("Thank you for your feedback!");
    } catch (err) {
      console.error("Failed to submit feedback", err);
      alert("Failed to submit feedback. Please try again.");
    }
  };

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
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-slate-900">Feedback</h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-700"
        >
          {showForm ? "Cancel" : "Submit Feedback"}
        </button>
      </div>

      {showForm && (
        <div className="mt-6 rounded-xl border border-slate-200 bg-white p-6">
          <h3 className="font-semibold text-slate-900">Submit Your Feedback</h3>
          <form onSubmit={handleSubmit} className="mt-4 space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700">
                Rating
              </label>
              <div className="mt-1 flex gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setForm({ ...form, rating: star })}
                    className={`text-2xl ${
                      star <= form.rating ? "text-yellow-400" : "text-gray-300"
                    } hover:text-yellow-400`}
                  >
                    ★
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700">
                Your Message
              </label>
              <textarea
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                className="input mt-1"
                rows={4}
                placeholder="Share your experience with Banik..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700">
                Feature Request (optional)
              </label>
              <textarea
                value={form.featureRequest}
                onChange={(e) =>
                  setForm({ ...form, featureRequest: e.target.value })
                }
                className="input mt-1"
                rows={2}
                placeholder="Suggest features you'd like to see..."
              />
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={form.isAnonymous}
                onChange={(e) =>
                  setForm({ ...form, isAnonymous: e.target.checked })
                }
              />
              <label className="text-sm font-medium text-slate-700">
                Submit anonymously
              </label>
            </div>
            <button
              type="submit"
              className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-700"
            >
              Submit Feedback
            </button>
          </form>
        </div>
      )}

      <div className="mt-6">
        <h3 className="font-semibold text-slate-900">My Feedback History</h3>
        <div className="mt-4 space-y-3">
          {myFeedback.map((f) => (
            <div
              key={f.id}
              className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm"
            >
              <div className="flex items-start justify-between">
                <div>
                  {renderStars(f.rating)}
                  {f.message && (
                    <p className="mt-2 text-sm text-slate-600">{f.message}</p>
                  )}
                  {f.featureRequest && (
                    <div className="mt-2">
                      <p className="text-xs font-medium text-slate-500">
                        Feature Request:
                      </p>
                      <p className="text-sm text-slate-600">{f.featureRequest}</p>
                    </div>
                  )}
                  <p className="mt-2 text-xs text-slate-500">
                    {new Date(f.createdAt).toLocaleString()}
                    {f.isAnonymous && " · Anonymous"}
                  </p>
                </div>
              </div>
            </div>
          ))}
          {myFeedback.length === 0 && (
            <p className="text-sm text-slate-500">
              No feedback submitted yet. Share your thoughts!
            </p>
          )}
        </div>
      </div>
    </div>
  );
}