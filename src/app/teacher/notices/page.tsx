"use client";

import { useState, useEffect } from "react";
import { Bell, Plus, Pin, X, AlertCircle, Clock } from "lucide-react";
import { AnnouncementData } from "@/lib/types";

const CATEGORIES = ["NOTICE", "EVENT", "EXAM", "HOLIDAY"];

export default function TeacherNoticesPage() {
  const [announcements, setAnnouncements] = useState<AnnouncementData[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("NOTICE");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadNotices();
  }, []);

  const loadNotices = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/announcements");
      const data = await res.json();
      if (data && data.announcements) {
        setAnnouncements(data.announcements);
      }
    } catch {
      console.error("Failed to load announcements");
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) {
      setError("Title and content are required.");
      return;
    }

    setSaving(true);
    setError(null);

    try {
      const res = await fetch("/api/announcements", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, content, category, isPinned: false }),
      });

      const data = await res.json();
      if (!res.ok || !data.ok) {
        setError(data.error || "Failed to publish notice.");
      } else {
        setIsModalOpen(false);
        setTitle("");
        setContent("");
        loadNotices();
      }
    } catch {
      setError("Network error publishing notice.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <Bell className="w-6 h-6 text-[#1B2A4A]" />
            <span>Class & Academic Notices</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Post class syllabus notifications, test schedules, and homework reminders for students.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center gap-2 bg-[#1B2A4A] hover:bg-[#111C32] text-white px-4 py-2.5 rounded-xl text-xs font-bold shadow transition"
        >
          <Plus className="w-4 h-4 text-[#D4AF37]" />
          <span>Post New Circular</span>
        </button>
      </div>

      {/* Notices Feed */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-xs text-slate-500">Loading notices...</div>
        ) : announcements.length === 0 ? (
          <div className="p-12 text-center text-xs text-slate-500">No notices posted yet.</div>
        ) : (
          <div className="divide-y divide-slate-100">
            {announcements.map((a) => (
              <div key={a.id} className="p-5 sm:p-6 hover:bg-slate-50/50 transition">
                <div className="flex items-center gap-2 mb-2 flex-wrap">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 border border-slate-200 text-slate-700">
                    {a.category}
                  </span>
                  <span className="text-slate-400 text-xs flex items-center gap-1">
                    <Clock className="w-3 h-3" /> {a.date}
                  </span>
                </div>
                <h3 className="font-bold text-base text-slate-900">{a.title}</h3>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed whitespace-pre-line">
                  {a.content}
                </p>
                <p className="text-[11px] text-slate-400 mt-2">
                  Published by: <span className="font-semibold text-slate-600">{a.publishedBy}</span>
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Publish Notice Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-5">
              <h3 className="font-extrabold text-lg text-slate-900 flex items-center gap-2">
                <Bell className="w-5 h-5 text-[#1B2A4A]" />
                <span>Post Class Notice</span>
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-700 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {error && (
              <div className="bg-rose-50 border border-rose-200 text-rose-700 p-3 rounded-xl text-xs flex items-center gap-2 mb-4">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleCreate} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Notice Title</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Class 9 Physics Lab Practical Schedule"
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 font-medium text-slate-900 focus:bg-white focus:ring-2 focus:ring-[#1B2A4A]"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 font-medium text-slate-900 focus:bg-white focus:ring-2 focus:ring-[#1B2A4A]"
                >
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Notice Content</label>
                <textarea
                  rows={4}
                  required
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Enter notice details for students..."
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 font-medium text-slate-900 focus:bg-white focus:ring-2 focus:ring-[#1B2A4A]"
                />
              </div>

              <div className="pt-3 flex items-center justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-300 text-slate-700 font-bold hover:bg-slate-50 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2 rounded-xl bg-[#1B2A4A] text-white font-bold hover:bg-[#111C32] transition disabled:opacity-60"
                >
                  {saving ? "Posting..." : "Post Notice"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
