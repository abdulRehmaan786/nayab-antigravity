"use client";

import { useState } from "react";
import Link from "next/link";
import { Search, Sparkles, User, Award, CreditCard, ChevronRight, AlertCircle, Printer, CheckCircle2, Clock, XCircle } from "lucide-react";
import { StudentData, ExamResultData, FeeRecordData, AnnouncementData } from "@/lib/types";

interface SearchResponse {
  ok: boolean;
  student: StudentData;
  latestResult: ExamResultData | null;
  fees: FeeRecordData[];
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
  { label: "Class 9 — Roll 101 (Distinction)", className: "Class 9", roll: "101" },
  { label: "Class 10 — Roll 201 (Top Rank)", className: "Class 10", roll: "201" },
  { label: "Class 8 — Roll 301 (A+ Grade)", className: "Class 8", roll: "301" },
  { label: "Class 9 — Roll 105 (Needs Dues)", className: "Class 9", roll: "105" },
];

export default function RollNumberSearch({ initialClass = "Class 9", initialRoll = "" }: { initialClass?: string; initialRoll?: string }) {
  const [selectedClass, setSelectedClass] = useState(initialClass);
  const [rollNumber, setRollNumber] = useState(initialRoll);
  const [loading, setLoading] = useState(false);
  const [resultData, setResultData] = useState<SearchResponse | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

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
      {/* Search Input Box */}
      <div className="bg-white rounded-2xl shadow-lg border border-slate-200/80 p-5 sm:p-7 transition-all duration-200 hover:shadow-xl">
        <div className="mb-4">
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
            Student Lookup Portal (No Login Required)
          </label>
          <p className="text-sm text-slate-600">
            Parents and students can check latest examination results, monthly fee status, and school notices.
          </p>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSearch();
          }}
          className="grid grid-cols-1 sm:grid-cols-12 gap-3"
        >
          {/* Class Select */}
          <div className="sm:col-span-5">
            <label className="block text-xs font-semibold text-slate-700 mb-1">Select Class</label>
            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="w-full h-12 bg-slate-50 border border-slate-300 rounded-xl px-3.5 text-sm font-medium text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#1B2A4A]"
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
            <label className="block text-xs font-semibold text-slate-700 mb-1">Roll Number</label>
            <input
              type="text"
              value={rollNumber}
              onChange={(e) => setRollNumber(e.target.value)}
              placeholder="e.g. 101, 201"
              className="w-full h-12 bg-slate-50 border border-slate-300 rounded-xl px-3.5 text-sm font-medium text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#1B2A4A]"
            />
          </div>

          {/* Search Button */}
          <div className="sm:col-span-3 flex items-end">
            <button
              type="submit"
              disabled={loading}
              className="w-full h-12 bg-[#1B2A4A] hover:bg-[#111C32] text-white font-semibold rounded-xl px-4 flex items-center justify-center gap-2 shadow transition active:scale-[0.99] disabled:opacity-60"
            >
              <Search className="w-4 h-4 text-[#D4AF37]" />
              <span>{loading ? "Searching..." : "Search Record"}</span>
            </button>
          </div>
        </form>

        {/* Demo Fast-Fill Chips */}
        <div className="mt-4 pt-3 border-t border-slate-100 flex flex-wrap items-center gap-2 text-xs">
          <span className="text-slate-500 font-medium flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" /> Try Demo:
          </span>
          {DEMO_STUDENTS.map((demo) => (
            <button
              key={demo.label}
              type="button"
              onClick={() => handleQuickSelect(demo.className, demo.roll)}
              className="bg-slate-100 hover:bg-[#FCF9EE] hover:border-[#D4AF37] text-slate-700 hover:text-[#1B2A4A] border border-slate-200 px-2.5 py-1 rounded-lg transition font-medium text-[11px]"
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
          <div className="bg-gradient-to-r from-[#1B2A4A] to-[#253966] text-white p-5 sm:p-6 rounded-2xl shadow-md border border-[#D4AF37]/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-white/10 border border-[#D4AF37] flex items-center justify-center font-bold text-xl text-[#D4AF37]">
                {resultData.student.name.charAt(0)}
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h2 className="text-xl sm:text-2xl font-bold tracking-tight">{resultData.student.name}</h2>
                  <span className="bg-[#D4AF37] text-[#111C32] text-xs font-extrabold px-2.5 py-0.5 rounded-full uppercase">
                    Roll #{resultData.student.rollNumber}
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-slate-300 mt-1">
                  S/O or D/O: <span className="font-semibold text-white">{resultData.student.fatherName}</span> • Class:{" "}
                  <span className="font-semibold text-white">{resultData.student.className}</span> (Section{" "}
                  {resultData.student.section})
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Link
                href={`/results?class=${encodeURIComponent(resultData.student.className)}&roll=${encodeURIComponent(resultData.student.rollNumber)}`}
                className="bg-white text-[#1B2A4A] hover:bg-slate-100 font-semibold px-4 py-2.5 rounded-xl text-xs sm:text-sm flex items-center gap-2 shadow transition"
              >
                <Printer className="w-4 h-4 text-[#1B2A4A]" />
                <span>Full Report Card</span>
              </Link>
            </div>
          </div>

          {/* Quick Metrics Grid: Result + Fee Status */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Examination Result Box */}
            <div className="bg-white rounded-2xl p-5 sm:p-6 shadow-sm border border-slate-200">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2 text-slate-800 font-bold text-base">
                  <Award className="w-5 h-5 text-[#D4AF37]" />
                  <span>Latest Academic Result</span>
                </div>
                {resultData.latestResult && (
                  <span className="text-xs text-slate-500 font-medium">
                    {resultData.latestResult.examTerm}
                  </span>
                )}
              </div>

              {resultData.latestResult ? (
                <div className="mt-4 space-y-4">
                  <div className="grid grid-cols-3 gap-3 text-center">
                    <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                      <p className="text-xs text-slate-500 font-medium">Total Marks</p>
                      <p className="text-base sm:text-lg font-bold text-[#1B2A4A] mt-0.5">
                        {resultData.latestResult.obtainedMarks} / {resultData.latestResult.totalMarks}
                      </p>
                    </div>
                    <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                      <p className="text-xs text-slate-500 font-medium">Percentage</p>
                      <p className="text-base sm:text-lg font-bold text-[#1B2A4A] mt-0.5">
                        {resultData.latestResult.percentage}%
                      </p>
                    </div>
                    <div
                      className={`p-3 rounded-xl border ${
                        resultData.latestResult.status === "PASS"
                          ? "bg-emerald-50 border-emerald-200 text-emerald-800"
                          : "bg-rose-50 border-rose-200 text-rose-800"
                      }`}
                    >
                      <p className="text-xs font-semibold">Grade</p>
                      <p className="text-lg font-extrabold mt-0.5">
                        {resultData.latestResult.overallGrade} ({resultData.latestResult.status})
                      </p>
                    </div>
                  </div>

                  {resultData.latestResult.remarks && (
                    <div className="bg-[#F8F9FB] p-3 rounded-xl text-xs text-slate-700 border border-slate-200">
                      <span className="font-semibold text-[#1B2A4A]">Teacher Remarks: </span>
                      {resultData.latestResult.remarks}
                    </div>
                  )}

                  <Link
                    href={`/results?class=${encodeURIComponent(resultData.student.className)}&roll=${encodeURIComponent(resultData.student.rollNumber)}`}
                    className="block text-center text-xs font-semibold text-[#1B2A4A] hover:text-[#D4AF37] hover:underline pt-1"
                  >
                    Click to view subject-wise mark sheet & printable certificate →
                  </Link>
                </div>
              ) : (
                <div className="py-6 text-center text-xs text-slate-500">
                  Examination results for this term are being compiled by the teachers.
                </div>
              )}
            </div>

            {/* Fee Status Box */}
            <div className="bg-white rounded-2xl p-5 sm:p-6 shadow-sm border border-slate-200">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2 text-slate-800 font-bold text-base">
                  <CreditCard className="w-5 h-5 text-[#1B2A4A]" />
                  <span>Monthly Fee Status</span>
                </div>
                <Link href="/fees" className="text-xs font-medium text-[#1B2A4A] hover:underline">
                  Payment Info
                </Link>
              </div>

              {resultData.fees && resultData.fees.length > 0 ? (
                <div className="mt-4 space-y-3">
                  {resultData.fees.map((fee) => {
                    const isPaid = fee.status === "PAID";
                    const isPending = fee.status === "PENDING";
                    return (
                      <div
                        key={fee.id}
                        className="flex items-center justify-between p-3 rounded-xl border border-slate-100 bg-slate-50"
                      >
                        <div>
                          <p className="text-xs font-bold text-slate-800">{fee.month}</p>
                          <p className="text-[11px] text-slate-500">
                            Due: {fee.dueDate} • Amount: Rs. {fee.amount.toLocaleString()}
                          </p>
                          {fee.receiptNumber && (
                            <p className="text-[10px] text-emerald-700 font-mono mt-0.5">
                              Receipt: {fee.receiptNumber}
                            </p>
                          )}
                        </div>
                        <div>
                          {isPaid && (
                            <span className="inline-flex items-center gap-1 bg-emerald-100 text-emerald-800 text-xs font-bold px-2.5 py-1 rounded-full">
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                              Paid
                            </span>
                          )}
                          {isPending && (
                            <span className="inline-flex items-center gap-1 bg-amber-100 text-amber-800 text-xs font-bold px-2.5 py-1 rounded-full">
                              <Clock className="w-3.5 h-3.5 text-amber-600" />
                              Pending
                            </span>
                          )}
                          {!isPaid && !isPending && (
                            <span className="inline-flex items-center gap-1 bg-rose-100 text-rose-800 text-xs font-bold px-2.5 py-1 rounded-full">
                              <XCircle className="w-3.5 h-3.5 text-rose-600" />
                              Unpaid
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="py-6 text-center text-xs text-slate-500">
                  No active fee vouchers found for this roll number.
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
