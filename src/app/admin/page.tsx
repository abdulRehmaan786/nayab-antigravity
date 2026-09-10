import Link from "next/link";
import { db } from "@/lib/db";
import {
  Users,
  CreditCard,
  Award,
  Bell,
  Plus,
  ArrowRight,
  CheckCircle2,
  Clock,
  XCircle,
  GraduationCap,
  Fingerprint,
} from "lucide-react";

export const dynamic = "force-dynamic";

async function getAdminMetrics() {
  const [
    studentsCount,
    teachersCount,
    resultsCount,
    paidFees,
    pendingFees,
    unpaidFees,
    attendanceStats,
    recentStudents,
    recentFees,
  ] = await Promise.all([
    db.student.count(),
    db.user.count({ where: { role: "TEACHER" } }),
    db.examResult.count(),
    db.feeRecord.aggregate({
      where: { status: "PAID" },
      _sum: { amount: true },
      _count: true,
    }),
    db.feeRecord.aggregate({
      where: { status: "PENDING" },
      _sum: { amount: true },
      _count: true,
    }),
    db.feeRecord.aggregate({
      where: { status: "UNPAID" },
      _sum: { amount: true },
      _count: true,
    }),
    db.attendanceRecord.findMany({
      where: { date: "2025-09-10" },
    }),
    db.student.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
    }),
    db.feeRecord.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      include: { student: true },
    }),
  ]);

  const presentCount = attendanceStats.filter((a) => a.status === "PRESENT").length;
  const lateCount = attendanceStats.filter((a) => a.status === "LATE").length;
  const attendanceRate =
    studentsCount > 0 ? Math.round(((presentCount + lateCount) / studentsCount) * 100) : 0;

  return {
    studentsCount,
    teachersCount,
    resultsCount,
    totalCollected: paidFees._sum.amount || 0,
    paidCount: paidFees._count || 0,
    totalPending: (pendingFees._sum.amount || 0) + (unpaidFees._sum.amount || 0),
    pendingCount: (pendingFees._count || 0) + (unpaidFees._count || 0),
    attendanceRate,
    presentCount,
    lateCount,
    recentStudents,
    recentFees,
  };
}

