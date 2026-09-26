"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  User,
  Search,
  Award,
  CreditCard,
  Clock,
  Printer,
  ChevronRight,
  AlertCircle,
  Sparkles,
  Calendar,
  CheckCircle2,
  FileText,
  Phone,
  ArrowRight,
  Bell,
  RefreshCw,
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

const DEMO_CHILDREN = [
  { label: "Class 1 — Roll 1 (Aarish Ali)", className: "Class 1", roll: "1" },
  { label: "Class 1 — Roll 43 (Usman - 97.5%)", className: "Class 1", roll: "43" },
  { label: "Class 9 — Roll 101 (Muhammad Ali)", className: "Class 9", roll: "101" },
  { label: "Class 10 — Roll 201 (Hamza Farooq)", className: "Class 10", roll: "201" },
  { label: "Class 8 — Roll 301 (Rayyan Ahmed)", className: "Class 8", roll: "301" },
];

function ParentPortalContent() {
  const searchParams = useSearchParams();
  const initialClass = searchParams.get("class") || searchParams.get("className") || "Class 9";
  const initialRoll = searchParams.get("roll") || searchParams.get("rollNumber") || "";

  const [selectedClass, setSelectedClass] = useState(initialClass);
  const [rollNumber, setRollNumber] = useState(initialRoll);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<SearchResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"overview" | "academics" | "attendance" | "fees">("overview");

  const loadStudent = async (cls: string, roll: string) => {
    if (!cls || !roll.trim()) {
      setError("Please select a class and enter your child's roll number.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`/api/search?className=${encodeURIComponent(cls)}&rollNumber=${encodeURIComponent(roll.trim())}`);
      const json = await res.json();

      if (!res.ok || !json.ok) {
        setError(json.error || "No student record found. Please verify class and roll number.");
        setData(null);
      } else {
        setData(json);
      }
    } catch {
      setError("Network connection error. Please try again.");
      setData(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (initialRoll) {
      loadStudent(initialClass, initialRoll);
    }
  }, [initialClass, initialRoll]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loadStudent(selectedClass, rollNumber);
  };

  const handleQuickDemo = (cls: string, roll: string) => {
    setSelectedClass(cls);
    setRollNumber(roll);
    loadStudent(cls, roll);
  };

  return (
    <div className="min-h-screen bg-[#F2F4F7] py-6 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Top Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div>
            <div className="flex items-center gap-2">
              <span className="bg-[#0D1B3D] text-[#D4AF37] text-xs font-bold px-2.5 py-1 rounded-lg uppercase tracking-wider">
                Parent Portal
              </span>
              <span className="text-xs text-slate-500 font-medium">Nayab English Grammer High School</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0D1B3D] tracking-tight font-heading mt-1 flex items-center gap-2">
              <span>Parent Access & Child Overview</span>
              <span className="text-2xl">👨‍👩‍👧‍👦</span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              Live academic performance, daily attendance registers, and monthly fee challans.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-[#F2F4F7] text-[#0D1B3D] border border-slate-200 px-3.5 py-2 rounded-xl text-xs font-semibold">
              <Calendar className="w-3.5 h-3.5 text-[#1E3A8A]" />
              <span>{new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })}</span>
            </div>
            <Link
              href="/results"
              className="inline-flex items-center gap-1.5 bg-[#0D1B3D] hover:bg-[#1E3A8A] text-white px-3.5 py-2 rounded-xl text-xs font-semibold shadow transition"
            >
              <Printer className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>Full Marksheet</span>
            </Link>
          </div>
        </div>

        {/* Search Card */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-sm">
          <form onSubmit={handleSearchSubmit} className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="sm:w-1/3">
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Select Child's Class
                </label>
                <select
                  value={selectedClass}
                  onChange={(e) => setSelectedClass(e.target.value)}
                  className="w-full h-11 bg-slate-50 border border-slate-300 rounded-xl px-3 text-sm font-medium text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0D1B3D]"
                >
                  {CLASSES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              <div className="sm:w-1/2">
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Child's Roll Number or G.R. Number
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={rollNumber}
                    onChange={(e) => setRollNumber(e.target.value)}
                    placeholder="e.g. 1, 43, 101, 201 or 1573"
                    className="w-full h-11 bg-slate-50 border border-slate-300 rounded-xl pl-3 pr-10 text-sm font-medium text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0D1B3D]"
                  />
                  <User className="w-4 h-4 text-slate-400 absolute right-3 top-3.5" />
                </div>
              </div>

              <div className="sm:w-auto flex items-end">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full sm:w-auto h-11 bg-[#0D1B3D] hover:bg-[#1E3A8A] text-white font-bold px-6 rounded-xl flex items-center justify-center gap-2 shadow transition disabled:opacity-60 cursor-pointer"
                >
                  {loading ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin text-[#D4AF37]" />
                      <span>Loading...</span>
                    </>
                  ) : (
                    <>
                      <Search className="w-4 h-4 text-[#D4AF37]" />
                      <span>View Child Record</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Demo Quick Chips */}
            <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center gap-2 text-xs">
              <span className="text-slate-500 font-medium flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" /> One-Click Child Demos:
              </span>
              {DEMO_CHILDREN.map((demo) => (
                <button
                  key={demo.label}
                  type="button"
                  onClick={() => handleQuickDemo(demo.className, demo.roll)}
                  className="bg-slate-100 hover:bg-[#FBF8EE] hover:border-[#D4AF37] text-slate-700 hover:text-[#0D1B3D] border border-slate-200 px-2.5 py-1 rounded-lg transition font-medium text-[11px] cursor-pointer"
                >
                  {demo.label}
                </button>
              ))}
            </div>
          </form>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="bg-rose-50 border border-rose-200 text-rose-800 p-4 rounded-xl flex items-start gap-3 text-sm animate-in fade-in">
            <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold">Child Record Not Found</p>
              <p className="text-xs text-rose-700 mt-0.5">{error}</p>
            </div>
          </div>
        )}

        {/* Empty State before search */}
        {!data && !error && !loading && (
          <div className="bg-white rounded-2xl border border-slate-200 p-8 sm:p-12 text-center space-y-4 shadow-sm">
            <div className="w-16 h-16 rounded-2xl bg-slate-100 border border-slate-200 text-[#0D1B3D] flex items-center justify-center mx-auto shadow-inner">
              <User className="w-8 h-8 text-[#1E3A8A]" />
            </div>
            <div className="max-w-md mx-auto space-y-1">
              <h2 className="text-xl font-bold text-slate-900 font-heading">
                Enter Child's Roll or G.R. Number
              </h2>
              <p className="text-xs sm:text-sm text-slate-500">
                Parents can monitor daily attendance registers, weekly test marks, examination report cards, and fee payment vouchers instantly without any password.
              </p>
            </div>
            <div className="pt-2 flex flex-wrap items-center justify-center gap-2">
              <button
                type="button"
                onClick={() => handleQuickDemo("Class 1", "1")}
                className="bg-[#0D1B3D] text-[#D4AF37] hover:bg-[#1E3A8A] px-4 py-2 rounded-xl text-xs font-bold transition shadow"
              >
                Try Roll #1 (Aarish Ali - Class 1)
              </button>
              <button
                type="button"
                onClick={() => handleQuickDemo("Class 9", "101")}
                className="bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300 px-4 py-2 rounded-xl text-xs font-bold transition"
              >
                Try Roll #101 (Muhammad Ali - Class 9)
              </button>
            </div>
          </div>
        )}

        {/* Live Student Data Loaded */}
        {data && data.student && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
            {/* Student Profile Card */}
            <div className="bg-gradient-to-r from-[#0D1B3D] to-[#1E3A8A] text-white p-6 rounded-2xl shadow-md border border-[#D4AF37]/30 flex flex-col md:flex-row md:items-center justify-between gap-5">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-white/10 border-2 border-[#D4AF37] flex items-center justify-center font-black text-2xl text-[#D4AF37] shrink-0">
                  {data.student.name.charAt(0)}
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h2 className="text-2xl font-black tracking-tight">{data.student.name}</h2>
                    <span className="bg-[#D4AF37] text-[#0D1B3D] text-xs font-black px-2.5 py-0.5 rounded-full uppercase">
                      Roll #{data.student.rollNumber}
                    </span>
                    {data.student.grNumber && (
                      <span className="bg-white/20 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                        GR: {data.student.grNumber}
                      </span>
                    )}
                  </div>
                  <p className="text-xs sm:text-sm text-slate-200 mt-1">
                    Father&apos;s Name: <strong className="text-white">{data.student.fatherName}</strong> • Class:{" "}
                    <strong className="text-white">{data.student.className}</strong> (Section {data.student.section})
                  </p>
                  {data.student.phone && (
                    <p className="text-xs text-slate-300 mt-0.5 flex items-center gap-1">
                      <Phone className="w-3 h-3 text-[#D4AF37]" />
                      <span>Guardian Contact: {data.student.phone}</span>
                    </p>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2.5 flex-wrap self-start md:self-auto">
                <Link
                  href={`/results?className=${encodeURIComponent(data.student.className)}&rollNumber=${encodeURIComponent(data.student.rollNumber)}`}
                  className="inline-flex items-center gap-2 bg-[#D4AF37] hover:bg-amber-400 text-[#0D1B3D] font-bold px-4 py-2.5 rounded-xl text-xs shadow transition cursor-pointer"
                >
                  <Printer className="w-4 h-4" />
                  <span>Official Report Card (A4)</span>
                </Link>
                <Link
                  href={`/student?class=${encodeURIComponent(data.student.className)}&roll=${encodeURIComponent(data.student.rollNumber)}`}
                  className="inline-flex items-center gap-1.5 bg-white/10 hover:bg-white/20 text-white font-semibold px-3 py-2.5 rounded-xl text-xs border border-white/20 transition"
                >
                  <span>Student View</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            {/* 3 Top Summary Metrics */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* Metric 1: Academics */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Academic Standing</span>
                    <Award className="w-4 h-4 text-[#1E3A8A]" />
                  </div>
                  {data.latestResult ? (
                    <div className="mt-3">
                      <div className="flex items-baseline gap-2">
                        <span className="text-3xl font-black text-[#0D1B3D]">{data.latestResult.percentage}%</span>
                        <span className="text-sm font-bold px-2 py-0.5 rounded bg-[#0D1B3D] text-white">
                          Grade {data.latestResult.overallGrade}
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 mt-1">
                        Obtained: {data.latestResult.obtainedMarks} / {data.latestResult.totalMarks} Marks
                      </p>
                      <p className="text-[11px] font-bold text-emerald-600 mt-0.5">
                        Status: {data.latestResult.status === "PASS" ? "PROMOTED / PASS" : "NEEDS RE-EXAM"}
                      </p>
                    </div>
                  ) : (
                    <p className="text-xs text-slate-500 mt-3">No exam results published yet.</p>
                  )}
                </div>
                <div className="pt-3 border-t border-slate-100 mt-3 flex justify-between items-center text-xs">
                  <span className="text-slate-400">{data.latestResult?.examTerm || "Term Evaluation"}</span>
                  <button
                    onClick={() => setActiveTab("academics")}
                    className="text-[#1E3A8A] font-bold hover:underline"
                  >
                    View Subjects →
                  </button>
                </div>
              </div>

              {/* Metric 2: Attendance */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Attendance Standing</span>
                    <Clock className="w-4 h-4 text-[#22C55E]" />
                  </div>
                  {data.attendanceSummary ? (
                    <div className="mt-3">
                      <div className="flex items-baseline gap-2">
                        <span className="text-3xl font-black text-emerald-600">{data.attendanceSummary.percentage}%</span>
                        <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                          {data.attendanceSummary.presentDays} of {data.attendanceSummary.totalDays} Days
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 mt-1">
                        Late: <strong className="text-amber-600">{data.attendanceSummary.lateDays}</strong> • Absent:{" "}
                        <strong className="text-rose-600">{data.attendanceSummary.absentDays}</strong> • Leave:{" "}
                        <strong className="text-blue-600">{data.attendanceSummary.leaveDays}</strong>
                      </p>
                      <div className="mt-1 flex items-center gap-1.5 text-xs text-slate-500">
                        <span>Today:</span>
                        <span className={`font-bold px-2 py-0.5 rounded text-[11px] ${
                          data.attendanceSummary.todayStatus?.status === "PRESENT"
                            ? "bg-emerald-100 text-emerald-800"
                            : data.attendanceSummary.todayStatus?.status === "LATE"
                            ? "bg-amber-100 text-amber-800"
                            : data.attendanceSummary.todayStatus?.status === "LEAVE"
                            ? "bg-blue-100 text-blue-800"
                            : data.attendanceSummary.todayStatus?.status === "ABSENT"
                            ? "bg-rose-100 text-rose-800"
                            : "bg-slate-100 text-slate-600"
                        }`}>
                          {data.attendanceSummary.todayStatus?.status || "Not Marked"}
                        </span>
                      </div>
                    </div>
                  ) : (
                    <p className="text-xs text-slate-500 mt-3">No attendance records logged.</p>
                  )}
                </div>
                <div className="pt-3 border-t border-slate-100 mt-3 flex justify-between items-center text-xs">
                  <span className="text-slate-400">Daily Register</span>
                  <button
                    onClick={() => setActiveTab("attendance")}
                    className="text-[#1E3A8A] font-bold hover:underline"
                  >
                    View History →
                  </button>
                </div>
              </div>

              {/* Metric 3: Fee Status */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Fee Status</span>
                    <CreditCard className="w-4 h-4 text-[#F59E0B]" />
                  </div>
                  {data.fees.length > 0 ? (
                    <div className="mt-3">
                      <div className="flex items-baseline gap-2">
                        <span className="text-2xl font-black text-slate-900">
                          Rs. {data.fees[0].amount.toLocaleString()}
                        </span>
                        <span
                          className={`text-xs font-bold px-2.5 py-0.5 rounded-full uppercase ${
                            data.fees[0].status === "PAID"
                              ? "bg-emerald-100 text-emerald-800 border border-emerald-200"
                              : data.fees[0].status === "PENDING"
                              ? "bg-amber-100 text-amber-800 border border-amber-200"
                              : "bg-rose-100 text-rose-800 border border-rose-200"
                          }`}
                        >
                          {data.fees[0].status}
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 mt-1">
                        {data.fees[0].month} Challan • Due: {data.fees[0].dueDate}
                      </p>
                      {data.fees[0].receiptNumber && (
                        <p className="text-[11px] text-slate-400 font-mono mt-0.5">
                          Receipt: {data.fees[0].receiptNumber}
                        </p>
                      )}
                    </div>
                  ) : (
                    <p className="text-xs text-slate-500 mt-3">No active fee record found.</p>
                  )}
                </div>
                <div className="pt-3 border-t border-slate-100 mt-3 flex justify-between items-center text-xs">
                  <span className="text-slate-400">Monthly Tuition</span>
                  <Link href="/fees" className="text-[#1E3A8A] font-bold hover:underline">
                    Fee Portal →
                  </Link>
                </div>
              </div>
            </div>

            {/* Navigation Tabs */}
            <div className="flex items-center gap-2 border-b border-slate-200 overflow-x-auto pb-2">
              <button
                type="button"
                onClick={() => setActiveTab("overview")}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer ${
                  activeTab === "overview"
                    ? "bg-[#0D1B3D] text-white shadow-sm"
                    : "bg-white text-slate-700 hover:bg-slate-100 border border-slate-200"
                }`}
              >
                Overview & Reports
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("academics")}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer ${
                  activeTab === "academics"
                    ? "bg-[#0D1B3D] text-white shadow-sm"
                    : "bg-white text-slate-700 hover:bg-slate-100 border border-slate-200"
                }`}
              >
                Subject-wise Marks
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("attendance")}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer ${
                  activeTab === "attendance"
                    ? "bg-[#0D1B3D] text-white shadow-sm"
                    : "bg-white text-slate-700 hover:bg-slate-100 border border-slate-200"
                }`}
              >
                Daily Attendance Register
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("fees")}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer ${
                  activeTab === "fees"
                    ? "bg-[#0D1B3D] text-white shadow-sm"
                    : "bg-white text-slate-700 hover:bg-slate-100 border border-slate-200"
                }`}
              >
                Fee Challans & Receipts
              </button>
            </div>

            {/* Tab 1: Overview & Subject Breakdown */}
            {activeTab === "overview" && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Left 8 Cols: Academic Result Table */}
                <div className="lg:col-span-8 bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                    <div>
                      <h3 className="font-bold text-base text-slate-900 font-heading flex items-center gap-2">
                        <Award className="w-5 h-5 text-[#D4AF37]" />
                        <span>Examination Marksheet Breakdown</span>
                      </h3>
                      <p className="text-xs text-slate-500 mt-0.5">
                        {data.latestResult?.examTerm || "Current Session Examination"}
                      </p>
                    </div>
                    {data.latestResult && (
                      <span className="text-xs bg-emerald-50 text-emerald-800 font-bold px-3 py-1 rounded-full border border-emerald-200">
                        {data.latestResult.obtainedMarks} / {data.latestResult.totalMarks} ({data.latestResult.percentage}%)
                      </span>
                    )}
                  </div>

                  {data.latestResult && Array.isArray(data.latestResult.subjectMarks) && data.latestResult.subjectMarks.length > 0 ? (
                    <div className="overflow-x-auto">
                      <table className="w-full text-xs text-left">
                        <thead className="bg-[#0D1B3D] text-white font-bold uppercase text-[11px]">
                          <tr>
                            <th className="py-2.5 px-3 rounded-l-lg">Subject</th>
                            <th className="py-2.5 px-3 text-center">Max Marks</th>
                            <th className="py-2.5 px-3 text-center">Obtained</th>
                            <th className="py-2.5 px-3 text-center">Percentage</th>
                            <th className="py-2.5 px-3 text-center rounded-r-lg">Grade</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {data.latestResult.subjectMarks.map((s, idx) => {
                            const pct = Math.round((s.obtainedMarks / s.maxMarks) * 100);
                            return (
                              <tr key={idx} className="hover:bg-slate-50 transition">
                                <td className="py-2.5 px-3 font-bold text-slate-900">{s.subject}</td>
                                <td className="py-2.5 px-3 text-center text-slate-500 font-mono">{s.maxMarks}</td>
                                <td className="py-2.5 px-3 text-center font-bold text-slate-900 font-mono">
                                  {s.obtainedMarks}
                                </td>
                                <td className="py-2.5 px-3 text-center font-medium">
                                  <div className="flex items-center justify-center gap-2">
                                    <div className="w-16 bg-slate-200 rounded-full h-1.5 overflow-hidden">
                                      <div
                                        className={`h-full ${pct >= 80 ? "bg-emerald-500" : pct >= 60 ? "bg-blue-500" : "bg-amber-500"}`}
                                        style={{ width: `${Math.min(pct, 100)}%` }}
                                      ></div>
                                    </div>
                                    <span className="text-[11px] font-mono">{pct}%</span>
                                  </div>
                                </td>
                                <td className="py-2.5 px-3 text-center">
                                  <span className={`font-black text-xs px-2 py-0.5 rounded ${
                                    s.grade === "A+" || s.grade === "A"
                                      ? "bg-emerald-100 text-emerald-800"
                                      : s.grade === "B"
                                      ? "bg-blue-100 text-blue-800"
                                      : "bg-amber-100 text-amber-800"
                                  }`}>
                                    {s.grade}
                                  </span>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <p className="text-xs text-slate-500 py-4 text-center">
                      Detailed subject marks have not been uploaded yet for this session.
                    </p>
                  )}

                  <div className="pt-2 flex items-center justify-between border-t border-slate-100 text-xs">
                    <p className="text-slate-500">
                      Grading Standard: <strong>A+ (80%+)</strong> • <strong>A (70-79%)</strong> • <strong>B (60-69%)</strong>
                    </p>
                    <Link
                      href={`/results?className=${encodeURIComponent(data.student.className)}&rollNumber=${encodeURIComponent(data.student.rollNumber)}`}
                      className="text-[#1E3A8A] font-bold hover:underline flex items-center gap-1"
                    >
                      <span>Full Printable Card</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>

                {/* Right 4 Cols: Fee Status & Announcements */}
                <div className="lg:col-span-4 space-y-6">
                  {/* Fee Voucher Quick Box */}
                  <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
                    <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                      <h3 className="font-bold text-sm text-slate-900 font-heading flex items-center gap-2">
                        <CreditCard className="w-4 h-4 text-[#D4AF37]" />
                        <span>Monthly Tuition Status</span>
                      </h3>
                      <Link href="/fees" className="text-xs font-semibold text-[#1E3A8A] hover:underline">
                        Details →
                      </Link>
                    </div>

                    {data.fees.length > 0 ? (
                      <div className="space-y-3">
                        <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                          <div className="flex justify-between items-center text-xs">
                            <span className="text-slate-500">Month:</span>
                            <span className="font-bold text-slate-900">{data.fees[0].month}</span>
                          </div>
                          <div className="flex justify-between items-center text-xs">
                            <span className="text-slate-500">Due Date:</span>
                            <span className="font-semibold text-slate-700">{data.fees[0].dueDate}</span>
                          </div>
                          <div className="flex justify-between items-center text-xs pt-1 border-t border-slate-200">
                            <span className="font-bold text-slate-700">Amount Due:</span>
                            <span className="font-black text-slate-900 text-sm">Rs. {data.fees[0].amount.toLocaleString()}</span>
                          </div>
                        </div>

                        <Link
                          href="/fees"
                          className="w-full inline-flex items-center justify-center gap-2 bg-[#0D1B3D] hover:bg-[#1E3A8A] text-white font-semibold py-2.5 rounded-xl text-xs shadow transition"
                        >
                          <span>Print Payment Voucher</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                      </div>
                    ) : (
                      <p className="text-xs text-slate-500">No pending fee record found for this student.</p>
                    )}
                  </div>

                  {/* School Announcements */}
                  <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-3">
                    <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                      <h3 className="font-bold text-sm text-slate-900 font-heading flex items-center gap-2">
                        <Bell className="w-4 h-4 text-[#0D1B3D]" />
                        <span>School Notices</span>
                      </h3>
                      <Link href="/announcements" className="text-xs font-semibold text-[#1E3A8A] hover:underline">
                        View All →
                      </Link>
                    </div>

                    <div className="space-y-2">
                      {data.recentAnnouncements && data.recentAnnouncements.length > 0 ? (
                        data.recentAnnouncements.map((ann) => (
                          <div key={ann.id} className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-1">
                            <p className="font-bold text-slate-900">{ann.title}</p>
                            <p className="text-[11px] text-slate-600 line-clamp-2">{ann.content}</p>
                            <p className="text-[10px] text-slate-400 font-medium">{ann.date}</p>
                          </div>
                        ))
                      ) : (
                        <p className="text-xs text-slate-500">No active circulars at this moment.</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Tab 2: Academics Detailed */}
            {activeTab === "academics" && (
              <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div>
                    <h3 className="text-base font-bold text-slate-900 font-heading">
                      Complete Subject Marksheet
                    </h3>
                    <p className="text-xs text-slate-500">
                      Session: {data.latestResult?.academicYear || "2024-2025"} • Term: {data.latestResult?.examTerm || "Weekly Test 1"}
                    </p>
                  </div>
                  <Link
                    href={`/results?className=${encodeURIComponent(data.student.className)}&rollNumber=${encodeURIComponent(data.student.rollNumber)}`}
                    className="inline-flex items-center gap-2 bg-[#D4AF37] hover:bg-amber-400 text-[#0D1B3D] font-bold px-4 py-2 rounded-xl text-xs shadow transition"
                  >
                    <Printer className="w-4 h-4" />
                    <span>Print Official Report Card</span>
                  </Link>
                </div>

                {data.latestResult && Array.isArray(data.latestResult.subjectMarks) && data.latestResult.subjectMarks.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="w-full text-xs text-left">
                      <thead className="bg-[#0D1B3D] text-white font-bold uppercase text-[11px]">
                        <tr>
                          <th className="py-3 px-4 rounded-l-lg">Subject Name</th>
                          <th className="py-3 px-4 text-center">Maximum Marks</th>
                          <th className="py-3 px-4 text-center">Marks Obtained</th>
                          <th className="py-3 px-4 text-center">Percentage</th>
                          <th className="py-3 px-4 text-center">Letter Grade</th>
                          <th className="py-3 px-4 rounded-r-lg">Teacher Remarks</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {data.latestResult.subjectMarks.map((s, idx) => {
                          const pct = Math.round((s.obtainedMarks / s.maxMarks) * 100);
                          return (
                            <tr key={idx} className="hover:bg-slate-50 transition">
                              <td className="py-3 px-4 font-bold text-slate-900 text-sm">{s.subject}</td>
                              <td className="py-3 px-4 text-center text-slate-600 font-mono">{s.maxMarks}</td>
                              <td className="py-3 px-4 text-center font-black text-slate-900 font-mono text-sm">
                                {s.obtainedMarks}
                              </td>
                              <td className="py-3 px-4 text-center font-bold text-slate-700">
                                {pct}%
                              </td>
                              <td className="py-3 px-4 text-center">
                                <span className={`font-black text-xs px-2.5 py-1 rounded-full ${
                                  s.grade === "A+" || s.grade === "A"
                                    ? "bg-emerald-100 text-emerald-800"
                                    : s.grade === "B"
                                    ? "bg-blue-100 text-blue-800"
                                    : "bg-amber-100 text-amber-800"
                                }`}>
                                  {s.grade}
                                </span>
                              </td>
                              <td className="py-3 px-4 text-slate-500">
                                {s.remarks || (pct >= 80 ? "Excellent understanding" : pct >= 60 ? "Good effort" : "Needs revision")}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                      <tfoot>
                        <tr className="bg-slate-50 font-bold border-t-2 border-slate-200">
                          <td className="py-3 px-4 text-slate-900">Grand Total</td>
                          <td className="py-3 px-4 text-center font-mono">{data.latestResult.totalMarks}</td>
                          <td className="py-3 px-4 text-center font-mono text-slate-900 font-black">
                            {data.latestResult.obtainedMarks}
                          </td>
                          <td className="py-3 px-4 text-center text-emerald-700 font-black">
                            {data.latestResult.percentage}%
                          </td>
                          <td className="py-3 px-4 text-center">
                            <span className="bg-[#0D1B3D] text-white px-2 py-0.5 rounded font-black">
                              {data.latestResult.overallGrade}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-emerald-700 font-bold">
                            {data.latestResult.status === "PASS" ? "PROMOTED / PASS" : "NEEDS RE-EXAM"}
                          </td>
                        </tr>
                      </tfoot>
                    </table>
                  </div>
                ) : (
                  <p className="text-xs text-slate-500 py-6 text-center">No examination marks published yet.</p>
                )}
              </div>
            )}

            {/* Tab 3: Attendance Register */}
            {activeTab === "attendance" && (
              <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-6">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div>
                    <h3 className="text-base font-bold text-slate-900 font-heading">
                      Daily Attendance Register & Punctuality
                    </h3>
                    <p className="text-xs text-slate-500">
                      Verified roll-call attendance logs recorded by class teachers.
                    </p>
                  </div>
                  {data.attendanceSummary && (
                    <span className="text-xs bg-emerald-50 text-emerald-800 border border-emerald-200 font-bold px-3 py-1 rounded-full">
                      Attendance Rate: {data.attendanceSummary.percentage}%
                    </span>
                  )}
                </div>

                {/* 4 Attendance Stat Cards */}
                {data.attendanceSummary && (
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 text-center">
                      <p className="text-[11px] font-bold text-emerald-800 uppercase">Present Days</p>
                      <h4 className="text-2xl font-black text-emerald-700 mt-1">{data.attendanceSummary.presentDays}</h4>
                    </div>
                    <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-center">
                      <p className="text-[11px] font-bold text-amber-800 uppercase">Late Arrivals</p>
                      <h4 className="text-2xl font-black text-amber-700 mt-1">{data.attendanceSummary.lateDays}</h4>
                    </div>
                    <div className="bg-rose-50 border border-rose-200 rounded-xl p-3 text-center">
                      <p className="text-[11px] font-bold text-rose-800 uppercase">Absences</p>
                      <h4 className="text-2xl font-black text-rose-700 mt-1">{data.attendanceSummary.absentDays}</h4>
                    </div>
                    <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 text-center">
                      <p className="text-[11px] font-bold text-blue-800 uppercase">Leaves Approved</p>
                      <h4 className="text-2xl font-black text-blue-700 mt-1">{data.attendanceSummary.leaveDays}</h4>
                    </div>
                  </div>
                )}

                {/* Recent Daily Logs Table */}
                <div>
                  <h4 className="font-bold text-xs uppercase text-slate-700 mb-3 tracking-wider">
                    Recent Daily Attendance Logs
                  </h4>
                  {data.attendanceSummary?.recentLogs && data.attendanceSummary.recentLogs.length > 0 ? (
                    <div className="overflow-x-auto">
                      <table className="w-full text-xs text-left">
                        <thead className="bg-[#0D1B3D] text-white font-bold uppercase text-[11px]">
                          <tr>
                            <th className="py-2.5 px-3 rounded-l-lg">Date</th>
                            <th className="py-2.5 px-3 text-center">Status</th>
                            <th className="py-2.5 px-3 text-center">Time</th>
                            <th className="py-2.5 px-3 rounded-r-lg">Remarks</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {data.attendanceSummary.recentLogs.map((log) => (
                            <tr key={log.id} className="hover:bg-slate-50 transition">
                              <td className="py-2.5 px-3 font-semibold text-slate-900">{log.date}</td>
                              <td className="py-2.5 px-3 text-center">
                                <span className={`font-bold text-xs px-2.5 py-0.5 rounded-full ${
                                  log.status === "PRESENT"
                                    ? "bg-emerald-100 text-emerald-800"
                                    : log.status === "LATE"
                                    ? "bg-amber-100 text-amber-800"
                                    : log.status === "LEAVE"
                                    ? "bg-blue-100 text-blue-800"
                                    : "bg-rose-100 text-rose-800"
                                }`}>
                                  {log.status}
                                </span>
                              </td>
                              <td className="py-2.5 px-3 text-center text-slate-600 font-mono">
                                {log.checkInTime || "—"}
                              </td>
                              <td className="py-2.5 px-3 text-slate-500">{log.remarks || "Recorded in class register"}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <p className="text-xs text-slate-500 py-3">No individual day logs recorded yet.</p>
                  )}
                </div>
              </div>
            )}

            {/* Tab 4: Fees Detailed */}
            {activeTab === "fees" && (
              <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div>
                    <h3 className="text-base font-bold text-slate-900 font-heading">
                      Fee Vouchers & Payment History
                    </h3>
                    <p className="text-xs text-slate-500">
                      Official computerized monthly tuition fees and receipts.
                    </p>
                  </div>
                  <Link
                    href="/fees"
                    className="inline-flex items-center gap-1.5 bg-[#0D1B3D] text-white px-3.5 py-2 rounded-xl text-xs font-semibold hover:bg-[#1E3A8A] transition shadow"
                  >
                    <span>Download Bank Voucher</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>

                {data.fees.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="w-full text-xs text-left">
                      <thead className="bg-[#0D1B3D] text-white font-bold uppercase text-[11px]">
                        <tr>
                          <th className="py-3 px-4 rounded-l-lg">Billing Month</th>
                          <th className="py-3 px-4 text-center">Amount Due</th>
                          <th className="py-3 px-4 text-center">Due Date</th>
                          <th className="py-3 px-4 text-center">Payment Status</th>
                          <th className="py-3 px-4 text-center">Paid Date</th>
                          <th className="py-3 px-4 rounded-r-lg">Receipt Number</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {data.fees.map((fee) => (
                          <tr key={fee.id} className="hover:bg-slate-50 transition">
                            <td className="py-3 px-4 font-bold text-slate-900">{fee.month}</td>
                            <td className="py-3 px-4 text-center font-mono font-bold text-slate-900">
                              Rs. {fee.amount.toLocaleString()}
                            </td>
                            <td className="py-3 px-4 text-center text-slate-600">{fee.dueDate}</td>
                            <td className="py-3 px-4 text-center">
                              <span className={`font-bold text-xs px-2.5 py-1 rounded-full uppercase ${
                                fee.status === "PAID"
                                  ? "bg-emerald-100 text-emerald-800 border border-emerald-200"
                                  : fee.status === "PENDING"
                                  ? "bg-amber-100 text-amber-800 border border-amber-200"
                                  : "bg-rose-100 text-rose-800 border border-rose-200"
                              }`}>
                                {fee.status}
                              </span>
                            </td>
                            <td className="py-3 px-4 text-center text-slate-600">
                              {fee.paidDate || "—"}
                            </td>
                            <td className="py-3 px-4 font-mono text-slate-700">
                              {fee.receiptNumber || "Pending"}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p className="text-xs text-slate-500 py-6 text-center">No fee history found for this student.</p>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default function ParentDashboardPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#F2F4F7] flex items-center justify-center p-8">
          <div className="text-center space-y-2">
            <div className="w-10 h-10 border-4 border-[#0D1B3D] border-t-[#D4AF37] rounded-full animate-spin mx-auto"></div>
            <p className="text-xs text-slate-500 font-semibold">Loading Parent Portal...</p>
          </div>
        </div>
      }
    >
      <ParentPortalContent />
    </Suspense>
  );
}
