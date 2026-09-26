"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { Menu, X, LogIn, LogOut, LayoutDashboard, User, MapPin } from "lucide-react";

function FacebookIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
    </svg>
  );
}

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
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between min-h-[4.25rem] sm:min-h-[4.75rem] py-2 sm:py-2.5 gap-2">
          {/* Brand Logo & Name */}
          <Link href="/" className="flex items-center gap-2.5 sm:gap-3.5 group shrink-0">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white p-0.5 shadow flex items-center justify-center overflow-hidden border-2 border-[#D4AF37] group-hover:scale-105 transition-transform duration-200 shrink-0">
              <Image
                src="/images/school-logo.png"
                alt="Nayab English Grammer High School Mirwah Logo"
                width={48}
                height={48}
                className="w-full h-full object-contain"
                priority
              />
            </div>
            <div className="flex flex-col justify-center min-w-0">
              <span className="font-extrabold text-xs sm:text-sm md:text-base lg:text-sm xl:text-lg tracking-tight leading-snug text-white group-hover:text-[#D4AF37] transition-colors">
                <span className="hidden sm:inline whitespace-nowrap">NAYAB ENGLISH GRAMMER HIGH SCHOOL</span>
                <span className="sm:hidden block font-black leading-tight">
                  NAYAB ENGLISH GRAMMER<br/>
                  <span className="text-[10px] text-slate-200 font-bold tracking-wide">HIGH SCHOOL MIRWAH</span>
                </span>
              </span>
              <span className="hidden sm:flex text-[10px] sm:text-[11px] text-slate-300 tracking-wider uppercase font-medium items-center gap-1.5 whitespace-nowrap mt-0.5">
                <span className="text-[#D4AF37] font-bold">Mirwah</span>
                <span className="inline-block w-1 h-1 rounded-full bg-[#D4AF37]"></span>
                <span className="truncate">Learn · Grow · Succeed</span>
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-0.5 xl:gap-1">
            {navLinks.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`px-2 xl:px-3 py-1.5 rounded-lg text-xs xl:text-sm font-medium transition-all duration-150 whitespace-nowrap ${
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

          {/* Desktop Auth & Social CTA */}
          <div className="hidden lg:flex items-center gap-1.5 xl:gap-2 shrink-0">
            <a
              href="https://www.facebook.com/nayabhs.mirwah"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 text-slate-300 hover:text-[#1877F2] hover:bg-white/10 rounded-lg transition"
              title="Official Facebook Page"
              aria-label="Facebook Page"
            >
              <FacebookIcon className="w-4 h-4 fill-current" />
            </a>

            <a
              href="https://maps.app.goo.gl/G9Zwdki6xpG3QZ4x5"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 text-slate-300 hover:text-[#D4AF37] hover:bg-white/10 rounded-lg transition mr-1"
              title="Campus Location on Google Maps"
              aria-label="Google Maps Location"
            >
              <MapPin className="w-4 h-4" />
            </a>

            {user ? (
              <div className="flex items-center gap-2">
                <Link
                  href={user.role === "ADMIN" ? "/admin" : "/teacher"}
                  className="flex items-center gap-1.5 bg-[#D4AF37] text-[#0D1B3D] px-3 py-1.5 xl:px-4 xl:py-2 rounded-lg text-xs xl:text-sm font-bold hover:bg-amber-400 transition shadow"
                >
                  <LayoutDashboard className="w-4 h-4" />
                  <span>Dashboard</span>
                </Link>
                <div className="hidden xl:flex items-center gap-2 pl-2 border-l border-white/20 text-xs text-slate-300">
                  <User className="w-3.5 h-3.5 text-[#D4AF37]" />
                  <span className="font-medium truncate max-w-[120px]">{user.name}</span>
                </div>
                <button
                  onClick={handleLogout}
                  title="Log out"
                  className="p-1.5 xl:p-2 text-slate-300 hover:text-white hover:bg-white/10 rounded-lg transition"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <Link
                href="/login"
                className="flex items-center gap-1.5 bg-white text-[#0D1B3D] hover:bg-slate-100 px-4 py-1.5 xl:px-5 xl:py-2 rounded-lg text-xs xl:text-sm font-bold transition shadow-sm"
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
                className="text-xs bg-white text-[#0D1B3D] px-3 py-1.5 rounded-lg font-semibold shadow-xs whitespace-nowrap"
              >
                Login
              </Link>
            )}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-1.5 sm:p-2 rounded-lg text-slate-200 hover:text-white hover:bg-white/10 focus:outline-none"
              aria-label="Toggle Navigation Menu"
            >
              {isOpen ? <X className="w-6 h-6 text-[#D4AF37]" /> : <Menu className="w-6 h-6" />}
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

          {/* Mobile Social Links */}
          <div className="pt-2 flex items-center justify-around py-2.5 px-4 bg-white/5 rounded-xl border border-white/10 text-xs">
            <a
              href="https://www.facebook.com/nayabhs.mirwah"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-slate-300 hover:text-[#1877F2] font-semibold transition"
            >
              <FacebookIcon className="w-4 h-4 fill-current text-[#1877F2]" />
              <span>Facebook Page</span>
            </a>
            <span className="text-slate-600">|</span>
            <a
              href="https://maps.app.goo.gl/G9Zwdki6xpG3QZ4x5"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-slate-300 hover:text-[#D4AF37] font-semibold transition"
            >
              <MapPin className="w-4 h-4 text-[#D4AF37]" />
              <span>Google Maps</span>
            </a>
          </div>

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
                  className="flex items-center justify-center gap-2 w-full py-2.5 rounded-lg text-sm text-rose-400 hover:bg-rose-950/30"
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
