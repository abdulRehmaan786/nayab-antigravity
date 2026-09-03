"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Lock, Mail, ShieldCheck, ArrowRight, AlertCircle, Sparkles, UserCheck } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Please provide both email and password.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok || !data.ok) {
        setError(data.error || "Login failed. Please check your credentials.");
      } else {
        if (data.user.role === "ADMIN") {
          router.push("/admin");
        } else {
          router.push("/teacher");
        }
      }
    } catch {
      setError("Network error during login. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const fillCredentials = (role: "admin" | "teacher") => {
    if (role === "admin") {
      setEmail("admin@nayab.edu.pk");
      setPassword("Admin@123");
    } else {
      setEmail("teacher.science@nayab.edu.pk");
      setPassword("Teacher@123");
    }
    setError(null);
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        {/* School Logo & Title */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 rounded-full bg-white p-1 border-2 border-[#D4AF37] mx-auto shadow-md flex items-center justify-center mb-3">
            <Image
              src="/images/school-logo.png"
              alt="Nayab Grammar School Emblem"
              width={76}
              height={76}
              className="w-full h-full object-contain"
            />
          </div>
          <h1 className="text-2xl font-extrabold text-[#1B2A4A] tracking-tight">
            Staff Portal Login
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Nayab Grammar School — Mirwah Administration & Faculty
          </p>
        </div>

        {/* Login Box */}
        <div className="bg-white rounded-3xl shadow-xl border border-slate-200/90 p-6 sm:p-8">
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Official Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@nayab.edu.pk"
                  required
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-300 rounded-xl text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#1B2A4A]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-300 rounded-xl text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#1B2A4A]"
                />
              </div>
            </div>

            {error && (
              <div className="bg-rose-50 border border-rose-200 text-rose-700 p-3 rounded-xl text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                <span>{error}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#1B2A4A] hover:bg-[#111C32] text-white font-bold py-3.5 rounded-xl shadow-md transition flex items-center justify-center gap-2 disabled:opacity-60"
            >
              <span>{loading ? "Authenticating..." : "Sign In to Dashboard"}</span>
              <ArrowRight className="w-4 h-4 text-[#D4AF37]" />
            </button>
          </form>

          {/* Quick Demo Credentials Box */}
          <div className="mt-6 pt-5 border-t border-slate-100">
            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" /> One-Click Evaluation Demo:
            </p>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => fillCredentials("admin")}
                className="bg-[#FCF9EE] hover:bg-amber-100 border border-[#D4AF37] text-[#1B2A4A] px-3 py-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span>Admin Login</span>
              </button>

              <button
                type="button"
                onClick={() => fillCredentials("teacher")}
                className="bg-slate-100 hover:bg-slate-200 border border-slate-300 text-slate-800 px-3 py-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5"
              >
                <UserCheck className="w-3.5 h-3.5 text-slate-600" />
                <span>Teacher Login</span>
              </button>
            </div>
            <p className="text-[10px] text-slate-400 text-center mt-2.5">
              Pre-seeded passwords: <code className="text-slate-600 font-mono">Admin@123</code> /{" "}
              <code className="text-slate-600 font-mono">Teacher@123</code>
            </p>
          </div>
        </div>

        {/* Public portal link */}
        <div className="text-center mt-6">
          <Link
            href="/"
            className="text-xs text-slate-600 hover:text-[#1B2A4A] font-semibold hover:underline"
          >
            ← Return to Public Student & Parent Search Portal
          </Link>
        </div>
      </div>
    </div>
  );
}
