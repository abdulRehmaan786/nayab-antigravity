import Link from "next/link";
import { getCurrentSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { FileSpreadsheet, Users, Award, ArrowRight, CheckCircle2, Clock } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function TeacherOverviewPage() {
  const session = await getCurrentSession();

  const [class9Count, class10Count, class8Count, totalResults] = await Promise.all([
    db.student.count({ where: { className: "Class 9" } }),
    db.student.count({ where: { className: "Class 10" } }),
    db.student.count({ where: { className: "Class 8" } }),
    db.examResult.count(),
  ]);

  const assigned = session?.assignedClasses || ["Class 8", "Class 9", "Class 10"];

  return (
    <div className="space-y-8">
      {/* Banner */}
      <div className="bg-gradient-to-r from-[#1B2A4A] to-[#243760] text-white p-6 sm:p-8 rounded-3xl shadow-lg border border-[#D4AF37]/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-[#D4AF37] uppercase tracking-wider">
            Faculty Portal
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight mt-1">
            Welcome, {session?.name}
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-2 max-w-xl leading-relaxed">
            Record midterm and annual examination marks, auto-compute letter grades (A+, A, B, C, F), and publish official report cards for your assigned classes.
          </p>
        </div>

        <Link
          href="/teacher/marks-entry"
          className="inline-flex items-center gap-2 bg-[#D4AF37] hover:bg-[#c29e2c] text-[#111C32] px-5 py-3 rounded-2xl text-xs sm:text-sm font-extrabold shadow-md transition self-start sm:self-auto"
        >
          <FileSpreadsheet className="w-4 h-4" />
          <span>Enter Marks Sheet</span>
        </Link>
      </div>

      {/* Assigned Classes Grid */}
      <div>
        <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
          <Users className="w-5 h-5 text-[#1B2A4A]" />
          <span>Your Assigned Classes</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Class 9</span>
              <span className="text-xs bg-blue-50 text-blue-800 font-bold px-2 py-0.5 rounded">
                Active
              </span>
            </div>
            <h3 className="text-2xl font-black text-slate-900">{class9Count} Students</h3>
            <p className="text-xs text-slate-500 mt-1">Sections A & B • Science Group</p>
            <div className="mt-4 pt-4 border-t border-slate-100">
              <Link
                href="/teacher/marks-entry?class=Class%209"
                className="text-xs font-bold text-[#1B2A4A] hover:text-[#D4AF37] flex items-center gap-1"
              >
                <span>Grade Class 9</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Class 10</span>
              <span className="text-xs bg-purple-50 text-purple-800 font-bold px-2 py-0.5 rounded">
                Matriculation
              </span>
            </div>
            <h3 className="text-2xl font-black text-slate-900">{class10Count} Students</h3>
            <p className="text-xs text-slate-500 mt-1">Sections A & B • Board Candidates</p>
            <div className="mt-4 pt-4 border-t border-slate-100">
              <Link
                href="/teacher/marks-entry?class=Class%2010"
                className="text-xs font-bold text-[#1B2A4A] hover:text-[#D4AF37] flex items-center gap-1"
              >
                <span>Grade Class 10</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Class 8</span>
              <span className="text-xs bg-emerald-50 text-emerald-800 font-bold px-2 py-0.5 rounded">
                Middle Wing
              </span>
            </div>
            <h3 className="text-2xl font-black text-slate-900">{class8Count} Students</h3>
            <p className="text-xs text-slate-500 mt-1">Section A • General Subjects</p>
            <div className="mt-4 pt-4 border-t border-slate-100">
              <Link
                href="/teacher/marks-entry?class=Class%208"
                className="text-xs font-bold text-[#1B2A4A] hover:text-[#D4AF37] flex items-center gap-1"
              >
                <span>Grade Class 8</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
