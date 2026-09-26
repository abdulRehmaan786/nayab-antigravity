"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Search,
  Sparkles,
  User,
  Award,
  CreditCard,
  ChevronRight,
  AlertCircle,
  Printer,
  CheckCircle2,
  Clock,
  XCircle,
  GraduationCap,
  Calendar,
  FileSpreadsheet,
} from "lucide-react";
import { StudentData, ExamResultData, FeeRecordData, AnnouncementData, AttendanceSummary } from "@/lib/types";

interface SearchResponse {
  ok: boolean;
  student: StudentData;
  latestResult: ExamResultData | null;
  fees: FeeRecordData[];
  attendanceSummary?: AttendanceSummary;
  recentAnnouncements: AnnouncementData[];
  error?: string;
}

const CLASSES = [
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
  "KG-2",
  "KG-1",
  "Nursery",
];

const DEMO_STUDENTS = [
  { label: "Class 1 — Roll 1 / GR 1573 (Aarish Ali - A+)", className: "Class 1", roll: "1" },
  { label: "Class 1 — Roll 43 (Usman - 585/600, 97.5%)", className: "Class 1", roll: "43" },
  { label: "Class 9 — Roll 101 (Distinction & On-time)", className: "Class 9", roll: "101" },
  { label: "Class 10 — Roll 201 (Top Rank)", className: "Class 10", roll: "201" },
  { label: "Class 8 — Roll 301 (A+ Grade)", className: "Class 8", roll: "301" },
];

