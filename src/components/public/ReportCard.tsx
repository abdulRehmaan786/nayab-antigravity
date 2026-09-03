"use client";

import Image from "next/image";
import { Printer, ArrowLeft, Award, CheckCircle2, XCircle } from "lucide-react";
import { StudentData, ExamResultData, SubjectMark } from "@/lib/types";

interface ReportCardProps {
  student: StudentData;
  result: ExamResultData;
  onBack?: () => void;
}

export default function ReportCard({ student, result, onBack }: ReportCardProps) {
  const subjects: SubjectMark[] = Array.isArray(result.subjectMarks)
    ? result.subjectMarks
    : JSON.parse(result.subjectMarks || "[]");

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="w-full max-w-4xl mx-auto my-6">
      {/* Action Toolbar (Hidden during print) */}
      <div className="flex items-center justify-between gap-3 mb-6 no-print">
        {onBack && (
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-[#1B2A4A] bg-white border border-slate-300 hover:bg-slate-50 px-3.5 py-2.5 rounded-xl shadow-sm transition"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Search</span>
          </button>
        )}
        <div className="flex items-center gap-3 ml-auto">
          <button
            onClick={handlePrint}
            className="flex items-center gap-2 text-xs sm:text-sm font-bold text-white bg-[#1B2A4A] hover:bg-[#111C32] px-5 py-2.5 rounded-xl shadow-md transition hover:scale-105 active:scale-95"
          >
            <Printer className="w-4 h-4 text-[#D4AF37]" />
            <span>Print Report Card (A4)</span>
          </button>
        </div>
      </div>

      {/* Formal Printable Report Card Sheet */}
      <div className="printable-card bg-white rounded-2xl shadow-xl border-2 border-[#1B2A4A]/20 p-6 sm:p-10 relative overflow-hidden text-slate-800">
        {/* Subtle Watermark in background */}
        <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none select-none">
          <Image
            src="/images/school-logo.png"
            alt="Watermark"
            width={450}
            height={450}
            className="object-contain"
          />
        </div>

        {/* School Formal Header */}
        <div className="border-b-2 border-[#1B2A4A] pb-5 mb-6 text-center relative z-10">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-2">
            <div className="w-20 h-20 rounded-full bg-white p-1 border-2 border-[#D4AF37] flex items-center justify-center shrink-0 shadow-sm">
              <Image
                src="/images/school-logo.png"
                alt="Nayab Grammar School Emblem"
                width={76}
                height={76}
                className="w-full h-full object-contain"
                priority
              />
            </div>
            <div className="text-center sm:text-left">
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#1B2A4A] uppercase">
                NAYAB GRAMMAR SCHOOL
              </h1>
              <p className="text-xs sm:text-sm font-semibold tracking-widest text-[#D4AF37] uppercase">
                Mirwah Campus • Registered & Recognized Institution
              </p>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Official Examination Wing • Academic Session {result.academicYear || "2024-2025"}
              </p>
            </div>
          </div>

          <div className="mt-3 inline-block bg-[#1B2A4A] text-white px-5 py-1.5 rounded-full text-xs sm:text-sm font-bold tracking-wider uppercase">
            {result.examTerm} — Progress Report Card
          </div>
        </div>

        {/* Student Bio Grid */}
        <div className="bg-[#F8F9FB] border border-slate-200 rounded-xl p-4 sm:p-5 mb-6 relative z-10">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs sm:text-sm">
            <div>
              <span className="block text-[11px] font-bold text-slate-400 uppercase">Student Name</span>
              <span className="font-bold text-slate-900 text-sm sm:text-base">{student.name}</span>
            </div>
            <div>
              <span className="block text-[11px] font-bold text-slate-400 uppercase">Father&apos;s Name</span>
              <span className="font-semibold text-slate-800">{student.fatherName}</span>
            </div>
            <div>
              <span className="block text-[11px] font-bold text-slate-400 uppercase">Roll Number</span>
              <span className="font-mono font-bold text-[#1B2A4A] text-sm sm:text-base">
                {student.rollNumber}
              </span>
            </div>
            <div>
              <span className="block text-[11px] font-bold text-slate-400 uppercase">Class & Section</span>
              <span className="font-semibold text-slate-800">
                {student.className} - {student.section}
              </span>
            </div>
          </div>
        </div>

        {/* Marks Breakdown Table */}
        <div className="overflow-x-auto mb-6 relative z-10">
          <table className="w-full text-left border-collapse border border-slate-200 text-xs sm:text-sm">
            <thead>
              <tr className="bg-[#1B2A4A] text-white">
                <th className="p-3 font-semibold border border-slate-300">#</th>
                <th className="p-3 font-semibold border border-slate-300">Subject Name</th>
                <th className="p-3 font-semibold text-center border border-slate-300">Total Marks</th>
                <th className="p-3 font-semibold text-center border border-slate-300">Obtained Marks</th>
                <th className="p-3 font-semibold text-center border border-slate-300">Grade</th>
                <th className="p-3 font-semibold border border-slate-300">Teacher Evaluation</th>
              </tr>
            </thead>
            <tbody>
              {subjects.map((sub, idx) => (
                <tr
                  key={sub.subject}
                  className={idx % 2 === 0 ? "bg-white" : "bg-slate-50/70"}
                >
                  <td className="p-2.5 font-mono text-slate-500 text-center border border-slate-200">
                    {idx + 1}
                  </td>
                  <td className="p-2.5 font-bold text-slate-800 border border-slate-200">
                    {sub.subject}
                  </td>
                  <td className="p-2.5 text-center font-semibold text-slate-600 border border-slate-200">
                    {sub.maxMarks}
                  </td>
                  <td className="p-2.5 text-center font-bold text-[#1B2A4A] border border-slate-200">
                    {sub.obtainedMarks}
                  </td>
                  <td className="p-2.5 text-center font-bold text-slate-800 border border-slate-200">
                    <span
                      className={`inline-block px-2 py-0.5 rounded text-xs font-extrabold ${
                        sub.grade === "A+"
                          ? "bg-emerald-100 text-emerald-800"
                          : sub.grade === "A"
                          ? "bg-blue-100 text-blue-800"
                          : sub.grade === "B"
                          ? "bg-amber-100 text-amber-800"
                          : sub.grade === "C"
                          ? "bg-orange-100 text-orange-800"
                          : "bg-rose-100 text-rose-800"
                      }`}
                    >
                      {sub.grade}
                    </span>
                  </td>
                  <td className="p-2.5 text-slate-600 text-xs border border-slate-200 italic">
                    {sub.remarks || "Satisfactory progress"}
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="bg-[#FCF9EE] font-bold text-slate-900 border-t-2 border-[#1B2A4A]">
                <td colSpan={2} className="p-3 text-right text-xs sm:text-sm uppercase tracking-wider border border-slate-300">
                  Grand Total:
                </td>
                <td className="p-3 text-center text-sm sm:text-base border border-slate-300">
                  {result.totalMarks}
                </td>
                <td className="p-3 text-center text-sm sm:text-base text-[#1B2A4A] border border-slate-300">
                  {result.obtainedMarks}
                </td>
                <td className="p-3 text-center text-sm sm:text-base text-emerald-800 border border-slate-300">
                  {result.overallGrade}
                </td>
                <td className="p-3 text-xs sm:text-sm text-slate-700 border border-slate-300">
                  Score: {result.percentage}% ({result.status})
                </td>
              </tr>
            </tfoot>
          </table>
        </div>

        {/* Performance Metrics Summary */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6 relative z-10">
          <div className="bg-white border border-slate-200 p-3.5 rounded-xl flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[#1B2A4A] text-[#D4AF37] flex items-center justify-center font-bold">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[11px] text-slate-500 uppercase font-semibold">Cumulative Score</p>
              <p className="text-base font-extrabold text-[#1B2A4A]">
                {result.obtainedMarks} / {result.totalMarks} ({result.percentage}%)
              </p>
            </div>
          </div>

          <div className="bg-white border border-slate-200 p-3.5 rounded-xl flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[#FCF9EE] border border-[#D4AF37] text-[#1B2A4A] flex items-center justify-center font-extrabold text-base">
              {result.overallGrade}
            </div>
            <div>
              <p className="text-[11px] text-slate-500 uppercase font-semibold">Overall Letter Grade</p>
              <p className="text-xs font-semibold text-slate-700">
                {result.overallGrade === "A+"
                  ? "Distinction / Outstanding"
                  : result.overallGrade === "A"
                  ? "First Division / Excellent"
                  : result.overallGrade === "B"
                  ? "Second Division / Good"
                  : result.overallGrade === "C"
                  ? "Third Division / Pass"
                  : "Needs Improvement"}
              </p>
            </div>
          </div>

          <div
            className={`border p-3.5 rounded-xl flex items-center gap-3 ${
              result.status === "PASS"
                ? "bg-emerald-50 border-emerald-200 text-emerald-900"
                : "bg-rose-50 border-rose-200 text-rose-900"
            }`}
          >
            <div className="w-10 h-10 rounded-lg flex items-center justify-center">
              {result.status === "PASS" ? (
                <CheckCircle2 className="w-7 h-7 text-emerald-600" />
              ) : (
                <XCircle className="w-7 h-7 text-rose-600" />
              )}
            </div>
            <div>
              <p className="text-[11px] uppercase font-bold">Final Status</p>
              <p className="text-base font-extrabold">{result.status === "PASS" ? "PROMOTED / PASS" : "FAIL / RE-EXAM"}</p>
            </div>
          </div>
        </div>

        {/* Teacher Remarks & Grading Scale */}
        <div className="border-t border-slate-200 pt-4 mb-8 text-xs text-slate-700 space-y-2 relative z-10">
          <p>
            <strong className="text-[#1B2A4A]">Teacher Assessment & Conduct: </strong>
            {result.remarks || "Diligent attitude and good moral character observed throughout the academic term."}
          </p>
          <div className="text-[11px] text-slate-500 bg-slate-50 p-2.5 rounded-lg">
            <strong>Grading Scale: </strong>
            A+ (80% & above - Outstanding) • A (70% to 79.9% - Excellent) • B (60% to 69.9% - Very Good) • C (50% to 59.9% - Pass) • F (Below 50% - Fail)
          </div>
        </div>

        {/* Official Signatures & Seal Section */}
        <div className="pt-8 border-t-2 border-dashed border-slate-300 grid grid-cols-3 gap-6 text-center text-xs relative z-10">
          <div className="space-y-1">
            <div className="h-10"></div>
            <div className="border-t border-slate-700 w-4/5 mx-auto pt-1 font-semibold text-slate-800">
              Class Teacher
            </div>
            <p className="text-[10px] text-slate-400">Signature & Date</p>
          </div>

          <div className="space-y-1">
            <div className="h-10"></div>
            <div className="border-t border-slate-700 w-4/5 mx-auto pt-1 font-semibold text-slate-800">
              Exam Controller
            </div>
            <p className="text-[10px] text-slate-400">Verified & Recorded</p>
          </div>

          <div className="space-y-1">
            <div className="h-10 flex items-center justify-center">
              <span className="text-[10px] text-slate-400 font-serif italic border border-slate-300 px-2 py-0.5 rounded">
                [ Official School Stamp ]
              </span>
            </div>
            <div className="border-t border-slate-700 w-4/5 mx-auto pt-1 font-bold text-[#1B2A4A]">
              Principal
            </div>
            <p className="text-[10px] text-slate-400">Nayab Grammar School</p>
          </div>
        </div>
      </div>
    </div>
  );
}
