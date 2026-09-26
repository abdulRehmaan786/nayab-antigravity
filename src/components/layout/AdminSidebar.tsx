"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
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
  Briefcase,
  Menu,
  X,
  Camera,
} from "lucide-react";

interface AdminSidebarProps {
  session: {
    userId: string;
    name: string;
    email: string;
    role: string;
  };
}

const navItems = [
  { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { name: "Academics", href: "/admin/teachers", icon: GraduationCap },
  { name: "Students", href: "/admin/students", icon: Users },
  { name: "Examinations", href: "/admin/results", icon: FileText },
  { name: "Finance", href: "/admin/fees", icon: CreditCard },
  { name: "Staff & Payroll", href: "/admin/staff", icon: Briefcase },
  { name: "Communication", href: "/admin/announcements", icon: Bell },
  { name: "School Gallery", href: "/admin/gallery", icon: Camera },
  { name: "Reports", href: "/admin/attendance", icon: BarChart3 },
];

export default function AdminSidebar({ session }: AdminSidebarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  return (
    <>
      {/* Mobile Top App Bar (< md) */}
      <div className="md:hidden sticky top-0 z-40 bg-[#0D1B3D] text-white border-b border-[#1E3A8A]/40 px-4 py-3 shadow-md flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-white p-0.5 border border-[#D4AF37] flex items-center justify-center overflow-hidden shrink-0 shadow">
            <Image
              src="/images/school-logo.png"
              alt="Nayab English Grammer High School Logo"
              width={30}
              height={30}
              className="w-full h-full object-contain"
            />
          </div>
          <div className="flex flex-col">
            <span className="font-extrabold text-[11px] tracking-tight text-white font-heading leading-tight">
              NAYAB ENGLISH GRAMMER
            </span>
            <span className="text-[9px] text-[#D4AF37] font-bold uppercase tracking-wider">
              High School Mirwah · Admin
            </span>
          </div>
        </div>

        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition focus:outline-none cursor-pointer"
          aria-label="Toggle Admin Navigation"
        >
          {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Slide-Down Drawer (< md) */}
      {isOpen && (
        <div className="md:hidden fixed inset-x-0 top-[57px] bottom-0 z-30 bg-[#071026]/95 backdrop-blur-md overflow-y-auto p-4 space-y-3 animate-in slide-in-from-top duration-200">
          <div className="bg-white/5 p-3 rounded-xl border border-white/10 text-xs">
            <p className="text-slate-400 text-[10px]">Logged in as:</p>
            <p className="font-bold text-white truncate text-sm">{session.name}</p>
            <p className="text-[10px] text-[#D4AF37]">System Administrator</p>
          </div>

          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center gap-3 px-3.5 py-3 rounded-xl text-xs font-bold transition ${
                    isActive
                      ? "bg-[#1E3A8A] text-[#D4AF37] shadow-sm"
                      : "text-slate-200 hover:bg-white/10"
                  }`}
                >
                  <Icon className="w-4 h-4 text-[#D4AF37]" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>

          <div className="pt-3 border-t border-white/10 space-y-2">
            <Link
              href="/"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-2 text-xs text-slate-300 hover:text-white px-2 py-2"
            >
              <ArrowLeft className="w-4 h-4 text-[#D4AF37]" />
              <span>Back to Public Website</span>
            </Link>
            <form action="/api/auth/logout" method="POST">
              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 text-xs font-bold text-rose-300 hover:text-rose-100 bg-rose-950/40 hover:bg-rose-900/60 border border-rose-900/60 py-2.5 rounded-xl transition"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign Out</span>
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Desktop Sticky Sidebar (>= md) */}
      <aside className="hidden md:flex w-64 bg-[#0D1B3D] text-white flex-col shrink-0 border-r border-[#1E3A8A]/40 shadow-xl min-h-screen sticky top-0 self-start">
        {/* Brand Header */}
        <div className="p-5 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-full bg-white p-0.5 border-2 border-[#D4AF37] flex items-center justify-center overflow-hidden shrink-0 shadow">
              <Image
                src="/images/school-logo.png"
                alt="Nayab English Grammer High School Logo"
                width={40}
                height={40}
                className="w-full h-full object-contain"
              />
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold text-xs tracking-tight leading-tight text-white font-heading">
                NAYAB ENGLISH GRAMMER
              </span>
              <span className="text-[10px] text-[#D4AF37] font-semibold tracking-wider uppercase mt-0.5">
                High School Mirwah
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
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition group ${
                  isActive
                    ? "bg-[#1E3A8A] text-white shadow-sm font-bold"
                    : "text-slate-200 hover:text-white hover:bg-white/10"
                }`}
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
    </>
  );
}