export default function RollNumberSearch({ initialClass = "Class 9", initialRoll = "" }: { initialClass?: string; initialRoll?: string }) {
  const [selectedClass, setSelectedClass] = useState(initialClass);
  const [rollNumber, setRollNumber] = useState(initialRoll);
  const [loading, setLoading] = useState(false);
  const [resultData, setResultData] = useState<SearchResponse | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"all" | "result" | "info" | "attendance" | "fee">("all");

  const handleSearch = async (cls = selectedClass, roll = rollNumber) => {
    if (!cls || !roll.trim()) {
      setErrorMessage("Please select your class and enter your roll number.");
      return;
    }

    setLoading(true);
    setErrorMessage(null);
    setResultData(null);

    try {
      const res = await fetch(`/api/search?className=${encodeURIComponent(cls)}&rollNumber=${encodeURIComponent(roll.trim())}`);
      const data = await res.json();

      if (!res.ok || !data.ok) {
        setErrorMessage(data.error || "No student record found. Please verify class and roll number.");
      } else {
        setResultData(data);
      }
    } catch {
      setErrorMessage("Network error occurred while searching. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleQuickSelect = (cls: string, roll: string) => {
    setSelectedClass(cls);
    setRollNumber(roll);
    handleSearch(cls, roll);
  };

  return (
    <div className="w-full">
      {/* Search Input Box Matching "SEARCH BY ROLL NUMBER (PUBLIC)" Card */}
      <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-6 sm:p-8 transition-all duration-200">
        <div className="text-center max-w-lg mx-auto mb-6">
          <h2 className="text-xl sm:text-2xl font-bold text-[#0D1B3D] tracking-tight">
            Check Result / Student Information
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Access student profiles, examination results, daily attendance, and fee status instantly.
          </p>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSearch();
          }}
          className="max-w-2xl mx-auto space-y-3"
        >
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
            {/* Class Select */}
            <div className="sm:col-span-5">
              <label className="block text-xs font-semibold text-slate-700 mb-1">Class</label>
              <select
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
                className="w-full h-12 bg-slate-50 border border-slate-300 rounded-xl px-3.5 text-sm font-medium text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0D1B3D]"
              >
                {CLASSES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            {/* Roll Number Input */}
            <div className="sm:col-span-4">
              <label className="block text-xs font-semibold text-slate-700 mb-1">Enter Roll Number</label>
              <input
                type="text"
                value={rollNumber}
                onChange={(e) => setRollNumber(e.target.value)}
                placeholder="e.g. 101, 201"
                className="w-full h-12 bg-slate-50 border border-slate-300 rounded-xl px-3.5 text-sm font-medium text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0D1B3D]"
              />
            </div>

            {/* Search Button (Solid Navy #0D1B3D) */}
            <div className="sm:col-span-3 flex items-end">
              <button
                type="submit"
                disabled={loading}
                className="w-full h-12 bg-[#0D1B3D] hover:bg-[#1E3A8A] text-white font-semibold rounded-xl px-4 flex items-center justify-center gap-2 shadow-md transition active:scale-[0.99] disabled:opacity-60 cursor-pointer"
              >
                <Search className="w-4 h-4 text-[#D4AF37]" />
                <span>{loading ? "Searching..." : "Search"}</span>
              </button>
            </div>
          </div>
        </form>

        {/* 4 Feature Pills / Indicators from Design Sheet */}
        <div className="max-w-xl mx-auto mt-6 pt-5 border-t border-slate-100 grid grid-cols-2 sm:grid-cols-4 gap-2 text-center">
          <button
            type="button"
            onClick={() => setActiveTab(activeTab === "result" ? "all" : "result")}
            className={`flex flex-col items-center justify-center p-2.5 rounded-xl border transition cursor-pointer ${
              activeTab === "result"
                ? "bg-[#0D1B3D] text-white border-[#0D1B3D]"
                : "bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100"
            }`}
          >
            <Award className={`w-5 h-5 mb-1 ${activeTab === "result" ? "text-[#D4AF37]" : "text-[#1E3A8A]"}`} />
            <span className="text-xs font-semibold">Result</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab(activeTab === "info" ? "all" : "info")}
            className={`flex flex-col items-center justify-center p-2.5 rounded-xl border transition cursor-pointer ${
              activeTab === "info"
                ? "bg-[#0D1B3D] text-white border-[#0D1B3D]"
                : "bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100"
            }`}
          >
            <User className={`w-5 h-5 mb-1 ${activeTab === "info" ? "text-[#D4AF37]" : "text-[#1E3A8A]"}`} />
            <span className="text-xs font-semibold">Student Info</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab(activeTab === "attendance" ? "all" : "attendance")}
            className={`flex flex-col items-center justify-center p-2.5 rounded-xl border transition cursor-pointer ${
              activeTab === "attendance"
                ? "bg-[#0D1B3D] text-white border-[#0D1B3D]"
                : "bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100"
            }`}
          >
            <Clock className={`w-5 h-5 mb-1 ${activeTab === "attendance" ? "text-[#D4AF37]" : "text-[#22C55E]"}`} />
            <span className="text-xs font-semibold">Attendance</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab(activeTab === "fee" ? "all" : "fee")}
            className={`flex flex-col items-center justify-center p-2.5 rounded-xl border transition cursor-pointer ${
              activeTab === "fee"
                ? "bg-[#0D1B3D] text-white border-[#0D1B3D]"
                : "bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100"
            }`}
          >
            <CreditCard className={`w-5 h-5 mb-1 ${activeTab === "fee" ? "text-[#D4AF37]" : "text-[#F59E0B]"}`} />
            <span className="text-xs font-semibold">Fee Status</span>
          </button>
        </div>

        {/* Caption from Design Sheet */}
        <p className="text-center text-xs text-slate-400 mt-4">
          This is a public service. No login required.
        </p>

        {/* Demo Fast-Fill Chips */}
        <div className="mt-4 pt-3 border-t border-slate-100 flex flex-wrap items-center justify-center gap-2 text-xs">
          <span className="text-slate-500 font-medium flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" /> Demo Rolls:
          </span>
          {DEMO_STUDENTS.map((demo) => (
            <button
              key={demo.label}
              type="button"
              onClick={() => handleQuickSelect(demo.className, demo.roll)}
              className="bg-slate-100 hover:bg-[#FBF8EE] hover:border-[#D4AF37] text-slate-700 hover:text-[#0D1B3D] border border-slate-200 px-2.5 py-1 rounded-lg transition font-medium text-[11px] cursor-pointer"
            >
              {demo.label}
            </button>
          ))}
        </div>
      </div>

      {/* Error Message Display */}
      {errorMessage && (
        <div className="mt-6 bg-rose-50 border border-rose-200 text-rose-800 p-4 rounded-xl flex items-start gap-3 text-sm animate-in fade-in">
          <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold">Record Not Found</p>
            <p className="text-xs text-rose-700 mt-0.5">{errorMessage}</p>
          </div>
        </div>
      )}

      {/* Search Result Card */}
      {resultData && resultData.student && (
        <div className="mt-8 space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
          {/* Header Profile Bar */}
          <div className="bg-gradient-to-r from-[#0D1B3D] to-[#1E3A8A] text-white p-5 sm:p-6 rounded-2xl shadow-md border border-[#D4AF37]/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-white/10 border border-[#D4AF37] flex items-center justify-center font-bold text-xl text-[#D4AF37]">
                {resultData.student.name.charAt(0)}
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h2 className="text-xl sm:text-2xl font-bold tracking-tight">{resultData.student.name}</h2>
                  <span className="bg-[#D4AF37] text-[#0D1B3D] text-xs font-extrabold px-2.5 py-0.5 rounded-full uppercase">
                    Roll #{resultData.student.rollNumber}
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-slate-300 mt-1">
                  S/O or D/O: <span className="font-semibold text-white">{resultData.student.fatherName}</span> • Class:{" "}
                  <span className="font-semibold text-white">{resultData.student.className}</span> ({resultData.student.section})
                </p>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex items-center gap-2 flex-wrap self-start sm:self-auto">
              <Link
                href={`/parent?class=${encodeURIComponent(resultData.student.className)}&roll=${encodeURIComponent(resultData.student.rollNumber)}`}
                className="inline-flex items-center gap-1.5 bg-white/10 hover:bg-white/20 text-white font-semibold px-3 py-1.5 rounded-xl text-xs border border-white/20 transition"
              >
                <User className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span>Parent View</span>
              </Link>
              <Link
                href={`/student?class=${encodeURIComponent(resultData.student.className)}&roll=${encodeURIComponent(resultData.student.rollNumber)}`}
                className="inline-flex items-center gap-1.5 bg-white/10 hover:bg-white/20 text-white font-semibold px-3 py-1.5 rounded-xl text-xs border border-white/20 transition"
              >
                <GraduationCap className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span>Student View</span>
              </Link>
              <Link
                href={`/results?className=${encodeURIComponent(resultData.student.className)}&rollNumber=${encodeURIComponent(resultData.student.rollNumber)}`}
                className="inline-flex items-center gap-2 bg-[#D4AF37] hover:bg-amber-400 text-[#0D1B3D] font-bold px-4 py-2 rounded-xl text-xs sm:text-sm shadow transition"
              >
                <Printer className="w-4 h-4" />
                <span>Print Report Card</span>
              </Link>
            </div>
          </div>

          {/* Quick Metrics Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* 1. Exam Result Summary */}
            <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Academic Standing</span>
                  <Award className="w-4 h-4 text-[#1E3A8A]" />
                </div>
                {resultData.latestResult ? (
                  <div className="mt-3">
                    <div className="flex items-baseline gap-2">
                      <span className="text-3xl font-black text-[#0D1B3D]">{resultData.latestResult.percentage}%</span>
                      <span className="text-sm font-bold px-2 py-0.5 rounded bg-[#0D1B3D] text-white">
                        Grade {resultData.latestResult.overallGrade}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 mt-1">
                      Marks: {resultData.latestResult.obtainedMarks} / {resultData.latestResult.totalMarks} • Status:{" "}
                      <span className={resultData.latestResult.status === "PASS" ? "text-emerald-600 font-bold" : "text-rose-600 font-bold"}>
                        {resultData.latestResult.status}
                      </span>
                    </p>
                    <p className="text-[11px] text-slate-400 mt-0.5">{resultData.latestResult.examTerm}</p>
                  </div>
                ) : (
                  <p className="text-sm text-slate-500 mt-3">No exam results published yet.</p>
                )}
              </div>
              <Link
                href={`/results?className=${encodeURIComponent(resultData.student.className)}&rollNumber=${encodeURIComponent(resultData.student.rollNumber)}`}
                className="text-xs font-semibold text-[#1E3A8A] hover:text-[#0D1B3D] mt-4 flex items-center gap-1"
              >
                <span>View subject marks breakdown</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* 2. Daily Attendance Record */}
            <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Attendance Standing</span>
                  <Clock className="w-4 h-4 text-[#22C55E]" />
                </div>
                {resultData.attendanceSummary ? (
                  <div className="mt-3">
                    <div className="flex items-baseline gap-2">
                      <span className="text-3xl font-black text-[#0D1B3D]">{resultData.attendanceSummary.percentage}%</span>
                      <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                        {resultData.attendanceSummary.presentDays} of {resultData.attendanceSummary.totalDays} Days
                      </span>
                    </div>
                    <div className="mt-2 flex items-center gap-2 text-xs">
                      <span className="text-slate-500">Today:</span>
                      {resultData.attendanceSummary.todayStatus && resultData.attendanceSummary.todayStatus.status !== "NOT_RECORDED" ? (
                        <span
                          className={`font-semibold flex items-center gap-1 ${
                            resultData.attendanceSummary.todayStatus.status === "PRESENT"
                              ? "text-emerald-600"
                              : resultData.attendanceSummary.todayStatus.status === "LATE"
                              ? "text-amber-600"
                              : "text-rose-600"
                          }`}
                        >
                          <Clock className="w-3.5 h-3.5" />
                          {resultData.attendanceSummary.todayStatus.status} ({resultData.attendanceSummary.todayStatus.checkInTime || "Recorded"})
                        </span>
                      ) : (
                        <span className="text-slate-400">Not recorded yet</span>
                      )}
                    </div>
                    {resultData.attendanceSummary.lateDays > 0 && (
                      <p className="text-[11px] text-amber-600 font-medium mt-1">
                        ⚠️ {resultData.attendanceSummary.lateDays} late arrival(s) after 08:15 AM
                      </p>
                    )}
                  </div>
                ) : (
                  <p className="text-sm text-slate-500 mt-3">No attendance records logged.</p>
                )}
              </div>
              <div className="text-[11px] text-slate-400 mt-4 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                <span>Daily Class Register Verified</span>
              </div>
            </div>

            {/* 3. Fee Status */}
            <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Fee Status (Latest)</span>
                  <CreditCard className="w-4 h-4 text-[#F59E0B]" />
                </div>
                {resultData.fees.length > 0 ? (
                  <div className="mt-3">
                    <div className="flex items-baseline gap-2">
                      <span className="text-2xl font-black text-slate-900">
                        Rs. {resultData.fees[0].amount.toLocaleString()}
                      </span>
                      <span
                        className={`text-xs font-bold px-2 py-0.5 rounded-full uppercase ${
                          resultData.fees[0].status === "PAID"
                            ? "bg-emerald-100 text-emerald-800 border border-emerald-200"
                            : resultData.fees[0].status === "PENDING"
                            ? "bg-amber-100 text-amber-800 border border-amber-200"
                            : "bg-rose-100 text-rose-800 border border-rose-200"
                        }`}
                      >
                        {resultData.fees[0].status}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 mt-1">
                      {resultData.fees[0].month} Voucher • Due: {resultData.fees[0].dueDate}
                    </p>
                    {resultData.fees[0].receiptNumber && (
                      <p className="text-[11px] text-slate-400 font-mono mt-0.5">Receipt: {resultData.fees[0].receiptNumber}</p>
                    )}
                  </div>
                ) : (
                  <p className="text-sm text-slate-500 mt-3">No active fee record found.</p>
                )}
              </div>
              <Link
                href="/fees"
                className="text-xs font-semibold text-[#1E3A8A] hover:text-[#0D1B3D] mt-4 flex items-center gap-1"
              >
                <span>View fee vouchers & payment history</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
