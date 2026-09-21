import Link from "next/link";
import { BookOpen, CheckCircle, Award, Sparkles, Clock, FileText, ChevronRight } from "lucide-react";

export const metadata = {
  title: "Academics — Nayab Grammar School Mirwah",
  description: "Explore our academic curriculum, classes from Pre-school to Matriculation, and faculty standards.",
};

const PROGRAMS = [
  {
    title: "Pre-Primary (Nursery, KG-1, KG-2)",
    age: "Ages 3 to 5",
    desc: "Activity-based Montessori learning, phonics, number awareness, sensory play, and Urdu/English letter tracing.",
    subjects: ["English Phonics", "Urdu Qaidah", "Early Numeracy", "General Knowledge", "Art & Craft"],
  },
  {
    title: "Primary Wing (Class 1 to Class 5)",
    age: "Ages 6 to 10",
    desc: "Conceptual foundation in Mathematics, General Science, Social Studies, and bilingual literacy.",
    subjects: ["Mathematics", "General Science", "English Grammar", "Urdu Literature", "Islamiat", "Sindhi"],
  },
  {
    title: "Middle School (Class 6 to Class 8)",
    age: "Ages 11 to 13",
    desc: "Critical thinking, science experiments, Computer Science foundations, and English writing fluency.",
    subjects: ["Science (Physics/Chem/Bio intro)", "Mathematics", "Computer Studies", "English", "Urdu", "Islamiat", "Pakistan Studies"],
  },
  {
    title: "Secondary Matric Wing (Class 9 & Class 10)",
    age: "Ages 14 to 16",
    desc: "Comprehensive Sindh Board of Secondary Education (BISE) curriculum preparing students for medical and engineering entrance.",
    subjects: ["Biology / Computer Science", "Chemistry", "Physics", "Mathematics", "English", "Urdu / Sindhi Salees", "Pakistan Studies", "Islamiat"],
  },
];

export default function AcademicsPage() {
  return (
    <div className="min-h-screen bg-[#F2F4F7] pb-16">
      {/* Header */}
      <section className="bg-[#0D1B3D] text-white py-14 px-4 sm:px-6 lg:px-8 border-b-4 border-[#D4AF37]">
        <div className="max-w-5xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 border border-[#D4AF37]/40 px-3.5 py-1 rounded-full text-xs font-semibold text-[#D4AF37] mb-4">
            <span>Academic Curriculum</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight font-heading">
            Academic Excellence & Programs
          </h1>
          <p className="mt-3 text-slate-300 max-w-2xl mx-auto text-sm sm:text-base leading-relaxed">
            A balanced curriculum blending modern scientific knowledge, analytical rigor, and core Islamic values.
          </p>
        </div>
      </section>

      {/* Programs List */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 mt-10 space-y-6">
        {PROGRAMS.map((prog, idx) => (
          <div key={idx} className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
              <div>
                <h2 className="text-xl font-bold text-[#0D1B3D] font-heading">{prog.title}</h2>
                <span className="text-xs text-slate-500">{prog.age}</span>
              </div>
              <span className="bg-[#0D1B3D] text-[#D4AF37] text-xs font-bold px-3 py-1 rounded-full self-start sm:self-auto">
                Sindh Board Aligned
              </span>
            </div>

            <p className="text-sm text-slate-600 leading-relaxed">{prog.desc}</p>

            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-2">
                Core Subjects Taught:
              </span>
              <div className="flex flex-wrap gap-2">
                {prog.subjects.map((sub, sIdx) => (
                  <span
                    key={sIdx}
                    className="bg-[#F2F4F7] text-slate-800 border border-slate-200 px-3 py-1 rounded-lg text-xs font-medium"
                  >
                    {sub}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}

        {/* Quick Link to Results */}
        <div className="bg-[#0D1B3D] text-white rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-bold text-[#D4AF37] font-heading">Check Student Academic Performance</h3>
            <p className="text-xs sm:text-sm text-slate-300 mt-1">
              Verify weekly test marks directly from the public roll number search.
            </p>
          </div>
          <Link
            href="/results"
            className="bg-[#D4AF37] text-[#0D1B3D] font-bold px-5 py-2.5 rounded-xl text-sm shadow hover:bg-amber-400 transition shrink-0"
          >
            Check Results
          </Link>
        </div>
      </div>
    </div>
  );
}
