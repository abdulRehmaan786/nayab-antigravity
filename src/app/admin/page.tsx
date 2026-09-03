import Link from "next/link";
import { db } from "@/lib/db";
import { Users, CreditCard, Award, Bell, Plus, ArrowRight, CheckCircle2, Clock, XCircle } from "lucide-react";

export const dynamic = "force-dynamic";

async function getAdminMetrics() {
  const [studentsCount, resultsCount, paidFees, pendingFees, unpaidFees, recentStudents, recentFees] = await Promise.all([
    db.student.count(),
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

  return {
    studentsCount,
    resultsCount,
    totalCollected: paidFees._sum.amount || 0,
    paidCount: paidFees._count || 0,
    totalPending: (pendingFees._sum.amount || 0) + (unpaidFees._sum.amount || 0),
    pendingCount: (pendingFees._count || 0) + (unpaidFees._count || 0),
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

        <div className="flex items-center gap-2">
          <Link
            href="/admin/students"
            className="inline-flex items-center gap-1.5 bg-[#1B2A4A] text-white px-3.5 py-2 rounded-xl text-xs font-bold hover:bg-[#111C32] transition shadow"
          >
            <Plus className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span>Add Student</span>
          </Link>
          <Link
            href="/admin/announcements"
            className="inline-flex items-center gap-1.5 bg-[#FCF9EE] border border-[#D4AF37] text-[#1B2A4A] px-3.5 py-2 rounded-xl text-xs font-bold hover:bg-[#D4AF37] hover:text-[#111C32] transition"
          >
            <Bell className="w-3.5 h-3.5 text-[#1B2A4A]" />
            <span>Post Notice</span>
          </Link>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center shrink-0">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-semibold uppercase">Total Students</p>
            <h3 className="text-2xl font-black text-slate-900 mt-0.5">{data.studentsCount}</h3>
            <p className="text-[11px] text-slate-400">Enrolled across all classes</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
            <CreditCard className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-semibold uppercase">Fee Collected</p>
            <h3 className="text-2xl font-black text-emerald-700 mt-0.5">
              Rs. {data.totalCollected.toLocaleString()}
            </h3>
            <p className="text-[11px] text-emerald-600 font-medium">{data.paidCount} Vouchers Cleared</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center shrink-0">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-semibold uppercase">Pending Dues</p>
            <h3 className="text-2xl font-black text-amber-700 mt-0.5">
              Rs. {data.totalPending.toLocaleString()}
            </h3>
            <p className="text-[11px] text-amber-600 font-medium">{data.pendingCount} Outstanding Vouchers</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center shrink-0">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-semibold uppercase">Exam Marksheets</p>
            <h3 className="text-2xl font-black text-purple-800 mt-0.5">{data.resultsCount}</h3>
            <p className="text-[11px] text-purple-600 font-medium">Published online</p>
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
