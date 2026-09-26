import Image from "next/image";
import Link from "next/link";
import RollNumberSearch from "@/components/public/RollNumberSearch";
import { db } from "@/lib/db";
import { Award, FileText, CreditCard, Bell, Sparkles, BookOpen, Users, Clock, ShieldCheck, ChevronRight, Pin, GraduationCap } from "lucide-react";

export const revalidate = 60; // Refresh every 60 seconds

async function getHomePageData() {
  try {
    const announcements = await db.announcement.findMany({
      orderBy: [{ isPinned: "desc" }, { createdAt: "desc" }],
      take: 4,
    });

    const totalStudents = await db.student.count();
    const totalResults = await db.examResult.count();

    return { announcements, totalStudents, totalResults };
  } catch (error) {
    console.error("Home page data fetch error:", error);
    return { announcements: [], totalStudents: 15, totalResults: 10 };
  }
}

export default async function HomePage() {
  const { announcements, totalStudents, totalResults } = await getHomePageData();

  return (
    <div className="w-full">
      {/* Hero Section matching PUBLIC HOMEPAGE (WEBSITE) from design sheet */}
      <section className="bg-[#0D1B3D] text-white pt-12 pb-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden border-b-4 border-[#D4AF37]">
        {/* Subtle background glow */}
        <div className="absolute -right-24 -top-24 w-96 h-96 bg-[#1E3A8A]/30 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute -left-24 -bottom-24 w-96 h-96 bg-[#D4AF37]/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 items-center relative z-10">
          {/* Left Column: Headline, Subtitle, Description & CTA */}
          <div className="lg:col-span-7 space-y-5 text-left">
            <div className="inline-flex items-center gap-2 bg-white/10 border border-[#D4AF37]/40 backdrop-blur-md px-3.5 py-1.5 rounded-full text-xs font-semibold text-[#D4AF37]">
              <span className="w-2 h-2 rounded-full bg-[#D4AF37] animate-pulse"></span>
              <span>Nayab English Grammer High School — Mirwah</span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight font-heading">
              Welcome to <br />
              <span className="text-white">Nayab English Grammer</span> <br />
              <span className="text-[#D4AF37]">High School Mirwah</span>
            </h1>

            <div className="text-lg sm:text-xl font-semibold text-[#D4AF37] tracking-wide">
              Quality Education, Bright Future
            </div>

            <p className="text-sm sm:text-base text-slate-300 max-w-xl leading-relaxed">
              We are committed to providing quality education and creating a better future for our students. Explore examination marksheets, biometric gate attendance, fee challans, and campus circulars.
            </p>

            <div className="flex items-center gap-3 pt-2">
              <Link
                href="/about"
                className="bg-white text-[#0D1B3D] hover:bg-slate-100 font-bold px-6 py-3 rounded-xl text-sm shadow-md transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                Learn More
              </Link>
              <Link
                href="/admissions"
                className="bg-transparent border border-white/30 hover:bg-white/10 text-white font-medium px-6 py-3 rounded-xl text-sm transition"
              >
                Admissions
              </Link>
            </div>
          </div>

          {/* Right Column: Real Students Hero Image */}
          <div className="lg:col-span-5 flex justify-center lg:justify-end">
            <div className="relative w-full max-w-md rounded-2xl overflow-hidden shadow-2xl border-4 border-[#D4AF37]/40 bg-[#071026] group">
              <div className="relative aspect-[4/3] sm:aspect-[4/3] w-full overflow-hidden">
                <Image
                  src="/images/students-hero.jpg"
                  alt="Nayab English Grammer High School Students with Award Shields"
                  fill
                  sizes="(max-width: 768px) 100vw, 500px"
                  className="object-cover object-top group-hover:scale-105 transition-transform duration-500"
                  priority
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-[#0D1B3D] via-transparent to-transparent"></div>
              <div className="absolute bottom-3 left-4 right-4 text-center">
                <p className="text-xs font-bold text-[#D4AF37] uppercase tracking-wider">
                  Academic Honorees • Class of 2025
                </p>
                <p className="text-[11px] text-slate-300">
                  Inspiring Young Minds in Mirwah Since 2012
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Public Roll Number Search Container (Placed right below hero, matching design card) */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 -mt-10 relative z-20">
        <RollNumberSearch />
      </section>

      {/* Quick KPI Stats Bar */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 pt-12">
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 grid grid-cols-2 sm:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-slate-100 p-4 sm:p-6 text-center">
          <div className="p-3">
            <div className="text-2xl sm:text-3xl font-extrabold text-[#0D1B3D] tracking-tight">
              1,245+
            </div>
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mt-1">
              Enrolled Students
            </div>
          </div>

          <div className="p-3">
            <div className="text-2xl sm:text-3xl font-extrabold text-[#0D1B3D] tracking-tight">
              86
            </div>
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mt-1">
              Qualified Teachers
            </div>
          </div>

          <div className="p-3">
            <div className="text-2xl sm:text-3xl font-extrabold text-[#0D1B3D] tracking-tight">
              28
            </div>
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mt-1">
              Academic Classes
            </div>
          </div>

          <div className="p-3">
            <div className="text-2xl sm:text-3xl font-extrabold text-[#D4AF37] tracking-tight">
              98.4%
            </div>
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mt-1">
              Matric Board Pass Rate
            </div>
          </div>
        </div>
      </section>

      {/* 4 Portals & User Flow Navigation matching Information Architecture */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-14">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight font-heading">
            Portals & Core Services
          </h2>
          <p className="text-sm text-slate-600 mt-2">
            Seamless, friction-free access for School Administrators, Faculty, Students, and Parents.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Card 1: Result Lookup */}
          <Link
            href="/results"
            className="group bg-white rounded-2xl p-6 shadow-sm border border-slate-200/90 hover:border-[#0D1B3D] hover:shadow-md transition-all duration-200 flex flex-col"
          >
            <div className="w-12 h-12 rounded-xl bg-[#0D1B3D]/5 text-[#0D1B3D] flex items-center justify-center group-hover:bg-[#0D1B3D] group-hover:text-[#D4AF37] transition duration-200 mb-4">
              <FileText className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-base text-slate-900 group-hover:text-[#0D1B3D] font-heading">
              Marks & Report Cards
            </h3>
            <p className="text-xs text-slate-600 mt-2 flex-1 leading-relaxed">
              Print official A4 progress report cards with computerized seals and grading breakdowns.
            </p>
            <span className="text-xs font-semibold text-[#1E3A8A] mt-4 flex items-center gap-1 group-hover:gap-2 transition-all">
              <span>View Results</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </span>
          </Link>

          {/* Card 2: Fee Status */}
          <Link
            href="/fees"
            className="group bg-white rounded-2xl p-6 shadow-sm border border-slate-200/90 hover:border-[#0D1B3D] hover:shadow-md transition-all duration-200 flex flex-col"
          >
            <div className="w-12 h-12 rounded-xl bg-[#0D1B3D]/5 text-[#0D1B3D] flex items-center justify-center group-hover:bg-[#0D1B3D] group-hover:text-[#D4AF37] transition duration-200 mb-4">
              <CreditCard className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-base text-slate-900 group-hover:text-[#0D1B3D] font-heading">
              Fee Status & Challans
            </h3>
            <p className="text-xs text-slate-600 mt-2 flex-1 leading-relaxed">
              Verify monthly tuition vouchers, computerized payment receipts, and bank details.
            </p>
            <span className="text-xs font-semibold text-[#1E3A8A] mt-4 flex items-center gap-1 group-hover:gap-2 transition-all">
              <span>Check Fee Status</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </span>
          </Link>

          {/* Card 3: Student & Parent Portal */}
          <Link
            href="/student"
            className="group bg-white rounded-2xl p-6 shadow-sm border border-slate-200/90 hover:border-[#0D1B3D] hover:shadow-md transition-all duration-200 flex flex-col"
          >
            <div className="w-12 h-12 rounded-xl bg-[#0D1B3D]/5 text-[#0D1B3D] flex items-center justify-center group-hover:bg-[#0D1B3D] group-hover:text-[#D4AF37] transition duration-200 mb-4">
              <GraduationCap className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-base text-slate-900 group-hover:text-[#0D1B3D] font-heading">
              Student & Parent Area
            </h3>
            <p className="text-xs text-slate-600 mt-2 flex-1 leading-relaxed">
              Inspect daily class timetables, attendance percentages, and term performance ranks.
            </p>
            <span className="text-xs font-semibold text-[#1E3A8A] mt-4 flex items-center gap-1 group-hover:gap-2 transition-all">
              <span>Open Student Area</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </span>
          </Link>

          {/* Card 4: Staff Area */}
          <Link
            href="/login"
            className="group bg-[#FBF8EE] rounded-2xl p-6 shadow-sm border border-[#D4AF37]/50 hover:border-[#0D1B3D] hover:shadow-md transition-all duration-200 flex flex-col"
          >
            <div className="w-12 h-12 rounded-xl bg-[#0D1B3D] text-[#D4AF37] flex items-center justify-center mb-4">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-base text-[#0D1B3D] font-heading">
              Staff Portal
            </h3>
            <p className="text-xs text-slate-700 mt-2 flex-1 leading-relaxed">
              Authorized access for school management and teachers to input marks and record attendance.
            </p>
            <span className="text-xs font-bold text-[#0D1B3D] mt-4 flex items-center gap-1 group-hover:gap-2 transition-all">
              <span>Sign In</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </span>
          </Link>
        </div>
      </section>

      {/* Latest Announcements Feed Section */}
      <section className="bg-white py-14 border-t border-slate-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold text-[#D4AF37] uppercase tracking-wider">
                <Bell className="w-4 h-4 text-[#0D1B3D]" />
                <span>Notice Board</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight mt-1 font-heading">
                Recent Announcements & Circulars
              </h2>
            </div>
            <Link
              href="/announcements"
              className="text-xs sm:text-sm font-semibold text-[#1E3A8A] hover:text-[#0D1B3D] flex items-center gap-1 self-start sm:self-auto"
            >
              <span>View All Circulars</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {announcements.map((item) => {
              const categoryBadge = {
                NOTICE: "bg-blue-50 text-blue-800 border-blue-200",
                EVENT: "bg-emerald-50 text-emerald-800 border-emerald-200",
                HOLIDAY: "bg-amber-50 text-amber-800 border-amber-200",
                EXAM: "bg-purple-50 text-purple-800 border-purple-200",
              }[item.category] || "bg-slate-100 text-slate-800 border-slate-200";

              return (
                <div
                  key={item.id}
                  className={`p-5 sm:p-6 rounded-2xl border transition hover:shadow-md flex flex-col justify-between ${
                    item.isPinned
                      ? "bg-[#FBF8EE]/50 border-[#D4AF37]"
                      : "bg-[#F8F9FB] border-slate-200/90"
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${categoryBadge}`}>
                        {item.category}
                      </span>
                      <div className="flex items-center gap-2">
                        {item.isPinned && (
                          <span className="flex items-center gap-1 text-[11px] font-bold text-[#D4AF37]">
                            <Pin className="w-3.5 h-3.5" /> Pinned
                          </span>
                        )}
                        <span className="text-xs text-slate-400 font-medium">{item.date}</span>
                      </div>
                    </div>

                    <h3 className="font-bold text-base sm:text-lg text-slate-900 leading-snug font-heading">
                      {item.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed line-clamp-3">
                      {item.content}
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-200/70 flex items-center justify-between text-xs text-slate-500">
                    <span>Issued by: {item.publishedBy}</span>
                    <Link
                      href="/announcements"
                      className="font-semibold text-[#1E3A8A] hover:underline"
                    >
                      Read full notice →
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Uniform & Timings Highlights */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-14">
        <div className="bg-[#0D1B3D] text-white rounded-3xl p-6 sm:p-10 shadow-xl border border-[#D4AF37]/40 relative overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-[#D4AF37]">
                School Guidelines
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight mt-1 font-heading">
                Uniform Policy & Campus Timings
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 mt-3 leading-relaxed">
                Nayab English Grammer High School Mirwah takes immense pride in student discipline, neatness, and punctual attendance.
              </p>

              <div className="mt-6 space-y-3.5 text-xs sm:text-sm">
                <div className="bg-white/10 p-3.5 rounded-xl border border-white/10">
                  <p className="font-bold text-[#D4AF37]">Boys Uniform:</p>
                  <p className="text-slate-200 mt-0.5">
                    White collared shirt, navy blue formal trousers, navy blue necktie, and black shoes.
                  </p>
                </div>

                <div className="bg-white/10 p-3.5 rounded-xl border border-white/10">
                  <p className="font-bold text-[#D4AF37]">Girls Uniform:</p>
                  <p className="text-slate-200 mt-0.5">
                    Navy blue frock or shalwar-kameez with white collar piping, white shalwar, and navy scarf/dupatta.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm space-y-4">
              <h3 className="font-bold text-lg text-white flex items-center gap-2 font-heading">
                <Clock className="w-5 h-5 text-[#D4AF37]" />
                <span>Daily Assembly & Timings</span>
              </h3>

              <div className="space-y-3 text-xs sm:text-sm">
                <div className="flex justify-between items-center py-2 border-b border-white/10">
                  <span className="text-slate-300">Gates Open:</span>
                  <span className="font-bold text-white">7:45 AM</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-white/10">
                  <span className="text-slate-300">Biometric Gate Cut-Off:</span>
                  <span className="font-bold text-[#D4AF37]">8:15 AM Sharp</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-white/10">
                  <span className="text-slate-300">Dismissal (Mon–Thu & Sat):</span>
                  <span className="font-bold text-white">1:30 PM</span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-slate-300">Dismissal (Friday):</span>
                  <span className="font-bold text-white">12:00 PM</span>
                </div>
              </div>

              <div className="pt-2">
                <Link
                  href="/announcements"
                  className="inline-flex items-center gap-2 text-xs font-bold text-[#0D1B3D] bg-[#D4AF37] hover:bg-amber-400 px-4 py-2.5 rounded-xl transition shadow"
                >
                  <span>View Academic Calendar</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
