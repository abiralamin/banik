import { useState } from "react";
import api from "../../lib/api";

export default function NotificationDetail({ announcement, onClose, onMarkAsRead }) {
  const [isRead, setIsRead] = useState(announcement.isRead || false);

  const handleMarkAsRead = () => {
    api.post(`/api/announcements/${announcement.id}/read`)
      .then(() => {
        setIsRead(true);
        onMarkAsRead(announcement.id);
      })
      .catch(() => {});
  };

  const handleMarkAsUnread = () => {
    api.post(`/api/announcements/${announcement.id}/unread`)
      .then(() => {
        setIsRead(false);
        onMarkAsRead(announcement.id, false);
      })
      .catch(() => {});
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 sm:items-center sm:p-4">
      <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-t-2xl bg-white p-6 shadow-xl sm:rounded-xl">
        <div className="flex items-start justify-between">
          <h2 className="text-xl font-semibold text-slate-900">
            {announcement.title}
          </h2>
          <button
            onClick={onClose}
            className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="mt-4">
          <div className="flex items-center gap-2">
            <span
              className={`rounded-full px-2 py-0.5 text-xs font-semibold ${
                isRead
                  ? "bg-slate-100 text-slate-600"
                  : "bg-brand-100 text-brand-700"
              }`}
            >
              {isRead ? "Read" : "Unread"}
            </span>
            <span className="text-xs text-slate-500">
              {new Date(announcement.createdAt).toLocaleString()}
            </span>
          </div>
        </div>

        <div className="mt-6 max-h-96 overflow-y-auto">
          <p className="text-slate-700 whitespace-pre-line leading-relaxed">
            {announcement.message}
          </p>
        </div>

        <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:justify-end">
          {!isRead ? (
            <button
              onClick={handleMarkAsRead}
              className="w-full rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-700 sm:w-auto"
            >
              Mark as Read
            </button>
          ) : (
            <button
              onClick={handleMarkAsUnread}
              className="w-full rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 sm:w-auto"
            >
              Mark as Unread
            </button>
          )}
          <button
            onClick={onClose}
            className="w-full rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 sm:w-auto"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
