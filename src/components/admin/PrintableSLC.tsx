"use client";

import Image from "next/image";
import Link from "next/link";
import { Printer, ArrowLeft, CheckCircle2, ExternalLink } from "lucide-react";
import { SchoolLeavingCertificateData } from "@/lib/types";

interface PrintableSLCProps {
  slc: SchoolLeavingCertificateData;
  onBack?: () => void;
}

export default function PrintableSLC({ slc, onBack }: PrintableSLCProps) {
  const handlePrint = () => {
    window.print();
  };

  const attendancePercentage =
    slc.totalWorkingDays > 0
      ? ((slc.daysAttended / slc.totalWorkingDays) * 100).toFixed(1)
      : "100.0";

  return (
    <div className="w-full max-w-4xl mx-auto my-2 print:my-0 print:p-0">
      {/* Action Toolbar (Hidden during print) */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4 no-print bg-white p-3.5 rounded-2xl border border-slate-200 shadow-sm">
        {onBack && (
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-[#1B2A4A] bg-slate-50 border border-slate-300 hover:bg-slate-100 px-3.5 py-2 rounded-xl transition cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to SLC Register</span>
          </button>
        )}

        <div className="flex flex-wrap items-center gap-2 ml-auto">
          <Link
            href={`/admin/slc/print?id=${encodeURIComponent(slc.id)}&autoprint=true`}
            target="_blank"
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-300 px-3.5 py-2 rounded-xl transition"
            title="Open in a standalone clean browser tab without any sidebar"
          >
            <ExternalLink className="w-3.5 h-3.5 text-blue-600" />
            <span>Open in New Tab</span>
          </Link>

          <button
            onClick={handlePrint}
            className="flex items-center gap-2 text-xs sm:text-sm font-bold text-white bg-[#0D1B3D] hover:bg-[#1E3A8A] px-5 py-2 rounded-xl shadow-md transition hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
          >
            <Printer className="w-4 h-4 text-[#D4AF37]" />
            <span>Print Official Certificate (A4)</span>
          </button>
        </div>
      </div>

      {/* Formal Printable School Leaving Certificate Sheet (Exact 1-Page A4) */}
      <div className="printable-card bg-white rounded-xl shadow-lg border-2 border-[#0D1B3D] p-5 sm:p-6 print:p-0 relative overflow-hidden text-slate-800">
        {/* Subtle Watermark in background */}
        <div className="absolute inset-0 flex items-center justify-center opacity-[0.035] pointer-events-none select-none">
          <Image
            src="/images/school-logo.png"
            alt="School Emblem Watermark"
            width={400}
            height={400}
            className="object-contain"
          />
        </div>

        {/* TOP SECTION: Institutional Header */}
        <div className="relative z-10 space-y-2 print:space-y-1.5">
          {/* Header Row */}
          <div className="flex items-center justify-between gap-3 border-b-2 border-[#0D1B3D] pb-2 print:pb-1.5">
            <div className="w-14 h-14 sm:w-16 sm:h-16 print:w-12 print:h-12 shrink-0 p-0.5 rounded-full border-2 border-[#D4AF37] bg-white flex items-center justify-center shadow-xs">
              <Image
                src="/images/school-logo.png"
                alt="Nayab School Logo"
                width={60}
                height={60}
                className="w-full h-full object-contain"
                priority
              />
            </div>

            <div className="flex-1 text-center space-y-0.5">
              <p className="text-[9px] print:text-[7pt] font-bold uppercase tracking-wider text-slate-600">
                Recognized by Directorate of School Education Sindh • Affiliated with BISE
              </p>
              <h1 className="text-lg sm:text-xl print:text-[14pt] font-black text-[#0D1B3D] tracking-tight font-serif uppercase leading-tight">
                Nayab English Grammar High School
              </h1>
              <p className="text-[11px] print:text-[8pt] font-extrabold text-[#D4AF37] uppercase tracking-wide">
                Campus: Mirwah Gorchail, Sindh, Pakistan
              </p>
              <p className="text-[9px] print:text-[7pt] text-slate-500">
                SEMIS Code: 405030211 • Reg. No: NEGHS-MWH-4050 • Estd: 2012 • Contact: +92 300 1234567
              </p>
            </div>

            <div className="w-14 sm:w-16 print:w-12 shrink-0 text-right">
              <div className="inline-block border border-slate-300 rounded p-1 bg-slate-50/80 text-center">
                <span className="block text-[7.5px] print:text-[6pt] text-slate-500 font-bold uppercase">Form</span>
                <span className="block text-[9px] print:text-[7pt] font-mono font-black text-[#0D1B3D]">SLC-I</span>
              </div>
            </div>
          </div>

          {/* Certificate Title Badge */}
          <div className="text-center py-0.5">
            <div className="inline-block bg-[#0D1B3D] text-white px-5 py-1 print:py-0.5 rounded-md shadow-xs border border-[#D4AF37]">
              <h2 className="text-xs sm:text-sm print:text-[11pt] font-extrabold tracking-wider uppercase font-serif">
                School Leaving Certificate
              </h2>
            </div>
            <p className="text-[9.5px] print:text-[7pt] font-semibold text-slate-600 italic mt-0.5">
              (Transfer & Character Certificate — Issued under Education Code Regulations)
            </p>
          </div>

          {/* Serial Metadata Strip */}
          <div className="grid grid-cols-3 gap-2 bg-[#FCF9EE] border border-[#D4AF37]/50 rounded-lg px-3 py-1 text-xs print:text-[8pt]">
            <div className="flex items-center gap-1.5">
              <span className="text-slate-500 font-semibold">Certificate No:</span>
              <span className="font-mono font-bold text-[#0D1B3D]">{slc.certificateNumber}</span>
            </div>
            <div className="flex items-center justify-center gap-1.5">
              <span className="text-slate-500 font-semibold">G.R. No:</span>
              <span className="font-mono font-bold text-slate-900">{slc.grNumber || "N/A"}</span>
            </div>
            <div className="flex items-center justify-end gap-1.5">
              <span className="text-slate-500 font-semibold">Date of Issue:</span>
              <span className="font-bold text-slate-900">{slc.issueDate}</span>
            </div>
          </div>

          {/* Legal Certification Statement */}
          <p className="text-[10px] print:text-[7.5pt] text-slate-700 italic text-justify leading-tight px-0.5">
            Certified that the following particulars are in accordance with the official General Register (G.R.) and admission records of this institution:
          </p>
        </div>

        {/* MIDDLE SECTION: Structured Particulars Table (Government / BISE Format) */}
        <div className="relative z-10 my-2 print:my-1.5 flex-1">
          <table className="w-full border-collapse border border-slate-300 text-xs print:text-[8pt]">
            <tbody>
              {/* Row 1: Student Name & Father Name */}
              <tr className="border-b border-slate-200">
                <td className="w-1/2 py-1 px-2.5 print:py-1 print:px-2 border-r border-slate-300 bg-slate-50/50">
                  <span className="text-slate-600 font-semibold text-[11px] print:text-[7.5pt]">1. Pupil&apos;s Full Name: </span>
                  <span className="font-black text-slate-900 text-xs print:text-[8.5pt] uppercase">{slc.studentName}</span>
                </td>
                <td className="w-1/2 py-1 px-2.5 print:py-1 print:px-2 bg-slate-50/50">
                  <span className="text-slate-600 font-semibold text-[11px] print:text-[7.5pt]">2. Father&apos;s Name: </span>
                  <span className="font-black text-slate-900 text-xs print:text-[8.5pt] uppercase">{slc.fatherName}</span>
                </td>
              </tr>

              {/* Row 2: Caste/Surname & Nationality/Religion */}
              <tr className="border-b border-slate-200">
                <td className="py-1 px-2.5 print:py-1 print:px-2 border-r border-slate-300">
                  <span className="text-slate-600 font-semibold text-[11px] print:text-[7.5pt]">3. Caste / Surname: </span>
                  <span className="font-bold text-slate-800">{slc.casteOrSurname || "—"}</span>
                </td>
                <td className="py-1 px-2.5 print:py-1 print:px-2">
                  <span className="text-slate-600 font-semibold text-[11px] print:text-[7.5pt]">4. Nationality & Religion: </span>
                  <span className="font-bold text-slate-800">{slc.nationality || "Pakistani"} / {slc.religion || "Islam"}</span>
                </td>
              </tr>

              {/* Row 3: Date of Birth in Figures & Words */}
              <tr className="border-b border-slate-200">
                <td className="py-1 px-2.5 print:py-1 print:px-2 border-r border-slate-300">
                  <span className="text-slate-600 font-semibold text-[11px] print:text-[7.5pt]">5. Date of Birth (Figures): </span>
                  <span className="font-mono font-bold text-slate-900">{slc.dateOfBirth || "As per Admission Register"}</span>
                </td>
                <td className="py-1 px-2.5 print:py-1 print:px-2">
                  <span className="text-slate-600 font-semibold text-[11px] print:text-[7.5pt]">6. Date of Birth (in Words): </span>
                  <span className="font-medium text-slate-800 italic">{slc.dateOfBirthInWords || "As recorded in General Register"}</span>
                </td>
              </tr>

              {/* Row 4: Admission Date & Class */}
              <tr className="border-b border-slate-200">
                <td className="py-1 px-2.5 print:py-1 print:px-2 border-r border-slate-300">
                  <span className="text-slate-600 font-semibold text-[11px] print:text-[7.5pt]">7. Date of Admission & Class: </span>
                  <span className="font-semibold text-slate-800">{slc.admissionDate || "As per G.R."} in {slc.admissionClass || "Class 1"}</span>
                </td>
                <td className="py-1 px-2.5 print:py-1 print:px-2">
                  <span className="text-slate-600 font-semibold text-[11px] print:text-[7.5pt]">8. Date of Leaving School: </span>
                  <span className="font-bold text-[#0D1B3D]">{slc.leavingDate}</span>
                </td>
              </tr>

              {/* Row 5: Leaving Class & Medium */}
              <tr className="border-b border-slate-200 bg-[#FCF9EE]/40">
                <td className="py-1 px-2.5 print:py-1 print:px-2 border-r border-slate-300">
                  <span className="text-slate-600 font-semibold text-[11px] print:text-[7.5pt]">9. Class Reading at Leaving: </span>
                  <span className="font-black text-[#0D1B3D] text-[12px] print:text-[8.5pt]">
                    {slc.leavingClass} {slc.leavingClassInWords ? `(${slc.leavingClassInWords})` : ""}
                  </span>
                </td>
                <td className="py-1 px-2.5 print:py-1 print:px-2">
                  <span className="text-slate-600 font-semibold text-[11px] print:text-[7.5pt]">10. Medium of Instruction: </span>
                  <span className="font-semibold text-slate-800">English / Sindhi / Urdu</span>
                </td>
              </tr>

              {/* Row 6: Subjects Studied */}
              <tr className="border-b border-slate-200">
                <td colSpan={2} className="py-1 px-2.5 print:py-1 print:px-2">
                  <span className="text-slate-600 font-semibold text-[11px] print:text-[7.5pt]">11. Subjects Studied: </span>
                  <span className="font-medium text-slate-800 text-[11px] print:text-[7.5pt]">
                    {slc.subjectsStudied || "English, Mathematics, General Science, Urdu, Islamiyat, Sindhi, Computer Science, Pakistan Studies"}
                  </span>
                </td>
              </tr>

              {/* Row 7: Last Exam & Promotion */}
              <tr className="border-b border-slate-200">
                <td className="py-1 px-2.5 print:py-1 print:px-2 border-r border-slate-300">
                  <span className="text-slate-600 font-semibold text-[11px] print:text-[7.5pt]">12. Last Examination Result: </span>
                  <span className="font-bold text-emerald-800">{slc.lastExamResult || "Passed Annual Examination"}</span>
                </td>
                <td className="py-1 px-2.5 print:py-1 print:px-2">
                  <span className="text-slate-600 font-semibold text-[11px] print:text-[7.5pt]">13. Qualified for Promotion: </span>
                  <span className="font-bold text-slate-900">{slc.qualifiedForPromotion || "Yes, Promoted to next higher class"}</span>
                </td>
              </tr>

              {/* Row 8: Dues & Concession */}
              <tr className="border-b border-slate-200">
                <td className="py-1 px-2.5 print:py-1 print:px-2 border-r border-slate-300">
                  <span className="text-slate-600 font-semibold text-[11px] print:text-[7.5pt]">14. School Dues Paid Up To: </span>
                  <span className="font-semibold text-slate-800">{slc.duesClearedMonth || "All School Dues Cleared"}</span>
                </td>
                <td className="py-1 px-2.5 print:py-1 print:px-2">
                  <span className="text-slate-600 font-semibold text-[11px] print:text-[7.5pt]">15. Fee Concession Availed: </span>
                  <span className="font-medium text-slate-800">{slc.feeConcession || "None"}</span>
                </td>
              </tr>

              {/* Row 9: Attendance & Conduct */}
              <tr className="border-b border-slate-200">
                <td className="py-1 px-2.5 print:py-1 print:px-2 border-r border-slate-300">
                  <span className="text-slate-600 font-semibold text-[11px] print:text-[7.5pt]">16. Attendance Record: </span>
                  <span className="font-semibold text-slate-800">
                    {slc.daysAttended} / {slc.totalWorkingDays} Days ({attendancePercentage}%)
                  </span>
                </td>
                <td className="py-1 px-2.5 print:py-1 print:px-2">
                  <span className="text-slate-600 font-semibold text-[11px] print:text-[7.5pt]">17. Conduct & Character: </span>
                  <span className="font-bold text-emerald-700">{slc.generalConduct || "Good & Moral Character"}</span>
                </td>
              </tr>

              {/* Row 10: Reason for Leaving */}
              <tr className="border-b border-slate-200 bg-slate-50/30">
                <td colSpan={2} className="py-1 px-2.5 print:py-1 print:px-2">
                  <span className="text-slate-600 font-semibold text-[11px] print:text-[7.5pt]">18. Reason for Leaving the School: </span>
                  <span className="font-bold text-[#0D1B3D]">
                    {slc.leavingReason}
                  </span>
                </td>
              </tr>

              {/* Row 11: General Remarks */}
              <tr>
                <td colSpan={2} className="py-1 px-2.5 print:py-1 print:px-2">
                  <span className="text-slate-600 font-semibold text-[11px] print:text-[7.5pt]">19. General Remarks: </span>
                  <span className="font-medium text-slate-700 italic text-[11px] print:text-[7.5pt]">
                    {slc.remarks || "A well-disciplined, obedient and sincere pupil. We wish him/her the best of success in all future academic pursuits."}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* BOTTOM SECTION: Four Signatures & Official Stamp (Guaranteed to fit) */}
        <div className="relative z-10 pt-3 print:pt-2 border-t-2 border-[#0D1B3D] space-y-2 print:space-y-1 break-inside-avoid">
          <div className="grid grid-cols-4 gap-3 text-center text-xs print:text-[7pt]">
            {/* Signature 1 */}
            <div className="space-y-0.5">
              <div className="h-6 print:h-5"></div>
              <div className="border-t-2 border-slate-700 w-5/6 mx-auto pt-1 font-bold text-slate-800">
                {slc.preparedBy || "Admin Clerk"}
              </div>
              <p className="text-[9.5px] print:text-[6.5pt] text-slate-400">Prepared by</p>
            </div>

            {/* Signature 2 */}
            <div className="space-y-0.5">
              <div className="h-6 print:h-5"></div>
              <div className="border-t-2 border-slate-700 w-5/6 mx-auto pt-1 font-bold text-slate-800">
                {slc.checkedBy || "Academic Incharge"}
              </div>
              <p className="text-[9.5px] print:text-[6.5pt] text-slate-400">Checked by</p>
            </div>

            {/* Stamp Box */}
            <div className="space-y-0.5 flex flex-col items-center justify-center">
              <div className="w-16 h-10 print:w-14 print:h-8 border-2 border-dashed border-slate-400 rounded flex items-center justify-center bg-slate-50">
                <span className="text-[8px] print:text-[6pt] text-slate-500 font-serif italic text-center px-1 leading-tight">
                  Official Seal
                </span>
              </div>
              <p className="text-[9px] print:text-[6pt] text-slate-400">School Stamp</p>
            </div>

            {/* Signature 4 */}
            <div className="space-y-0.5">
              <div className="h-6 print:h-5"></div>
              <div className="border-t-2 border-[#0D1B3D] w-5/6 mx-auto pt-1 font-black text-[#0D1B3D]">
                {slc.headmasterName || "Principal / Headmaster"}
              </div>
              <p className="text-[9.5px] print:text-[6.5pt] text-slate-500 font-semibold">Head of Institution</p>
            </div>
          </div>

          {/* Footer Warning / Verification Note */}
          <div className="flex items-center justify-between text-[8.5px] print:text-[6.5pt] text-slate-500 pt-1 border-t border-slate-200">
            <span>Note: This certificate is issued without any alteration or erasure. Any tampering renders it invalid.</span>
            <span className="font-mono text-slate-400">Doc Verification: SLC-{slc.id.slice(0, 8).toUpperCase()}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
