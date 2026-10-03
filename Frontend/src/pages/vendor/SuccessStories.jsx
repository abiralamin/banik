import { useEffect, useState } from "react";
import api from "../../lib/api";

export default function SuccessStories() {
  const [stories, setStories] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    title: "",
    content: "",
    isSuccessStory: true,
  });
  const [expandedComments, setExpandedComments] = useState({});

  useEffect(() => {
    loadStories();
  }, []);

  const loadStories = () => {
    api
      .get("/api/success-stories")
      .then((res) => setStories(res.data))
      .catch(() => {});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post("/api/success-stories", form);
      setShowForm(false);
      setForm({ title: "", content: "", isSuccessStory: true });
      loadStories();
      alert("Success story submitted successfully!");
    } catch (err) {
      console.error("Failed to submit success story", err);
      alert("Failed to submit success story.");
    }
  };

  const handleLike = async (storyId) => {
    try {
      const res = await api.post(`/api/success-stories/${storyId}/like`);
      setStories(stories.map(s => s.id === storyId ? res.data : s));
    } catch (err) {
      console.error("Failed to like story", err);
    }
  };

  const handleComment = async (storyId, content) => {
    if (!content.trim()) return;
    try {
      await api.post(`/api/success-stories/${storyId}/comments`, { content });
      loadStories();
    } catch (err) {
      console.error("Failed to add comment", err);
      alert("Failed to add comment.");
    }
  };

  const toggleComments = (storyId) => {
    setExpandedComments(prev => ({
      ...prev,
      [storyId]: !prev[storyId]
    }));
  };

  return (
    <div>
      <div className="mb-6 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 p-6 text-white">
        <h2 className="text-xl font-bold">Success Stories</h2>
        <p className="mt-1 text-amber-100">
          Inspiring stories from fellow vendors - share your journey and get inspired!
        </p>
      </div>

      <div className="mb-6 flex gap-3">
        <button
          onClick={() => setShowForm(!showForm)}
          className="rounded-lg bg-amber-600 px-4 py-2 text-sm font-semibold text-white hover:bg-amber-700"
        >
          {showForm ? "Cancel" : "Share Your Success Story"}
        </button>
      </div>

      {showForm && (
        <div className="mb-6 rounded-xl border border-amber-200 bg-white p-6">
          <h3 className="font-semibold text-slate-900">Share Your Success Story</h3>
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
                Your Success Story
              </label>
              <textarea
                required
                value={form.content}
                onChange={(e) => setForm({ ...form, content: e.target.value })}
                className="input mt-1"
                rows={4}
                placeholder="Share your success story, achievements, and what helped you succeed..."
              />
            </div>
            <button
              type="submit"
              className="rounded-lg bg-amber-600 px-4 py-2 text-sm font-semibold text-white hover:bg-amber-700"
            >
              Share Story
            </button>
          </form>
        </div>
      )}

      <div className="space-y-4">
        {stories.map((story) => (
          <div
            key={story.id}
            className="rounded-xl border border-amber-200 bg-amber-50 p-6 shadow-sm"
          >
            <div className="flex items-center gap-2 mb-2">
              <span className="rounded-full bg-amber-500 px-2 py-0.5 text-xs font-semibold text-white">
                SUCCESS STORY
              </span>
              <h4 className="font-semibold text-slate-900">{story.title}</h4>
            </div>
            <p className="text-sm text-slate-600">{story.content}</p>
            <p className="mt-2 text-xs text-slate-500">
              By {story.vendorName} · {new Date(story.createdAt).toLocaleDateString()}
            </p>
            
            <div className="mt-4 flex items-center gap-4">
              <button
                onClick={() => handleLike(story.id)}
                className={`flex items-center gap-1 text-sm ${
                  story.isLikedByCurrentUser 
                    ? "text-red-600 font-semibold" 
                    : "text-slate-600 hover:text-red-600"
                }`}
              >
                <span>{story.isLikedByCurrentUser ? "❤️" : "🤍"}</span>
                <span>{story.likesCount}</span>
              </button>
              <button
                onClick={() => toggleComments(story.id)}
                className="flex items-center gap-1 text-sm text-slate-600 hover:text-slate-900"
              >
                <span>💬</span>
                <span>{story.commentsCount} Comments</span>
              </button>
            </div>

            {expandedComments[story.id] && (
              <div className="mt-4 border-t border-amber-200 pt-4">
                <div className="space-y-3 mb-4">
                  {story.comments && story.comments.length > 0 ? (
                    story.comments.map((comment) => (
                      <div key={comment.id} className="bg-white rounded-lg p-3 border border-slate-200">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-semibold text-slate-900">{comment.userName}</span>
                          <span className="text-xs text-slate-500">
                            {new Date(comment.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="text-sm text-slate-600 mt-1">{comment.content}</p>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-slate-500">No comments yet. Be the first to comment!</p>
                  )}
                </div>
                
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Add a comment..."
                    className="input flex-1"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        handleComment(story.id, e.target.value);
                        e.target.value = '';
                      }
                    }}
                  />
                  <button
                    onClick={(e) => {
                      const input = e.target.previousElementSibling;
                      handleComment(story.id, input.value);
                      input.value = '';
                    }}
                    className="rounded-lg bg-amber-600 px-4 py-2 text-sm font-semibold text-white hover:bg-amber-700"
                  >
                    Post
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
        {stories.length === 0 && (
          <p className="text-sm text-slate-500">No success stories shared yet. Be the first to share your journey!</p>
        )}
      </div>
    </div>
  );
}
