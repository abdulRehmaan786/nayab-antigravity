import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Home, Search, HelpCircle } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-16">
      <div className="max-w-md w-full text-center bg-white rounded-3xl p-8 sm:p-10 shadow-xl border border-slate-200">
        <div className="w-20 h-20 rounded-full bg-white p-1 border-2 border-[#D4AF37] mx-auto shadow flex items-center justify-center mb-6">
          <Image
            src="/images/school-logo.png"
            alt="Nayab Grammar School Emblem"
            width={76}
            height={76}
            className="w-full h-full object-contain"
          />
        </div>

        <span className="inline-block bg-[#FCF9EE] border border-[#D4AF37] text-[#1B2A4A] text-xs font-extrabold px-3 py-1 rounded-full uppercase tracking-wider mb-3">
          Error 404 — Page Not Found
        </span>

        <h1 className="text-2xl font-extrabold text-[#1B2A4A] tracking-tight mb-2">
          Looking for School Records?
        </h1>

        <p className="text-xs sm:text-sm text-slate-600 mb-8 leading-relaxed">
          The page you requested could not be located. You may return to the homepage to search your child&apos;s result or check fee status.
        </p>

        <div className="space-y-3">
          <Link
            href="/"
            className="flex items-center justify-center gap-2 w-full bg-[#1B2A4A] hover:bg-[#111C32] text-white font-bold py-3.5 rounded-xl shadow-md transition"
          >
            <Home className="w-4 h-4 text-[#D4AF37]" />
            <span>Return to Homepage Portal</span>
          </Link>

          <Link
            href="/results"
            className="flex items-center justify-center gap-2 w-full bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold py-3 rounded-xl transition text-xs"
          >
            <Search className="w-4 h-4 text-[#1B2A4A]" />
            <span>Go to Result Lookup</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
