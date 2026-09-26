import Link from "next/link";
import { getCurrentSession } from "@/lib/auth";
import { db } from "@/lib/db";
import {
  FileSpreadsheet,
  Users,
  Award,
  ArrowRight,
  CheckCircle2,
  Clock,
  BookOpen,
  Calendar,
  Bell,
  PlusCircle,
  ExternalLink,
  DollarSign,
  Briefcase,
  GraduationCap,
} from "lucide-react";

export const dynamic = "force-dynamic";

export default async function TeacherOverviewPage() {
  const session = await getCurrentSession();

  const teacherName = session?.name || "Teacher";

  const staffProfile = session?.userId
    ? await db.staffMember.findFirst({
        where: {
          OR: [
            { userId: session.userId },
            { name: { contains: teacherName.split(" ")[1] || teacherName } },
          ],
        },
        include: {
          salaries: { orderBy: { createdAt: "desc" }, take: 1 },
          attendances: { orderBy: { date: "desc" }, take: 5 },
        },
      })
    : null;

  const latestSalary = staffProfile?.salaries?.[0];
  const recentAttendances = staffProfile?.attendances || [];

  return (
    <div className="space-y-6 max-w-7xl mx-auto font-sans">
      {/* Top Bar matching Teacher High-Fidelity Screen */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight font-heading flex items-center gap-2">
            <span>Good Morning, {teacherName}</span>
            <span className="text-2xl">👋</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Here's your classes and activities.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {session?.classTeacherOf && (
            <span className="inline-flex items-center gap-1.5 bg-emerald-100 text-emerald-800 border border-emerald-300 px-3 py-1.5 rounded-xl text-xs font-bold shadow-xs">
              <GraduationCap className="w-3.5 h-3.5 text-emerald-700" />
              <span>Class Teacher: {session.classTeacherOf}</span>
            </span>
          )}
          <div className="flex items-center gap-2 bg-[#F2F4F7] text-[#0D1B3D] border border-slate-200 px-3.5 py-2 rounded-xl text-xs font-semibold">
            <Calendar className="w-3.5 h-3.5 text-[#1E3A8A]" />
            <span>09 May, 2025</span>
          </div>
        </div>
      </div>

      {/* Class Teacher Dedicated Action Banner */}
      {session?.classTeacherOf && (
        <div className="bg-gradient-to-r from-[#0F392B] to-[#1B2A4A] text-white p-5 rounded-2xl border border-emerald-500/30 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="text-[10px] font-extrabold uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 px-2.5 py-0.5 rounded-full inline-flex items-center gap-1">
              <GraduationCap className="w-3.5 h-3.5" /> Class Teacher Privileges
            </span>
            <h2 className="text-base sm:text-lg font-bold text-white">Daily Attendance for {session.classTeacherOf}</h2>
            <p className="text-xs text-slate-300">
              You are assigned as the Class Teacher for {session.classTeacherOf}. Record today's student roll-call and punctuality.
            </p>
          </div>
          <Link
            href="/teacher/class-attendance"
            className="inline-flex items-center gap-2 bg-[#D4AF37] hover:bg-[#e0bc45] text-[#111C32] px-4 py-2 rounded-xl text-xs font-black shadow transition whitespace-nowrap self-start sm:self-auto cursor-pointer"
          >
            <span>Take Today's Attendance</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      )}

      {/* Row 1: 4 Stat Cards from Mockup */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {/* Card 1: My Classes */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-[#1E3A8A] flex items-center justify-center shrink-0">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500">My Classes</p>
            <h3 className="text-2xl font-black text-slate-900 mt-0.5 tracking-tight font-heading">4</h3>
          </div>
        </div>

        {/* Card 2: Today's Classes */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-[#F59E0B] flex items-center justify-center shrink-0">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500">Today's Classes</p>
            <h3 className="text-2xl font-black text-slate-900 mt-0.5 tracking-tight font-heading">3</h3>
          </div>
        </div>

        {/* Card 3: Total Students */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-700 flex items-center justify-center shrink-0">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500">Total Students</p>
            <h3 className="text-2xl font-black text-slate-900 mt-0.5 tracking-tight font-heading">112</h3>
          </div>
        </div>

        {/* Card 4: Present Today */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-[#22C55E] flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500">Present Today</p>
            <h3 className="text-2xl font-black text-[#22C55E] mt-0.5 tracking-tight font-heading">96%</h3>
          </div>
        </div>
      </div>

      {/* Row 2: Two Columns Layout matching Mockup */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (7 cols): "My Classes" Table */}
        <div className="lg:col-span-7 bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h2 className="text-base font-bold text-slate-900 font-heading">My Classes</h2>
            <Link href="/teacher/marks-entry" className="text-xs font-semibold text-[#1E3A8A] hover:underline">
              View All Classes →
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="border-b border-slate-100 text-slate-400 uppercase font-semibold">
                  <th className="py-2.5 px-2">Class</th>
                  <th className="py-2.5 px-2 text-center">Students</th>
                  <th className="py-2.5 px-2 text-right">Next Class</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                <tr className="hover:bg-slate-50 transition">
                  <td className="py-3 px-2 font-bold text-slate-900">9th A</td>
                  <td className="py-3 px-2 text-center text-slate-600 font-semibold">28</td>
                  <td className="py-3 px-2 text-right font-bold text-[#1E3A8A]">10:00 AM</td>
                </tr>
                <tr className="hover:bg-slate-50 transition">
                  <td className="py-3 px-2 font-bold text-slate-900">9th B</td>
                  <td className="py-3 px-2 text-center text-slate-600 font-semibold">27</td>
                  <td className="py-3 px-2 text-right font-bold text-[#1E3A8A]">11:00 AM</td>
                </tr>
                <tr className="hover:bg-slate-50 transition">
                  <td className="py-3 px-2 font-bold text-slate-900">8th A</td>
                  <td className="py-3 px-2 text-center text-slate-600 font-semibold">29</td>
                  <td className="py-3 px-2 text-right font-bold text-[#1E3A8A]">12:00 PM</td>
                </tr>
                <tr className="hover:bg-slate-50 transition">
                  <td className="py-3 px-2 font-bold text-slate-900">7th B</td>
                  <td className="py-3 px-2 text-center text-slate-600 font-semibold">28</td>
                  <td className="py-3 px-2 text-right font-bold text-[#1E3A8A]">01:00 PM</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="pt-2">
            <Link
              href="/teacher/marks-entry"
              className="text-xs font-semibold text-[#1E3A8A] hover:text-[#0D1B3D] flex items-center gap-1"
            >
              <span>Grade Marks for All Classes</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Right Column (5 cols): Quick Actions & Recent Announcements */}
        <div className="lg:col-span-5 space-y-6">
          {/* Quick Actions Card from Mockup */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
            <h2 className="text-base font-bold text-slate-900 font-heading">Quick Actions</h2>
            <div className="grid grid-cols-2 gap-3">
              <Link
                href="/teacher/attendance"
                className="flex items-center gap-2 p-3 rounded-xl bg-slate-50 border border-slate-200 hover:bg-[#0D1B3D] hover:text-white group transition text-xs font-semibold text-slate-700"
              >
                <Calendar className="w-4 h-4 text-[#22C55E] group-hover:text-white" />
                <span>My Attendance Calendar</span>
              </Link>

              <Link
                href="/teacher/marks-entry"
                className="flex items-center gap-2 p-3 rounded-xl bg-slate-50 border border-slate-200 hover:bg-[#0D1B3D] hover:text-white group transition text-xs font-semibold text-slate-700"
              >
                <FileSpreadsheet className="w-4 h-4 text-[#1E3A8A] group-hover:text-white" />
                <span>Enter Marks</span>
              </Link>

              <Link
                href="/academics"
                className="flex items-center gap-2 p-3 rounded-xl bg-slate-50 border border-slate-200 hover:bg-[#0D1B3D] hover:text-white group transition text-xs font-semibold text-slate-700"
              >
                <Clock className="w-4 h-4 text-[#F59E0B] group-hover:text-white" />
                <span>View Timetable</span>
              </Link>

              <Link
                href="/teacher/notices"
                className="flex items-center gap-2 p-3 rounded-xl bg-slate-50 border border-slate-200 hover:bg-[#0D1B3D] hover:text-white group transition text-xs font-semibold text-slate-700"
              >
                <Bell className="w-4 h-4 text-purple-600 group-hover:text-white" />
                <span>Create Notice</span>
              </Link>

              {session?.classTeacherOf && (
                <Link
                  href="/teacher/class-attendance"
                  className="col-span-2 flex items-center justify-between p-3 rounded-xl bg-emerald-50 border border-emerald-300 hover:bg-emerald-800 hover:text-white group transition text-xs font-bold text-emerald-900"
                >
                  <div className="flex items-center gap-2">
                    <GraduationCap className="w-4 h-4 text-emerald-700 group-hover:text-white" />
                    <span>Take Daily Attendance ({session.classTeacherOf})</span>
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 text-emerald-600 group-hover:text-white" />
                </Link>
              )}
            </div>
          </div>

          {/* My Salary & Attendance Widget */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h2 className="text-base font-bold text-slate-900 font-heading flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-[#1E3A8A]" />
                <span>My Salary & Attendance</span>
              </h2>
              {latestSalary && (
                <span className={`px-2 py-0.5 rounded text-[11px] font-black ${
                  latestSalary.status === "PAID"
                    ? "bg-emerald-100 text-emerald-800"
                    : "bg-amber-100 text-amber-800"
                }`}>
                  {latestSalary.status}
                </span>
              )}
            </div>

            <div className="grid grid-cols-2 gap-3 pt-1">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <p className="text-[10px] text-slate-400 font-semibold uppercase">Latest Salary</p>
                <p className="text-base font-black text-[#0D1B3D] mt-0.5">
                  Rs. {latestSalary?.netSalary?.toLocaleString() || "35,000"}
                </p>
                <p className="text-[10px] text-slate-500 mt-0.5">
                  {latestSalary?.month || "September 2025"} {latestSalary?.receiptNumber ? `• ${latestSalary.receiptNumber}` : ""}
                </p>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <p className="text-[10px] text-slate-400 font-semibold uppercase">Today's Check-In</p>
                <p className="text-base font-black text-emerald-600 mt-0.5">
                  {recentAttendances[0]?.checkInTime || "07:30 AM"}
                </p>
                <p className="text-[10px] text-slate-500 mt-0.5">
                  Status: <strong className="text-emerald-700">{recentAttendances[0]?.status || "PRESENT"}</strong>
                </p>
              </div>
            </div>
          </div>

          {/* Recent Announcements from Mockup */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h2 className="text-base font-bold text-slate-900 font-heading">Recent Announcements</h2>
              <Link href="/announcements" className="text-xs font-semibold text-[#1E3A8A] hover:underline">
                View All →
              </Link>
            </div>

            <div className="p-3.5 rounded-xl bg-[#F2F4F7] border border-slate-200 space-y-1">
              <div className="flex items-center justify-between">
                <p className="font-bold text-xs text-slate-900">Summer Vacation Notice</p>
                <span className="text-[10px] text-slate-400">08 May, 2025</span>
              </div>
              <p className="text-[11px] text-slate-600">
                School will remain closed from 15th May to 31st May.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
