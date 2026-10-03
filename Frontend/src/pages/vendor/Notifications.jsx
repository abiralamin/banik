import { useEffect, useState } from "react";
import api from "../../lib/api";
import NotificationDetail from "./NotificationDetail";

export default function Notifications() {
  const [announcements, setAnnouncements] = useState([]);
  const [selectedAnnouncement, setSelectedAnnouncement] = useState(null);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    loadAnnouncements();
    loadUnreadCount();
  }, []);

  const loadAnnouncements = () => {
    api
      .get("/api/announcements")
      .then((res) => setAnnouncements(res.data))
      .catch(() => {});
  };

  const loadUnreadCount = () => {
    api
      .get("/api/announcements/unread-count")
      .then((res) => {
        setUnreadCount(res.data.count);
        // Trigger event to update sidebar count
        window.dispatchEvent(new CustomEvent('refreshUnreadCount'));
      })
      .catch(() => {});
  };

  const handleMarkAsRead = (updatedAnnouncementId, isReadStatus = true) => {
    // Update the specific announcement in the list
    setAnnouncements(prevAnnouncements =>
      prevAnnouncements.map(a =>
        a.id === updatedAnnouncementId ? { ...a, isRead: isReadStatus } : a
      )
    );
    loadUnreadCount();
    // Trigger event to update sidebar count
    window.dispatchEvent(new CustomEvent('refreshUnreadCount'));
  };

  const handleAnnouncementClick = (announcement) => {
    setSelectedAnnouncement(announcement);
  };

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">
            Notifications
          </h2>
          <p className="text-sm text-slate-500">
            {unreadCount} unread notification{unreadCount !== 1 ? "s" : ""}
          </p>
        </div>
      </div>

      <div className="mt-6 space-y-4">
        {announcements.map((a) => (
          <div
            key={a.id}
            onClick={() => handleAnnouncementClick(a)}
            className={`cursor-pointer rounded-xl border p-5 shadow-sm transition-colors hover:border-brand-400 hover:bg-brand-50/40 ${
              a.isRead
                ? "border-slate-200 bg-white"
                : "border-brand-400 bg-brand-50"
            }`}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  {!a.isRead && (
                    <span className="h-2 w-2 rounded-full bg-brand-600" />
                  )}
                  <h3 className="font-semibold text-slate-900">{a.title}</h3>
                </div>
                <p className="mt-2 text-sm text-slate-600 line-clamp-2">
                  {a.message}
                </p>
                <p className="mt-3 text-xs text-slate-500">
                  {new Date(a.createdAt).toLocaleString()}
                </p>
              </div>
              <div className="ml-4">
                <span className="text-brand-600">→</span>
              </div>
            </div>
          </div>
        ))}
        {announcements.length === 0 && (
          <p className="text-sm text-slate-500">No notifications found.</p>
        )}
      </div>

      {selectedAnnouncement && (
        <NotificationDetail
          announcement={selectedAnnouncement}
          onClose={() => setSelectedAnnouncement(null)}
          onMarkAsRead={handleMarkAsRead}
        />
      )}
    </div>
  );
}
