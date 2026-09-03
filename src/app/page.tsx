import Image from "next/image";
import Link from "next/link";
import RollNumberSearch from "@/components/public/RollNumberSearch";
import { db } from "@/lib/db";
import { Award, FileText, CreditCard, Bell, Sparkles, BookOpen, Users, Clock, ShieldCheck, ChevronRight, Pin } from "lucide-react";

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
      {/* Hero Banner Section */}
      <section className="bg-gradient-to-b from-[#1B2A4A] via-[#16233E] to-[#111C32] text-white pt-10 pb-16 px-4 sm:px-6 lg:px-8 border-b-4 border-[#D4AF37] relative overflow-hidden">
        {/* Subtle Decorative Elements */}
        <div className="absolute -right-20 -top-20 w-96 h-96 bg-[#D4AF37]/5 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute -left-20 -bottom-20 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl pointer-events-none"></div>

        <div className="max-w-5xl mx-auto text-center relative z-10">
          {/* Emblem & School Badge */}
          <div className="inline-flex items-center gap-2.5 bg-white/10 border border-[#D4AF37]/40 backdrop-blur-md px-4 py-1.5 rounded-full text-xs font-semibold text-[#D4AF37] mb-6">
            <span className="w-2 h-2 rounded-full bg-[#D4AF37] animate-pulse"></span>
            <span>Welcome to Nayab Grammar School — Mirwah</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight">
            Academic Excellence & <br className="hidden sm:inline" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#D4AF37] via-amber-200 to-[#D4AF37]">
              Character Building
            </span>
          </h1>

          <p className="mt-4 text-sm sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Welcome to our unified school management portal. Search examination results, track fee vouchers, and stay updated with official school circulars in seconds.
          </p>

          {/* Quick Front Door Search Box Container */}
          <div className="mt-10 max-w-3xl mx-auto text-left">
            <RollNumberSearch />
          </div>
        </div>
      </section>

      {/* Quick Stats Bar */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 -mt-8 relative z-20">
        <div className="bg-white rounded-2xl shadow-lg border border-slate-200/90 grid grid-cols-2 sm:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-slate-100 p-4 sm:p-6 text-center">
          <div className="p-3">
            <div className="text-2xl sm:text-3xl font-extrabold text-[#1B2A4A] tracking-tight">
              {totalStudents}+
            </div>
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mt-1">
              Enrolled Students
            </div>
          </div>

          <div className="p-3">
            <div className="text-2xl sm:text-3xl font-extrabold text-[#1B2A4A] tracking-tight">
              98.4%
            </div>
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mt-1">
              Matric Board Pass Rate
            </div>
          </div>

          <div className="p-3">
            <div className="text-2xl sm:text-3xl font-extrabold text-[#1B2A4A] tracking-tight">
              25+
            </div>
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mt-1">
              Dedicated Faculty
            </div>
          </div>

          <div className="p-3">
            <div className="text-2xl sm:text-3xl font-extrabold text-[#D4AF37] tracking-tight">
              Est. 2012
            </div>
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mt-1">
              13+ Years of Service
            </div>
          </div>
        </div>
      </section>

      {/* Core Portals & Services Grid */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-14">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            Designed for Parents, Students & Staff
          </h2>
          <p className="text-sm text-slate-600 mt-2">
            Instant, friction-free access to all essential school services from your phone or desktop.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Card 1 */}
          <Link
            href="/results"
            className="group bg-white rounded-2xl p-6 shadow-sm border border-slate-200/90 hover:border-[#1B2A4A] hover:shadow-md transition-all duration-200 flex flex-col"
          >
            <div className="w-12 h-12 rounded-xl bg-[#1B2A4A]/5 text-[#1B2A4A] flex items-center justify-center group-hover:bg-[#1B2A4A] group-hover:text-[#D4AF37] transition duration-200 mb-4">
              <FileText className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-base text-slate-900 group-hover:text-[#1B2A4A]">
              Result Lookup & Cards
            </h3>
            <p className="text-xs text-slate-600 mt-2 flex-1 leading-relaxed">
              Check midterm and annual examination marks, percentages, grades, and print official report cards.
            </p>
            <span className="text-xs font-semibold text-[#1B2A4A] mt-4 flex items-center gap-1 group-hover:gap-2 transition-all">
              <span>View Results</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </span>
          </Link>

          {/* Card 2 */}
          <Link
            href="/fees"
            className="group bg-white rounded-2xl p-6 shadow-sm border border-slate-200/90 hover:border-[#1B2A4A] hover:shadow-md transition-all duration-200 flex flex-col"
          >
            <div className="w-12 h-12 rounded-xl bg-[#1B2A4A]/5 text-[#1B2A4A] flex items-center justify-center group-hover:bg-[#1B2A4A] group-hover:text-[#D4AF37] transition duration-200 mb-4">
              <CreditCard className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-base text-slate-900 group-hover:text-[#1B2A4A]">
              Fee Status & Challan
            </h3>
            <p className="text-xs text-slate-600 mt-2 flex-1 leading-relaxed">
              Verify monthly tuition payment status, due dates, paid receipt records, and bank transfer guidelines.
            </p>
            <span className="text-xs font-semibold text-[#1B2A4A] mt-4 flex items-center gap-1 group-hover:gap-2 transition-all">
              <span>Check Fee Status</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </span>
          </Link>

          {/* Card 3 */}
          <Link
            href="/announcements"
            className="group bg-white rounded-2xl p-6 shadow-sm border border-slate-200/90 hover:border-[#1B2A4A] hover:shadow-md transition-all duration-200 flex flex-col"
          >
            <div className="w-12 h-12 rounded-xl bg-[#1B2A4A]/5 text-[#1B2A4A] flex items-center justify-center group-hover:bg-[#1B2A4A] group-hover:text-[#D4AF37] transition duration-200 mb-4">
              <Bell className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-base text-slate-900 group-hover:text-[#1B2A4A]">
              School Notices & Events
            </h3>
            <p className="text-xs text-slate-600 mt-2 flex-1 leading-relaxed">
              Stay informed about sports galas, winter timings, examination date sheets, and holiday notifications.
            </p>
            <span className="text-xs font-semibold text-[#1B2A4A] mt-4 flex items-center gap-1 group-hover:gap-2 transition-all">
              <span>Read Notices</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </span>
          </Link>

          {/* Card 4 */}
          <Link
            href="/login"
            className="group bg-[#FCF9EE] rounded-2xl p-6 shadow-sm border border-[#D4AF37]/50 hover:border-[#1B2A4A] hover:shadow-md transition-all duration-200 flex flex-col"
          >
            <div className="w-12 h-12 rounded-xl bg-[#1B2A4A] text-[#D4AF37] flex items-center justify-center mb-4">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-base text-[#111C32]">
              Teacher & Admin Portal
            </h3>
            <p className="text-xs text-slate-700 mt-2 flex-1 leading-relaxed">
              Secure staff area to input student marks, calculate grades, manage fee registers, and publish announcements.
            </p>
            <span className="text-xs font-bold text-[#1B2A4A] mt-4 flex items-center gap-1 group-hover:gap-2 transition-all">
              <span>Staff Login</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </span>
          </Link>
        </div>
      </section>

      {/* Latest Announcements Feed Section */}
      <section className="bg-white py-14 border-t border-slate-200/80">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold text-[#D4AF37] uppercase tracking-wider">
                <Bell className="w-4 h-4 text-[#1B2A4A]" />
                <span>Notice Board</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight mt-1">
                Latest Announcements & Circulars
              </h2>
            </div>
            <Link
              href="/announcements"
              className="text-xs sm:text-sm font-semibold text-[#1B2A4A] hover:text-[#D4AF37] flex items-center gap-1 self-start sm:self-auto"
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
                      ? "bg-[#FCF9EE]/50 border-[#D4AF37]"
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

                    <h3 className="font-bold text-base sm:text-lg text-slate-900 leading-snug">
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
                      className="font-semibold text-[#1B2A4A] hover:underline"
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
        <div className="bg-[#1B2A4A] text-white rounded-3xl p-6 sm:p-10 shadow-xl border border-[#D4AF37]/40 relative overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-[#D4AF37]">
                School Guidelines
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight mt-1">
                Uniform Policy & Campus Timings
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 mt-3 leading-relaxed">
                Nayab Grammar School takes immense pride in student discipline, neatness, and punctual attendance.
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
              <h3 className="font-bold text-lg text-white flex items-center gap-2">
                <Clock className="w-5 h-5 text-[#D4AF37]" />
                <span>Daily Assembly & Timings</span>
              </h3>

              <div className="space-y-3 text-xs sm:text-sm">
                <div className="flex justify-between items-center py-2 border-b border-white/10">
                  <span className="text-slate-300">Gates Open:</span>
                  <span className="font-bold text-white">7:45 AM</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-white/10">
                  <span className="text-slate-300">Morning Assembly:</span>
                  <span className="font-bold text-[#D4AF37]">8:00 AM Sharp</span>
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
                  className="inline-flex items-center gap-2 text-xs font-bold text-[#111C32] bg-[#D4AF37] hover:bg-amber-400 px-4 py-2.5 rounded-xl transition shadow"
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
