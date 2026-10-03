import { useEffect, useState } from "react";
import api from "../../lib/api";
import Badge from "../../components/Badge";

const categoryTone = {
  POLICY_CHANGE: "red",
  NEW_FEATURE: "green",
  EVENT: "blue",
  HOLIDAY: "amber",
};

export default function Announcements() {
  const [announcements, setAnnouncements] = useState([]);

  useEffect(() => {
    api
      .get("/api/announcements")
      .then((res) => setAnnouncements(res.data))
      .catch(() => {});
  }, []);

  return (
    <div>
      <h2 className="text-lg font-semibold text-slate-900">Announcements</h2>
      <p className="text-sm text-slate-500">
        Stay updated with the latest news and updates
      </p>

      <div className="mt-6 space-y-4">
        {announcements.map((a) => (
          <div
            key={a.id}
            className={`rounded-xl border p-5 shadow-sm ${
              a.isPinned ? "border-brand-400 bg-brand-50" : "border-slate-200 bg-white"
            }`}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  {a.isPinned && (
                    <span className="rounded-full bg-brand-600 px-2 py-0.5 text-xs font-semibold text-white">
                      PINNED
                    </span>
                  )}
                  <h3 className="font-semibold text-slate-900">{a.title}</h3>
                </div>
                <p className="mt-2 text-sm text-slate-600 whitespace-pre-line">
                  {a.body}
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  <Badge tone={categoryTone[a.category] || "slate"}>
                    {a.category.replace("_", " ")}
                  </Badge>
                </div>
                {a.attachmentPath && (
                  <a
                    href={a.attachmentPath}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-3 block text-sm font-semibold text-brand-600 hover:underline"
                  >
                    Download Attachment
                  </a>
                )}
                <p className="mt-3 text-xs text-slate-500">
                  {new Date(a.createdAt).toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        ))}
        {announcements.length === 0 && (
          <p className="text-sm text-slate-500">No announcements available.</p>
        )}
      </div>
    </div>
  );
}