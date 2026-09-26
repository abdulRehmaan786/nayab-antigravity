"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { FileSpreadsheet, Save, CheckCircle2, RefreshCw, BookOpen, Lock, AlertCircle, Info } from "lucide-react";
import { calculateGrade, calculateSubjectGrade } from "@/lib/grading";
import { AuthSession } from "@/lib/types";

interface OtherSubject {
  subject: string;
  maxMarks: number;
  obtainedMarks: number;
  grade: string;
}

interface StudentRow {
  studentId: string;
  rollNumber: string;
  name: string;
  fatherName: string;
  className: string;
  section: string;
  targetObtained: number;
  targetMax: number;
  remarks: string;
  otherSubjects: OtherSubject[];
  saved: boolean;
  saving: boolean;
}

const ALL_SUBJECTS = [
  { name: "General Science", max: 100 },
  { name: "Physics", max: 100 },
  { name: "Mathematics", max: 100 },
  { name: "English", max: 100 },
  { name: "Urdu", max: 100 },
  { name: "Islamiyat", max: 50 },
  { name: "Pakistan Studies", max: 50 },
];

function MarksEntryContent() {
  const searchParams = useSearchParams();
  const [session, setSession] = useState<AuthSession | null>(null);
  const [availableClasses, setAvailableClasses] = useState<string[]>([]);
  const [availableSubjects, setAvailableSubjects] = useState<string[]>([]);

  const [selectedClass, setSelectedClass] = useState("Class 9");
  const [selectedSubject, setSelectedSubject] = useState("General Science");
  const [examTerm, setExamTerm] = useState("Weekly Test 1 - 2025");
  const [academicYear, setAcademicYear] = useState("2024-2025");

  const [rows, setRows] = useState<StudentRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [globalMessage, setGlobalMessage] = useState<string | null>(null);

  // 1. Fetch Session & Determine Allowed Classes/Subjects
  useEffect(() => {
    fetch("/api/auth/me")
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (data && data.authenticated) {
          const userSession: AuthSession = data.user;
          setSession(userSession);

          if (userSession.role === "ADMIN") {
            setAvailableClasses(["Class 10", "Class 9", "Class 8", "Class 7"]);
            setAvailableSubjects(ALL_SUBJECTS.map((s) => s.name));
          } else {
            const assigned = userSession.assignedSubjects || [];
            const uniqueClasses = Array.from(new Set(assigned.map((a) => a.className)));
            setAvailableClasses(uniqueClasses.length > 0 ? uniqueClasses : userSession.assignedClasses);

            const initialCls = uniqueClasses[0] || "Class 9";
            setSelectedClass(initialCls);

            const filteredSubs = assigned
              .filter((a) => a.className.toLowerCase() === initialCls.toLowerCase())
              .map((a) => a.subject);

            const subList = filteredSubs.length > 0 ? filteredSubs : ["General Science"];
            setAvailableSubjects(subList);
            setSelectedSubject(subList[0]);
          }
        }
      })
      .catch(() => {});
  }, []);

  // 2. When Class changes, update available subjects for that teacher
  const handleClassChange = (newCls: string) => {
    setSelectedClass(newCls);
    if (session && session.role !== "ADMIN") {
      const assigned = session.assignedSubjects || [];
      const filteredSubs = assigned
        .filter((a) => a.className.toLowerCase() === newCls.toLowerCase())
        .map((a) => a.subject);
      const subList = filteredSubs.length > 0 ? filteredSubs : ["General Science"];
      setAvailableSubjects(subList);
      setSelectedSubject(subList[0]);
    }
  };

  // 3. Load Students and their current exam results
  useEffect(() => {
    if (selectedClass && selectedSubject) {
      loadClassStudents();
    }
  }, [selectedClass, selectedSubject, examTerm]);

  const loadClassStudents = async () => {
    setLoading(true);
    setGlobalMessage(null);

    try {
      // Fetch students in this class
      const sRes = await fetch(`/api/students?className=${encodeURIComponent(selectedClass)}`);
      const sData = await sRes.json();
      const studentsList = sData.students || [];

      // Fetch existing results for this class and examTerm
      const rRes = await fetch(
        `/api/results?className=${encodeURIComponent(selectedClass)}&examTerm=${encodeURIComponent(examTerm)}`
      );
      const rData = await rRes.json();
      const existingResults = rData.results || [];

      const targetSubjectConfig =
        ALL_SUBJECTS.find((s) => s.name.toLowerCase() === selectedSubject.toLowerCase()) || {
          name: selectedSubject,
          max: selectedSubject.includes("Islam") || selectedSubject.includes("Pak") ? 50 : 100,
        };

      const initialRows: StudentRow[] = studentsList.map((s: { id: string; rollNumber: string; name: string; fatherName: string; className: string; section: string }) => {
        const foundResult = existingResults.find((r: { studentId: string }) => r.studentId === s.id);
        let targetObtained = 0;
        let remarks = "";
        let otherSubjects: OtherSubject[] = [];

        if (foundResult && Array.isArray(foundResult.subjectMarks)) {
          foundResult.subjectMarks.forEach((sub: { subject: string; maxMarks: number; obtainedMarks: number; grade: string }) => {
            if (sub.subject.toLowerCase() === selectedSubject.toLowerCase()) {
              targetObtained = sub.obtainedMarks;
            } else {
              otherSubjects.push({
                subject: sub.subject,
                maxMarks: sub.maxMarks,
                obtainedMarks: sub.obtainedMarks,
                grade: sub.grade,
              });
            }
          });
          remarks = foundResult.remarks || "";
        }

        return {
          studentId: s.id,
          rollNumber: s.rollNumber,
          name: s.name,
          fatherName: s.fatherName,
          className: s.className,
          section: s.section,
          targetObtained,
          targetMax: targetSubjectConfig.max,
          remarks,
          otherSubjects,
          saved: !!foundResult,
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

  const handleScoreChange = (studentId: string, val: number) => {
    setRows((prev) =>
      prev.map((r) => (r.studentId === studentId ? { ...r, targetObtained: val, saved: false } : r))
    );
  };

  const handleRemarksChange = (studentId: string, val: string) => {
    setRows((prev) =>
      prev.map((r) => (r.studentId === studentId ? { ...r, remarks: val, saved: false } : r))
    );
  };

  // Computes cumulative total, percentage, overall grade considering other teachers' subjects + current subject
  const calculateRowTotal = (row: StudentRow) => {
    const otherMax = row.otherSubjects.reduce((sum, o) => sum + o.maxMarks, 0);
    const otherObtained = row.otherSubjects.reduce((sum, o) => sum + o.obtainedMarks, 0);

    const grandMax = otherMax + row.targetMax;
    const grandObtained = otherObtained + Number(row.targetObtained || 0);

    const percentage = grandMax > 0 ? Number(((grandObtained / grandMax) * 100).toFixed(1)) : 0;
    const { grade, isPass } = calculateGrade(percentage);

    const subjectGrade = calculateSubjectGrade(row.targetObtained, row.targetMax);

    return { grandMax, grandObtained, percentage, grade, isPass, subjectGrade };
  };

  const handleSaveStudent = async (row: StudentRow) => {
    setRows((prev) => prev.map((r) => (r.studentId === row.studentId ? { ...r, saving: true } : r)));

    try {
      const res = await fetch("/api/results", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          studentId: row.studentId,
          examTerm,
          academicYear,
          targetSubject: selectedSubject,
          subjects: [
            {
              subject: selectedSubject,
              maxMarks: row.targetMax,
              obtainedMarks: Number(row.targetObtained) || 0,
            },
          ],
          remarks: row.remarks || `Marks recorded for ${selectedSubject}`,
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
    setGlobalMessage(`Saving all students for ${selectedSubject}...`);
    for (const row of rows) {
      await handleSaveStudent(row);
    }
    setGlobalMessage(`All ${selectedSubject} marks successfully merged and published!`);
    setTimeout(() => setGlobalMessage(null), 4000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 bg-[#FCF9EE] border border-[#D4AF37] px-3 py-0.5 rounded-full text-xs font-bold text-[#1B2A4A] mb-1.5">
            <Lock className="w-3 h-3 text-[#D4AF37]" />
            <span>Subject-Teacher Isolated Grading</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <FileSpreadsheet className="w-6 h-6 text-[#1B2A4A]" />
            <span>Marks Entry Sheet — {selectedSubject}</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            You are authorized to enter marks for <strong className="text-slate-800">{selectedSubject}</strong> in{" "}
            <strong className="text-slate-800">{selectedClass}</strong>. Marks are safely merged without overwriting other subject teachers&apos; scores.
          </p>
        </div>

        <button
          onClick={handleSaveAll}
          disabled={loading || rows.length === 0}
          className="inline-flex items-center gap-2 bg-[#1B2A4A] hover:bg-[#111C32] text-white px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold shadow-md transition disabled:opacity-50"
        >
          <Save className="w-4 h-4 text-[#D4AF37]" />
          <span>Save All {selectedSubject} Marks</span>
        </button>
      </div>

      {globalMessage && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-3.5 rounded-xl text-xs font-bold flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>{globalMessage}</span>
        </div>
      )}

      {/* Selectors Toolbar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3">
          {/* Class Select */}
          <div>
            <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">Assigned Class</label>
            <select
              value={selectedClass}
              onChange={(e) => handleClassChange(e.target.value)}
              className="bg-slate-50 border border-slate-300 rounded-xl px-3 py-1.5 text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#1B2A4A]"
            >
              {availableClasses.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          {/* Subject Select */}
          <div>
            <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1 flex items-center gap-1">
              <BookOpen className="w-3 h-3 text-[#D4AF37]" /> Assigned Subject
            </label>
            <select
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="bg-[#FCF9EE] border border-[#D4AF37] rounded-xl px-3 py-1.5 text-xs font-bold text-[#1B2A4A] focus:outline-none focus:ring-2 focus:ring-[#1B2A4A]"
            >
              {availableSubjects.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>

          {/* Exam Term */}
          <div>
            <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">Weekly Test / Exam</label>
            <select
              value={examTerm}
              onChange={(e) => setExamTerm(e.target.value)}
              className="bg-slate-50 border border-slate-300 rounded-xl px-3 py-1.5 text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#1B2A4A]"
            >
              <option value="Weekly Test 1 - 2025">Weekly Test 1</option>
              <option value="Weekly Test 2 - 2025">Weekly Test 2</option>
              <option value="Weekly Test 3 - 2025">Weekly Test 3</option>
              <option value="Weekly Test 4 - 2025">Weekly Test 4</option>
              <option value="Weekly Test 5 - 2025">Weekly Test 5</option>
              <option value="Weekly Test 6 - 2025">Weekly Test 6</option>
              <option value="Weekly Test 7 - 2025">Weekly Test 7</option>
              <option value="Weekly Test 8 - 2025">Weekly Test 8</option>
              <option value="Annual Examination 2025">Annual Examination 2025</option>
            </select>
          </div>

          {/* Max Marks Selector */}
          <div>
            <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">Max Marks</label>
            <select
              value={rows[0]?.targetMax || 100}
              onChange={(e) => {
                const newMax = Number(e.target.value);
                setRows((prev) => prev.map((r) => ({ ...r, targetMax: newMax })));
              }}
              className="bg-slate-50 border border-slate-300 rounded-xl px-3 py-1.5 text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#1B2A4A]"
            >
              <option value="20">20 Marks</option>
              <option value="25">25 Marks</option>
              <option value="50">50 Marks</option>
              <option value="100">100 Marks</option>
            </select>
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

      {/* Spreadsheet Marks Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-16 text-center text-xs text-slate-500">
            Loading students for {selectedClass} — {selectedSubject}...
          </div>
        ) : rows.length === 0 ? (
          <div className="p-16 text-center text-slate-500 text-xs">
            No students found in {selectedClass}.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-[#1B2A4A] text-white">
                  <th className="p-3 font-bold sticky left-0 bg-[#1B2A4A] z-10">Roll #</th>
                  <th className="p-3 font-bold sticky left-14 bg-[#1B2A4A] z-10">Student</th>
                  <th className="p-3 font-bold text-center bg-[#253966] text-[#D4AF37]">
                    {selectedSubject} (Max: {rows[0]?.targetMax || 100})
                  </th>
                  <th className="p-3 font-bold text-center">Subject Grade</th>
                  <th className="p-3 font-bold">Other Subjects (Read-Only Preview)</th>
                  <th className="p-3 font-bold text-center bg-[#111C32]">Grand Total</th>
                  <th className="p-3 font-bold text-center bg-[#111C32]">Cumulative %</th>
                  <th className="p-3 font-bold text-center bg-[#111C32]">Overall Grade</th>
                  <th className="p-3 font-bold">Teacher Remarks</th>
                  <th className="p-3 font-bold text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {rows.map((row, idx) => {
                  const { grandMax, grandObtained, percentage, grade, isPass, subjectGrade } =
                    calculateRowTotal(row);

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

                      {/* Editable Target Subject Input */}
                      <td className="p-2 text-center bg-[#FCF9EE]/60 border-x border-[#D4AF37]/30">
                        <input
                          type="number"
                          min="0"
                          max={row.targetMax}
                          value={row.targetObtained === 0 && !row.saved ? "" : row.targetObtained}
                          placeholder="0"
                          onFocus={(e) => e.target.select()}
                          onChange={(e) => {
                            const raw = e.target.value;
                            if (raw === "") {
                              handleScoreChange(row.studentId, 0);
                              return;
                            }
                            const unpadded = raw.replace(/^0+(?=\d)/, "");
                            const num = parseInt(unpadded, 10);
                            handleScoreChange(row.studentId, isNaN(num) ? 0 : Math.min(num, row.targetMax));
                          }}
                          className="w-20 h-9 text-center bg-white border-2 border-[#D4AF37] rounded-xl font-extrabold text-base text-[#1B2A4A] focus:ring-2 focus:ring-[#1B2A4A] shadow-inner"
                        />
                      </td>

                      {/* Subject Grade Pill */}
                      <td className="p-2 text-center">
                        <span
                          className={`inline-block px-2 py-0.5 rounded text-[11px] font-black ${
                            subjectGrade === "A+"
                              ? "bg-emerald-100 text-emerald-800"
                              : subjectGrade === "A"
                              ? "bg-blue-100 text-blue-800"
                              : subjectGrade === "B"
                              ? "bg-amber-100 text-amber-800"
                              : subjectGrade === "C"
                              ? "bg-orange-100 text-orange-800"
                              : "bg-rose-100 text-rose-800"
                          }`}
                        >
                          {subjectGrade}
                        </span>
                      </td>

                      {/* Other Teachers' Subjects Preview (Read Only) */}
                      <td className="p-2.5 max-w-[260px]">
                        {row.otherSubjects.length > 0 ? (
                          <div className="flex flex-wrap gap-1">
                            {row.otherSubjects.map((o) => (
                              <span
                                key={o.subject}
                                title={`${o.subject}: ${o.obtainedMarks}/${o.maxMarks} (Grade ${o.grade})`}
                                className="text-[10px] bg-slate-100 text-slate-700 px-1.5 py-0.5 rounded border border-slate-200 font-medium"
                              >
                                {o.subject}: <strong>{o.obtainedMarks}</strong>
                              </span>
                            ))}
                          </div>
                        ) : (
                          <span className="text-[11px] text-slate-400 italic">No other subject marks yet</span>
                        )}
                      </td>

                      {/* Cumulative Grand Total */}
                      <td className="p-2.5 text-center font-black text-slate-900 bg-slate-100/60">
                        {grandObtained} / {grandMax}
                      </td>

                      {/* Cumulative Percentage */}
                      <td className="p-2.5 text-center font-mono font-bold text-[#1B2A4A] bg-slate-100/60">
                        {percentage}%
                      </td>

                      {/* Overall Grade */}
                      <td className="p-2.5 text-center bg-slate-100/60">
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
                          {grade} ({isPass ? "PASS" : "FAIL"})
                        </span>
                      </td>

                      {/* Remarks */}
                      <td className="p-2 min-w-[150px]">
                        <input
                          type="text"
                          value={row.remarks}
                          onChange={(e) => handleRemarksChange(row.studentId, e.target.value)}
                          placeholder="Teacher feedback..."
                          className="w-full h-8 px-2.5 bg-slate-50 border border-slate-300 rounded-lg text-[11px] text-slate-800 focus:bg-white focus:ring-2 focus:ring-[#1B2A4A]"
                        />
                      </td>

                      {/* Action */}
                      <td className="p-2 text-right whitespace-nowrap">
                        <button
                          onClick={() => handleSaveStudent(row)}
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
      fallback={<div className="p-12 text-center text-slate-500">Loading Subject Marks Sheet...</div>}
    >
      <MarksEntryContent />
    </Suspense>
  );
}
