"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  GraduationCap,
  BookOpen,
  Calendar,
  Clock,
  Award,
  CheckCircle2,
  TrendingUp,
  ArrowRight,
  Printer,
  Search,
  Sparkles,
  CreditCard,
  AlertCircle,
  RefreshCw,
  Bell,
  User,
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
  { label: "Class 1 — Roll 1 (Aarish Ali)", className: "Class 1", roll: "1" },
  { label: "Class 1 — Roll 43 (Usman - 97.5%)", className: "Class 1", roll: "43" },
  { label: "Class 9 — Roll 101 (Muhammad Ali)", className: "Class 9", roll: "101" },
  { label: "Class 10 — Roll 201 (Hamza Farooq)", className: "Class 10", roll: "201" },
  { label: "Class 8 — Roll 301 (Rayyan Ahmed)", className: "Class 8", roll: "301" },
];

const STANDARD_TIMETABLE = [
  { period: 1, subject: "English Language & Grammar", time: "08:00 AM – 08:45 AM", room: "Room 101" },
  { period: 2, subject: "Mathematics", time: "08:45 AM – 09:30 AM", room: "Room 101" },
  { period: 3, subject: "General Science / Biology", time: "09:30 AM – 10:15 AM", room: "Science Lab" },
  { period: 4, subject: "Urdu Literature & Writing", time: "10:45 AM – 11:30 AM", room: "Room 101" },
  { period: 5, subject: "Islamiyat / Sindhi", time: "11:30 AM – 12:15 PM", room: "Room 101" },
  { period: 6, subject: "Computer Science / Social Studies", time: "12:15 PM – 01:00 PM", room: "Computer Lab" },
];

