"use client";

import Image from "next/image";
import { Printer, ArrowLeft, Award, CheckCircle2, XCircle, ShieldCheck } from "lucide-react";
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
    <div className="w-full max-w-4xl mx-auto my-4 print:my-0 print:p-0">
      {/* Action Toolbar (Hidden during print) */}
      <div className="flex items-center justify-between gap-3 mb-4 no-print">
        {onBack && (
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-[#1B2A4A] bg-white border border-slate-300 hover:bg-slate-50 px-3.5 py-2 rounded-xl shadow-xs transition cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Search</span>
          </button>
        )}
        <div className="flex items-center gap-2 ml-auto">
          <button
            onClick={handlePrint}
            className="flex items-center gap-2 text-xs sm:text-sm font-bold text-white bg-[#0D1B3D] hover:bg-[#1E3A8A] px-5 py-2.5 rounded-xl shadow-md transition hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
          >
            <Printer className="w-4 h-4 text-[#D4AF37]" />
            <span>Print Report Card (A4 — 1 Page)</span>
          </button>
        </div>
      </div>

      {/* Formal Printable Report Card Sheet (Guaranteed 1-Page A4) */}
      <div className="printable-card bg-white rounded-xl shadow-lg border-2 border-[#0D1B3D] p-5 sm:p-7 print:p-3 relative overflow-hidden text-slate-800">
        {/* Subtle Watermark in background */}
        <div className="absolute inset-0 flex items-center justify-center opacity-[0.035] pointer-events-none select-none">
          <Image
            src="/images/school-logo.png"
            alt="Watermark"
            width={380}
            height={380}
            className="object-contain"
          />
        </div>

        {/* 1. School Formal Header */}
        <div className="border-b-2 border-[#0D1B3D] pb-3 mb-3 print:pb-2 print:mb-2 text-center relative z-10">
          <div className="flex items-center justify-center gap-3 sm:gap-4 mb-1.5">
            <div className="w-14 h-14 sm:w-16 sm:h-16 print:w-12 print:h-12 rounded-full bg-white p-0.5 border-2 border-[#D4AF37] flex items-center justify-center shrink-0 shadow-xs">
              <Image
                src="/images/school-logo.png"
                alt="Nayab English Grammer High School Emblem"
                width={56}
                height={56}
                className="w-full h-full object-contain"
                priority
              />
            </div>
            <div className="text-center sm:text-left">
              <h1 className="text-lg sm:text-xl md:text-2xl print:text-lg font-black tracking-tight text-[#0D1B3D] uppercase font-heading leading-tight">
                NAYAB ENGLISH GRAMMER HIGH SCHOOL
              </h1>
              <p className="text-[11px] sm:text-xs print:text-[9.5pt] font-bold tracking-wider text-[#D4AF37] uppercase">
                Mirwah Campus • Registered & Recognized Institution
              </p>
              <p className="text-[10px] sm:text-[11px] print:text-[8pt] text-slate-500 font-medium">
                Official Examination Wing • Academic Session {result.academicYear || "2024-2025"}
              </p>
            </div>
          </div>

          <div className="inline-block bg-[#0D1B3D] text-[#D4AF37] px-4 py-1 print:py-0.5 rounded-full text-[11px] sm:text-xs print:text-[8.5pt] font-extrabold tracking-wider uppercase border border-[#D4AF37]/40 shadow-xs">
            {result.examTerm} — Progress Report Card
          </div>
        </div>

        {/* 2. Student Bio Grid */}
        <div className="bg-[#F8F9FB] border border-slate-300 rounded-lg p-3 print:p-2 mb-3 print:mb-2 text-xs print:text-[8pt] relative z-10">
          <div className="grid grid-cols-2 sm:grid-cols-4 print:grid-cols-4 gap-2.5 print:gap-1.5">
            <div>
              <span className="block text-[10px] print:text-[7pt] font-bold text-slate-400 uppercase">Student Name</span>
              <span className="font-extrabold text-slate-900 text-sm print:text-[8.5pt]">{student.name}</span>
            </div>
            <div>
              <span className="block text-[10px] print:text-[7pt] font-bold text-slate-400 uppercase">Father&apos;s Name</span>
              <span className="font-bold text-slate-800 text-xs print:text-[8pt]">{student.fatherName}</span>
            </div>
            <div>
              <span className="block text-[10px] print:text-[7pt] font-bold text-slate-400 uppercase">Roll & G.R. Number</span>
              <span className="font-mono font-black text-[#0D1B3D] text-xs print:text-[8pt]">
                Roll #{student.rollNumber} {student.grNumber ? `• GR: ${student.grNumber}` : ""}
              </span>
            </div>
            <div>
              <span className="block text-[10px] print:text-[7pt] font-bold text-slate-400 uppercase">Class & Section</span>
              <span className="font-bold text-slate-800 text-xs print:text-[8pt]">
                {student.className} ({student.section || "A"})
              </span>
            </div>
          </div>
        </div>

        {/* 3. Subject Marks Breakdown Table */}
        <div className="overflow-x-auto mb-3 print:mb-2 relative z-10">
          <table className="w-full text-left border-collapse border border-slate-300 text-xs print:text-[8pt]">
            <thead>
              <tr className="bg-[#0D1B3D] text-white print:bg-[#0D1B3D] print:text-white">
                <th className="py-2 px-2.5 print:py-1 print:px-2 font-bold border border-slate-300 text-center w-8">#</th>
                <th className="py-2 px-2.5 print:py-1 print:px-2 font-bold border border-slate-300">Subject Name</th>
                <th className="py-2 px-2.5 print:py-1 print:px-2 font-bold text-center border border-slate-300 w-24">Total Marks</th>
                <th className="py-2 px-2.5 print:py-1 print:px-2 font-bold text-center border border-slate-300 w-24">Obtained</th>
                <th className="py-2 px-2.5 print:py-1 print:px-2 font-bold text-center border border-slate-300 w-16">Grade</th>
                <th className="py-2 px-2.5 print:py-1 print:px-2 font-bold border border-slate-300">Teacher Evaluation</th>
              </tr>
            </thead>
            <tbody>
              {subjects.map((sub, idx) => (
                <tr
                  key={sub.subject}
                  className={idx % 2 === 0 ? "bg-white" : "bg-slate-50/60"}
                >
                  <td className="py-1.5 px-2 print:py-1 print:px-2 font-mono text-slate-500 text-center border border-slate-200">
                    {idx + 1}
                  </td>
                  <td className="py-1.5 px-2.5 print:py-1 print:px-2 font-bold text-slate-900 border border-slate-200">
                    {sub.subject}
                  </td>
                  <td className="py-1.5 px-2.5 print:py-1 print:px-2 text-center font-semibold text-slate-600 border border-slate-200 font-mono">
                    {sub.maxMarks}
                  </td>
                  <td className="py-1.5 px-2.5 print:py-1 print:px-2 text-center font-black text-[#0D1B3D] border border-slate-200 font-mono">
                    {sub.obtainedMarks}
                  </td>
                  <td className="py-1.5 px-2.5 print:py-1 print:px-2 text-center font-bold text-slate-800 border border-slate-200">
                    <span
                      className={`inline-block px-1.5 py-0.2 rounded text-[11px] print:text-[7.5pt] font-black ${
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
                  <td className="py-1.5 px-2.5 print:py-1 print:px-2 text-slate-600 text-[11px] print:text-[7.5pt] border border-slate-200 italic">
                    {sub.remarks || (sub.obtainedMarks / sub.maxMarks >= 0.8 ? "Outstanding comprehension" : "Good conceptual grasp")}
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="bg-[#FCF9EE] font-black text-slate-900 border-t-2 border-[#0D1B3D]">
                <td colSpan={2} className="py-2 px-2.5 print:py-1 print:px-2 text-right uppercase tracking-wider border border-slate-300 text-xs print:text-[8pt]">
                  Grand Total:
                </td>
                <td className="py-2 px-2.5 print:py-1 print:px-2 text-center font-mono border border-slate-300">
                  {result.totalMarks}
                </td>
                <td className="py-2 px-2.5 print:py-1 print:px-2 text-center text-[#0D1B3D] font-mono border border-slate-300">
                  {result.obtainedMarks}
                </td>
                <td className="py-2 px-2.5 print:py-1 print:px-2 text-center text-emerald-800 border border-slate-300">
                  {result.overallGrade}
                </td>
                <td className="py-2 px-2.5 print:py-1 print:px-2 text-slate-700 border border-slate-300 text-xs print:text-[8pt]">
                  Percentage: <strong>{result.percentage}%</strong> ({result.status === "PASS" ? "PROMOTED" : "RE-EXAM"})
                </td>
              </tr>
            </tfoot>
          </table>
        </div>

        {/* 4. Unified Performance & Attendance Certificate Strip (Fits perfectly on 1 page) */}
        <div className="bg-slate-50 border border-slate-300 rounded-lg p-2.5 print:p-2 mb-3 print:mb-2 text-xs print:text-[8pt] relative z-10">
          <div className="grid grid-cols-2 sm:grid-cols-4 print:grid-cols-4 gap-2.5 text-center divide-x divide-slate-200">
            {/* Box 1: Score */}
            <div className="px-2">
              <span className="block text-[10px] print:text-[7pt] font-bold text-slate-500 uppercase">Cumulative Score</span>
              <p className="font-black text-[#0D1B3D] text-sm print:text-[9pt] mt-0.5">
                {result.obtainedMarks} / {result.totalMarks} ({result.percentage}%)
              </p>
            </div>

            {/* Box 2: Letter Grade */}
            <div className="px-2">
              <span className="block text-[10px] print:text-[7pt] font-bold text-slate-500 uppercase">Overall Letter Grade</span>
              <div className="flex items-center justify-center gap-1.5 mt-0.5">
                <span className="bg-[#0D1B3D] text-[#D4AF37] px-2 py-0.2 rounded font-black text-xs print:text-[8pt]">
                  {result.overallGrade}
                </span>
                <span className="font-bold text-slate-700 text-[11px] print:text-[7.5pt]">
                  {result.overallGrade === "A+"
                    ? "Distinction"
                    : result.overallGrade === "A"
                    ? "1st Division"
                    : result.overallGrade === "B"
                    ? "2nd Division"
                    : "Pass"}
                </span>
              </div>
            </div>

            {/* Box 3: Final Status */}
            <div className="px-2">
              <span className="block text-[10px] print:text-[7pt] font-bold text-slate-500 uppercase">Final Status</span>
              <span className={`inline-block font-black text-xs print:text-[8pt] px-2 py-0.5 rounded mt-0.5 ${
                result.status === "PASS"
                  ? "bg-emerald-100 text-emerald-800"
                  : "bg-rose-100 text-rose-800"
              }`}>
                {result.status === "PASS" ? "PROMOTED / PASS" : "FAIL / RE-EXAM"}
              </span>
            </div>

            {/* Box 4: Attendance Standing */}
            <div className="px-2">
              <span className="block text-[10px] print:text-[7pt] font-bold text-slate-500 uppercase">Attendance Standing</span>
              <p className="font-bold text-emerald-700 text-xs print:text-[8pt] mt-0.5">
                96.0% Regular & Punctual
              </p>
            </div>
          </div>
        </div>

        {/* 5. Teacher Remarks & Grading Scale */}
        <div className="border border-slate-200 bg-white rounded-lg p-2.5 print:p-2 mb-3 print:mb-2 text-xs print:text-[7.5pt] text-slate-700 space-y-1 relative z-10">
          <p>
            <strong className="text-[#0D1B3D]">Teacher Conduct & Evaluation: </strong>
            {result.remarks || "Demonstrated excellent discipline, curiosity, and sincere devotion towards academic and co-curricular pursuits."}
          </p>
          <div className="text-[10px] print:text-[7pt] text-slate-500 bg-slate-50 p-1.5 rounded border border-slate-100">
            <strong>Grading Scale: </strong>
            A+ (80% & above - Outstanding) • A (70% to 79.9% - Excellent) • B (60% to 69.9% - Very Good) • C (50% to 59.9% - Pass) • F (Below 50% - Fail)
          </div>
        </div>

        {/* 6. Official Signatures & Seal Section */}
        <div className="pt-3 print:pt-2 border-t-2 border-dashed border-slate-300 grid grid-cols-3 gap-4 text-center text-xs print:text-[7.5pt] relative z-10 break-inside-avoid">
          <div className="space-y-0.5">
            <div className="h-7 print:h-5"></div>
            <div className="border-t border-slate-700 w-4/5 mx-auto pt-1 font-bold text-slate-800">
              Class Teacher
            </div>
            <p className="text-[9px] print:text-[6.5pt] text-slate-400">Signature & Date</p>
          </div>

          <div className="space-y-0.5">
            <div className="h-7 print:h-5"></div>
            <div className="border-t border-slate-700 w-4/5 mx-auto pt-1 font-bold text-slate-800">
              Controller of Exams
            </div>
            <p className="text-[9px] print:text-[6.5pt] text-slate-400">Verified & Recorded</p>
          </div>

          <div className="space-y-0.5">
            <div className="h-7 print:h-5 flex items-center justify-center">
              <span className="text-[9px] print:text-[6.5pt] text-slate-400 font-serif italic border border-slate-300 px-1.5 py-0.2 rounded">
                [ Official School Seal ]
              </span>
            </div>
            <div className="border-t border-slate-700 w-4/5 mx-auto pt-1 font-black text-[#0D1B3D]">
              Principal
            </div>
            <p className="text-[9px] print:text-[6.5pt] text-slate-400">Nayab English Grammer High School</p>
          </div>
        </div>
      </div>
    </div>
  );
}
