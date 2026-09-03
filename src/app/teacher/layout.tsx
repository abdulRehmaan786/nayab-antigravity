import { redirect } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { getCurrentSession } from "@/lib/auth";
import { LayoutDashboard, FileSpreadsheet, Bell, LogOut, ArrowLeft, GraduationCap } from "lucide-react";

export default async function TeacherLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getCurrentSession();

  if (!session || (session.role !== "TEACHER" && session.role !== "ADMIN")) {
    redirect("/login");
  }

  const navItems = [
    { name: "Teacher Overview", href: "/teacher", icon: LayoutDashboard },
    { name: "Marks Entry Sheet", href: "/teacher/marks-entry", icon: FileSpreadsheet },
    { name: "Class Notices", href: "/teacher/notices", icon: Bell },
  ];

  return (
    <div className="min-h-screen bg-[#F8F9FB] flex flex-col md:flex-row">
      {/* Sidebar on Desktop */}
      <aside className="w-full md:w-64 bg-[#111C32] text-white flex flex-col shrink-0 border-r border-slate-800">
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
                <GraduationCap className="w-3 h-3" /> Nayab Grammar School
              </span>
            </div>
          </div>

          <div className="mt-4 bg-white/5 p-2.5 rounded-xl border border-white/10 text-xs">
            <p className="text-slate-400 text-[11px]">Instructor:</p>
            <p className="font-bold text-white truncate">{session.name}</p>
            <p className="text-[10px] text-slate-400 truncate">{session.email}</p>
            {session.assignedClasses.length > 0 && (
              <div className="mt-1.5 flex flex-wrap gap-1">
                {session.assignedClasses.map((c) => (
                  <span key={c} className="text-[9px] bg-[#D4AF37]/20 text-[#D4AF37] px-1.5 py-0.2 rounded font-bold">
                    {c}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="p-3 space-y-1 flex-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                href={item.href}
                className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-slate-300 hover:text-white hover:bg-white/10 transition"
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

      {/* Main Content Area */}
      <main className="flex-1 overflow-x-hidden p-4 sm:p-8">{children}</main>
    </div>
  );
}