function StudentPortalContent() {
  const searchParams = useSearchParams();
  const initialClass = searchParams.get("class") || searchParams.get("className") || "Class 9";
  const initialRoll = searchParams.get("roll") || searchParams.get("rollNumber") || "";

  const [selectedClass, setSelectedClass] = useState(initialClass);
  const [rollNumber, setRollNumber] = useState(initialRoll);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<SearchResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchStudentRecord = async (cls: string, roll: string) => {
    if (!cls || !roll.trim()) {
      setError("Please select your class and enter your roll number.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`/api/search?className=${encodeURIComponent(cls)}&rollNumber=${encodeURIComponent(roll.trim())}`);
      const json = await res.json();

      if (!res.ok || !json.ok) {
        setError(json.error || "Student record not found. Please verify your roll number.");
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
      fetchStudentRecord(initialClass, initialRoll);
    }
  }, [initialClass, initialRoll]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchStudentRecord(selectedClass, rollNumber);
  };

  const handleQuickSelect = (cls: string, roll: string) => {
    setSelectedClass(cls);
    setRollNumber(roll);
    fetchStudentRecord(cls, roll);
  };

  return (
    <div className="min-h-screen bg-[#F2F4F7] py-6 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Top Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div>
            <div className="flex items-center gap-2">
              <span className="bg-[#0D1B3D] text-[#D4AF37] text-xs font-bold px-2.5 py-1 rounded-lg uppercase tracking-wider">
                Student Portal
              </span>
              <span className="text-xs text-slate-500 font-medium">Nayab English Grammer High School</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0D1B3D] tracking-tight font-heading mt-1 flex items-center gap-2">
              <span>{data ? `Welcome back, ${data.student.name}!` : "Student Academic Portal"}</span>
              <span className="text-2xl">🎓</span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              {data
                ? `${data.student.className} • Section ${data.student.section} • Roll #${data.student.rollNumber}`
                : "Check your class timetable, term examination marks, and attendance register."}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-[#F2F4F7] text-[#0D1B3D] border border-slate-200 px-3.5 py-2 rounded-xl text-xs font-semibold">
              <Calendar className="w-3.5 h-3.5 text-[#1E3A8A]" />
              <span>{new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })}</span>
            </div>

            {data && (
              <Link
                href={`/results?className=${encodeURIComponent(data.student.className)}&rollNumber=${encodeURIComponent(data.student.rollNumber)}`}
                className="inline-flex items-center gap-1.5 bg-[#0D1B3D] hover:bg-[#1E3A8A] text-white px-3.5 py-2 rounded-xl text-xs font-semibold shadow transition"
              >
                <Printer className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span>Print Marksheet</span>
              </Link>
            )}
          </div>
        </div>

        {/* Search Card */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-sm">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="sm:w-1/3">
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Select Your Class
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
                  Your Roll Number or G.R. Number
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={rollNumber}
                    onChange={(e) => setRollNumber(e.target.value)}
                    placeholder="e.g. 1, 43, 101, 201, 301"
                    className="w-full h-11 bg-slate-50 border border-slate-300 rounded-xl pl-3 pr-10 text-sm font-medium text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0D1B3D]"
                  />
                  <GraduationCap className="w-4 h-4 text-slate-400 absolute right-3 top-3.5" />
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
                      <span>Open Portal</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Quick Demo Roll Chips */}
            <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center gap-2 text-xs">
              <span className="text-slate-500 font-medium flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" /> Quick Student Demos:
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
          </form>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="bg-rose-50 border border-rose-200 text-rose-800 p-4 rounded-xl flex items-start gap-3 text-sm animate-in fade-in">
            <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold">Student Record Not Found</p>
              <p className="text-xs text-rose-700 mt-0.5">{error}</p>
            </div>
          </div>
        )}

        {/* Empty State before search */}
        {!data && !error && !loading && (
          <div className="bg-white rounded-2xl border border-slate-200 p-8 sm:p-12 text-center space-y-4 shadow-sm">
            <div className="w-16 h-16 rounded-2xl bg-blue-50 border border-blue-100 text-[#0D1B3D] flex items-center justify-center mx-auto shadow-inner">
              <GraduationCap className="w-8 h-8 text-[#1E3A8A]" />
            </div>
            <div className="max-w-md mx-auto space-y-1">
              <h2 className="text-xl font-bold text-slate-900 font-heading">
                Enter Your Class & Roll Number
              </h2>
              <p className="text-xs sm:text-sm text-slate-500">
                View your personal marksheet, daily roll-call attendance percentage, timetable, and upcoming school announcements instantly.
              </p>
            </div>
            <div className="pt-2 flex flex-wrap items-center justify-center gap-2">
              <button
                type="button"
                onClick={() => handleQuickSelect("Class 1", "1")}
                className="bg-[#0D1B3D] text-[#D4AF37] hover:bg-[#1E3A8A] px-4 py-2 rounded-xl text-xs font-bold transition shadow"
              >
                Try Roll #1 (Class 1)
              </button>
              <button
                type="button"
                onClick={() => handleQuickSelect("Class 9", "101")}
                className="bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300 px-4 py-2 rounded-xl text-xs font-bold transition"
              >
                Try Roll #101 (Class 9)
              </button>
            </div>
          </div>
        )}

        {/* Live Student Data Loaded */}
        {data && data.student && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
            {/* Row 1: 4 Key Metric Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {/* Card 1: Exam Score */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-blue-50 text-[#1E3A8A] flex items-center justify-center shrink-0">
                  <Award className="w-6 h-6 text-[#1E3A8A]" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-500">Academic Score</p>
                  <h3 className="text-2xl font-black text-slate-900 mt-0.5 tracking-tight font-heading">
                    {data.latestResult ? `${data.latestResult.percentage}%` : "—"}
                  </h3>
                  {data.latestResult && (
                    <span className="text-[10px] font-bold text-emerald-600">
                      Grade {data.latestResult.overallGrade}
                    </span>
                  )}
                </div>
              </div>

              {/* Card 2: Attendance */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-emerald-50 text-[#22C55E] flex items-center justify-center shrink-0">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-500">Attendance</p>
                  <h3 className="text-2xl font-black text-[#22C55E] mt-0.5 tracking-tight font-heading">
                    {data.attendanceSummary ? `${data.attendanceSummary.percentage}%` : "100%"}
                  </h3>
                  {data.attendanceSummary && (
                    <span className="text-[10px] font-bold text-slate-500">
                      {data.attendanceSummary.presentDays} / {data.attendanceSummary.totalDays} Days
                    </span>
                  )}
                </div>
              </div>

              {/* Card 3: Fee Clearance */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-amber-50 text-[#F59E0B] flex items-center justify-center shrink-0">
                  <CreditCard className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-500">Fee Standing</p>
                  <h3 className="text-lg font-black text-slate-900 mt-0.5 tracking-tight font-heading">
                    {data.fees.length > 0 ? (
                      <span className={data.fees[0].status === "PAID" ? "text-emerald-600" : "text-amber-600"}>
                        {data.fees[0].status}
                      </span>
                    ) : (
                      "Clear"
                    )}
                  </h3>
                  <span className="text-[10px] text-slate-400">
                    {data.fees.length > 0 ? data.fees[0].month : "Current Month"}
                  </span>
                </div>
              </div>

              {/* Card 4: Subjects Count */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center shrink-0">
                  <BookOpen className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-500">Subjects</p>
                  <h3 className="text-2xl font-black text-slate-900 mt-0.5 tracking-tight font-heading">
                    {data.latestResult?.subjectMarks?.length || 6}
                  </h3>
                  <span className="text-[10px] font-bold text-purple-700">Enrolled Courses</span>
                </div>
              </div>
            </div>

            {/* Row 2: Timetable & Marks Breakdown */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Left 5 Cols: Daily Class Timetable */}
              <div className="lg:col-span-5 bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <h2 className="text-base font-bold text-slate-900 font-heading flex items-center gap-2">
                    <Clock className="w-4 h-4 text-[#1E3A8A]" />
                    <span>Daily Class Timetable</span>
                  </h2>
                  <span className="text-xs text-[#D4AF37] font-bold">6 Periods</span>
                </div>

                <div className="divide-y divide-slate-100">
                  {STANDARD_TIMETABLE.map((t) => (
                    <div key={t.period} className="py-2.5 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2.5">
                        <span className="w-6 h-6 rounded-lg bg-slate-100 text-slate-700 font-bold flex items-center justify-center text-[11px] shrink-0">
                          {t.period}
                        </span>
                        <div>
                          <p className="font-bold text-slate-900 text-xs">{t.subject}</p>
                          <p className="text-[10px] text-slate-400">{t.room}</p>
                        </div>
                      </div>
                      <span className="font-semibold text-slate-600 bg-slate-50 px-2 py-1 rounded-md border border-slate-200 text-[11px]">
                        {t.time}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-slate-500">Morning Assembly: <strong>07:45 AM</strong></span>
                  <Link href="/academics" className="text-[#1E3A8A] font-bold hover:underline flex items-center gap-1">
                    <span>Syllabus →</span>
                  </Link>
                </div>
              </div>

              {/* Right 7 Cols: Examination Results Breakdown */}
              <div className="lg:col-span-7 bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div>
                    <h2 className="text-base font-bold text-slate-900 font-heading flex items-center gap-2">
                      <Award className="w-4 h-4 text-[#D4AF37]" />
                      <span>Latest Examination Marks</span>
                    </h2>
                    <p className="text-xs text-slate-500">
                      {data.latestResult?.examTerm || "Current Session"}
                    </p>
                  </div>
                  {data.latestResult && (
                    <span className="text-xs bg-emerald-50 text-emerald-800 border border-emerald-200 font-bold px-2.5 py-1 rounded-full">
                      Grand Total: {data.latestResult.obtainedMarks}/{data.latestResult.totalMarks} ({data.latestResult.percentage}%)
                    </span>
                  )}
                </div>

                {data.latestResult && Array.isArray(data.latestResult.subjectMarks) && data.latestResult.subjectMarks.length > 0 ? (
                  <div className="space-y-3">
                    {data.latestResult.subjectMarks.map((sub, idx) => {
                      const pct = Math.round((sub.obtainedMarks / sub.maxMarks) * 100);
                      return (
                        <div key={idx} className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-1.5">
                          <div className="flex items-center justify-between text-xs">
                            <span className="font-bold text-slate-900">{sub.subject}</span>
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-slate-700 font-mono">
                                {sub.obtainedMarks} / {sub.maxMarks}
                              </span>
                              <span className={`font-black text-[11px] px-2 py-0.5 rounded ${
                                sub.grade === "A+" || sub.grade === "A"
                                  ? "bg-emerald-100 text-emerald-800"
                                  : sub.grade === "B"
                                  ? "bg-blue-100 text-blue-800"
                                  : "bg-amber-100 text-amber-800"
                              }`}>
                                {sub.grade}
                              </span>
                            </div>
                          </div>
                          <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                            <div
                              className={`h-full transition-all duration-500 ${
                                pct >= 80 ? "bg-emerald-500" : pct >= 60 ? "bg-blue-500" : "bg-amber-500"
                              }`}
                              style={{ width: `${Math.min(pct, 100)}%` }}
                            ></div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <p className="text-xs text-slate-500 py-6 text-center">
                    Examination marks have not been uploaded yet for this session.
                  </p>
                )}

                <div className="pt-2 flex items-center justify-between border-t border-slate-100 text-xs">
                  <Link
                    href={`/parent?class=${encodeURIComponent(data.student.className)}&roll=${encodeURIComponent(data.student.rollNumber)}`}
                    className="text-slate-600 hover:text-[#0D1B3D] font-medium"
                  >
                    ← Switch to Parent View
                  </Link>
                  <Link
                    href={`/results?className=${encodeURIComponent(data.student.className)}&rollNumber=${encodeURIComponent(data.student.rollNumber)}`}
                    className="text-[#1E3A8A] font-bold hover:underline flex items-center gap-1"
                  >
                    <span>Print Formal Report Card</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div>

            {/* Row 3: Notice Board */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <h3 className="font-bold text-sm text-slate-900 font-heading flex items-center gap-2">
                  <Bell className="w-4 h-4 text-[#0D1B3D]" />
                  <span>Student Notice Board</span>
                </h3>
                <Link href="/announcements" className="text-xs font-semibold text-[#1E3A8A] hover:underline">
                  View All Announcements →
                </Link>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {data.recentAnnouncements && data.recentAnnouncements.length > 0 ? (
                  data.recentAnnouncements.map((ann) => (
                    <div key={ann.id} className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-1">
                      <p className="font-bold text-slate-900">{ann.title}</p>
                      <p className="text-[11px] text-slate-600 line-clamp-2">{ann.content}</p>
                      <p className="text-[10px] text-slate-400 font-medium">{ann.date}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-slate-500">No active student notices at this moment.</p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function StudentDashboardPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#F2F4F7] flex items-center justify-center p-8">
          <div className="text-center space-y-2">
            <div className="w-10 h-10 border-4 border-[#0D1B3D] border-t-[#D4AF37] rounded-full animate-spin mx-auto"></div>
            <p className="text-xs text-slate-500 font-semibold">Loading Student Portal...</p>
          </div>
        </div>
      }
    >
      <StudentPortalContent />
    </Suspense>
  );
}
