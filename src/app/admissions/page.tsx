import Link from "next/link";
import { CheckCircle2, FileText, Calendar, Clock, DollarSign, HelpCircle } from "lucide-react";

export const metadata = {
  title: "Admissions — Nayab Grammar School Mirwah",
  description: "Information regarding admission policy, age criteria, fee schedule, and registration process.",
};

const STEPS = [
  { step: "01", title: "Obtain Prospectus & Form", desc: "Collect the admission packet from the campus accounts office in Mirwah or download online." },
  { step: "02", title: "Assessment & Interview", desc: "Basic diagnostic test in English, Urdu, and Math for Class 1 and above to evaluate student grade placement." },
  { step: "03", title: "Document Submission", desc: "Submit B-Form/Birth Certificate copy, 4 passport photos, and previous school leaving certificate." },
  { step: "04", title: "Fee Voucher Clearance", desc: "Pay the computerized admission fee challan at the campus counter or designated bank branches." },
];

export default function AdmissionsPage() {
  return (
    <div className="min-h-screen bg-[#F2F4F7] pb-16">
      {/* Header */}
      <section className="bg-[#0D1B3D] text-white py-14 px-4 sm:px-6 lg:px-8 border-b-4 border-[#D4AF37]">
        <div className="max-w-5xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 border border-[#D4AF37]/40 px-3.5 py-1 rounded-full text-xs font-semibold text-[#D4AF37] mb-4">
            <span>Admissions Open 2025–2026</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight font-heading">
            Join Nayab Grammar School
          </h1>
          <p className="mt-3 text-slate-300 max-w-2xl mx-auto text-sm sm:text-base leading-relaxed">
            Nurturing young minds with knowledge, discipline, and purpose. Apply today for admission from Nursery to Class 10.
          </p>
        </div>
      </section>

      {/* Main Container */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 mt-10 space-y-8">
        {/* Admission Steps */}
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
          <h2 className="text-2xl font-bold text-[#0D1B3D] font-heading">Simple 4-Step Admission Process</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {STEPS.map((s) => (
              <div key={s.step} className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                <span className="text-2xl font-black text-[#D4AF37] font-heading">{s.step}</span>
                <h3 className="font-bold text-sm text-[#0D1B3D]">{s.title}</h3>
                <p className="text-xs text-slate-600 leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Requirements & Fee Structure Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Required Documents */}
          <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4">
            <h3 className="text-lg font-bold text-[#0D1B3D] font-heading flex items-center gap-2">
              <FileText className="w-5 h-5 text-[#1E3A8A]" />
              <span>Required Documents</span>
            </h3>
            <ul className="space-y-2.5 text-xs sm:text-sm text-slate-700">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#22C55E] shrink-0 mt-0.5" />
                <span>Original or copy of Student NADRA B-Form / Birth Certificate</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#22C55E] shrink-0 mt-0.5" />
                <span>4 recent passport-size blue background photographs</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#22C55E] shrink-0 mt-0.5" />
                <span>Copy of Father / Guardian CNIC</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#22C55E] shrink-0 mt-0.5" />
                <span>School Leaving Certificate (for transfer students from Class 2+)</span>
              </li>
            </ul>
          </div>

          {/* Fee Schedule Summary */}
          <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4">
            <h3 className="text-lg font-bold text-[#0D1B3D] font-heading flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-[#D4AF37]" />
              <span>Fee Structure (Monthly Tuition)</span>
            </h3>
            <div className="divide-y divide-slate-100 text-xs sm:text-sm">
              <div className="py-2.5 flex justify-between items-center">
                <span className="text-slate-700">Pre-Primary (Nursery, KG):</span>
                <span className="font-bold text-[#0D1B3D]">Rs. 1,800 / month</span>
              </div>
              <div className="py-2.5 flex justify-between items-center">
                <span className="text-slate-700">Primary (Class 1 to 5):</span>
                <span className="font-bold text-[#0D1B3D]">Rs. 2,200 / month</span>
              </div>
              <div className="py-2.5 flex justify-between items-center">
                <span className="text-slate-700">Middle (Class 6 to 8):</span>
                <span className="font-bold text-[#0D1B3D]">Rs. 2,600 / month</span>
              </div>
              <div className="py-2.5 flex justify-between items-center">
                <span className="text-slate-700">Matric (Class 9 & 10):</span>
                <span className="font-bold text-[#0D1B3D]">Rs. 3,200 / month</span>
              </div>
            </div>
            <p className="text-[11px] text-slate-500">
              * One-time admission registration fee applies at time of enrollment.
            </p>
          </div>
        </div>

        {/* Contact Campus CTA */}
        <div className="bg-[#0D1B3D] text-white rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-bold text-[#D4AF37] font-heading">Have Admission Inquiries?</h3>
            <p className="text-xs sm:text-sm text-slate-300 mt-1">
              Visit the campus office in Mirwah during working hours (8:00 AM to 1:30 PM).
            </p>
          </div>
          <Link
            href="/contact"
            className="bg-[#D4AF37] text-[#0D1B3D] font-bold px-5 py-2.5 rounded-xl text-sm shadow hover:bg-amber-400 transition shrink-0"
          >
            Contact Campus
          </Link>
        </div>
      </div>
    </div>
  );
}
