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
    { name: "Gallery", href: "/gallery" },
    { name: "Announcements", href: "/announcements" },
    { name: "Contact Us", href: "/contact" },
  ];

  return (
    <header className="sticky top-0 z-40 bg-[#0D1B3D] text-white shadow-md border-b border-[#D4AF37]/30 font-sans">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 xl:px-8">
        <div className="flex items-center justify-between min-h-[4rem] sm:min-h-[4.5rem] py-2 gap-2">
          {/* Brand Logo & Name */}
          <Link href="/" className="flex items-center gap-2 sm:gap-3 group shrink-0">
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-white p-0.5 shadow flex items-center justify-center overflow-hidden border-2 border-[#D4AF37] group-hover:scale-105 transition-transform duration-200 shrink-0">
              <Image
                src="/images/school-logo.png"
                alt="Nayab English Grammer High School Mirwah Logo"
                width={44}
                height={44}
                className="w-full h-full object-contain"
                priority
              />
            </div>
            <div className="flex flex-col justify-center min-w-0">
              <span className="font-extrabold tracking-tight leading-snug text-white group-hover:text-[#D4AF37] transition-colors">
                {/* On 2XL & XL screens (>=1280px) */}
                <span className="hidden xl:inline text-sm sm:text-base xl:text-lg whitespace-nowrap">
                  NAYAB ENGLISH GRAMMER HIGH SCHOOL
                </span>
                {/* On Medium & Large screens (640px - 1279px) */}
                <span className="hidden sm:inline xl:hidden text-xs sm:text-sm whitespace-nowrap font-black">
                  NAYAB ENGLISH GRAMMAR
                </span>
                {/* On Mobile screens (<640px) */}
                <span className="sm:hidden block text-xs font-black leading-tight">
                  NAYAB ENGLISH GRAMMAR
                </span>
              </span>
              <span className="text-[10px] sm:text-[11px] text-slate-300 tracking-wider uppercase font-medium flex items-center gap-1.5 whitespace-nowrap mt-0.5">
                <span className="text-[#D4AF37] font-bold">Mirwah</span>
                <span className="inline-block w-1 h-1 rounded-full bg-[#D4AF37]"></span>
                <span className="truncate">Learn · Grow · Succeed</span>
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-0.5 xl:gap-1.5">
            {navLinks.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`px-2 xl:px-3 py-1.5 rounded-lg text-xs xl:text-sm font-medium transition-all duration-150 whitespace-nowrap ${
                    isActive
                      ? "bg-white/15 text-[#D4AF37] shadow-inner font-bold"
                      : "text-slate-200 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  {item.name}
                </Link>
              );
            })}
          </nav>

          {/* Desktop Auth CTA */}
          <div className="hidden lg:flex items-center gap-2 shrink-0">
            {user ? (
              <div className="flex items-center gap-2">
                <Link
                  href={user.role === "ADMIN" ? "/admin" : "/teacher"}
                  className="flex items-center gap-1.5 bg-[#D4AF37] text-[#0D1B3D] px-3 py-1.5 xl:px-4 xl:py-2 rounded-lg text-xs xl:text-sm font-bold hover:bg-amber-400 transition shadow"
                >
                  <LayoutDashboard className="w-4 h-4" />
                  <span>Dashboard</span>
                </Link>
                <div className="hidden 2xl:flex items-center gap-2 pl-2 border-l border-white/20 text-xs text-slate-300">
                  <User className="w-3.5 h-3.5 text-[#D4AF37]" />
                  <span className="font-medium truncate max-w-[100px]">{user.name}</span>
                </div>
                <button
                  onClick={handleLogout}
                  title="Log out"
                  className="p-1.5 xl:p-2 text-slate-300 hover:text-white hover:bg-white/10 rounded-lg transition cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <Link
                href="/login"
                className="flex items-center gap-1.5 bg-white text-[#0D1B3D] hover:bg-slate-100 px-3.5 py-1.5 xl:px-4 xl:py-2 rounded-lg text-xs xl:text-sm font-bold transition shadow-sm"
              >
                <LogIn className="w-4 h-4 text-[#0D1B3D]" />
                <span>Login</span>
              </Link>
            )}
          </div>

          {/* Mobile Menu Controls */}
          <div className="flex lg:hidden items-center gap-2 shrink-0">
            {user ? (
              <Link
                href={user.role === "ADMIN" ? "/admin" : "/teacher"}
                className="text-xs bg-[#D4AF37] text-[#0D1B3D] px-2.5 py-1.5 rounded-lg font-bold shadow-xs whitespace-nowrap"
              >
                Dashboard
              </Link>
            ) : (
              <Link
                href="/login"
                className="text-xs bg-white text-[#0D1B3D] px-3 py-1.5 rounded-lg font-bold shadow-xs whitespace-nowrap"
              >
                Login
              </Link>
            )}

            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-lg bg-white/10 text-white hover:bg-white/20 transition focus:outline-none cursor-pointer"
              aria-label="Toggle navigation menu"
            >
              {isOpen ? <X className="w-5 h-5 text-[#D4AF37]" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {isOpen && (
        <div className="lg:hidden bg-[#071026] border-t border-slate-800 px-4 pt-3 pb-6 space-y-1.5 shadow-2xl animate-in slide-in-from-top-2 duration-200">
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
                  <span>Open Dashboard</span>
                </Link>
                <button
                  onClick={() => {
                    setIsOpen(false);
                    handleLogout();
                  }}
                  className="flex items-center justify-center gap-2 w-full py-2.5 rounded-lg text-sm text-rose-400 hover:bg-rose-950/30 cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sign Out</span>
                </button>
              </div>
            ) : (
              <Link
                href="/login"
                onClick={() => setIsOpen(false)}
                className="flex items-center justify-center gap-2 w-full bg-white text-[#0D1B3D] py-3 rounded-lg font-semibold text-sm shadow"
              >
                <LogIn className="w-4 h-4 text-[#0D1B3D]" />
                <span>Login</span>
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
