"use client";

import { useState, useEffect } from "react";
import { Bell, Search, Pin, Calendar, Tag, Filter, Clock } from "lucide-react";
import { AnnouncementData } from "@/lib/types";

const CATEGORIES = ["ALL", "NOTICE", "EVENT", "HOLIDAY", "EXAM"];

export default function AnnouncementsPage() {
  const [announcements, setAnnouncements] = useState<AnnouncementData[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("ALL");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchAnnouncements();
  }, [activeCategory]);

  const fetchAnnouncements = async () => {
    setLoading(true);
    try {
      const url = activeCategory === "ALL" ? "/api/announcements" : `/api/announcements?category=${activeCategory}`;
      const res = await fetch(url);
      const data = await res.json();
      if (data && data.announcements) {
        setAnnouncements(data.announcements);
      }
    } catch {
      console.error("Failed to load notices");
    } finally {
      setLoading(false);
    }
  };

  const filtered = announcements.filter((a) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return a.title.toLowerCase().includes(q) || a.content.toLowerCase().includes(q) || a.publishedBy.toLowerCase().includes(q);
  });

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto mb-8">
        <div className="inline-flex items-center gap-2 bg-[#FCF9EE] border border-[#D4AF37] px-3.5 py-1 rounded-full text-xs font-bold text-[#1B2A4A] mb-3">
          <Bell className="w-3.5 h-3.5 text-[#D4AF37]" />
          <span>School Circulars & Notifications</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1B2A4A] tracking-tight">
          Announcements & Event Board
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 mt-2">
          Stay up to date with official school schedule changes, examination dates, sports galas, and holiday notices.
        </p>
      </div>

      {/* Filter and Search Controls */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-4 sm:p-5 mb-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Category Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition shrink-0 ${
                activeCategory === cat
                  ? "bg-[#1B2A4A] text-[#D4AF37] shadow"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {cat === "ALL" ? "All Notices" : cat}
            </button>
          ))}
        </div>

        {/* Search Box */}
        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search circulars..."
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#1B2A4A]"
          />
        </div>
      </div>

      {/* Announcements Feed */}
      {loading ? (
        <div className="text-center py-16 text-slate-500 text-xs">
          Loading school notices...
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center border border-slate-200 max-w-md mx-auto">
          <Bell className="w-10 h-10 text-slate-300 mx-auto mb-3" />
          <h3 className="font-bold text-slate-800 text-base">No announcements found</h3>
          <p className="text-xs text-slate-500 mt-1">
            There are currently no active announcements in this category.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((item) => {
            const categoryBadge = {
              NOTICE: "bg-blue-50 text-blue-800 border-blue-200",
              EVENT: "bg-emerald-50 text-emerald-800 border-emerald-200",
              HOLIDAY: "bg-amber-50 text-amber-800 border-amber-200",
              EXAM: "bg-purple-50 text-purple-800 border-purple-200",
            }[item.category] || "bg-slate-100 text-slate-800 border-slate-200";

            return (
              <div
                key={item.id}
                className={`p-6 rounded-2xl border transition-all duration-200 hover:shadow-md ${
                  item.isPinned
                    ? "bg-[#FCF9EE]/60 border-[#D4AF37]"
                    : "bg-white border-slate-200"
                }`}
              >
                <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                  <div className="flex items-center gap-2">
                    <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${categoryBadge}`}>
                      {item.category}
                    </span>
                    {item.isPinned && (
                      <span className="flex items-center gap-1 text-[11px] font-bold text-[#1B2A4A] bg-[#D4AF37] px-2.5 py-0.5 rounded-full">
                        <Pin className="w-3 h-3 text-[#111C32]" /> Pinned Notice
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-slate-400 font-medium">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{item.date}</span>
                  </div>
                </div>

                <h2 className="text-lg sm:text-xl font-bold text-slate-900 mb-2 leading-snug">
                  {item.title}
                </h2>

                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed whitespace-pre-line">
                  {item.content}
                </p>

                <div className="mt-4 pt-3 border-t border-slate-100 text-xs text-slate-400 flex items-center justify-between">
                  <span>Authorized by: <strong className="text-slate-600">{item.publishedBy}</strong></span>
                  <span className="text-[11px] text-slate-400">Nayab English Grammer High School Mirwah</span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