export default async function AdminDashboardPage() {
  const data = await getAdminMetrics();

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Administrator Overview
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Real-time management dashboard for Nayab Grammar School, Mirwah.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Link
            href="/admin/attendance"
            className="inline-flex items-center gap-1.5 bg-[#FCF9EE] border border-[#D4AF37] text-[#1B2A4A] px-3.5 py-2 rounded-xl text-xs font-bold hover:bg-[#D4AF37] hover:text-[#111C32] transition shadow-xs"
          >
            <Fingerprint className="w-3.5 h-3.5 text-[#1B2A4A]" />
            <span>Biometric Gate</span>
          </Link>
          <Link
            href="/admin/teachers"
            className="inline-flex items-center gap-1.5 bg-white border border-slate-300 text-slate-800 px-3.5 py-2 rounded-xl text-xs font-bold hover:bg-slate-100 transition shadow-xs"
          >
            <GraduationCap className="w-3.5 h-3.5 text-[#1B2A4A]" />
            <span>Teachers & Subjects</span>
          </Link>
          <Link
            href="/admin/students"
            className="inline-flex items-center gap-1.5 bg-[#1B2A4A] text-white px-3.5 py-2 rounded-xl text-xs font-bold hover:bg-[#111C32] transition shadow-xs"
          >
            <Plus className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span>Add Student</span>
          </Link>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center shrink-0">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[10px] text-slate-500 font-bold uppercase">Total Students</p>
            <h3 className="text-xl font-black text-slate-900 mt-0.5">{data.studentsCount}</h3>
            <p className="text-[10px] text-slate-400">All classes enrolled</p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-[#FCF9EE] text-[#1B2A4A] border border-[#D4AF37]/40 flex items-center justify-center shrink-0">
            <Fingerprint className="w-5 h-5 text-[#D4AF37]" />
          </div>
          <div>
            <p className="text-[10px] text-slate-500 font-bold uppercase">Biometric Attendance</p>
            <h3 className="text-xl font-black text-slate-900 mt-0.5">{data.attendanceRate}%</h3>
            <p className="text-[10px] text-emerald-600 font-semibold">{data.presentCount} On-time, {data.lateCount} Late</p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
            <CreditCard className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[10px] text-slate-500 font-bold uppercase">Fee Collected</p>
            <h3 className="text-xl font-black text-emerald-700 mt-0.5">
              Rs. {data.totalCollected.toLocaleString()}
            </h3>
            <p className="text-[10px] text-emerald-600 font-medium">{data.paidCount} Vouchers Paid</p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center shrink-0">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[10px] text-slate-500 font-bold uppercase">Pending Dues</p>
            <h3 className="text-xl font-black text-amber-700 mt-0.5">
              Rs. {data.totalPending.toLocaleString()}
            </h3>
            <p className="text-[10px] text-amber-600 font-medium">{data.pendingCount} Vouchers Pending</p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center shrink-0">
            <Award className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[10px] text-slate-500 font-bold uppercase">Subject Results</p>
            <h3 className="text-xl font-black text-purple-800 mt-0.5">{data.resultsCount}</h3>
            <p className="text-[10px] text-purple-600 font-medium">{data.teachersCount} Active Teachers</p>
          </div>
        </div>
      </div>

      {/* Two Column Tables: Recent Students & Fee Status Register */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Students */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <h2 className="font-bold text-base text-slate-900 flex items-center gap-2">
              <Users className="w-4 h-4 text-[#1B2A4A]" />
              <span>Recently Registered Students</span>
            </h2>
            <Link href="/admin/students" className="text-xs font-semibold text-[#1B2A4A] hover:underline">
              View all →
            </Link>
          </div>

          <div className="divide-y divide-slate-100 mt-2">
            {data.recentStudents.map((s) => (
              <div key={s.id} className="py-3 flex items-center justify-between gap-3 text-xs">
                <div>
                  <p className="font-bold text-slate-900 text-sm">{s.name}</p>
                  <p className="text-slate-500">
                    S/O {s.fatherName} • Roll #{s.rollNumber}
                  </p>
                </div>
                <div className="text-right">
                  <span className="inline-block bg-[#1B2A4A]/10 text-[#1B2A4A] font-bold px-2 py-0.5 rounded text-[11px]">
                    {s.className} ({s.section})
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Fee Records */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <h2 className="font-bold text-base text-slate-900 flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-[#1B2A4A]" />
              <span>Recent Fee Activity</span>
            </h2>
            <Link href="/admin/fees" className="text-xs font-semibold text-[#1B2A4A] hover:underline">
              Manage fees →
            </Link>
          </div>

          <div className="divide-y divide-slate-100 mt-2">
            {data.recentFees.map((f) => (
              <div key={f.id} className="py-3 flex items-center justify-between gap-3 text-xs">
                <div>
                  <p className="font-bold text-slate-900">
                    {f.student?.name || "Student"} ({f.student?.className})
                  </p>
                  <p className="text-slate-500">
                    {f.month} • Rs. {f.amount.toLocaleString()}
                  </p>
                </div>
                <div>
                  {f.status === "PAID" ? (
                    <span className="inline-flex items-center gap-1 bg-emerald-100 text-emerald-800 text-[11px] font-bold px-2 py-0.5 rounded-full">
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Paid
                    </span>
                  ) : f.status === "PENDING" ? (
                    <span className="inline-flex items-center gap-1 bg-amber-100 text-amber-800 text-[11px] font-bold px-2 py-0.5 rounded-full">
                      <Clock className="w-3 h-3 text-amber-600" /> Pending
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 bg-rose-100 text-rose-800 text-[11px] font-bold px-2 py-0.5 rounded-full">
                      <XCircle className="w-3 h-3 text-rose-600" /> Unpaid
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
