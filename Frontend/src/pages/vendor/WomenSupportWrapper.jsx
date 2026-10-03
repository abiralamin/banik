import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../lib/api";

export default function WomenSupportWrapper() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("support");

  useEffect(() => {
    api
      .get("/api/vendor/profile")
      .then((res) => {
        setProfile(res.data);
        setLoading(false);
        
        // Check if user is female
        if (res.data.gender !== "FEMALE") {
          alert("This feature is only available for women vendors. Redirecting to Success Stories.");
          navigate("/vendor/success-stories");
        }
      })
      .catch(() => {
        setLoading(false);
        alert("Failed to load profile information");
        navigate("/vendor/dashboard");
      });
  }, [navigate]);

  if (loading) {
    return <p className="text-sm text-slate-500">Loading...</p>;
  }

  const tabs = [
    { id: "support", label: "Support & Schemes" },
    { id: "community", label: "Community Forum" },
    { id: "safety", label: "Safety & Help" },
  ];

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-slate-900">Women Vendor Support</h2>
        <p className="text-sm text-slate-500">
          Special features and support for women vendors
        </p>
      </div>

      <div className="mb-6 flex gap-2">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`rounded-lg px-4 py-2 text-sm font-semibold ${
              activeTab === tab.id
                ? "bg-purple-600 text-white"
                : "border border-slate-300 text-slate-700 hover:bg-slate-50"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="mt-6">
        {activeTab === "support" && <WomenSupportComponent />}
        {activeTab === "community" && <WomenCommunityComponent />}
        {activeTab === "safety" && <WomenSafetyComponent />}
      </div>
    </div>
  );
}

// Inline components to avoid circular imports
function WomenSupportComponent() {
  const [schemes, setSchemes] = useState([]);

  useEffect(() => {
    api
      .get("/api/women-support/schemes")
      .then((res) => setSchemes(res.data))
      .catch(() => {});
  }, []);

  return (
    <div>
      <div className="mb-6 rounded-xl bg-gradient-to-r from-pink-500 to-purple-600 p-6 text-white">
        <h2 className="text-xl font-bold">Women's Support</h2>
        <p className="mt-1 text-pink-100">
          Special schemes, subsidies, and grants for women vendors
        </p>
      </div>

      <div className="space-y-4">
        {schemes.map((scheme) => (
          <div
            key={scheme.id}
            className="rounded-xl border border-pink-200 bg-white p-6 shadow-sm"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className="font-semibold text-slate-900">{scheme.title}</h3>
                <p className="mt-2 text-sm text-slate-600">{scheme.description}</p>
                
                <div className="mt-4 space-y-2">
                  <div>
                    <p className="text-xs font-medium text-slate-500">Benefits:</p>
                    <p className="text-sm text-slate-700">{scheme.benefits}</p>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-slate-500">Eligibility:</p>
                    <p className="text-sm text-slate-700">{scheme.eligibilityCriteria}</p>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-slate-500">Application Process:</p>
                    <p className="text-sm text-slate-700">{scheme.applicationProcess}</p>
                  </div>
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
              </div>
            </div>
          </div>
        ))}
        {schemes.length === 0 && (
          <p className="text-sm text-slate-500">No schemes available at the moment.</p>
        )}
      </div>
    </div>
  );
}

function WomenCommunityComponent() {
  const [posts, setPosts] = useState([]);
  const [successStories, setSuccessStories] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    title: "",
    content: "",
    isSuccessStory: false,
  });
  const [expandedComments, setExpandedComments] = useState({});

  useEffect(() => {
    loadPosts();
    loadSuccessStories();
  }, []);

  const loadPosts = () => {
    api
      .get("/api/women-support/community/posts")
      .then((res) => setPosts(res.data))
      .catch(() => {});
  };

  const loadSuccessStories = () => {
    api
      .get("/api/women-support/community/success-stories")
      .then((res) => setSuccessStories(res.data))
      .catch(() => {});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post("/api/women-support/community/posts", form);
      setShowForm(false);
      setForm({ title: "", content: "", isSuccessStory: false });
      loadPosts();
      if (form.isSuccessStory) {
        loadSuccessStories();
      }
      alert("Post submitted successfully!");
    } catch (err) {
      console.error("Failed to submit post", err);
      alert("Failed to submit post. You may not have access to this feature.");
    }
  };

  const handleLike = async (storyId) => {
    try {
      const res = await api.post(`/api/women-support/community/success-stories/${storyId}/like`);
      setSuccessStories(successStories.map(s => s.id === storyId ? res.data : s));
    } catch (err) {
      console.error("Failed to like story", err);
    }
  };

  const handleComment = async (storyId, content) => {
    if (!content.trim()) return;
    try {
      await api.post(`/api/women-support/community/success-stories/${storyId}/comments`, { content });
      loadSuccessStories();
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
      <div className="mb-6 rounded-xl bg-gradient-to-r from-purple-500 to-indigo-600 p-6 text-white">
        <h2 className="text-xl font-bold">Women's Community</h2>
        <p className="mt-1 text-purple-100">
          Share experiences, success stories, and get mentorship
        </p>
      </div>

      <div className="mb-6 flex gap-3">
        <button
          onClick={() => setShowForm(!showForm)}
          className="rounded-lg bg-purple-600 px-4 py-2 text-sm font-semibold text-white hover:bg-purple-700"
        >
          {showForm ? "Cancel" : "Share Your Story"}
        </button>
      </div>

      {showForm && (
        <div className="mb-6 rounded-xl border border-purple-200 bg-white p-6">
          <h3 className="font-semibold text-slate-900">Share Your Experience</h3>
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
                Your Story
              </label>
              <textarea
                required
                value={form.content}
                onChange={(e) => setForm({ ...form, content: e.target.value })}
                className="input mt-1"
                rows={4}
                placeholder="Share your experience, tips, or success story..."
              />
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={form.isSuccessStory}
                onChange={(e) =>
                  setForm({ ...form, isSuccessStory: e.target.checked })
                }
              />
              <label className="text-sm font-medium text-slate-700">
                This is a success story
              </label>
            </div>
            <button
              type="submit"
              className="rounded-lg bg-purple-600 px-4 py-2 text-sm font-semibold text-white hover:bg-purple-700"
            >
              Share
            </button>
          </form>
        </div>
      )}

      <div className="mb-8">
        <h3 className="font-semibold text-slate-900 mb-4">Success Stories</h3>
        <div className="space-y-4">
          {successStories.map((post) => (
            <div
              key={post.id}
              className="rounded-xl border border-amber-200 bg-amber-50 p-6 shadow-sm"
            >
              <div className="flex items-center gap-2 mb-2">
                <span className="rounded-full bg-amber-500 px-2 py-0.5 text-xs font-semibold text-white">
                  SUCCESS STORY
                </span>
                <h4 className="font-semibold text-slate-900">{post.title}</h4>
              </div>
              <p className="text-sm text-slate-600">{post.content}</p>
              <p className="mt-2 text-xs text-slate-500">
                By {post.vendorName} · {new Date(post.createdAt).toLocaleDateString()}
              </p>
              
              <div className="mt-4 flex items-center gap-4">
                <button
                  onClick={() => handleLike(post.id)}
                  className={`flex items-center gap-1 text-sm ${
                    post.isLikedByCurrentUser 
                      ? "text-red-600 font-semibold" 
                      : "text-slate-600 hover:text-red-600"
                  }`}
                >
                  <span>{post.isLikedByCurrentUser ? "❤️" : "🤍"}</span>
                  <span>{post.likesCount}</span>
                </button>
                <button
                  onClick={() => toggleComments(post.id)}
                  className="flex items-center gap-1 text-sm text-slate-600 hover:text-slate-900"
                >
                  <span>💬</span>
                  <span>{post.commentsCount} Comments</span>
                </button>
              </div>

              {expandedComments[post.id] && (
                <div className="mt-4 border-t border-amber-200 pt-4">
                  <div className="space-y-3 mb-4">
                    {post.comments && post.comments.length > 0 ? (
                      post.comments.map((comment) => (
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
                          handleComment(post.id, e.target.value);
                          e.target.value = '';
                        }
                      }}
                    />
                    <button
                      onClick={(e) => {
                        const input = e.target.previousElementSibling;
                        handleComment(post.id, input.value);
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
          {successStories.length === 0 && (
            <p className="text-sm text-slate-500">No success stories shared yet.</p>
          )}
        </div>
      </div>

      <div>
        <h3 className="font-semibold text-slate-900 mb-4">Community Posts</h3>
        <div className="space-y-4">
          {posts.map((post) => (
            <div
              key={post.id}
              className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm"
            >
              <h4 className="font-semibold text-slate-900">{post.title}</h4>
              <p className="mt-2 text-sm text-slate-600">{post.content}</p>
              <p className="mt-2 text-xs text-slate-500">
                By {post.vendorName} · {new Date(post.createdAt).toLocaleDateString()}
              </p>
            </div>
          ))}
          {posts.length === 0 && (
            <p className="text-sm text-slate-500">No community posts yet.</p>
          )}
        </div>
      </div>
    </div>
  );
}

function WomenSafetyComponent() {
  const [tips, setTips] = useState([]);

  useEffect(() => {
    api
      .get("/api/women-support/safety-tips")
      .then((res) => setTips(res.data))
      .catch(() => {});
  }, []);

  return (
    <div>
      <div className="mb-6 rounded-xl bg-gradient-to-r from-red-500 to-orange-600 p-6 text-white">
        <h2 className="text-xl font-bold">Safety & Help</h2>
        <p className="mt-1 text-red-100">
          Safety tips and emergency contact numbers
        </p>
      </div>

      <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-6">
        <h3 className="font-semibold text-red-800">Emergency Contacts</h3>
        <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div className="rounded-lg border border-red-300 bg-white p-4">
            <p className="font-semibold text-slate-900">Police Emergency</p>
            <p className="text-lg font-bold text-red-600">999</p>
          </div>
          <div className="rounded-lg border border-red-300 bg-white p-4">
            <p className="font-semibold text-slate-900">Women Helpline</p>
            <p className="text-lg font-bold text-red-600">999</p>
          </div>
          <div className="rounded-lg border border-red-300 bg-white p-4">
            <p className="font-semibold text-slate-900">Banik Support</p>
            <p className="text-lg font-bold text-brand-600">01712-345678</p>
          </div>
          <div className="rounded-lg border border-red-300 bg-white p-4">
            <p className="font-semibold text-slate-900">Local Zone In-charge</p>
            <p className="text-sm text-slate-600">Contact your zone supervisor</p>
          </div>
        </div>
      </div>

      <div>
        <h3 className="font-semibold text-slate-900 mb-4">Safety Tips</h3>
        <div className="space-y-4">
          {tips.map((tip) => (
            <div
              key={tip.id}
              className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    {tip.tipCategory && (
                      <span className="rounded-full bg-brand-100 px-2 py-0.5 text-xs font-semibold text-brand-700">
                        {tip.tipCategory}
                      </span>
                    )}
                    <h4 className="font-semibold text-slate-900">{tip.title}</h4>
                  </div>
                  <p className="mt-2 text-sm text-slate-600">{tip.content}</p>
                  {tip.emergencyContact && (
                    <div className="mt-3 rounded-lg bg-red-50 p-3">
                      <p className="text-xs font-medium text-red-700">
                        Emergency Contact: {tip.emergencyContact}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
          {tips.length === 0 && (
            <p className="text-sm text-slate-500">No safety tips available.</p>
          )}
        </div>
      </div>
    </div>
  );
}