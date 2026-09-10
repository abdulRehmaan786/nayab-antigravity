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
  Fingerprint,
  Bell,
  PlusCircle,
  ExternalLink,
} from "lucide-react";

export const dynamic = "force-dynamic";

export default async function TeacherOverviewPage() {
  const session = await getCurrentSession();

  const teacherName = session?.name || "Ali Hassan";

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

        <div className="flex items-center gap-2 bg-[#F2F4F7] text-[#0D1B3D] border border-slate-200 px-3.5 py-2 rounded-xl text-xs font-semibold">
          <Calendar className="w-3.5 h-3.5 text-[#1E3A8A]" />
          <span>09 May, 2025</span>
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
                <Fingerprint className="w-4 h-4 text-[#22C55E] group-hover:text-white" />
                <span>Mark Attendance</span>
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
