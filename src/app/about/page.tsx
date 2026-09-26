import Image from "next/image";
import Link from "next/link";
import { Award, BookOpen, CheckCircle, GraduationCap, Heart, Shield, Users } from "lucide-react";

export const metadata = {
  title: "About Us — Nayab English Grammer High School Mirwah",
  description: "Learn about the mission, history, and academic values of Nayab English Grammer High School Mirwah.",
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#F2F4F7] pb-16">
      {/* Hero Header */}
      <section className="bg-[#0D1B3D] text-white py-14 px-4 sm:px-6 lg:px-8 border-b-4 border-[#D4AF37]">
        <div className="max-w-5xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 border border-[#D4AF37]/40 px-3.5 py-1 rounded-full text-xs font-semibold text-[#D4AF37] mb-4">
            <span>Our Heritage & Vision</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight font-heading">
            About Nayab English Grammer High School Mirwah
          </h1>
          <p className="mt-3 text-slate-300 max-w-2xl mx-auto text-sm sm:text-base leading-relaxed">
            Founded with a commitment to academic brilliance, moral character, and community leadership in Mirwah since 2012.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 mt-10 space-y-8">
        {/* Slogan Banner */}
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm flex flex-col md:flex-row items-center gap-6">
          <div className="w-20 h-20 rounded-2xl bg-[#0D1B3D] border-2 border-[#D4AF37] p-2 flex items-center justify-center shrink-0 shadow-md">
            <Image
              src="/images/school-logo.png"
              alt="Nayab English Grammer High School Logo"
              width={72}
              height={72}
              className="w-full h-full object-contain"
            />
          </div>
          <div className="space-y-1 text-center md:text-left">
            <span className="text-xs font-bold uppercase tracking-widest text-[#D4AF37]">School Motto</span>
            <h2 className="text-2xl font-bold text-[#0D1B3D] font-heading">Learn · Grow · Succeed</h2>
            <p className="text-sm text-slate-600 leading-relaxed">
              At Nayab English Grammer High School Mirwah, every child is nurtured to excel in modern scientific thought, moral discipline, and communicative confidence.
            </p>
          </div>
        </div>

        {/* Mission & Vision Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-3">
            <div className="w-12 h-12 rounded-xl bg-[#0D1B3D]/5 text-[#0D1B3D] flex items-center justify-center">
              <Award className="w-6 h-6 text-[#D4AF37]" />
            </div>
            <h3 className="text-xl font-bold text-[#0D1B3D] font-heading">Our Mission</h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              To deliver high-standard education that combines rigorous STEM foundations, linguistic fluency in English, Urdu, and Sindhi, and ethical integrity, enabling students to gain top positions in Matriculation Board exams.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-3">
            <div className="w-12 h-12 rounded-xl bg-[#0D1B3D]/5 text-[#0D1B3D] flex items-center justify-center">
              <GraduationCap className="w-6 h-6 text-[#1E3A8A]" />
            </div>
            <h3 className="text-xl font-bold text-[#0D1B3D] font-heading">Our Vision</h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              To be the premier grammar school in Mirwah and Sindh, acclaimed for nurturing compassionate future leaders, doctors, engineers, and civic contributors who make their families and nation proud.
            </p>
          </div>
        </div>

        {/* Core Pillars */}
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
          <h3 className="text-xl font-bold text-[#0D1B3D] font-heading">Why Choose Nayab English Grammer High School Mirwah?</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm font-bold text-[#0D1B3D]">
                <CheckCircle className="w-4 h-4 text-[#22C55E]" />
                <span>Modern Science Labs</span>
              </div>
              <p className="text-xs text-slate-600">
                Well-equipped Biology, Chemistry, and Physics laboratories for experiential matric board preparation.
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm font-bold text-[#0D1B3D]">
                <CheckCircle className="w-4 h-4 text-[#22C55E]" />
                <span>Biometric Attendance Gate</span>
              </div>
              <p className="text-xs text-slate-600">
                Automated optical fingerprint gates ensuring student safety, punctual attendance, and parent transparency.
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm font-bold text-[#0D1B3D]">
                <CheckCircle className="w-4 h-4 text-[#22C55E]" />
                <span>Character & Deeniat</span>
              </div>
              <p className="text-xs text-slate-600">
                Daily morning assembly with Holy Quran recitation, national anthem, and character development sessions.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
