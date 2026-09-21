import { redirect } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { getCurrentSession } from "@/lib/auth";
import {
  LayoutDashboard,
  GraduationCap,
  Users,
  FileText,
  CreditCard,
  Bell,
  BarChart3,
  Settings,
  LogOut,
  ArrowLeft,
  ShieldCheck,
  Fingerprint,
  Briefcase,
} from "lucide-react";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getCurrentSession();

  if (!session || session.role !== "ADMIN") {
    redirect("/login");
  }

  // Navigation structure directly from Design Sheet Section 3
  const navItems = [
    { name: "Dashboard", href: "/admin", icon: LayoutDashboard, desc: "Overview & quick actions" },
    { name: "Academics", href: "/admin/teachers", icon: GraduationCap, desc: "Classes, Subjects, Teachers" },
    { name: "Students", href: "/admin/students", icon: Users, desc: "Student List & Admissions" },
    { name: "Examinations", href: "/admin/results", icon: FileText, desc: "Marks Entry & Results" },
    { name: "Finance", href: "/admin/fees", icon: CreditCard, desc: "Fee Collection & Status" },
    { name: "Staff & Payroll", href: "/admin/staff", icon: Briefcase, desc: "Staff Salary & Attendance" },
    { name: "Communication", href: "/admin/announcements", icon: Bell, desc: "Announcements & Notices" },
    { name: "Reports", href: "/admin/attendance", icon: BarChart3, desc: "Biometric & Academic Reports" },
    { name: "Settings", href: "/admin/teachers", icon: Settings, desc: "User Roles & General" },
  ];

  return (
    <div className="min-h-screen bg-[#F2F4F7] flex flex-col md:flex-row font-sans">
      {/* Sidebar matching Navigation Structure */}
      <aside className="w-full md:w-64 bg-[#0D1B3D] text-white flex flex-col shrink-0 border-r border-[#1E3A8A]/40 shadow-xl">
        {/* Brand Header */}
        <div className="p-5 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-full bg-white p-0.5 border-2 border-[#D4AF37] flex items-center justify-center overflow-hidden shrink-0 shadow">
              <Image
                src="/images/school-logo.png"
                alt="Nayab Grammar Logo"
                width={40}
                height={40}
                className="w-full h-full object-contain"
              />
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-sm tracking-tight leading-none text-white font-heading">
                NAYAB GRAMMAR
              </span>
              <span className="text-[10px] text-[#D4AF37] font-semibold tracking-wider uppercase mt-1">
                Mirwah · Admin
              </span>
            </div>
          </div>

          <div className="mt-4 bg-white/5 p-2.5 rounded-xl border border-white/10 text-xs">
            <p className="text-slate-400 text-[10px]">Logged in as:</p>
            <p className="font-bold text-white truncate">{session.name}</p>
            <p className="text-[10px] text-[#D4AF37] truncate">System Administrator</p>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="p-3 space-y-1 flex-1 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                href={item.href}
                className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-slate-200 hover:text-white hover:bg-white/10 transition group"
              >
                <Icon className="w-4 h-4 text-[#D4AF37] group-hover:scale-110 transition-transform" />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-white/10 space-y-2 bg-[#071026]">
          <Link
            href="/"
            className="flex items-center gap-2 text-xs text-slate-300 hover:text-white transition px-2 py-1.5"
          >
            <ArrowLeft className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span>Public Website</span>
          </Link>
          <form action="/api/auth/logout" method="POST">
            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 text-xs font-semibold text-rose-300 hover:text-rose-100 bg-rose-950/40 hover:bg-rose-900/60 border border-rose-900/60 py-2 rounded-xl transition cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          </form>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-x-hidden p-4 sm:p-8">{children}</main>
    </div>
  );
}
