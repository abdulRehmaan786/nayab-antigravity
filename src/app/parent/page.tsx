import Image from "next/image";
import Link from "next/link";
import { Calendar, CreditCard, Bell, ArrowRight, User, Award, Clock } from "lucide-react";

export const metadata = {
  title: "Parent Dashboard — Nayab Grammar School Mirwah",
  description: "Parent portal with children's academic performance, biometric attendance, and fee status.",
};

export default function ParentDashboardPage() {
  const children = [
    {
      name: "Ahmed Khan",
      className: "Class: 9th A",
      roll: "Roll: 12",
      image: "/images/student-ahmed.jpg",
      attendance: "94% Present",
      grade: "Grade A+",
      rollLink: "/results?className=Class%209&rollNumber=101",
    },
    {
      name: "Sara Rashid",
      className: "Class: 7th B",
      roll: "Roll: 05",
      image: "/images/student-sara.jpg",
      attendance: "98% Present",
      grade: "Grade A",
      rollLink: "/results?className=Class%207&rollNumber=102",
    },
  ];

  return (
    <div className="min-h-screen bg-[#F2F4F7] p-4 sm:p-8 font-sans">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Top Header matching Parent High-Fidelity Screen */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight font-heading flex items-center gap-2">
              <span>Welcome, Mr. Rashid</span>
              <span className="text-2xl">👋</span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              Here's your children's overview.
            </p>
          </div>

          <div className="flex items-center gap-2 bg-[#F2F4F7] text-[#0D1B3D] border border-slate-200 px-3.5 py-2 rounded-xl text-xs font-semibold">
            <Calendar className="w-3.5 h-3.5 text-[#1E3A8A]" />
            <span>09 May, 2025</span>
          </div>
        </div>

        {/* Row 1: My Children & Fee Overview Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column (7 cols): My Children */}
          <div className="lg:col-span-7 bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h2 className="text-base font-bold text-slate-900 font-heading flex items-center gap-2">
                <User className="w-4 h-4 text-[#1E3A8A]" />
                <span>My Children</span>
              </h2>
              <span className="text-xs text-slate-400 font-semibold">2 Enrolled</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {children.map((child, idx) => (
                <div
                  key={idx}
                  className="bg-[#F2F4F7] border border-slate-200 rounded-2xl p-4 flex items-center gap-4 hover:border-[#D4AF37] transition shadow-xs"
                >
                  <div className="w-16 h-20 relative rounded-xl overflow-hidden border-2 border-[#D4AF37] shrink-0 bg-white">
                    <Image
                      src={child.image}
                      alt={child.name}
                      fill
                      className="object-cover object-top"
                    />
                  </div>

                  <div className="space-y-1">
                    <h3 className="font-bold text-sm text-slate-900 font-heading">{child.name}</h3>
                    <p className="text-xs text-slate-600 font-medium">{child.className}</p>
                    <p className="text-xs text-[#1E3A8A] font-bold">{child.roll}</p>

                    <div className="pt-1 flex items-center gap-2 text-[10px]">
                      <span className="bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.5 rounded">
                        {child.attendance}
                      </span>
                    </div>

                    <div className="pt-1">
                      <Link
                        href={child.rollLink}
                        className="text-[11px] font-bold text-[#0D1B3D] hover:text-[#1E3A8A] underline flex items-center gap-0.5"
                      >
                        <span>View Marksheet</span>
                        <ArrowRight className="w-3 h-3" />
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column (5 cols): Fee Overview */}
          <div className="lg:col-span-5 bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h2 className="text-base font-bold text-slate-900 font-heading flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-[#D4AF37]" />
                <span>Fee Overview</span>
              </h2>
              <Link href="/fees" className="text-xs font-semibold text-[#1E3A8A] hover:underline">
                View Fee Details →
              </Link>
            </div>

            <div className="space-y-3 pt-1">
              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs">
                <span className="text-slate-600 font-medium">Total Due:</span>
                <span className="font-black text-slate-900 text-base font-heading">Rs. 35,000</span>
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-emerald-50 border border-emerald-100 text-xs">
                <span className="text-emerald-800 font-medium">Paid Amount:</span>
                <span className="font-black text-[#22C55E] text-base font-heading">Rs. 15,000</span>
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-amber-50 border border-amber-100 text-xs">
                <span className="text-amber-800 font-medium">Remaining Balance:</span>
                <span className="font-black text-[#F59E0B] text-base font-heading">Rs. 20,000</span>
              </div>
            </div>

            <div className="pt-2">
              <Link
                href="/fees"
                className="w-full inline-flex items-center justify-center gap-2 bg-[#0D1B3D] hover:bg-[#1E3A8A] text-white font-semibold py-2.5 rounded-xl text-xs shadow transition"
              >
                <span>Download Payment Vouchers</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>

        {/* Row 2: Latest Announcements from Mockup */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <h2 className="text-base font-bold text-slate-900 font-heading flex items-center gap-2">
              <Bell className="w-4 h-4 text-[#0D1B3D]" />
              <span>Latest Announcements</span>
            </h2>
            <Link href="/announcements" className="text-xs font-semibold text-[#1E3A8A] hover:underline">
              View All →
            </Link>
          </div>

          <div className="p-4 rounded-xl bg-[#F2F4F7] border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <p className="font-bold text-xs text-slate-900">Parents Meeting</p>
              <p className="text-xs text-slate-600 mt-0.5">
                Meeting will be held on 12th May at 10:00 AM in the school main auditorium.
              </p>
            </div>
            <span className="text-xs text-slate-400 font-semibold self-start sm:self-auto">07 May, 2025</span>
          </div>
        </div>
      </div>
    </div>
  );
}
