"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { FileSpreadsheet, Save, CheckCircle2, AlertCircle, RefreshCw, Sparkles, ExternalLink } from "lucide-react";
import Link from "next/link";
import { calculateGrade, calculateSubjectGrade } from "@/lib/grading";

interface StudentRow {
  studentId: string;
  rollNumber: string;
  name: string;
  fatherName: string;
  className: string;
  section: string;
  english: number;
  urdu: number;
  math: number;
  science: number;
  islamiyat: number;
  pakStudies: number;
  remarks: string;
  saved: boolean;
  saving: boolean;
}

const DEFAULT_SUBJECTS = [
  { name: "English", max: 100 },
  { name: "Urdu", max: 100 },
  { name: "Mathematics", max: 100 },
  { name: "Science", max: 100 },
  { name: "Islamiyat", max: 50 },
  { name: "Pak Studies", max: 50 },
];

function MarksEntryContent() {
  const searchParams = useSearchParams();
  const initialClass = searchParams.get("class") || "Class 9";
  const [selectedClass, setSelectedClass] = useState(initialClass);
  const [examTerm, setExamTerm] = useState("Midterm Examination 2025");
  const [academicYear, setAcademicYear] = useState("2024-2025");
  const [rows, setRows] = useState<StudentRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [globalMessage, setGlobalMessage] = useState<string | null>(null);

  useEffect(() => {
    loadClassStudents();
  }, [selectedClass, examTerm]);

  const loadClassStudents = async () => {
    setLoading(true);
    setGlobalMessage(null);

    try {
      // 1. Fetch students in this class
      const sRes = await fetch(`/api/students?className=${encodeURIComponent(selectedClass)}`);
      const sData = await sRes.json();
      const studentsList = sData.students || [];

      // 2. Fetch existing results for this class and examTerm
      const rRes = await fetch(`/api/results?className=${encodeURIComponent(selectedClass)}&examTerm=${encodeURIComponent(examTerm)}`);
      const rData = await rRes.json();
      const existingResults = rData.results || [];

      const initialRows: StudentRow[] = studentsList.map((s: { id: string; rollNumber: string; name: string; fatherName: string; className: string; section: string }) => {
        const found = existingResults.find((r: { studentId: string }) => r.studentId === s.id);
        let eng = 0, urd = 0, mth = 0, sci = 0, isl = 0, pak = 0, rem = "";

        if (found && Array.isArray(found.subjectMarks)) {
          found.subjectMarks.forEach((sub: { subject: string; obtainedMarks: number }) => {
            const name = sub.subject.toLowerCase();
            if (name.includes("english")) eng = sub.obtainedMarks;
            else if (name.includes("urdu")) urd = sub.obtainedMarks;
            else if (name.includes("math")) mth = sub.obtainedMarks;
            else if (name.includes("sci") || name.includes("phys")) sci = sub.obtainedMarks;
            else if (name.includes("islam")) isl = sub.obtainedMarks;
            else if (name.includes("pak") || name.includes("social")) pak = sub.obtainedMarks;
          });
          rem = found.remarks || "";
        }

        return {
          studentId: s.id,
          rollNumber: s.rollNumber,
          name: s.name,
          fatherName: s.fatherName,
          className: s.className,
          section: s.section,
          english: eng,
          urdu: urd,
          math: mth,
          science: sci,
          islamiyat: isl,
          pakStudies: pak,
          remarks: rem,
          saved: !!found,
          saving: false,
        };
      });

      setRows(initialRows);
    } catch {
      console.error("Error loading marks entry data");
    } finally {
      setLoading(false);
    }
  };

  const handleFieldChange = (studentId: string, field: keyof StudentRow, value: string | number) => {
    setRows((prev) =>
      prev.map((row) => {
        if (row.studentId === studentId) {
          return {
            ...row,
            [field]: value,
            saved: false,
          };
        }
        return row;
      })
    );
  };

  const calculateRowMetrics = (row: StudentRow) => {
    const totalMax = 500;
    const obtained =
      Number(row.english || 0) +
      Number(row.urdu || 0) +
      Number(row.math || 0) +
      Number(row.science || 0) +
      Number(row.islamiyat || 0) +
      Number(row.pakStudies || 0);

    const percentage = Number(((obtained / totalMax) * 100).toFixed(1));
    const { grade, isPass } = calculateGrade(percentage);

    return { totalMax, obtained, percentage, grade, isPass };
  };

  const handleSaveRow = async (row: StudentRow) => {
    // Set saving state
    setRows((prev) => prev.map((r) => (r.studentId === row.studentId ? { ...r, saving: true } : r)));

    const subjects = [
      { subject: "English", maxMarks: 100, obtainedMarks: Number(row.english) || 0 },
      { subject: "Urdu", maxMarks: 100, obtainedMarks: Number(row.urdu) || 0 },
      { subject: "Mathematics", maxMarks: 100, obtainedMarks: Number(row.math) || 0 },
      { subject: "General Science", maxMarks: 100, obtainedMarks: Number(row.science) || 0 },
      { subject: "Islamiyat", maxMarks: 50, obtainedMarks: Number(row.islamiyat) || 0 },
      { subject: "Pakistan Studies", maxMarks: 50, obtainedMarks: Number(row.pakStudies) || 0 },
    ];

    try {
      const res = await fetch("/api/results", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          studentId: row.studentId,
          examTerm,
          academicYear,
          subjects,
          remarks: row.remarks || "Progress verified by class teacher.",
        }),
      });

      const data = await res.json();
      if (res.ok && data.ok) {
        setRows((prev) =>
          prev.map((r) => (r.studentId === row.studentId ? { ...r, saved: true, saving: false } : r))
        );
      } else {
        alert(data.error || "Failed to save marks");
        setRows((prev) => prev.map((r) => (r.studentId === row.studentId ? { ...r, saving: false } : r)));
      }
    } catch {
      alert("Network error saving student result");
      setRows((prev) => prev.map((r) => (r.studentId === row.studentId ? { ...r, saving: false } : r)));
    }
  };

  const handleSaveAll = async () => {
    setGlobalMessage("Saving all student mark sheets...");
    for (const row of rows) {
      await handleSaveRow(row);
    }
    setGlobalMessage("All student marks successfully saved and published online!");
    setTimeout(() => setGlobalMessage(null), 4000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <FileSpreadsheet className="w-6 h-6 text-[#1B2A4A]" />
            <span>Interactive Marks Entry Sheet</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Input subject marks per student. Total, percentage, and letter grades (A+, A, B, C, F) auto-calculate in real time.
          </p>
        </div>

        <button
          onClick={handleSaveAll}
          disabled={loading || rows.length === 0}
          className="inline-flex items-center gap-2 bg-[#1B2A4A] hover:bg-[#111C32] text-white px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold shadow-md transition disabled:opacity-50"
        >
          <Save className="w-4 h-4 text-[#D4AF37]" />
          <span>Save & Publish All Marks</span>
        </button>
      </div>

      {globalMessage && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-3.5 rounded-xl text-xs font-bold flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>{globalMessage}</span>
        </div>
      )}

      {/* Class & Exam Selectors Toolbar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3">
          <div>
            <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">Class</label>
            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="bg-slate-50 border border-slate-300 rounded-xl px-3 py-1.5 text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#1B2A4A]"
            >
              <option value="Class 10">Class 10</option>
              <option value="Class 9">Class 9</option>
              <option value="Class 8">Class 8</option>
              <option value="Class 7">Class 7</option>
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">Examination Term</label>
            <select
              value={examTerm}
              onChange={(e) => setExamTerm(e.target.value)}
              className="bg-slate-50 border border-slate-300 rounded-xl px-3 py-1.5 text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#1B2A4A]"
            >
              <option value="Midterm Examination 2025">Midterm Examination 2025</option>
              <option value="Annual Examination 2025">Annual Examination 2025</option>
              <option value="First Term Test 2025">First Term Test 2025</option>
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">Academic Year</label>
            <input
              type="text"
              value={academicYear}
              onChange={(e) => setAcademicYear(e.target.value)}
              className="bg-slate-50 border border-slate-300 rounded-xl px-3 py-1.5 text-xs font-bold text-slate-800 w-28 focus:outline-none focus:ring-2 focus:ring-[#1B2A4A]"
            />
          </div>
        </div>

        <button
          onClick={loadClassStudents}
          className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-[#1B2A4A] p-2 hover:bg-slate-100 rounded-lg transition"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Reload</span>
        </button>
      </div>

      {/* Spreadsheet Marks Entry Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-16 text-center text-xs text-slate-500">
            Loading students and grade sheets for {selectedClass}...
          </div>
        ) : rows.length === 0 ? (
          <div className="p-16 text-center text-slate-500 text-xs">
            No students found in {selectedClass}. Add students from the Admin directory first.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-[#1B2A4A] text-white">
                  <th className="p-3 font-bold sticky left-0 bg-[#1B2A4A] z-10">Roll #</th>
                  <th className="p-3 font-bold sticky left-14 bg-[#1B2A4A] z-10">Student</th>
                  <th className="p-3 font-bold text-center">English (100)</th>
                  <th className="p-3 font-bold text-center">Urdu (100)</th>
                  <th className="p-3 font-bold text-center">Math (100)</th>
                  <th className="p-3 font-bold text-center">Science (100)</th>
                  <th className="p-3 font-bold text-center">Islamiyat (50)</th>
                  <th className="p-3 font-bold text-center">Pak St (50)</th>
                  <th className="p-3 font-bold text-center bg-[#111C32]">Total (500)</th>
                  <th className="p-3 font-bold text-center bg-[#111C32]">Percent %</th>
                  <th className="p-3 font-bold text-center bg-[#111C32]">Grade</th>
                  <th className="p-3 font-bold text-center">Status</th>
                  <th className="p-3 font-bold">Teacher Remarks</th>
                  <th className="p-3 font-bold text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {rows.map((row, idx) => {
                  const { obtained, percentage, grade, isPass } = calculateRowMetrics(row);
                  return (
                    <tr
                      key={row.studentId}
                      className={`hover:bg-slate-50/70 transition ${
                        idx % 2 === 0 ? "bg-white" : "bg-slate-50/40"
                      }`}
                    >
                      {/* Roll */}
                      <td className="p-3 font-mono font-bold text-[#1B2A4A] sticky left-0 bg-inherit z-10">
                        {row.rollNumber}
                      </td>

                      {/* Name */}
                      <td className="p-3 font-bold text-slate-900 whitespace-nowrap sticky left-14 bg-inherit z-10">
                        {row.name}
                        <span className="block text-[10px] text-slate-400 font-normal">
                          {row.section} • S/O {row.fatherName}
                        </span>
                      </td>

                      {/* English */}
                      <td className="p-2 text-center">
                        <input
                          type="number"
                          min="0"
                          max="100"
                          value={row.english}
                          onChange={(e) => handleFieldChange(row.studentId, "english", Number(e.target.value))}
                          className="w-16 h-8 text-center bg-slate-50 border border-slate-300 rounded-lg font-bold text-slate-800 focus:bg-white focus:ring-2 focus:ring-[#1B2A4A] text-xs"
                        />
                      </td>

                      {/* Urdu */}
                      <td className="p-2 text-center">
                        <input
                          type="number"
                          min="0"
                          max="100"
                          value={row.urdu}
                          onChange={(e) => handleFieldChange(row.studentId, "urdu", Number(e.target.value))}
                          className="w-16 h-8 text-center bg-slate-50 border border-slate-300 rounded-lg font-bold text-slate-800 focus:bg-white focus:ring-2 focus:ring-[#1B2A4A] text-xs"
                        />
                      </td>

                      {/* Math */}
                      <td className="p-2 text-center">
                        <input
                          type="number"
                          min="0"
                          max="100"
                          value={row.math}
                          onChange={(e) => handleFieldChange(row.studentId, "math", Number(e.target.value))}
                          className="w-16 h-8 text-center bg-slate-50 border border-slate-300 rounded-lg font-bold text-slate-800 focus:bg-white focus:ring-2 focus:ring-[#1B2A4A] text-xs"
                        />
                      </td>

                      {/* Science */}
                      <td className="p-2 text-center">
                        <input
                          type="number"
                          min="0"
                          max="100"
                          value={row.science}
                          onChange={(e) => handleFieldChange(row.studentId, "science", Number(e.target.value))}
                          className="w-16 h-8 text-center bg-slate-50 border border-slate-300 rounded-lg font-bold text-slate-800 focus:bg-white focus:ring-2 focus:ring-[#1B2A4A] text-xs"
                        />
                      </td>

                      {/* Islamiyat */}
                      <td className="p-2 text-center">
                        <input
                          type="number"
                          min="0"
                          max="50"
                          value={row.islamiyat}
                          onChange={(e) => handleFieldChange(row.studentId, "islamiyat", Number(e.target.value))}
                          className="w-14 h-8 text-center bg-slate-50 border border-slate-300 rounded-lg font-bold text-slate-800 focus:bg-white focus:ring-2 focus:ring-[#1B2A4A] text-xs"
                        />
                      </td>

                      {/* Pak Studies */}
                      <td className="p-2 text-center">
                        <input
                          type="number"
                          min="0"
                          max="50"
                          value={row.pakStudies}
                          onChange={(e) => handleFieldChange(row.studentId, "pakStudies", Number(e.target.value))}
                          className="w-14 h-8 text-center bg-slate-50 border border-slate-300 rounded-lg font-bold text-slate-800 focus:bg-white focus:ring-2 focus:ring-[#1B2A4A] text-xs"
                        />
                      </td>

                      {/* Live Calculated Total */}
                      <td className="p-2.5 text-center font-black text-slate-900 bg-slate-100/70">
                        {obtained}
                      </td>

                      {/* Live Calculated Percentage */}
                      <td className="p-2.5 text-center font-mono font-bold text-[#1B2A4A] bg-slate-100/70">
                        {percentage}%
                      </td>

                      {/* Live Calculated Grade */}
                      <td className="p-2.5 text-center bg-slate-100/70">
                        <span
                          className={`inline-block px-2 py-0.5 rounded text-[11px] font-black ${
                            grade === "A+"
                              ? "bg-emerald-100 text-emerald-800"
                              : grade === "A"
                              ? "bg-blue-100 text-blue-800"
                              : grade === "B"
                              ? "bg-amber-100 text-amber-800"
                              : grade === "C"
                              ? "bg-orange-100 text-orange-800"
                              : "bg-rose-100 text-rose-800"
                          }`}
                        >
                          {grade}
                        </span>
                      </td>

                      {/* Pass / Fail */}
                      <td className="p-2.5 text-center">
                        {isPass ? (
                          <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-1.5 py-0.5 rounded">
                            PASS
                          </span>
                        ) : (
                          <span className="text-[10px] font-bold text-rose-700 bg-rose-50 border border-rose-200 px-1.5 py-0.5 rounded">
                            FAIL
                          </span>
                        )}
                      </td>

                      {/* Remarks */}
                      <td className="p-2 min-w-[160px]">
                        <input
                          type="text"
                          value={row.remarks}
                          onChange={(e) => handleFieldChange(row.studentId, "remarks", e.target.value)}
                          placeholder="e.g. Outstanding analytical effort"
                          className="w-full h-8 px-2.5 bg-slate-50 border border-slate-300 rounded-lg text-[11px] text-slate-800 focus:bg-white focus:ring-2 focus:ring-[#1B2A4A]"
                        />
                      </td>

                      {/* Actions */}
                      <td className="p-2 text-right whitespace-nowrap">
                        <button
                          onClick={() => handleSaveRow(row)}
                          disabled={row.saving}
                          className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-[11px] font-bold transition shadow-xs ${
                            row.saved
                              ? "bg-emerald-600 hover:bg-emerald-700 text-white"
                              : "bg-[#1B2A4A] hover:bg-[#111C32] text-white"
                          }`}
                        >
                          <Save className="w-3 h-3 text-[#D4AF37]" />
                          <span>{row.saving ? "Saving..." : row.saved ? "Saved" : "Save"}</span>
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default function TeacherMarksEntryPage() {
  return (
    <Suspense
      fallback={<div className="p-12 text-center text-slate-500">Loading Marks Sheet...</div>}
    >
      <MarksEntryContent />
    </Suspense>
  );
}
