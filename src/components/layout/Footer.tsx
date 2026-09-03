import Link from "next/link";
import Image from "next/image";
import { Phone, Mail, MapPin, Clock, ShieldCheck } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-[#111C32] text-slate-300 border-t-4 border-[#D4AF37] pt-12 pb-24 md:pb-12 print-hide">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand & Mission */}
          <div className="md:col-span-1 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-white p-0.5 border-2 border-[#D4AF37] flex items-center justify-center overflow-hidden">
                <Image
                  src="/images/school-logo.png"
                  alt="Nayab Grammar School"
                  width={46}
                  height={46}
                  className="w-full h-full object-contain"
                />
              </div>
              <div>
                <h3 className="text-white font-bold text-base leading-tight">NAYAB GRAMMAR SCHOOL</h3>
                <p className="text-[#D4AF37] text-xs font-semibold uppercase tracking-wider">Mirwah Campus</p>
              </div>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Committed to academic excellence, moral discipline, and nurturing future leaders through holistic education in Mirwah.
            </p>
            <div className="flex items-center gap-2 text-xs text-[#D4AF37]">
              <ShieldCheck className="w-4 h-4" />
              <span>Registered & Recognized Institution</span>
            </div>
          </div>

          {/* Quick Navigation */}
          <div>
            <h4 className="text-white font-semibold text-sm uppercase tracking-wider mb-4 border-b border-slate-700/80 pb-2">
              Student & Parent Portal
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/" className="hover:text-[#D4AF37] transition">Home & Search</Link>
              </li>
              <li>
                <Link href="/results" className="hover:text-[#D4AF37] transition">Check Midterm Results</Link>
              </li>
              <li>
                <Link href="/fees" className="hover:text-[#D4AF37] transition">Fee Status & Challan</Link>
              </li>
              <li>
                <Link href="/announcements" className="hover:text-[#D4AF37] transition">School Circulars & Holidays</Link>
              </li>
              <li>
                <Link href="/login" className="hover:text-[#D4AF37] transition">Teacher & Admin Portal</Link>
              </li>
            </ul>
          </div>

          {/* Timings & Uniform */}
          <div>
            <h4 className="text-white font-semibold text-sm uppercase tracking-wider mb-4 border-b border-slate-700/80 pb-2">
              School Hours & Schedule
            </h4>
            <div className="space-y-2.5 text-xs text-slate-300">
              <div className="flex items-start gap-2">
                <Clock className="w-4 h-4 text-[#D4AF37] shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-white">Mon – Thu & Sat:</p>
                  <p className="text-slate-400">8:00 AM – 1:30 PM</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <Clock className="w-4 h-4 text-[#D4AF37] shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-white">Friday:</p>
                  <p className="text-slate-400">8:00 AM – 12:00 PM</p>
                </div>
              </div>
              <p className="text-[11px] text-slate-400 pt-1">
                Accounts Office: 8:30 AM – 1:00 PM
              </p>
            </div>
          </div>

          {/* Contact Details */}
          <div>
            <h4 className="text-white font-semibold text-sm uppercase tracking-wider mb-4 border-b border-slate-700/80 pb-2">
              Contact & Location
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-300">
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-[#D4AF37] shrink-0 mt-0.5" />
                <span>Main Campus, City Road, Mirwah, Sindh, Pakistan</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-[#D4AF37] shrink-0" />
                <span>+92 301 2345670 / +92 312 9876543</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#D4AF37] shrink-0" />
                <span>info@nayab.edu.pk</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="pt-6 border-t border-slate-800 text-xs text-slate-500 flex flex-col sm:flex-row justify-between items-center gap-3">
          <p>© {new Date().getFullYear()} Nayab Grammar School, Mirwah. All rights reserved.</p>
          <p className="text-slate-400">
            Final Year Capstone Project — Production School Management Web Application
          </p>
        </div>
      </div>
    </footer>
  );
}
