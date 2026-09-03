"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { Menu, X, GraduationCap, FileText, CreditCard, Bell, LogIn, LogOut, LayoutDashboard } from "lucide-react";

interface UserSession {
  userId: string;
  name: string;
  email: string;
  role: "ADMIN" | "TEACHER";
}

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState<UserSession | null>(null);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    fetch("/api/auth/me")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data && data.authenticated) {
          setUser(data.user);
        } else {
          setUser(null);
        }
      })
      .catch(() => setUser(null));
  }, [pathname]);

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    setUser(null);
    router.push("/login");
  };

  const navLinks = [
    { name: "Home", href: "/", icon: GraduationCap },
    { name: "Result Lookup", href: "/results", icon: FileText },
    { name: "Fee Status", href: "/fees", icon: CreditCard },
    { name: "Announcements", href: "/announcements", icon: Bell },
  ];

  return (
    <header className="sticky top-0 z-40 bg-[#1B2A4A] text-white shadow-md border-b border-[#D4AF37]/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Brand Logo & Name */}
          <Link href="/" className="flex items-center gap-3.5 group">
            <div className="w-12 h-12 rounded-full bg-white p-0.5 shadow flex items-center justify-center overflow-hidden border-2 border-[#D4AF37] group-hover:scale-105 transition-transform duration-200">
              <Image
                src="/images/school-logo.png"
                alt="Nayab Grammar School Logo"
                width={48}
                height={48}
                className="w-full h-full object-contain"
                priority
              />
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-lg sm:text-xl tracking-tight leading-none text-white group-hover:text-[#D4AF37] transition-colors">
                NAYAB GRAMMAR SCHOOL
              </span>
              <span className="text-xs text-slate-300 tracking-wider uppercase mt-1 font-medium flex items-center gap-1.5">
                <span>Mirwah</span>
                <span className="inline-block w-1 h-1 rounded-full bg-[#D4AF37]"></span>
                <span className="text-[#D4AF37]">Est. 2012</span>
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1.5">
            {navLinks.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-all duration-150 ${
                    isActive
                      ? "bg-white/15 text-[#D4AF37] shadow-inner font-semibold"
                      : "text-slate-200 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {item.name}
                </Link>
              );
            })}
          </nav>

          {/* Desktop Auth / Dashboard CTA */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <div className="flex items-center gap-2.5">
                <Link
                  href={user.role === "ADMIN" ? "/admin" : "/teacher"}
                  className="flex items-center gap-2 bg-[#D4AF37] text-[#111C32] px-4 py-2 rounded-lg text-sm font-semibold hover:bg-[#c49f2c] transition shadow"
                >
                  <LayoutDashboard className="w-4 h-4" />
                  {user.role === "ADMIN" ? "Admin Panel" : "Teacher Panel"}
                </Link>
                <button
                  onClick={handleLogout}
                  title="Log out"
                  className="p-2 text-slate-300 hover:text-white hover:bg-white/10 rounded-lg transition"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <Link
                href="/login"
                className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white border border-white/20 px-4 py-2 rounded-lg text-sm font-medium transition"
              >
                <LogIn className="w-4 h-4 text-[#D4AF37]" />
                <span>Staff Login</span>
              </Link>
            )}
          </div>

          {/* Mobile Menu Toggle Button */}
          <div className="flex md:hidden items-center gap-2">
            {user ? (
              <Link
                href={user.role === "ADMIN" ? "/admin" : "/teacher"}
                className="text-xs bg-[#D4AF37] text-[#111C32] px-2.5 py-1.5 rounded font-bold"
              >
                Dashboard
              </Link>
            ) : (
              <Link
                href="/login"
                className="text-xs bg-white/10 text-slate-200 px-2.5 py-1.5 rounded font-medium border border-white/20"
              >
                Staff
              </Link>
            )}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-lg text-slate-200 hover:text-white hover:bg-white/10 focus:outline-none"
              aria-label="Toggle Navigation Menu"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Dropdown Drawer */}
      {isOpen && (
        <div className="md:hidden bg-[#111C32] border-t border-slate-800 px-4 pt-3 pb-5 space-y-1.5 shadow-2xl">
          {navLinks.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg text-base font-medium transition ${
                  isActive
                    ? "bg-white/15 text-[#D4AF37] font-semibold"
                    : "text-slate-200 hover:bg-white/5"
                }`}
              >
                <Icon className="w-5 h-5 text-[#D4AF37]" />
                {item.name}
              </Link>
            );
          })}

          <div className="pt-3 border-t border-slate-700/60 mt-2">
            {user ? (
              <div className="space-y-2">
                <div className="px-4 py-2 text-xs text-slate-400">
                  Signed in as <span className="text-white font-semibold">{user.name}</span> ({user.role})
                </div>
                <Link
                  href={user.role === "ADMIN" ? "/admin" : "/teacher"}
                  onClick={() => setIsOpen(false)}
                  className="flex items-center justify-center gap-2 w-full bg-[#D4AF37] text-[#111C32] py-3 rounded-lg font-bold text-center text-sm shadow"
                >
                  <LayoutDashboard className="w-4 h-4" />
                  Open Dashboard
                </Link>
                <button
                  onClick={() => {
                    setIsOpen(false);
                    handleLogout();
                  }}
                  className="flex items-center justify-center gap-2 w-full py-2.5 rounded-lg text-sm text-rose-400 hover:bg-rose-950/30"
                >
                  <LogOut className="w-4 h-4" />
                  Sign Out
                </button>
              </div>
            ) : (
              <Link
                href="/login"
                onClick={() => setIsOpen(false)}
                className="flex items-center justify-center gap-2 w-full bg-white/10 hover:bg-white/20 text-white border border-white/20 py-3 rounded-lg font-medium text-sm"
              >
                <LogIn className="w-4 h-4 text-[#D4AF37]" />
                Teacher / Admin Login
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
