"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FileSpreadsheet,
  Calendar,
  Bell,
  LogOut,
  ArrowLeft,
  GraduationCap,
  BookOpen,
  Menu,
  X,
} from "lucide-react";
import { TeacherSubjectAssignment } from "@/lib/types";

interface TeacherSidebarProps {
  session: {
    userId: string;
    name: string;
    email: string;
    role: string;
    assignedSubjects?: TeacherSubjectAssignment[];
  };
}

const navItems = [
  { name: "Teacher Overview", href: "/teacher", icon: LayoutDashboard },
  { name: "Subject Marks Entry", href: "/teacher/marks-entry", icon: FileSpreadsheet },
  { name: "My Attendance Calendar", href: "/teacher/attendance", icon: Calendar },
  { name: "Class Notices", href: "/teacher/notices", icon: Bell },
];

export default function TeacherSidebar({ session }: TeacherSidebarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  return (
    <>
      {/* Mobile Top App Bar (< md) */}
      <div className="md:hidden sticky top-0 z-40 bg-[#111C32] text-white border-b border-slate-800 px-4 py-3 shadow-md flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-white p-0.5 border border-[#D4AF37] flex items-center justify-center overflow-hidden shrink-0 shadow">
            <Image
              src="/images/school-logo.png"
              alt="Logo"
              width={30}
              height={30}
              className="w-full h-full object-contain"
            />
          </div>
          <div className="flex flex-col">
            <span className="font-extrabold text-xs tracking-tight text-white font-heading leading-tight">
              TEACHER CONSOLE
            </span>
            <span className="text-[9px] text-[#D4AF37] font-bold uppercase tracking-wider truncate max-w-[170px]">
              {session.name}
            </span>
          </div>
        </div>

        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition focus:outline-none cursor-pointer"
          aria-label="Toggle Teacher Navigation"
        >
          {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Slide-Down Drawer (< md) */}
      {isOpen && (
        <div className="md:hidden fixed inset-x-0 top-[57px] bottom-0 z-30 bg-[#071026]/95 backdrop-blur-md overflow-y-auto p-4 space-y-3 animate-in slide-in-from-top duration-200">
          <div className="bg-white/5 p-3 rounded-xl border border-white/10 text-xs space-y-1.5">
            <p className="text-slate-400 text-[10px] uppercase font-bold tracking-wider">Faculty Member</p>
            <p className="font-bold text-white text-sm">{session.name}</p>
            <p className="text-[10px] text-slate-400">{session.email}</p>

            {session.assignedSubjects && session.assignedSubjects.length > 0 && (
              <div className="pt-2 border-t border-white/10">
                <p className="text-[10px] text-[#D4AF37] font-bold uppercase tracking-wider mb-1 flex items-center gap-1">
                  <BookOpen className="w-3 h-3" /> Assigned Subjects
                </p>
                <div className="flex flex-wrap gap-1">
                  {session.assignedSubjects.map((as, idx) => (
                    <span
                      key={idx}
                      className="text-[9px] bg-[#D4AF37]/20 border border-[#D4AF37]/40 text-[#D4AF37] px-1.5 py-0.5 rounded font-bold"
                    >
                      {as.className}: {as.subject}
                    </span>
                  ))}
                </div>
              </div>
            )}
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
              <span>Public Website</span>
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
      <aside className="hidden md:flex w-64 bg-[#111C32] text-white flex-col shrink-0 border-r border-slate-800 min-h-screen sticky top-0 self-start">
        <div className="p-5 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-white p-0.5 border border-[#D4AF37] flex items-center justify-center overflow-hidden shrink-0">
              <Image
                src="/images/school-logo.png"
                alt="Logo"
                width={38}
                height={38}
                className="w-full h-full object-contain"
              />
            </div>
            <div>
              <h2 className="font-bold text-sm tracking-tight leading-tight">Teacher Console</h2>
              <span className="text-[10px] text-[#D4AF37] uppercase font-bold flex items-center gap-1">
                <GraduationCap className="w-3 h-3" /> Nayab English Grammer High School Mirwah
              </span>
            </div>
          </div>

          <div className="mt-4 bg-white/5 p-3 rounded-xl border border-white/10 text-xs space-y-2">
            <div>
              <p className="text-slate-400 text-[10px] uppercase font-bold tracking-wider">Faculty Member</p>
              <p className="font-bold text-white truncate text-sm">{session.name}</p>
              <p className="text-[10px] text-slate-400 truncate">{session.email}</p>
            </div>

            {session.assignedSubjects && session.assignedSubjects.length > 0 && (
              <div className="pt-2 border-t border-white/10">
                <p className="text-[10px] text-[#D4AF37] font-bold uppercase tracking-wider flex items-center gap-1 mb-1">
                  <BookOpen className="w-3 h-3" /> Assigned Subjects
                </p>
                <div className="flex flex-wrap gap-1">
                  {session.assignedSubjects.map((as, idx) => (
                    <span
                      key={idx}
                      className="text-[9px] bg-[#D4AF37]/20 border border-[#D4AF37]/40 text-[#D4AF37] px-1.5 py-0.5 rounded font-bold"
                    >
                      {as.className}: {as.subject}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="p-3 space-y-1 flex-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition ${
                  isActive
                    ? "bg-[#1E3A8A] text-white shadow-sm font-bold"
                    : "text-slate-300 hover:text-white hover:bg-white/10"
                }`}
              >
                <Icon className="w-4 h-4 text-[#D4AF37]" />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-slate-800 space-y-2">
          <Link
            href="/"
            className="flex items-center gap-2 text-xs text-slate-400 hover:text-white transition px-2 py-1.5"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Public Front Door</span>
          </Link>
          <form action="/api/auth/logout" method="POST">
            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 text-xs font-semibold text-rose-300 hover:text-rose-200 bg-rose-950/40 hover:bg-rose-950/70 border border-rose-900/50 py-2 rounded-xl transition"
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
