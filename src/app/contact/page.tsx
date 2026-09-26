import { MapPin, Phone, Mail, Clock, Send, ExternalLink } from "lucide-react";

function FacebookIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
    </svg>
  );
}

export const metadata = {
  title: "Contact Us — Nayab English Grammer High School Mirwah",
  description: "Get in touch with Nayab English Grammer High School campus in Mirwah, Sindh. Phone numbers, location, and office timings.",
};

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-[#F2F4F7] pb-16">
      {/* Header */}
      <section className="bg-[#0D1B3D] text-white py-14 px-4 sm:px-6 lg:px-8 border-b-4 border-[#D4AF37]">
        <div className="max-w-5xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 border border-[#D4AF37]/40 px-3.5 py-1 rounded-full text-xs font-semibold text-[#D4AF37] mb-4">
            <span>Mirwah Campus</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight font-heading">
            Contact & Campus Info
          </h1>
          <p className="mt-3 text-slate-300 max-w-2xl mx-auto text-sm sm:text-base leading-relaxed">
            We are always here to assist parents, students, and community members.
          </p>
        </div>
      </section>

      {/* Main Grid */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 mt-10 grid grid-cols-1 md:grid-cols-12 gap-8">
        {/* Contact Info (5 cols) */}
        <div className="md:col-span-5 space-y-6">
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-5">
            <h2 className="text-xl font-bold text-[#0D1B3D] font-heading">Campus Address & Contact</h2>

            {/* Campus Location */}
            <div className="flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-[#0D1B3D]/5 text-[#0D1B3D] flex items-center justify-center shrink-0">
                <MapPin className="w-5 h-5 text-[#D4AF37]" />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-sm text-slate-900">Nayab English Grammer High School Mirwah</p>
                <p className="text-xs text-slate-600 mt-0.5">Main Bypass Road, Near Degree College, Mirwah, Sindh, Pakistan</p>
                <a
                  href="https://maps.app.goo.gl/G9Zwdki6xpG3QZ4x5"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 mt-2 bg-[#0D1B3D] hover:bg-[#1E3A8A] text-white text-xs px-3 py-1.5 rounded-lg font-bold shadow-xs transition hover:scale-[1.02]"
                >
                  <MapPin className="w-3.5 h-3.5 text-[#D4AF37]" />
                  <span>Open in Google Maps ↗</span>
                </a>
              </div>
            </div>

            {/* Official Facebook Page */}
            <div className="flex items-start gap-3.5 pt-2 border-t border-slate-100">
              <div className="w-10 h-10 rounded-xl bg-[#1877F2]/10 text-[#1877F2] flex items-center justify-center shrink-0">
                <FacebookIcon className="w-5 h-5 fill-current" />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-sm text-slate-900">Official Facebook Page</p>
                <p className="text-xs text-slate-600 mt-0.5">Follow us for latest school activities, exam notifications, and campus event albums.</p>
                <a
                  href="https://www.facebook.com/nayabhs.mirwah"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 mt-2 bg-[#1877F2] hover:bg-[#166fe5] text-white text-xs px-3 py-1.5 rounded-lg font-bold shadow-xs transition hover:scale-[1.02]"
                >
                  <FacebookIcon className="w-3.5 h-3.5 fill-current" />
                  <span>Visit Facebook Page ↗</span>
                </a>
              </div>
            </div>

            {/* Telephone */}
            <div className="flex items-start gap-3.5 pt-2 border-t border-slate-100">
              <div className="w-10 h-10 rounded-xl bg-[#0D1B3D]/5 text-[#0D1B3D] flex items-center justify-center shrink-0">
                <Phone className="w-5 h-5 text-[#1E3A8A]" />
              </div>
              <div>
                <p className="font-semibold text-sm text-slate-900">Telephone Lines</p>
                <p className="text-xs text-slate-600 mt-0.5">+92 (0243) 720191 / +92 300 1234567</p>
              </div>
            </div>

            {/* Email */}
            <div className="flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-[#0D1B3D]/5 text-[#0D1B3D] flex items-center justify-center shrink-0">
                <Mail className="w-5 h-5 text-[#22C55E]" />
              </div>
              <div>
                <p className="font-semibold text-sm text-slate-900">Official Email</p>
                <p className="text-xs text-slate-600 mt-0.5">info@nayab.edu.pk / principal@nayab.edu.pk</p>
              </div>
            </div>

            {/* Office Timings */}
            <div className="flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-[#0D1B3D]/5 text-[#0D1B3D] flex items-center justify-center shrink-0">
                <Clock className="w-5 h-5 text-[#F59E0B]" />
              </div>
              <div>
                <p className="font-semibold text-sm text-slate-900">Accounts & Admin Office</p>
                <p className="text-xs text-slate-600 mt-0.5">Mon – Thu & Sat: 8:00 AM – 1:30 PM</p>
                <p className="text-xs text-slate-600">Friday: 8:00 AM – 12:00 PM (Sunday Closed)</p>
              </div>
            </div>
          </div>

          {/* Quick Location Card */}
          <div className="bg-[#0D1B3D] text-white rounded-2xl p-5 border border-[#1E3A8A] shadow-md space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#D4AF37]" />
                <h3 className="font-bold text-sm text-white">Find Us on Google Maps</h3>
              </div>
              <span className="text-[10px] text-[#D4AF37] font-bold bg-[#D4AF37]/10 border border-[#D4AF37]/30 px-2 py-0.5 rounded">
                Live Location
              </span>
            </div>
            <p className="text-xs text-slate-300">
              Easily navigate to our campus using turn-by-turn Google Maps directions.
            </p>
            <a
              href="https://maps.app.goo.gl/G9Zwdki6xpG3QZ4x5"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-[#D4AF37] hover:bg-[#c49f2e] text-[#0D1B3D] text-xs font-extrabold transition shadow cursor-pointer"
            >
              <MapPin className="w-4 h-4 text-[#0D1B3D]" />
              <span>Open in Google Maps Application ↗</span>
            </a>
          </div>
        </div>

        {/* Inquiry Form (7 cols) */}
        <div className="md:col-span-7">
          <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-5">
            <h2 className="text-xl font-bold text-[#0D1B3D] font-heading">Send an Inquiry</h2>
            <p className="text-xs text-slate-500">
              Have questions regarding student admission, fee vouchers, or school policies? Fill out the form below.
            </p>

            <form className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Your Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Tariq Ahmed"
                    className="w-full h-11 bg-slate-50 border border-slate-300 rounded-xl px-3.5 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0D1B3D]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Phone Number</label>
                  <input
                    type="tel"
                    required
                    placeholder="0300-XXXXXXX"
                    className="w-full h-11 bg-slate-50 border border-slate-300 rounded-xl px-3.5 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0D1B3D]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Student Class / Roll (If enrolled)</label>
                <input
                  type="text"
                  placeholder="e.g. Class 9, Roll 101"
                  className="w-full h-11 bg-slate-50 border border-slate-300 rounded-xl px-3.5 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0D1B3D]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Message / Question</label>
                <textarea
                  rows={4}
                  required
                  placeholder="Enter your message or inquiry..."
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3.5 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0D1B3D]"
                ></textarea>
              </div>

              <button
                type="submit"
                className="w-full h-12 bg-[#0D1B3D] hover:bg-[#1E3A8A] text-white font-semibold rounded-xl flex items-center justify-center gap-2 shadow transition cursor-pointer"
              >
                <Send className="w-4 h-4 text-[#D4AF37]" />
                <span>Submit Inquiry</span>
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
