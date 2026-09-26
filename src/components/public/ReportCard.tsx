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
            <span>Print Full A4 Report Card</span>
          </button>
        </div>
      </div>

      {/* Formal Printable Report Card Sheet (Full A4 Sheet Canvas) */}
      <div className="printable-card bg-white rounded-xl shadow-lg border-2 border-[#0D1B3D] p-6 sm:p-8 relative overflow-hidden text-slate-800">
        {/* Subtle Watermark in background */}
        <div className="absolute inset-0 flex items-center justify-center opacity-[0.035] pointer-events-none select-none">
          <Image
            src="/images/school-logo.png"
            alt="Watermark"
            width={440}
            height={440}
            className="object-contain"
          />
        </div>

        {/* TOP SECTION: Header + Bio */}
        <div className="space-y-4 print:space-y-3 relative z-10">
          {/* 1. School Formal Header */}
          <div className="border-b-2 border-[#0D1B3D] pb-3 text-center">
            <div className="flex items-center justify-center gap-4 mb-2">
              <div className="w-16 h-16 sm:w-20 sm:h-20 print:w-16 print:h-16 rounded-full bg-white p-1 border-2 border-[#D4AF37] flex items-center justify-center shrink-0 shadow-xs">
                <Image
                  src="/images/school-logo.png"
                  alt="Nayab English Grammer High School Emblem"
                  width={68}
                  height={68}
                  className="w-full h-full object-contain"
                  priority
                />
              </div>
              <div className="text-center sm:text-left">
                <h1 className="text-xl sm:text-2xl md:text-3xl print:text-xl font-black tracking-tight text-[#0D1B3D] uppercase font-heading leading-tight">
                  NAYAB ENGLISH GRAMMER HIGH SCHOOL
                </h1>
                <p className="text-xs sm:text-sm print:text-[10pt] font-extrabold tracking-wider text-[#D4AF37] uppercase">
                  Mirwah Campus • Registered & Recognized Institution
                </p>
                <p className="text-[11px] sm:text-xs print:text-[8.5pt] text-slate-500 font-medium">
                  Official Examination Wing • Academic Session {result.academicYear || "2024-2025"}
                </p>
              </div>
            </div>

            <div className="inline-block bg-[#0D1B3D] text-[#D4AF37] px-5 py-1 rounded-full text-xs print:text-[9pt] font-extrabold tracking-wider uppercase border border-[#D4AF37]/50 shadow-xs">
              {result.examTerm} — Progress Report Card
            </div>
          </div>

          {/* 2. Student Bio Grid */}
          <div className="bg-[#F8F9FB] border border-slate-300 rounded-lg p-3.5 print:p-2.5 text-xs print:text-[8.5pt]">
            <div className="grid grid-cols-2 sm:grid-cols-4 print:grid-cols-4 gap-3 print:gap-2">
              <div>
                <span className="block text-[10px] print:text-[7pt] font-bold text-slate-400 uppercase tracking-wider">
                  Student Name
                </span>
                <span className="font-extrabold text-slate-900 text-sm print:text-[9.5pt]">{student.name}</span>
              </div>
              <div>
                <span className="block text-[10px] print:text-[7pt] font-bold text-slate-400 uppercase tracking-wider">
                  Father&apos;s Name
                </span>
                <span className="font-bold text-slate-800 text-xs print:text-[8.5pt]">{student.fatherName}</span>
              </div>
              <div>
                <span className="block text-[10px] print:text-[7pt] font-bold text-slate-400 uppercase tracking-wider">
                  Roll & G.R. Number
                </span>
                <span className="font-mono font-black text-[#0D1B3D] text-xs print:text-[8.5pt]">
                  Roll #{student.rollNumber} {student.grNumber ? `• GR: ${student.grNumber}` : ""}
                </span>
              </div>
              <div>
                <span className="block text-[10px] print:text-[7pt] font-bold text-slate-400 uppercase tracking-wider">
                  Class & Section
                </span>
                <span className="font-bold text-slate-800 text-xs print:text-[8.5pt]">
                  {student.className} ({student.section || "A"})
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* MIDDLE SECTION: Marks Breakdown Table */}
        <div className="my-3 print:my-2 overflow-x-auto relative z-10 flex-1 flex flex-col justify-center">
          <table className="w-full text-left border-collapse border border-slate-300 text-xs print:text-[8.5pt]">
            <thead>
              <tr className="bg-[#0D1B3D] text-white print:bg-[#0D1B3D] print:text-white">
                <th className="py-2.5 px-3 print:py-1.5 print:px-2.5 font-bold border border-slate-300 text-center w-10">
                  Sr#
                </th>
                <th className="py-2.5 px-3 print:py-1.5 print:px-2.5 font-bold border border-slate-300">
                  Subject Name
                </th>
                <th className="py-2.5 px-3 print:py-1.5 print:px-2.5 font-bold text-center border border-slate-300 w-24">
                  Max Marks
                </th>
                <th className="py-2.5 px-3 print:py-1.5 print:px-2.5 font-bold text-center border border-slate-300 w-24">
                  Obtained
                </th>
                <th className="py-2.5 px-3 print:py-1.5 print:px-2.5 font-bold text-center border border-slate-300 w-20">
                  Grade
                </th>
                <th className="py-2.5 px-3 print:py-1.5 print:px-2.5 font-bold border border-slate-300">
                  Teacher Evaluation & Remarks
                </th>
              </tr>
            </thead>
            <tbody>
              {subjects.map((sub, idx) => (
                <tr
                  key={sub.subject}
                  className={idx % 2 === 0 ? "bg-white" : "bg-slate-50/70"}
                >
                  <td className="py-2 px-3 print:py-1.5 print:px-2.5 font-mono text-slate-500 text-center border border-slate-200">
                    {idx + 1}
                  </td>
                  <td className="py-2 px-3 print:py-1.5 print:px-2.5 font-bold text-slate-900 border border-slate-200">
                    {sub.subject}
                  </td>
                  <td className="py-2 px-3 print:py-1.5 print:px-2.5 text-center font-semibold text-slate-600 border border-slate-200 font-mono">
                    {sub.maxMarks}
                  </td>
                  <td className="py-2 px-3 print:py-1.5 print:px-2.5 text-center font-black text-[#0D1B3D] border border-slate-200 font-mono">
                    {sub.obtainedMarks}
                  </td>
                  <td className="py-2 px-3 print:py-1.5 print:px-2.5 text-center font-bold text-slate-800 border border-slate-200">
                    <span
                      className={`inline-block px-2 py-0.5 rounded text-[11px] print:text-[8pt] font-black ${
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
                  <td className="py-2 px-3 print:py-1.5 print:px-2.5 text-slate-600 text-xs print:text-[8pt] border border-slate-200 italic">
                    {sub.remarks || (sub.obtainedMarks / sub.maxMarks >= 0.8 ? "Outstanding comprehension" : "Good conceptual grasp")}
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="bg-[#FCF9EE] font-black text-slate-900 border-t-2 border-[#0D1B3D]">
                <td colSpan={2} className="py-2.5 px-3 print:py-2 print:px-2.5 text-right uppercase tracking-wider border border-slate-300 text-xs print:text-[8.5pt]">
                  Grand Total:
                </td>
                <td className="py-2.5 px-3 print:py-2 print:px-2.5 text-center font-mono border border-slate-300">
                  {result.totalMarks}
                </td>
                <td className="py-2.5 px-3 print:py-2 print:px-2.5 text-center text-[#0D1B3D] font-mono border border-slate-300 text-sm print:text-[9.5pt]">
                  {result.obtainedMarks}
                </td>
                <td className="py-2.5 px-3 print:py-2 print:px-2.5 text-center text-emerald-800 border border-slate-300 text-sm print:text-[9.5pt]">
                  {result.overallGrade}
                </td>
                <td className="py-2.5 px-3 print:py-2 print:px-2.5 text-slate-800 border border-slate-300 text-xs print:text-[8.5pt]">
                  Overall Percentage: <strong>{result.percentage}%</strong> ({result.status === "PASS" ? "PROMOTED" : "RE-EXAM"})
                </td>
              </tr>
            </tfoot>
          </table>
        </div>

        {/* BOTTOM SECTION: Performance Strip + Remarks + Signatures */}
        <div className="space-y-3.5 print:space-y-2.5 relative z-10">
          {/* 3. Unified Performance & Attendance Certificate Strip */}
          <div className="bg-slate-50 border border-slate-300 rounded-lg p-3 print:p-2 text-xs print:text-[8.5pt]">
            <div className="grid grid-cols-2 sm:grid-cols-4 print:grid-cols-4 gap-3 text-center divide-x divide-slate-200">
              {/* Box 1: Score */}
              <div className="px-2">
                <span className="block text-[10px] print:text-[7pt] font-bold text-slate-500 uppercase tracking-wider">
                  Cumulative Score
                </span>
                <p className="font-black text-[#0D1B3D] text-base print:text-[10pt] mt-0.5">
                  {result.obtainedMarks} / {result.totalMarks} ({result.percentage}%)
                </p>
              </div>

              {/* Box 2: Letter Grade */}
              <div className="px-2">
                <span className="block text-[10px] print:text-[7pt] font-bold text-slate-500 uppercase tracking-wider">
                  Overall Letter Grade
                </span>
                <div className="flex items-center justify-center gap-1.5 mt-0.5">
                  <span className="bg-[#0D1B3D] text-[#D4AF37] px-2 py-0.5 rounded font-black text-xs print:text-[8.5pt]">
                    {result.overallGrade}
                  </span>
                  <span className="font-bold text-slate-700 text-xs print:text-[8pt]">
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
                <span className="block text-[10px] print:text-[7pt] font-bold text-slate-500 uppercase tracking-wider">
                  Final Status
                </span>
                <span className={`inline-block font-black text-xs print:text-[8.5pt] px-2.5 py-0.5 rounded mt-0.5 ${
                  result.status === "PASS"
                    ? "bg-emerald-100 text-emerald-800"
                    : "bg-rose-100 text-rose-800"
                }`}>
                  {result.status === "PASS" ? "PROMOTED / PASS" : "FAIL / RE-EXAM"}
                </span>
              </div>

              {/* Box 4: Attendance Standing */}
              <div className="px-2">
                <span className="block text-[10px] print:text-[7pt] font-bold text-slate-500 uppercase tracking-wider">
                  Attendance Standing
                </span>
                <p className="font-bold text-emerald-700 text-xs print:text-[8.5pt] mt-0.5">
                  96.0% Regular & Punctual
                </p>
              </div>
            </div>
          </div>

          {/* 4. Teacher Remarks & Grading Scale */}
          <div className="border border-slate-200 bg-white rounded-lg p-3 print:p-2 text-xs print:text-[8pt] text-slate-700 space-y-1.5">
            <p>
              <strong className="text-[#0D1B3D]">Teacher Assessment & Conduct: </strong>
              {result.remarks || "Demonstrated commendable discipline, academic curiosity, and active participation in school co-curricular activities."}
            </p>
            <div className="text-[10px] print:text-[7.5pt] text-slate-500 bg-slate-50 p-1.5 rounded border border-slate-100">
              <strong>Grading Scale: </strong>
              A+ (80% & above - Outstanding) • A (70% to 79.9% - Excellent) • B (60% to 69.9% - Very Good) • C (50% to 59.9% - Pass) • F (Below 50% - Fail)
            </div>
          </div>

          {/* 5. Official Signatures & Seal Section (Anchored at the bottom) */}
          <div className="pt-4 print:pt-3 border-t-2 border-dashed border-slate-300 grid grid-cols-3 gap-6 text-center text-xs print:text-[8pt] break-inside-avoid">
            <div className="space-y-1">
              <div className="h-10 print:h-8"></div>
              <div className="border-t-2 border-slate-700 w-4/5 mx-auto pt-1 font-bold text-slate-800">
                Class Teacher
              </div>
              <p className="text-[10px] print:text-[7pt] text-slate-400">Signature & Date</p>
            </div>

            <div className="space-y-1">
              <div className="h-10 print:h-8"></div>
              <div className="border-t-2 border-slate-700 w-4/5 mx-auto pt-1 font-bold text-slate-800">
                Controller of Exams
              </div>
              <p className="text-[10px] print:text-[7pt] text-slate-400">Verified & Recorded</p>
            </div>

            <div className="space-y-1">
              <div className="h-10 print:h-8 flex items-center justify-center">
                <span className="text-[9px] print:text-[7pt] text-slate-400 font-serif italic border border-slate-300 px-2 py-0.5 rounded">
                  [ Official School Seal ]
                </span>
              </div>
              <div className="border-t-2 border-slate-700 w-4/5 mx-auto pt-1 font-black text-[#0D1B3D]">
                Principal
              </div>
              <p className="text-[10px] print:text-[7pt] text-slate-400">Nayab English Grammer High School</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
