"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { Menu, X, LogIn, LogOut, LayoutDashboard, User } from "lucide-react";

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
    { name: "Home", href: "/" },
    { name: "About Us", href: "/about" },
    { name: "Academics", href: "/academics" },
    { name: "Admissions", href: "/admissions" },
    { name: "Announcements", href: "/announcements" },
    { name: "Contact Us", href: "/contact" },
  ];

  return (
    <header className="sticky top-0 z-40 bg-[#0D1B3D] text-white shadow-md border-b border-[#D4AF37]/30 font-sans">
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
              <span className="text-[11px] text-slate-300 tracking-wider uppercase mt-1 font-medium flex items-center gap-1.5">
                <span>Mirwah</span>
                <span className="inline-block w-1 h-1 rounded-full bg-[#D4AF37]"></span>
                <span className="text-[#D4AF37] font-semibold">Learn · Grow · Succeed</span>
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links (matching design sheet) */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-all duration-150 ${
                    isActive
                      ? "bg-white/15 text-[#D4AF37] shadow-inner font-semibold"
                      : "text-slate-200 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  {item.name}
                </Link>
              );
            })}
          </nav>

          {/* Desktop Auth CTA - Single Clean "Login" Button (Teacher Portal button removed) */}
          <div className="hidden lg:flex items-center gap-3">
            {user ? (
              <div className="flex items-center gap-2.5">
                <Link
                  href={user.role === "ADMIN" ? "/admin" : "/teacher"}
                  className="flex items-center gap-2 bg-[#D4AF37] text-[#0D1B3D] px-4 py-2 rounded-lg text-sm font-semibold hover:bg-amber-400 transition shadow"
                >
                  <LayoutDashboard className="w-4 h-4" />
                  <span>Dashboard</span>
                </Link>
                <div className="flex items-center gap-2 pl-2 border-l border-white/20 text-xs text-slate-300">
                  <User className="w-3.5 h-3.5 text-[#D4AF37]" />
                  <span className="font-medium truncate max-w-[120px]">{user.name}</span>
                </div>
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
                className="flex items-center gap-2 bg-white text-[#0D1B3D] hover:bg-slate-100 px-5 py-2 rounded-lg text-sm font-semibold transition shadow-sm"
              >
                <LogIn className="w-4 h-4 text-[#0D1B3D]" />
                <span>Login</span>
              </Link>
            )}
          </div>

          {/* Mobile Menu Controls */}
          <div className="flex lg:hidden items-center gap-2">
            {user ? (
              <Link
                href={user.role === "ADMIN" ? "/admin" : "/teacher"}
                className="text-xs bg-[#D4AF37] text-[#0D1B3D] px-3 py-1.5 rounded-lg font-bold"
              >
                Dashboard
              </Link>
            ) : (
              <Link
                href="/login"
                className="text-xs bg-white text-[#0D1B3D] px-3.5 py-1.5 rounded-lg font-semibold shadow-sm"
              >
                Login
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

      {/* Mobile Navigation Drawer */}
      {isOpen && (
        <div className="lg:hidden bg-[#071026] border-t border-slate-800 px-4 pt-3 pb-6 space-y-1.5 shadow-2xl">
          {navLinks.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className={`block px-4 py-3 rounded-lg text-sm font-medium transition ${
                  isActive
                    ? "bg-white/15 text-[#D4AF37] font-semibold"
                    : "text-slate-200 hover:bg-white/5"
                }`}
              >
                {item.name}
              </Link>
            );
          })}

          <div className="pt-3 border-t border-slate-800 mt-2">
            {user ? (
              <div className="space-y-2">
                <div className="px-4 py-1 text-xs text-slate-400">
                  Signed in as <span className="text-white font-semibold">{user.name}</span> ({user.role})
                </div>
                <Link
                  href={user.role === "ADMIN" ? "/admin" : "/teacher"}
                  onClick={() => setIsOpen(false)}
                  className="flex items-center justify-center gap-2 w-full bg-[#D4AF37] text-[#0D1B3D] py-3 rounded-lg font-bold text-center text-sm shadow"
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
                className="flex items-center justify-center gap-2 w-full bg-white text-[#0D1B3D] py-3 rounded-lg font-semibold text-sm shadow"
              >
                <LogIn className="w-4 h-4 text-[#0D1B3D]" />
                Login
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
