import { redirect } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { getCurrentSession } from "@/lib/auth";
import { LayoutDashboard, Users, FileText, CreditCard, Bell, LogOut, ArrowLeft, ShieldCheck } from "lucide-react";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getCurrentSession();

  if (!session || session.role !== "ADMIN") {
    redirect("/login");
  }

  const navItems = [
    { name: "Overview", href: "/admin", icon: LayoutDashboard },
    { name: "Students", href: "/admin/students", icon: Users },
    { name: "Fee Register", href: "/admin/fees", icon: CreditCard },
    { name: "Exam Results", href: "/admin/results", icon: FileText },
    { name: "Announcements", href: "/admin/announcements", icon: Bell },
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
              <h2 className="font-bold text-sm tracking-tight leading-tight">Admin Console</h2>
              <span className="text-[10px] text-[#D4AF37] uppercase font-bold flex items-center gap-1">
                <ShieldCheck className="w-3 h-3" /> Nayab Grammar School
              </span>
            </div>
          </div>

          <div className="mt-4 bg-white/5 p-2.5 rounded-xl border border-white/10 text-xs">
            <p className="text-slate-400 text-[11px]">Logged in as:</p>
            <p className="font-bold text-white truncate">{session.name}</p>
            <p className="text-[10px] text-slate-400 truncate">{session.email}</p>
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
