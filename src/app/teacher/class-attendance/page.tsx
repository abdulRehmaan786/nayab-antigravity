"use client";

import { useState, useEffect } from "react";
import {
  GraduationCap,
  Calendar,
  CheckCircle2,
  XCircle,
  Clock,
  AlertCircle,
  Save,
  Search,
  Filter,
  Check,
  UserCheck,
  ShieldCheck,
  ArrowRight,
  RefreshCw,
  Sparkles,
} from "lucide-react";

interface StudentAttendanceItem {
  studentId: string;
  rollNumber: string;
  grNumber: string | null;
  name: string;
  fatherName: string;
  className: string;
  section: string;
  gender: string;
  attendanceId: string | null;
  status: "PRESENT" | "LATE" | "ABSENT" | "LEAVE" | "NOT_MARKED";
  checkInTime: string | null;
  remarks: string | null;
}

interface AttendanceSummary {
  totalStudents: number;
  presentCount: number;
  lateCount: number;
  absentCount: number;
  leaveCount: number;
  notMarkedCount: number;
  attendancePercentage: number;
}

function getTodayString(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function getCurrentTimeString(): string {
  return new Date().toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
}

export default function ClassTeacherAttendancePage() {
  const [session, setSession] = useState<{
    name: string;
    email: string;
    role: string;
    classTeacherOf: string | null;
  } | null>(null);

  const [date, setDate] = useState<string>(getTodayString());
  const [students, setStudents] = useState<StudentAttendanceItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");

  useEffect(() => {
    loadUserSession();
  }, []);

  useEffect(() => {
    if (session?.classTeacherOf) {
      loadClassAttendance(session.classTeacherOf, date);
    }
  }, [session, date]);

  const loadUserSession = async () => {
    try {
      const res = await fetch("/api/auth/me");
      const data = await res.json();
      if (data && data.authenticated && data.user) {
        setSession({
          name: data.user.name,
          email: data.user.email,
          role: data.user.role,
          classTeacherOf: data.user.classTeacherOf || null,
        });
      }
    } catch {
      console.error("Failed to load user session");
    }
  };

  const loadClassAttendance = async (className: string, selectedDate: string) => {
    setLoading(true);
    setErrorMessage(null);
    setSaveSuccess(null);
    try {
      const res = await fetch(
        `/api/attendance/class?className=${encodeURIComponent(className)}&date=${encodeURIComponent(selectedDate)}`
      );
      const data = await res.json();
      if (data.ok && Array.isArray(data.students)) {
        setStudents(data.students);
      } else {
        setErrorMessage(data.error || "Failed to load classroom attendance roster.");
      }
    } catch {
      setErrorMessage("Network error loading student roster.");
    } finally {
      setLoading(false);
    }
  };

  const updateStudentStatus = (
    studentId: string,
    newStatus: "PRESENT" | "LATE" | "ABSENT" | "LEAVE"
  ) => {
    setStudents((prev) =>
      prev.map((s) => {
        if (s.studentId !== studentId) return s;
        const currentTime = getCurrentTimeString();
        return {
          ...s,
          status: newStatus,
          checkInTime:
            newStatus === "PRESENT" || newStatus === "LATE"
              ? s.checkInTime || currentTime
              : null,
        };
      })
    );
  };

  const updateStudentRemarks = (studentId: string, remarks: string) => {
    setStudents((prev) =>
      prev.map((s) => (s.studentId === studentId ? { ...s, remarks } : s))
    );
  };

  const updateStudentCheckInTime = (studentId: string, checkInTime: string) => {
    setStudents((prev) =>
      prev.map((s) => (s.studentId === studentId ? { ...s, checkInTime } : s))
    );
  };

  const markAll = (targetStatus: "PRESENT" | "ABSENT") => {
    const time = getCurrentTimeString();
    setStudents((prev) =>
      prev.map((s) => ({
        ...s,
        status: targetStatus,
        checkInTime: targetStatus === "PRESENT" ? time : null,
      }))
    );
  };

  const handleSaveAttendance = async () => {
    if (!session?.classTeacherOf) return;
    setSaving(true);
    setErrorMessage(null);
    setSaveSuccess(null);

    try {
      const recordsToSave = students.map((s) => ({
        studentId: s.studentId,
        status: s.status === "NOT_MARKED" ? "PRESENT" : s.status,
        checkInTime: s.checkInTime,
        remarks: s.remarks,
      }));

      const res = await fetch("/api/attendance/class", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          className: session.classTeacherOf,
          date,
          records: recordsToSave,
        }),
      });

      const data = await res.json();
      if (res.ok && data.ok) {
        setSaveSuccess(
          `Attendance successfully saved for ${recordsToSave.length} students on ${date}!`
        );
        // Refresh to get official updated state
        loadClassAttendance(session.classTeacherOf, date);
      } else {
        setErrorMessage(data.error || "Failed to save attendance.");
      }
    } catch {
      setErrorMessage("Network error while submitting attendance.");
    } finally {
      setSaving(false);
    }
  };

  // Compute live KPIs
  const totalCount = students.length;
  const presentCount = students.filter((s) => s.status === "PRESENT").length;
  const lateCount = students.filter((s) => s.status === "LATE").length;
  const absentCount = students.filter((s) => s.status === "ABSENT").length;
  const leaveCount = students.filter((s) => s.status === "LEAVE").length;
  const notMarkedCount = students.filter((s) => s.status === "NOT_MARKED").length;
  const markedAttendanceCount = presentCount + lateCount;
  const attendanceRate =
    totalCount > 0
      ? Number(((markedAttendanceCount / (totalCount - leaveCount || 1)) * 100).toFixed(1))
      : 100;

  // Filter students for display
  const filteredStudents = students.filter((s) => {
    if (statusFilter !== "ALL" && s.status !== statusFilter) return false;
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase().trim();
    return (
      s.name.toLowerCase().includes(q) ||
      s.rollNumber.toLowerCase().includes(q) ||
      (s.grNumber && s.grNumber.toLowerCase().includes(q)) ||
      s.fatherName.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto font-sans pb-16">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-[#1B2A4A] to-[#253966] text-white p-6 sm:p-7 rounded-3xl shadow-lg border border-[#D4AF37]/30 flex flex-col md:flex-row md:items-center justify-between gap-5">
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-1.5 bg-[#D4AF37] text-[#111C32] px-3 py-0.5 rounded-full text-xs font-black uppercase tracking-wider">
            <GraduationCap className="w-3.5 h-3.5" />
            <span>Class Teacher Portal</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white flex items-center gap-2">
            <span>Class Attendance Register</span>
            {session?.classTeacherOf && (
              <span className="text-[#D4AF37]">({session.classTeacherOf})</span>
            )}
          </h1>
          <p className="text-xs sm:text-sm text-slate-300">
            Official daily roll-call and punctuality register for your designated classroom.
          </p>
        </div>

        {/* Date Selector & Primary Action */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="bg-[#111C32]/90 border border-white/20 rounded-2xl px-3 py-2 flex items-center gap-2 text-xs">
            <Calendar className="w-4 h-4 text-[#D4AF37]" />
            <span className="text-slate-300 font-medium">Date:</span>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="bg-transparent text-white font-bold font-mono focus:outline-none cursor-pointer"
            />
          </div>

          {session?.classTeacherOf && (
            <button
              onClick={handleSaveAttendance}
              disabled={saving || loading || students.length === 0}
              className="inline-flex items-center gap-2 bg-[#D4AF37] hover:bg-[#e0bc45] text-[#111C32] px-4 py-2.5 rounded-2xl font-black text-xs shadow-md transition disabled:opacity-50 cursor-pointer"
            >
              {saving ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>Save Attendance</span>
                </>
              )}
            </button>
          )}
        </div>
      </div>

      {/* Notifications */}
      {saveSuccess && (
        <div className="bg-emerald-50 border border-emerald-300 text-emerald-900 p-4 rounded-2xl text-xs sm:text-sm flex items-center gap-3 shadow-sm animate-in fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span className="font-semibold">{saveSuccess}</span>
        </div>
      )}

      {errorMessage && (
        <div className="bg-rose-50 border border-rose-300 text-rose-900 p-4 rounded-2xl text-xs sm:text-sm flex items-center gap-3 shadow-sm animate-in fade-in">
          <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
          <span className="font-semibold">{errorMessage}</span>
        </div>
      )}

      {/* Non-Class Teacher State Warning */}
      {!session?.classTeacherOf && !loading && (
        <div className="bg-amber-50 border border-amber-200 p-6 sm:p-8 rounded-3xl text-center space-y-3">
          <div className="w-12 h-12 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center mx-auto">
            <GraduationCap className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-base text-amber-900">
            No Classroom Assigned
          </h3>
          <p className="text-xs sm:text-sm text-amber-800 max-w-md mx-auto leading-relaxed">
            You are currently registered as a Subject Teacher. To take class attendance, please request the School Administrator to designate you as the Class Teacher for your class in the Admin Portal.
          </p>
        </div>
      )}

      {/* Class Teacher Active Screen */}
      {session?.classTeacherOf && (
        <>
          {/* Summary KPI Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3.5">
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                Total Enrolled
              </span>
              <p className="text-2xl font-black text-[#1B2A4A] mt-1">{totalCount}</p>
              <p className="text-[11px] text-slate-500 mt-0.5">{session.classTeacherOf}</p>
            </div>

            <div className="bg-emerald-50/80 p-4 rounded-2xl border border-emerald-200 shadow-sm">
              <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Present
              </span>
              <p className="text-2xl font-black text-emerald-800 mt-1">{presentCount}</p>
              <p className="text-[11px] text-emerald-600 mt-0.5">Students in class</p>
            </div>

            <div className="bg-amber-50/80 p-4 rounded-2xl border border-amber-200 shadow-sm">
              <span className="text-[10px] font-bold text-amber-800 uppercase tracking-wider flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" /> Late Arrivals
              </span>
              <p className="text-2xl font-black text-amber-800 mt-1">{lateCount}</p>
              <p className="text-[11px] text-amber-600 mt-0.5">After assembly cut-off</p>
            </div>

            <div className="bg-rose-50/80 p-4 rounded-2xl border border-rose-200 shadow-sm">
              <span className="text-[10px] font-bold text-rose-800 uppercase tracking-wider flex items-center gap-1">
                <XCircle className="w-3.5 h-3.5" /> Absent
              </span>
              <p className="text-2xl font-black text-rose-800 mt-1">{absentCount}</p>
              <p className="text-[11px] text-rose-600 mt-0.5">No attendance logged</p>
            </div>

            <div className="bg-indigo-50/80 p-4 rounded-2xl border border-indigo-200 shadow-sm col-span-2 sm:col-span-1">
              <span className="text-[10px] font-bold text-indigo-800 uppercase tracking-wider flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-indigo-600" /> Attendance Rate
              </span>
              <p className="text-2xl font-black text-indigo-800 mt-1">{attendanceRate}%</p>
              <p className="text-[11px] text-indigo-600 mt-0.5">{markedAttendanceCount} attended</p>
            </div>
          </div>

          {/* Quick Action Bar & Filters */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 text-xs">
            {/* Quick Bulk Marking */}
            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-600 text-[11px] uppercase tracking-wider hidden sm:inline">
                Quick Action:
              </span>
              <button
                type="button"
                onClick={() => markAll("PRESENT")}
                className="inline-flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-3 py-1.5 rounded-xl transition cursor-pointer"
              >
                <Check className="w-3.5 h-3.5" />
                <span>Mark All Present</span>
              </button>
              <button
                type="button"
                onClick={() => markAll("ABSENT")}
                className="inline-flex items-center gap-1.5 bg-slate-100 hover:bg-rose-50 text-slate-700 hover:text-rose-700 border border-slate-300 font-bold px-3 py-1.5 rounded-xl transition cursor-pointer"
              >
                <XCircle className="w-3.5 h-3.5" />
                <span>Mark All Absent</span>
              </button>
            </div>

            {/* Search & Filter */}
            <div className="flex items-center gap-2">
              <div className="relative flex-1 sm:w-48">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search student or roll..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-8 pr-3 py-1.5 text-xs text-slate-800 focus:bg-white focus:outline-none"
                />
              </div>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="bg-slate-50 border border-slate-300 rounded-xl px-2.5 py-1.5 text-xs font-semibold text-slate-700 cursor-pointer"
              >
                <option value="ALL">All Statuses</option>
                <option value="PRESENT">Present</option>
                <option value="LATE">Late</option>
                <option value="ABSENT">Absent</option>
                <option value="LEAVE">Leave</option>
                <option value="NOT_MARKED">Not Marked</option>
              </select>
            </div>
          </div>

          {/* Student Attendance List */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
            {loading ? (
              <div className="p-16 text-center text-xs text-slate-500 flex flex-col items-center justify-center gap-2">
                <RefreshCw className="w-6 h-6 animate-spin text-[#1B2A4A]" />
                <span>Loading class roster and attendance records...</span>
              </div>
            ) : filteredStudents.length === 0 ? (
              <div className="p-16 text-center text-xs text-slate-500">
                No students match your filter criteria.
              </div>
            ) : (
              <>
                {/* Desktop View Table */}
                <div className="hidden md:block overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-[#1B2A4A] text-white">
                        <th className="p-3.5 font-bold w-20">Roll No</th>
                        <th className="p-3.5 font-bold">GR Number</th>
                        <th className="p-3.5 font-bold">Student Name</th>
                        <th className="p-3.5 font-bold">Father's Name</th>
                        <th className="p-3.5 font-bold text-center">Status</th>
                        <th className="p-3.5 font-bold">Check-in Time</th>
                        <th className="p-3.5 font-bold">Teacher Remarks</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {filteredStudents.map((s, idx) => (
                        <tr
                          key={s.studentId}
                          className={`hover:bg-slate-50/70 transition ${
                            idx % 2 === 0 ? "bg-white" : "bg-slate-50/30"
                          }`}
                        >
                          <td className="p-3.5 font-bold font-mono text-[#1B2A4A]">
                            #{s.rollNumber}
                          </td>
                          <td className="p-3.5 font-mono text-slate-600 font-semibold">
                            {s.grNumber || "—"}
                          </td>
                          <td className="p-3.5 font-bold text-slate-900">
                            <span>{s.name}</span>
                            <span className="text-[10px] text-slate-400 block font-normal">
                              Sec {s.section} · {s.gender}
                            </span>
                          </td>
                          <td className="p-3.5 text-slate-600">{s.fatherName}</td>

                          {/* 4 Tactile Status Toggle Buttons */}
                          <td className="p-3.5">
                            <div className="inline-flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200">
                              <button
                                type="button"
                                onClick={() => updateStudentStatus(s.studentId, "PRESENT")}
                                className={`px-2.5 py-1 rounded-lg font-bold text-xs transition cursor-pointer ${
                                  s.status === "PRESENT"
                                    ? "bg-emerald-600 text-white shadow-xs"
                                    : "text-slate-600 hover:bg-white"
                                }`}
                                title="Mark Present"
                              >
                                P
                              </button>
                              <button
                                type="button"
                                onClick={() => updateStudentStatus(s.studentId, "LATE")}
                                className={`px-2.5 py-1 rounded-lg font-bold text-xs transition cursor-pointer ${
                                  s.status === "LATE"
                                    ? "bg-amber-500 text-white shadow-xs"
                                    : "text-slate-600 hover:bg-white"
                                }`}
                                title="Mark Late"
                              >
                                L
                              </button>
                              <button
                                type="button"
                                onClick={() => updateStudentStatus(s.studentId, "ABSENT")}
                                className={`px-2.5 py-1 rounded-lg font-bold text-xs transition cursor-pointer ${
                                  s.status === "ABSENT"
                                    ? "bg-rose-600 text-white shadow-xs"
                                    : "text-slate-600 hover:bg-white"
                                }`}
                                title="Mark Absent"
                              >
                                A
                              </button>
                              <button
                                type="button"
                                onClick={() => updateStudentStatus(s.studentId, "LEAVE")}
                                className={`px-2.5 py-1 rounded-lg font-bold text-xs transition cursor-pointer ${
                                  s.status === "LEAVE"
                                    ? "bg-indigo-600 text-white shadow-xs"
                                    : "text-slate-600 hover:bg-white"
                                }`}
                                title="Mark Leave"
                              >
                                Lv
                              </button>
                            </div>
                          </td>

                          {/* Time Input */}
                          <td className="p-3.5">
                            <input
                              type="text"
                              placeholder="07:50 AM"
                              value={s.checkInTime || ""}
                              onChange={(e) =>
                                updateStudentCheckInTime(s.studentId, e.target.value)
                              }
                              className="w-24 bg-white border border-slate-200 rounded-lg px-2 py-1 text-xs font-mono text-slate-800"
                            />
                          </td>

                          {/* Remarks */}
                          <td className="p-3.5">
                            <input
                              type="text"
                              placeholder="Optional remarks..."
                              value={s.remarks || ""}
                              onChange={(e) =>
                                updateStudentRemarks(s.studentId, e.target.value)
                              }
                              className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1 text-xs text-slate-800 focus:bg-white focus:outline-none"
                            />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Mobile Responsive Cards (< md) */}
                <div className="md:hidden divide-y divide-slate-100 p-3 space-y-3">
                  {filteredStudents.map((s) => (
                    <div
                      key={s.studentId}
                      className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-xs space-y-3"
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-mono font-bold text-xs bg-[#1B2A4A] text-white px-2 py-0.5 rounded-md">
                              Roll #{s.rollNumber}
                            </span>
                            {s.grNumber && (
                              <span className="font-mono text-[10px] text-slate-500 font-semibold">
                                {s.grNumber}
                              </span>
                            )}
                          </div>
                          <h4 className="font-bold text-slate-900 text-sm mt-1">{s.name}</h4>
                          <p className="text-[11px] text-slate-500">S/O {s.fatherName}</p>
                        </div>

                        {/* Current Status Pill */}
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            s.status === "PRESENT"
                              ? "bg-emerald-100 text-emerald-800"
                              : s.status === "LATE"
                              ? "bg-amber-100 text-amber-800"
                              : s.status === "ABSENT"
                              ? "bg-rose-100 text-rose-800"
                              : s.status === "LEAVE"
                              ? "bg-indigo-100 text-indigo-800"
                              : "bg-slate-100 text-slate-600"
                          }`}
                        >
                          {s.status}
                        </span>
                      </div>

                      {/* 4 Large Touch Buttons */}
                      <div className="grid grid-cols-4 gap-2 pt-1">
                        <button
                          type="button"
                          onClick={() => updateStudentStatus(s.studentId, "PRESENT")}
                          className={`h-11 rounded-xl font-black text-xs transition flex flex-col items-center justify-center cursor-pointer ${
                            s.status === "PRESENT"
                              ? "bg-emerald-600 text-white shadow-md ring-2 ring-emerald-600"
                              : "bg-slate-100 text-slate-700 hover:bg-emerald-50"
                          }`}
                        >
                          <span>P</span>
                          <span className="text-[8px] font-normal uppercase">Present</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => updateStudentStatus(s.studentId, "LATE")}
                          className={`h-11 rounded-xl font-black text-xs transition flex flex-col items-center justify-center cursor-pointer ${
                            s.status === "LATE"
                              ? "bg-amber-500 text-white shadow-md ring-2 ring-amber-500"
                              : "bg-slate-100 text-slate-700 hover:bg-amber-50"
                          }`}
                        >
                          <span>L</span>
                          <span className="text-[8px] font-normal uppercase">Late</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => updateStudentStatus(s.studentId, "ABSENT")}
                          className={`h-11 rounded-xl font-black text-xs transition flex flex-col items-center justify-center cursor-pointer ${
                            s.status === "ABSENT"
                              ? "bg-rose-600 text-white shadow-md ring-2 ring-rose-600"
                              : "bg-slate-100 text-slate-700 hover:bg-rose-50"
                          }`}
                        >
                          <span>A</span>
                          <span className="text-[8px] font-normal uppercase">Absent</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => updateStudentStatus(s.studentId, "LEAVE")}
                          className={`h-11 rounded-xl font-black text-xs transition flex flex-col items-center justify-center cursor-pointer ${
                            s.status === "LEAVE"
                              ? "bg-indigo-600 text-white shadow-md ring-2 ring-indigo-600"
                              : "bg-slate-100 text-slate-700 hover:bg-indigo-50"
                          }`}
                        >
                          <span>Lv</span>
                          <span className="text-[8px] font-normal uppercase">Leave</span>
                        </button>
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-xs pt-1">
                        <div>
                          <label className="text-[10px] text-slate-400 block mb-0.5">Time</label>
                          <input
                            type="text"
                            placeholder="07:50 AM"
                            value={s.checkInTime || ""}
                            onChange={(e) =>
                              updateStudentCheckInTime(s.studentId, e.target.value)
                            }
                            className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1 text-xs font-mono"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] text-slate-400 block mb-0.5">Note</label>
                          <input
                            type="text"
                            placeholder="Remarks..."
                            value={s.remarks || ""}
                            onChange={(e) =>
                              updateStudentRemarks(s.studentId, e.target.value)
                            }
                            className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1 text-xs"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Sticky Bottom Save Action */}
          <div className="sticky bottom-4 z-30 bg-[#1B2A4A]/95 backdrop-blur-md text-white p-3.5 sm:p-4 rounded-2xl shadow-2xl border border-[#D4AF37]/40 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-[#D4AF37] text-[#111C32] flex items-center justify-center font-black">
                <Check className="w-5 h-5" />
              </div>
              <div>
                <p className="font-bold text-xs sm:text-sm">
                  {students.filter((s) => s.status !== "NOT_MARKED").length} of {students.length} students marked
                </p>
                <p className="text-[11px] text-slate-300">
                  Ready to save for {date}
                </p>
              </div>
            </div>

            <button
              onClick={handleSaveAttendance}
              disabled={saving || loading || students.length === 0}
              className="inline-flex items-center gap-2 bg-[#D4AF37] hover:bg-[#e0bc45] text-[#111C32] px-5 py-2.5 rounded-xl font-extrabold text-xs shadow-lg transition cursor-pointer disabled:opacity-50"
            >
              {saving ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Submitting...</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>Submit Attendance</span>
                </>
              )}
            </button>
          </div>
        </>
      )}
    </div>
  );
}
