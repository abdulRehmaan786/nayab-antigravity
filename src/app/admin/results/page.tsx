"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Award, Filter, Search, Printer, ExternalLink, CheckCircle2, XCircle } from "lucide-react";
import { ExamResultData } from "@/lib/types";

const CLASSES = ["All Classes", "Class 10", "Class 9", "Class 8", "Class 7", "Class 6"];

export default function AdminResultsPage() {
  const [results, setResults] = useState<ExamResultData[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedClass, setSelectedClass] = useState("All Classes");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    loadResults();
  }, [selectedClass]);

  const loadResults = async () => {
    setLoading(true);
    try {
      const cls = selectedClass === "All Classes" ? "all" : selectedClass;
      const res = await fetch(`/api/results?className=${encodeURIComponent(cls)}`);
      const data = await res.json();
      if (data && data.results) {
        setResults(data.results);
      }
    } catch {
      console.error("Failed to load results");
    } finally {
      setLoading(false);
    }
  };

  const filtered = results.filter((r) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    const sName = r.student?.name?.toLowerCase() || "";
    const sRoll = r.student?.rollNumber?.toLowerCase() || "";
    return sName.includes(q) || sRoll.includes(q) || r.overallGrade.toLowerCase().includes(q);
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <Award className="w-6 h-6 text-[#D4AF37]" />
            <span>Examination Results Register</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Review published marksheets, letter grades, and print official student report cards.
          </p>
        </div>

        <Link
          href="/teacher/marks-entry"
          className="inline-flex items-center gap-2 bg-[#1B2A4A] hover:bg-[#111C32] text-white px-4 py-2.5 rounded-xl text-xs font-bold shadow transition"
        >
          <span>Open Marks Entry Sheet</span>
        </Link>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="w-4 h-4 text-slate-400 shrink-0" />
          <select
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
            className="bg-slate-50 border border-slate-300 rounded-xl px-3 py-1.5 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#1B2A4A]"
          >
            {CLASSES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
          <span className="text-xs text-slate-400 ml-2">
            ({filtered.length} marksheets)
          </span>
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search student or roll number..."
            className="w-full pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#1B2A4A]"
          />
        </div>
      </div>

      {/* Results Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-xs text-slate-500">
            Loading examination marksheets...
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center text-slate-500">
            <p className="font-bold text-slate-700 text-sm">No exam results found</p>
            <p className="text-xs text-slate-400 mt-1">
              Ensure teachers have entered and published marks for this class.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-[#1B2A4A] text-white">
                  <th className="p-3.5 font-bold">Student Name</th>
                  <th className="p-3.5 font-bold">Class & Roll</th>
                  <th className="p-3.5 font-bold">Exam Term</th>
                  <th className="p-3.5 font-bold text-center">Marks Obtained</th>
                  <th className="p-3.5 font-bold text-center">Percentage</th>
                  <th className="p-3.5 font-bold text-center">Grade</th>
                  <th className="p-3.5 font-bold text-center">Result Status</th>
                  <th className="p-3.5 font-bold text-right">Official Card</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((r, idx) => (
                  <tr key={r.id} className={idx % 2 === 0 ? "bg-white" : "bg-slate-50/50"}>
                    <td className="p-3.5 font-bold text-slate-900">
                      {r.student?.name}
                      <span className="block text-[11px] font-normal text-slate-500">
                        S/O {r.student?.fatherName}
                      </span>
                    </td>
                    <td className="p-3.5">
                      <span className="font-semibold text-slate-800">{r.student?.className}</span>
                      <span className="block font-mono text-slate-500 text-[11px]">
                        Roll #{r.student?.rollNumber}
                      </span>
                    </td>
                    <td className="p-3.5 text-slate-700 font-medium">{r.examTerm}</td>
                    <td className="p-3.5 text-center font-bold text-slate-900">
                      {r.obtainedMarks} / {r.totalMarks}
                    </td>
                    <td className="p-3.5 text-center font-mono font-bold text-[#1B2A4A]">
                      {r.percentage}%
                    </td>
                    <td className="p-3.5 text-center">
                      <span
                        className={`inline-block px-2 py-0.5 rounded text-xs font-black ${
                          r.overallGrade === "A+"
                            ? "bg-emerald-100 text-emerald-800"
                            : r.overallGrade === "A"
                            ? "bg-blue-100 text-blue-800"
                            : r.overallGrade === "B"
                            ? "bg-amber-100 text-amber-800"
                            : r.overallGrade === "C"
                            ? "bg-orange-100 text-orange-800"
                            : "bg-rose-100 text-rose-800"
                        }`}
                      >
                        {r.overallGrade}
                      </span>
                    </td>
                    <td className="p-3.5 text-center">
                      {r.status === "PASS" ? (
                        <span className="inline-flex items-center gap-1 text-emerald-700 font-bold text-[11px]">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Pass
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-rose-700 font-bold text-[11px]">
                          <XCircle className="w-3.5 h-3.5" /> Fail
                        </span>
                      )}
                    </td>
                    <td className="p-3.5 text-right">
                      <Link
                        href={`/results?class=${encodeURIComponent(r.student?.className || "")}&roll=${encodeURIComponent(r.student?.rollNumber || "")}`}
                        target="_blank"
                        className="inline-flex items-center gap-1 bg-slate-100 hover:bg-[#FCF9EE] border border-slate-300 hover:border-[#D4AF37] text-[#1B2A4A] px-2.5 py-1 rounded-lg font-bold text-[11px] transition shadow-xs"
                      >
                        <Printer className="w-3 h-3 text-[#1B2A4A]" />
                        <span>Print Report Card</span>
                      </Link>
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
