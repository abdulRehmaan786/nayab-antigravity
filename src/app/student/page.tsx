import Link from "next/link";
import { BookOpen, Calendar, Clock, Award, CheckCircle2, TrendingUp, ArrowRight, Printer } from "lucide-react";

export const metadata = {
  title: "Student Dashboard — Nayab Grammar School Mirwah",
  description: "Student dashboard with class timetables, attendance percentages, and examination results.",
};

export default function StudentDashboardPage() {
  const timetable = [
    { period: 1, subject: "English", time: "08:00 AM" },
    { period: 2, subject: "Mathematics", time: "09:00 AM" },
    { period: 3, subject: "Science", time: "10:00 AM" },
    { period: 4, subject: "Urdu", time: "11:00 AM" },
    { period: 5, subject: "Computer", time: "12:00 PM" },
  ];

  const results = [
    { subject: "English", obtained: 85, total: 100, pct: "85%", grade: "A" },
    { subject: "Mathematics", obtained: 90, total: 100, pct: "90%", grade: "A+" },
    { subject: "Science", obtained: 78, total: 100, pct: "78%", grade: "B" },
    { subject: "Urdu", obtained: 88, total: 100, pct: "88%", grade: "A" },
    { subject: "Computer", obtained: 92, total: 100, pct: "92%", grade: "A+" },
  ];

  return (
    <div className="min-h-screen bg-[#F2F4F7] p-4 sm:p-8 font-sans">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Top Header matching Student High-Fidelity Screen */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight font-heading flex items-center gap-2">
              <span>Welcome, Ahmed Khan</span>
              <span className="text-2xl">👋</span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              Keep up the great work! Class 9th A • Roll #101
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-[#F2F4F7] text-[#0D1B3D] border border-slate-200 px-3.5 py-2 rounded-xl text-xs font-semibold">
              <Calendar className="w-3.5 h-3.5 text-[#1E3A8A]" />
              <span>09 May, 2025</span>
            </div>

            <Link
              href="/results?className=Class%209&rollNumber=101"
              className="inline-flex items-center gap-1.5 bg-[#0D1B3D] hover:bg-[#1E3A8A] text-white px-3.5 py-2 rounded-xl text-xs font-semibold shadow transition"
            >
              <Printer className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>Official Marksheet</span>
            </Link>
          </div>
        </div>

        {/* Row 1: 4 Stat Cards from Mockup */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {/* Card 1: My Classes */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-[#1E3A8A] flex items-center justify-center shrink-0">
              <BookOpen className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-500">My Classes</p>
              <h3 className="text-2xl font-black text-slate-900 mt-0.5 tracking-tight font-heading">5</h3>
            </div>
          </div>

          {/* Card 2: Attendance */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-[#22C55E] flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-500">Attendance</p>
              <h3 className="text-2xl font-black text-[#22C55E] mt-0.5 tracking-tight font-heading">94%</h3>
            </div>
          </div>

          {/* Card 3: Average Marks */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-[#22C55E] flex items-center justify-center shrink-0">
              <TrendingUp className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-500">Average Marks</p>
              <h3 className="text-2xl font-black text-[#22C55E] mt-0.5 tracking-tight font-heading">85%</h3>
            </div>
          </div>

          {/* Card 4: My Rank */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-[#1E3A8A] flex items-center justify-center shrink-0">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-500">My Rank</p>
              <h3 className="text-2xl font-black text-[#1E3A8A] mt-0.5 tracking-tight font-heading">3 / 28</h3>
            </div>
          </div>
        </div>

        {/* Row 2: Timetable & Latest Results Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column (5 cols): Today's Timetable */}
          <div className="lg:col-span-5 bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h2 className="text-base font-bold text-slate-900 font-heading flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#1E3A8A]" />
                <span>Today's Timetable</span>
              </h2>
              <span className="text-xs text-[#D4AF37] font-bold">5 Periods</span>
            </div>

            <div className="divide-y divide-slate-100">
              {timetable.map((t) => (
                <div key={t.period} className="py-3 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-full bg-slate-100 text-slate-700 font-bold flex items-center justify-center text-[11px]">
                      {t.period}
                    </span>
                    <span className="font-bold text-slate-900 text-sm">{t.subject}</span>
                  </div>
                  <span className="font-semibold text-slate-500 bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-200">
                    {t.time}
                  </span>
                </div>
              ))}
            </div>

            <div className="pt-2">
              <Link href="/academics" className="text-xs font-semibold text-[#1E3A8A] hover:underline flex items-center gap-1">
                <span>View Full Timetable</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Right Column (7 cols): Latest Results */}
          <div className="lg:col-span-7 bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h2 className="text-base font-bold text-slate-900 font-heading flex items-center gap-2">
                <Award className="w-4 h-4 text-[#D4AF37]" />
                <span>Latest Results</span>
              </h2>
              <span className="text-xs bg-emerald-50 text-emerald-800 border border-emerald-200 font-bold px-2.5 py-0.5 rounded-full">
                Grand Total: 433/500 (86.6%)
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead>
                  <tr className="border-b border-slate-100 text-slate-400 uppercase font-semibold">
                    <th className="py-2.5 px-2">Subject</th>
                    <th className="py-2.5 px-2 text-center">Obtained</th>
                    <th className="py-2.5 px-2 text-center">Total</th>
                    <th className="py-2.5 px-2 text-center">%</th>
                    <th className="py-2.5 px-2 text-right">Grade</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {results.map((r) => (
                    <tr key={r.subject} className="hover:bg-slate-50 transition">
                      <td className="py-3 px-2 font-bold text-slate-900">{r.subject}</td>
                      <td className="py-3 px-2 text-center font-bold text-[#0D1B3D]">{r.obtained}</td>
                      <td className="py-3 px-2 text-center text-slate-500">{r.total}</td>
                      <td className="py-3 px-2 text-center font-semibold text-slate-700">{r.pct}</td>
                      <td className="py-3 px-2 text-right">
                        <span className="bg-[#0D1B3D] text-white font-bold px-2 py-0.5 rounded text-[11px]">
                          {r.grade}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="pt-2">
              <Link
                href="/results?className=Class%209&rollNumber=101"
                className="text-xs font-semibold text-[#1E3A8A] hover:underline flex items-center gap-1"
              >
                <span>View Full Results & Official Card</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
