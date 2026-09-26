"use client";

import { useState, useEffect } from "react";
import {
  Calendar,
  CheckCircle2,
  Clock,
  XCircle,
  Search,
  Filter,
  Check,
  AlertCircle,
  UserCheck,
  Printer,
  RefreshCw,
  Users,
  GraduationCap,
} from "lucide-react";

interface AttendanceRecordItem {
  studentId: string;
  rollNumber: string;
  grNumber?: string | null;
  name: string;
  fatherName: string;
  className: string;
  section: string;
  attendanceId: string | null;
  status: "PRESENT" | "LATE" | "ABSENT" | "LEAVE" | "NOT_MARKED";
  checkInTime: string | null;
  remarks: string | null;
}

const CLASSES = [
  "All Classes",
  "Class 10",
  "Class 9",
  "Class 8",
  "Class 7",
  "Class 6",
  "Class 5",
  "Class 4",
  "Class 3",
  "Class 2",
  "Class 1",
];

const STATUS_FILTERS = ["ALL", "PRESENT", "LATE", "ABSENT", "LEAVE"];

function getTodayString(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export default function AdminAttendancePage() {
  const [date, setDate] = useState("2025-09-10");
  const [selectedClass, setSelectedClass] = useState("All Classes");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [searchQuery, setSearchQuery] = useState("");

  const [items, setItems] = useState<AttendanceRecordItem[]>([]);
  const [summary, setSummary] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);

  useEffect(() => {
    loadAttendance();
  }, [date, selectedClass]);

  const loadAttendance = async () => {
    setLoading(true);
    try {
      const clsParam = selectedClass === "All Classes" ? "all" : selectedClass;
      const res = await fetch(
        `/api/attendance?date=${date}&className=${encodeURIComponent(clsParam)}`
      );
      const data = await res.json();
      if (data && data.items) {
        setItems(data.items);
        setSummary(data.summary);
      }
    } catch {
      console.error("Failed to load attendance records");
    } finally {
      setLoading(false);
    }
  };

  const handleManualOverride = async (
    studentId: string,
    newStatus: "PRESENT" | "LATE" | "ABSENT" | "LEAVE"
  ) => {
    setUpdatingId(studentId);
    try {
      const res = await fetch("/api/attendance", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          studentId,
          date,
          status: newStatus,
          remarks: `Manual update by Admin`,
        }),
      });
      if (res.ok) {
        setItems((prev) =>
          prev.map((it) => (it.studentId === studentId ? { ...it, status: newStatus } : it))
        );
        // Refresh summary
        loadAttendance();
        setFeedbackMessage("Attendance status updated.");
        setTimeout(() => setFeedbackMessage(null), 2500);
      }
    } catch {
      alert("Failed to update attendance status.");
    } finally {
      setUpdatingId(null);
    }
  };

  const handleBulkMark = async (status: "PRESENT" | "ABSENT") => {
    if (!confirm(`Mark all currently displayed students as ${status} for ${date}?`)) return;

    setLoading(true);
    try {
      for (const item of filtered) {
        await fetch("/api/attendance", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            studentId: item.studentId,
            date,
            status,
            remarks: `Bulk mark by Admin`,
          }),
        });
      }
      loadAttendance();
      setFeedbackMessage(`All displayed students marked as ${status}.`);
      setTimeout(() => setFeedbackMessage(null), 3000);
    } catch {
      alert("Error updating bulk attendance.");
      setLoading(false);
    }
  };

  const filtered = items.filter((item) => {
    if (statusFilter !== "ALL" && item.status !== statusFilter) return false;
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      item.name.toLowerCase().includes(q) ||
      item.rollNumber.toLowerCase().includes(q) ||
      (item.grNumber && item.grNumber.toLowerCase().includes(q)) ||
      item.fatherName.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto font-sans pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 sm:p-6 rounded-3xl border border-slate-200 shadow-sm">
        <div>
          <div className="inline-flex items-center gap-1.5 bg-[#D4AF37]/20 border border-[#D4AF37]/40 text-[#1B2A4A] px-3 py-0.5 rounded-full text-xs font-black uppercase tracking-wider mb-1.5">
            <UserCheck className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span>Attendance Administration</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight font-heading">
            Student Daily Attendance Register
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Official daily roll-call records, punctuality tracking, and status registers for Nayab English Grammer High School Mirwah.
          </p>
        </div>

        {/* Date Selector & Print Action */}
        <div className="flex flex-wrap items-center gap-2.5">
          <div className="bg-slate-50 border border-slate-300 rounded-2xl px-3 py-2 flex items-center gap-2 text-xs">
            <Calendar className="w-4 h-4 text-[#1B2A4A]" />
            <span className="text-slate-500 font-medium">Date:</span>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="bg-transparent font-bold text-slate-900 focus:outline-none cursor-pointer"
            />
          </div>

          <button
            onClick={() => window.print()}
            className="inline-flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 px-3.5 py-2.5 rounded-2xl text-xs font-bold transition cursor-pointer"
            title="Print Attendance Register"
          >
            <Printer className="w-4 h-4 text-slate-600" />
            <span>Print Sheet</span>
          </button>
        </div>
      </div>

      {feedbackMessage && (
        <div className="bg-emerald-50 border border-emerald-300 text-emerald-900 p-3.5 rounded-2xl text-xs flex items-center gap-2 shadow-sm animate-in fade-in">
          <Check className="w-4 h-4 text-emerald-600 shrink-0" />
          <span className="font-semibold">{feedbackMessage}</span>
        </div>
      )}

      {/* Summary KPI Cards */}
      {summary && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-sm">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              Attendance Standing
            </span>
            <p className="text-3xl font-black text-[#1B2A4A] mt-1">{summary.attendancePercentage}%</p>
            <p className="text-[11px] text-slate-500 mt-0.5">{summary.totalStudents} enrolled students</p>
          </div>

          <div className="bg-emerald-50/80 p-4 sm:p-5 rounded-2xl border border-emerald-200 shadow-sm">
            <span className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> Present (On-Time)
            </span>
            <p className="text-3xl font-black text-emerald-800 mt-1">{summary.presentCount}</p>
            <p className="text-[11px] text-emerald-600 mt-0.5">Arrived before 8:15 AM</p>
          </div>

          <div className="bg-amber-50/80 p-4 sm:p-5 rounded-2xl border border-amber-200 shadow-sm">
            <span className="text-[11px] font-bold text-amber-800 uppercase tracking-wider flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" /> Late Arrivals
            </span>
            <p className="text-3xl font-black text-amber-800 mt-1">{summary.lateCount}</p>
            <p className="text-[11px] text-amber-600 mt-0.5">Arrived after 8:15 AM</p>
          </div>

          <div className="bg-rose-50/80 p-4 sm:p-5 rounded-2xl border border-rose-200 shadow-sm">
            <span className="text-[11px] font-bold text-rose-800 uppercase tracking-wider flex items-center gap-1">
              <XCircle className="w-3.5 h-3.5" /> Absent / Leave
            </span>
            <p className="text-3xl font-black text-rose-800 mt-1">
              {summary.absentCount + summary.notMarkedCount}
            </p>
            <p className="text-[11px] text-rose-600 mt-0.5">Absences & unexcused leaves</p>
          </div>
        </div>
      )}

      {/* Filter and Quick Action Controls */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
        {/* Class Selection & Quick Mark */}
        <div className="flex flex-wrap items-center gap-2">
          <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Class:</label>
          <select
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
            className="bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 focus:outline-none"
          >
            {CLASSES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>

          <span className="h-6 w-px bg-slate-200 mx-1 hidden sm:inline" />

          {/* Quick Bulk Marking */}
          <button
            onClick={() => handleBulkMark("PRESENT")}
            className="inline-flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-3 py-2 rounded-xl transition cursor-pointer"
          >
            <Check className="w-3.5 h-3.5" />
            <span>Mark All Present</span>
          </button>

          <button
            onClick={() => handleBulkMark("ABSENT")}
            className="inline-flex items-center gap-1.5 bg-slate-100 hover:bg-rose-50 text-slate-700 hover:text-rose-700 border border-slate-300 font-bold text-xs px-3 py-2 rounded-xl transition cursor-pointer"
          >
            <XCircle className="w-3.5 h-3.5" />
            <span>Mark All Absent</span>
          </button>
        </div>

        {/* Search & Status Filters */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative flex-1 sm:w-56">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search student or roll..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-8 pr-3 py-1.5 text-xs text-slate-800 focus:bg-white focus:outline-none"
            />
          </div>

          <div className="flex items-center gap-1">
            {STATUS_FILTERS.map((s) => (
              <button
                key={s}
                onClick={() => setStatusFilter(s)}
                className={`px-2.5 py-1.5 rounded-xl font-bold text-[11px] transition cursor-pointer ${
                  statusFilter === s
                    ? "bg-[#1B2A4A] text-white shadow-xs"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Attendance Register Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-20 text-center text-xs text-slate-500 flex flex-col items-center justify-center gap-2">
            <RefreshCw className="w-6 h-6 animate-spin text-[#1B2A4A]" />
            <span>Loading class attendance records for {date}...</span>
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-16 text-center text-xs text-slate-500">
            No students found matching your filters.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-[#1B2A4A] text-white">
                  <th className="p-3.5 font-bold w-20">Roll No</th>
                  <th className="p-3.5 font-bold">GR Number</th>
                  <th className="p-3.5 font-bold">Student Name</th>
                  <th className="p-3.5 font-bold">Class & Sec</th>
                  <th className="p-3.5 font-bold text-center">Status</th>
                  <th className="p-3.5 font-bold">Arrival Time</th>
                  <th className="p-3.5 font-bold text-center">Admin Status Change</th>
                  <th className="p-3.5 font-bold">Remarks</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((item, idx) => (
                  <tr
                    key={item.studentId}
                    className={`hover:bg-slate-50/70 transition ${
                      idx % 2 === 0 ? "bg-white" : "bg-slate-50/30"
                    }`}
                  >
                    <td className="p-3.5 font-bold font-mono text-[#1B2A4A]">
                      #{item.rollNumber}
                    </td>
                    <td className="p-3.5 font-mono text-slate-600 font-semibold">
                      {item.grNumber || "—"}
                    </td>
                    <td className="p-3.5">
                      <p className="font-bold text-slate-900">{item.name}</p>
                      <p className="text-[10px] text-slate-400">S/O {item.fatherName}</p>
                    </td>
                    <td className="p-3.5 font-semibold text-slate-700">
                      {item.className} - {item.section}
                    </td>
                    <td className="p-3.5 text-center">
                      <span
                        className={`inline-block px-2.5 py-1 rounded-full font-bold text-[10px] ${
                          item.status === "PRESENT"
                            ? "bg-emerald-100 text-emerald-800"
                            : item.status === "LATE"
                            ? "bg-amber-100 text-amber-800"
                            : item.status === "ABSENT"
                            ? "bg-rose-100 text-rose-800"
                            : item.status === "LEAVE"
                            ? "bg-indigo-100 text-indigo-800"
                            : "bg-slate-100 text-slate-500"
                        }`}
                      >
                        {item.status}
                      </span>
                    </td>
                    <td className="p-3.5 font-mono text-slate-600">
                      {item.checkInTime || "—"}
                    </td>

                    {/* Single-Click Override Buttons */}
                    <td className="p-3.5 text-center">
                      <div className="inline-flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200">
                        <button
                          type="button"
                          onClick={() => handleManualOverride(item.studentId, "PRESENT")}
                          disabled={updatingId === item.studentId}
                          className={`px-2 py-0.5 rounded font-bold text-[11px] transition cursor-pointer ${
                            item.status === "PRESENT"
                              ? "bg-emerald-600 text-white shadow-xs"
                              : "text-slate-600 hover:bg-white"
                          }`}
                          title="Mark Present"
                        >
                          P
                        </button>
                        <button
                          type="button"
                          onClick={() => handleManualOverride(item.studentId, "LATE")}
                          disabled={updatingId === item.studentId}
                          className={`px-2 py-0.5 rounded font-bold text-[11px] transition cursor-pointer ${
                            item.status === "LATE"
                              ? "bg-amber-500 text-white shadow-xs"
                              : "text-slate-600 hover:bg-white"
                          }`}
                          title="Mark Late"
                        >
                          L
                        </button>
                        <button
                          type="button"
                          onClick={() => handleManualOverride(item.studentId, "ABSENT")}
                          disabled={updatingId === item.studentId}
                          className={`px-2 py-0.5 rounded font-bold text-[11px] transition cursor-pointer ${
                            item.status === "ABSENT"
                              ? "bg-rose-600 text-white shadow-xs"
                              : "text-slate-600 hover:bg-white"
                          }`}
                          title="Mark Absent"
                        >
                          A
                        </button>
                        <button
                          type="button"
                          onClick={() => handleManualOverride(item.studentId, "LEAVE")}
                          disabled={updatingId === item.studentId}
                          className={`px-2 py-0.5 rounded font-bold text-[11px] transition cursor-pointer ${
                            item.status === "LEAVE"
                              ? "bg-indigo-600 text-white shadow-xs"
                              : "text-slate-600 hover:bg-white"
                          }`}
                          title="Mark Leave"
                        >
                          Lv
                        </button>
                      </div>
                    </td>

                    <td className="p-3.5 text-slate-500 text-[11px]">
                      {item.remarks || "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
