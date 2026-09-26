import Link from "next/link";
import Image from "next/image";
import { Phone, Mail, MapPin, Clock, ExternalLink } from "lucide-react";

function FacebookIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
    </svg>
  );
}

export default function Footer() {
  return (
    <footer className="bg-[#0D1B3D] text-slate-300 border-t-4 border-[#D4AF37] pt-12 pb-24 md:pb-12 print-hide font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand & Mission */}
          <div className="md:col-span-1 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-white p-0.5 border-2 border-[#D4AF37] flex items-center justify-center overflow-hidden shrink-0">
                <Image
                  src="/images/school-logo.png"
                  alt="Nayab English Grammer High School Mirwah"
                  width={46}
                  height={46}
                  className="w-full h-full object-contain"
                />
              </div>
              <div>
                <h3 className="text-white font-bold text-sm sm:text-base leading-tight font-heading">NAYAB ENGLISH GRAMMER HIGH SCHOOL</h3>
                <p className="text-[#D4AF37] text-xs font-semibold tracking-wider">Mirwah · Sindh</p>
              </div>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Committed to academic excellence, moral discipline, and nurturing future leaders through holistic education in Mirwah.
            </p>
            <div className="pt-1 flex items-center gap-2">
              <a
                href="https://www.facebook.com/nayabhs.mirwah"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 bg-[#1877F2] hover:bg-[#166fe5] text-white text-xs px-3 py-1.5 rounded-lg font-bold shadow-xs transition hover:scale-[1.02]"
              >
                <FacebookIcon className="w-3.5 h-3.5 fill-current" />
                <span>Facebook Page</span>
              </a>
              <a
                href="https://maps.app.goo.gl/G9Zwdki6xpG3QZ4x5"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 bg-white/10 hover:bg-white/20 text-[#D4AF37] text-xs px-3 py-1.5 rounded-lg font-bold border border-[#D4AF37]/30 transition hover:scale-[1.02]"
              >
                <MapPin className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span>Google Maps</span>
              </a>
            </div>
          </div>

          {/* Quick Navigation */}
          <div>
            <h4 className="text-white font-semibold text-sm uppercase tracking-wider mb-4 border-b border-white/10 pb-2 font-heading">
              Quick Links
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/" className="hover:text-[#D4AF37] transition">Home</Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-[#D4AF37] transition">About Us</Link>
              </li>
              <li>
                <Link href="/academics" className="hover:text-[#D4AF37] transition">Academics & Curriculum</Link>
              </li>
              <li>
                <Link href="/admissions" className="hover:text-[#D4AF37] transition">Admissions 2025</Link>
              </li>
              <li>
                <Link href="/results" className="hover:text-[#D4AF37] transition">Examination Marksheets</Link>
              </li>
              <li>
                <Link href="/gallery" className="hover:text-[#D4AF37] transition">Photo Gallery & Events</Link>
              </li>
              <li>
                <Link href="/fees" className="hover:text-[#D4AF37] transition">Fee Vouchers</Link>
              </li>
            </ul>
          </div>

          {/* Timings & Schedule */}
          <div>
            <h4 className="text-white font-semibold text-sm uppercase tracking-wider mb-4 border-b border-white/10 pb-2 font-heading">
              School Timings
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
                Morning Gate & Assembly Cut-off: 8:15 AM
              </p>
            </div>
          </div>

          {/* Contact Details */}
          <div>
            <h4 className="text-white font-semibold text-sm uppercase tracking-wider mb-4 border-b border-white/10 pb-2 font-heading">
              Contact & Location
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-300">
              <li className="flex items-start gap-2 group">
                <MapPin className="w-4 h-4 text-[#D4AF37] shrink-0 mt-0.5" />
                <div>
                  <a
                    href="https://maps.app.goo.gl/G9Zwdki6xpG3QZ4x5"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-white transition group-hover:text-[#D4AF37]"
                  >
                    Main Bypass Road, Mirwah, Sindh, Pakistan
                    <span className="block text-[11px] text-[#D4AF37] font-semibold mt-0.5">
                      📍 Open in Google Maps ↗
                    </span>
                  </a>
                </div>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-[#D4AF37] shrink-0" />
                <span>+92 (0243) 720191 / +92 300 1234567</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#D4AF37] shrink-0" />
                <span>info@nayab.edu.pk</span>
              </li>
              <li className="flex items-center gap-2">
                <a
                  href="https://www.facebook.com/nayabhs.mirwah"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-[#1877F2] hover:text-[#4294ff] font-semibold transition"
                >
                  <FacebookIcon className="w-4 h-4 fill-current" />
                  <span>fb.com/nayabhs.mirwah ↗</span>
                </a>
              </li>
              <li className="pt-2">
                <Link
                  href="/login"
                  className="inline-block bg-white/10 hover:bg-white/20 text-white text-xs px-3.5 py-1.5 rounded-lg font-medium border border-white/20 transition"
                >
                  Staff Login Portal →
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="pt-6 border-t border-white/10 text-xs text-slate-400 flex flex-col sm:flex-row justify-between items-center gap-3">
          <p>© {new Date().getFullYear()} Nayab English Grammer High School Mirwah. All rights reserved.</p>
          <div className="flex items-center gap-4 text-xs">
            <a
              href="https://www.facebook.com/nayabhs.mirwah"
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-400 hover:text-[#1877F2] flex items-center gap-1 transition"
            >
              <FacebookIcon className="w-3.5 h-3.5 fill-current" />
              <span>Facebook</span>
            </a>
            <span className="text-slate-600">•</span>
            <a
              href="https://maps.app.goo.gl/G9Zwdki6xpG3QZ4x5"
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-400 hover:text-[#D4AF37] flex items-center gap-1 transition"
            >
              <MapPin className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>Campus Map</span>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
