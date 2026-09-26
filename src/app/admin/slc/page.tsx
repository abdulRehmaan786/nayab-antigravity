"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  GraduationCap,
  FileCheck,
  Search,
  Plus,
  Printer,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  Clock,
  ShieldCheck,
  X,
  FileText,
  UserCheck,
  UserX,
  Building,
  Calendar,
  ExternalLink,
} from "lucide-react";
import PrintableSLC from "@/components/admin/PrintableSLC";
import { SchoolLeavingCertificateData, StudentData } from "@/lib/types";

interface SLCStats {
  totalCertificates: number;
  totalActive: number;
  totalLeft: number;
  issuedThisYear: number;
  nextCertificateNumber: string;
}

export default function AdminSLCPage() {
  const [activeTab, setActiveTab] = useState<"certificates" | "leftStudents">("certificates");
  const [certificates, setCertificates] = useState<SchoolLeavingCertificateData[]>([]);
  const [leftStudents, setLeftStudents] = useState<StudentData[]>([]);
  const [activeStudents, setActiveStudents] = useState<StudentData[]>([]);
  const [stats, setStats] = useState<SLCStats>({
    totalCertificates: 0,
    totalActive: 0,
    totalLeft: 0,
    issuedThisYear: 0,
    nextCertificateNumber: "SLC-2025-001",
  });
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  // Print Mode State
  const [selectedForPrint, setSelectedForPrint] = useState<SchoolLeavingCertificateData | null>(null);

  // Issue SLC Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [modalError, setModalError] = useState<string | null>(null);

  // Form State
  const [selectedStudentId, setSelectedStudentId] = useState("");
  const [studentSearch, setStudentSearch] = useState("");
  const [formData, setFormData] = useState({
    certificateNumber: "",
    grNumber: "",
    studentName: "",
    fatherName: "",
    casteOrSurname: "",
    nationality: "Pakistani",
    religion: "Islam",
    dateOfBirth: "",
    dateOfBirthInWords: "",
    admissionDate: "",
    admissionClass: "Class 1",
    leavingDate: new Date().toISOString().split("T")[0],
    leavingClass: "",
    leavingClassInWords: "",
    subjectsStudied: "English, Mathematics, General Science, Urdu, Islamiyat, Sindhi, Computer Science, Pakistan Studies",
    lastExamResult: "Passed Annual Examination with Grade A",
    qualifiedForPromotion: "Yes, Promoted to next higher class",
    duesClearedMonth: "September 2025 (All school dues fully cleared)",
    feeConcession: "None",
    totalWorkingDays: 210,
    daysAttended: 198,
    generalConduct: "Good & Moral Character",
    leavingReason: "Parent's Transfer / Relocation",
    remarks: "A sincere, polite, and hardworking student. We wish him/her the best of success in all future academic pursuits.",
    issueDate: new Date().toISOString().split("T")[0],
    preparedBy: "Admin Office",
    checkedBy: "Academic Incharge",
    headmasterName: "Principal / Headmaster",
  });

  // Revert Dialog
  const [revertingId, setRevertingId] = useState<string | null>(null);
  const [reverting, setReverting] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      // 1. Fetch certificates and stats
      const slcRes = await fetch("/api/slc");
      const slcData = await slcRes.json();
      if (slcData.ok) {
        setCertificates(slcData.certificates || []);
        if (slcData.stats) {
          setStats(slcData.stats);
          setFormData((prev) => ({
            ...prev,
            certificateNumber: slcData.stats.nextCertificateNumber,
          }));
        }
      }

      // 2. Fetch Active Students (for dropdown/picker)
      const activeRes = await fetch("/api/students?status=ACTIVE");
      const activeData = await activeRes.json();
      if (activeData.ok && activeData.students) {
        setActiveStudents(activeData.students);
      }

      // 3. Fetch Left Students (for Archive tab)
      const leftRes = await fetch("/api/students?status=LEFT");
      const leftData = await leftRes.json();
      if (leftData.ok && leftData.students) {
        setLeftStudents(leftData.students);
      }
    } catch (err) {
      console.error("Error loading SLC data:", err);
    } finally {
      setLoading(false);
    }
  };

  // Handle student selection from dropdown
  const handleStudentSelect = (studentId: string) => {
    setSelectedStudentId(studentId);
    const st = activeStudents.find((s) => s.id === studentId);
    if (st) {
      // Convert class name to words e.g. "Class 9" -> "Ninth"
      let inWords = "";
      if (st.className.includes("10")) inWords = "Tenth";
      else if (st.className.includes("9")) inWords = "Ninth";
      else if (st.className.includes("8")) inWords = "Eighth";
      else if (st.className.includes("7")) inWords = "Seventh";
      else if (st.className.includes("6")) inWords = "Sixth";
      else if (st.className.includes("5")) inWords = "Fifth";
      else if (st.className.includes("4")) inWords = "Fourth";
      else if (st.className.includes("3")) inWords = "Third";
      else if (st.className.includes("2")) inWords = "Second";
      else if (st.className.includes("1")) inWords = "First";

      setFormData((prev) => ({
        ...prev,
        grNumber: st.grNumber || "",
        studentName: st.name,
        fatherName: st.fatherName,
        dateOfBirth: st.dateOfBirth || "",
        leavingClass: st.className,
        leavingClassInWords: inWords,
      }));
    }
  };

  const handleIssueSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStudentId) {
      setModalError("Please select an active student.");
      return;
    }
    if (!formData.studentName.trim() || !formData.fatherName.trim() || !formData.leavingClass.trim()) {
      setModalError("Student Name, Father Name, and Leaving Class are required.");
      return;
    }

    setSubmitting(true);
    setModalError(null);

    try {
      const res = await fetch("/api/slc", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          studentId: selectedStudentId,
          ...formData,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.ok) {
        throw new Error(data.error || "Failed to issue certificate");
      }

      setIsModalOpen(false);
      await loadData();

      // Automatically open the issued certificate for instant printing
      if (data.certificate) {
        setSelectedForPrint(data.certificate);
      }
    } catch (err: any) {
      setModalError(err.message || "An unexpected error occurred.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleRevert = async (certId: string) => {
    if (!confirm("Are you sure you want to revoke this certificate and restore the student back to ACTIVE status?")) {
      return;
    }

    setReverting(true);
    try {
      const res = await fetch(`/api/slc?id=${encodeURIComponent(certId)}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (!res.ok || !data.ok) {
        throw new Error(data.error || "Failed to revoke certificate");
      }
      setRevertingId(null);
      await loadData();
    } catch (err: any) {
      alert(err.message || "Error revoking certificate");
    } finally {
      setReverting(false);
    }
  };

  // If in Print Mode, render the full A4 printable document
  if (selectedForPrint) {
    return (
      <div className="min-h-screen bg-slate-100 py-6 px-4 print:p-0 print:bg-white">
        <PrintableSLC slc={selectedForPrint} onBack={() => setSelectedForPrint(null)} />
      </div>
    );
  }

  // Filtered Certificates
  const filteredCertificates = certificates.filter((c) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      c.certificateNumber.toLowerCase().includes(q) ||
      c.studentName.toLowerCase().includes(q) ||
      c.fatherName.toLowerCase().includes(q) ||
      (c.grNumber && c.grNumber.toLowerCase().includes(q)) ||
      c.leavingClass.toLowerCase().includes(q) ||
      c.leavingReason.toLowerCase().includes(q)
    );
  });

  // Filtered Left Students
  const filteredLeftStudents = leftStudents.filter((s) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      s.name.toLowerCase().includes(q) ||
      s.fatherName.toLowerCase().includes(q) ||
      s.rollNumber.toLowerCase().includes(q) ||
      (s.grNumber && s.grNumber.toLowerCase().includes(q)) ||
      s.className.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2.5">
            <GraduationCap className="w-7 h-7 text-[#D4AF37]" />
            <span>School Leaving Certificates (SLC)</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Official Transfer Certificates & Permanent Archive. Left student records, past marks, and fees are permanently preserved.
          </p>
        </div>

        <button
          onClick={() => {
            setSelectedStudentId("");
            setStudentSearch("");
            setModalError(null);
            setIsModalOpen(true);
          }}
          className="inline-flex items-center gap-2 bg-[#0D1B3D] hover:bg-[#1E3A8A] text-white px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold shadow-md transition hover:scale-[1.02] cursor-pointer"
        >
          <Plus className="w-4 h-4 text-[#D4AF37]" />
          <span>Issue New Leaving Certificate</span>
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-xs font-semibold">Total SLCs Issued</span>
            <FileCheck className="w-4 h-4 text-[#0D1B3D]" />
          </div>
          <p className="text-2xl font-black text-slate-900">{stats.totalCertificates}</p>
          <p className="text-[11px] text-emerald-600 font-medium mt-1">Official Board Register</p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-xs font-semibold">Left Students Archived</span>
            <UserX className="w-4 h-4 text-amber-600" />
          </div>
          <p className="text-2xl font-black text-amber-700">{stats.totalLeft}</p>
          <p className="text-[11px] text-slate-500 font-medium mt-1">Data 100% Preserved</p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-xs font-semibold">Active Enrolled</span>
            <UserCheck className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-2xl font-black text-emerald-700">{stats.totalActive}</p>
          <p className="text-[11px] text-slate-500 font-medium mt-1">Currently Attending</p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-xs font-semibold">Issued This Year</span>
            <Calendar className="w-4 h-4 text-blue-600" />
          </div>
          <p className="text-2xl font-black text-[#0D1B3D]">{stats.issuedThisYear}</p>
          <p className="text-[11px] text-blue-600 font-medium mt-1">Current Academic Year</p>
        </div>
      </div>

      {/* Tabs & Search Bar */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-4 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          {/* Tabs */}
          <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-xl">
            <button
              onClick={() => setActiveTab("certificates")}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                activeTab === "certificates"
                  ? "bg-white text-[#0D1B3D] shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <FileCheck className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>Issued Certificates ({certificates.length})</span>
            </button>
            <button
              onClick={() => setActiveTab("leftStudents")}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                activeTab === "leftStudents"
                  ? "bg-white text-[#0D1B3D] shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <UserX className="w-3.5 h-3.5 text-amber-600" />
              <span>Left Students Archive ({leftStudents.length})</span>
            </button>
          </div>

          {/* Search Box */}
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search by name, GR, cert #..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#1E3A8A]"
            />
          </div>
        </div>

        {/* Tab 1: Issued Certificates Table */}
        {activeTab === "certificates" && (
          <div>
            {loading ? (
              <div className="py-12 text-center text-xs text-slate-400">Loading certificate records...</div>
            ) : filteredCertificates.length === 0 ? (
              <div className="py-12 text-center text-slate-500 space-y-2">
                <FileCheck className="w-10 h-10 text-slate-300 mx-auto" />
                <p className="text-sm font-semibold text-slate-700">No School Leaving Certificates Found</p>
                <p className="text-xs text-slate-400">
                  {searchQuery ? "No certificates matched your search." : "Click 'Issue New Leaving Certificate' to issue one."}
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-50 text-slate-600 border-b border-slate-200">
                      <th className="p-3 font-bold">Cert. Number</th>
                      <th className="p-3 font-bold">Student Particulars</th>
                      <th className="p-3 font-bold">Leaving Class</th>
                      <th className="p-3 font-bold">Leaving Date</th>
                      <th className="p-3 font-bold">Reason for Leaving</th>
                      <th className="p-3 font-bold">Conduct</th>
                      <th className="p-3 font-bold text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredCertificates.map((c, idx) => (
                      <tr key={c.id} className={idx % 2 === 0 ? "bg-white hover:bg-slate-50/50" : "bg-slate-50/30 hover:bg-slate-50/70"}>
                        <td className="p-3">
                          <span className="font-mono font-bold text-[#0D1B3D] text-[11px] block">
                            {c.certificateNumber}
                          </span>
                          <span className="text-[10px] text-slate-500 font-mono">
                            G.R: {c.grNumber || "N/A"}
                          </span>
                        </td>
                        <td className="p-3">
                          <p className="font-bold text-slate-900 text-xs">{c.studentName}</p>
                          <p className="text-[11px] text-slate-500">S/O {c.fatherName}</p>
                        </td>
                        <td className="p-3">
                          <span className="inline-block px-2 py-0.5 rounded bg-blue-50 text-blue-800 font-semibold text-[11px] border border-blue-200">
                            {c.leavingClass}
                          </span>
                        </td>
                        <td className="p-3 font-medium text-slate-700">
                          {c.leavingDate}
                          <span className="block text-[10px] text-slate-400">Issued: {c.issueDate}</span>
                        </td>
                        <td className="p-3 max-w-[200px]">
                          <span className="line-clamp-2 text-slate-700 text-[11px]">
                            {c.leavingReason}
                          </span>
                        </td>
                        <td className="p-3">
                          <span className="inline-flex items-center gap-1 text-emerald-700 font-bold text-[11px]">
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                            {c.generalConduct}
                          </span>
                        </td>
                        <td className="p-3 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => setSelectedForPrint(c)}
                              className="inline-flex items-center gap-1 bg-[#0D1B3D] hover:bg-[#1E3A8A] text-white px-2.5 py-1.5 rounded-lg font-bold text-[11px] shadow-xs transition cursor-pointer"
                              title="Print Official A4 Certificate"
                            >
                              <Printer className="w-3.5 h-3.5 text-[#D4AF37]" />
                              <span>Print SLC</span>
                            </button>
                            <button
                              onClick={() => handleRevert(c.id)}
                              disabled={reverting}
                              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition border border-transparent hover:border-rose-200 cursor-pointer"
                              title="Revoke Certificate & Re-admit Student"
                            >
                              <RotateCcw className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Left Students Archive */}
        {activeTab === "leftStudents" && (
          <div>
            <div className="bg-amber-50/70 border border-amber-200/80 rounded-xl p-3 text-xs text-amber-900 mb-4 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-amber-700 shrink-0" />
              <span>
                <strong>Permanent School Archive:</strong> All historical data for these students — including examination marksheets, fee receipts, and daily attendance logs — is preserved safely in the database and never removed.
              </span>
            </div>

            {loading ? (
              <div className="py-12 text-center text-xs text-slate-400">Loading left students...</div>
            ) : filteredLeftStudents.length === 0 ? (
              <div className="py-12 text-center text-slate-500 space-y-2">
                <UserCheck className="w-10 h-10 text-slate-300 mx-auto" />
                <p className="text-sm font-semibold text-slate-700">No Left Students Found</p>
                <p className="text-xs text-slate-400">Currently, all enrolled students are in active standing.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-50 text-slate-600 border-b border-slate-200">
                      <th className="p-3 font-bold">G.R. & Roll #</th>
                      <th className="p-3 font-bold">Student Name & Father</th>
                      <th className="p-3 font-bold">Class at Leaving</th>
                      <th className="p-3 font-bold">Status Badge</th>
                      <th className="p-3 font-bold">Contact Phone</th>
                      <th className="p-3 font-bold text-right">Academic Records</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredLeftStudents.map((s, idx) => (
                      <tr key={s.id} className={idx % 2 === 0 ? "bg-white" : "bg-slate-50/30"}>
                        <td className="p-3">
                          <span className="font-mono font-bold text-[#0D1B3D] text-[11px] block">
                            {s.grNumber || "N/A"}
                          </span>
                          <span className="text-[10px] text-slate-400 font-mono">
                            Roll #{s.rollNumber}
                          </span>
                        </td>
                        <td className="p-3">
                          <p className="font-bold text-slate-900 text-xs">{s.name}</p>
                          <p className="text-[11px] text-slate-500">S/O {s.fatherName}</p>
                        </td>
                        <td className="p-3">
                          <span className="font-semibold text-slate-800">{s.className}</span>
                        </td>
                        <td className="p-3">
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-300">
                            <UserX className="w-3 h-3" /> LEFT / SLC ISSUED
                          </span>
                        </td>
                        <td className="p-3 text-slate-600">{s.phone || "—"}</td>
                        <td className="p-3 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Link
                              href={`/results?class=${encodeURIComponent(s.className)}&roll=${encodeURIComponent(s.rollNumber)}`}
                              target="_blank"
                              className="inline-flex items-center gap-1 bg-slate-100 hover:bg-slate-200 text-slate-800 px-2 py-1 rounded text-[11px] font-semibold border border-slate-300 transition"
                            >
                              <FileText className="w-3 h-3 text-blue-600" />
                              <span>View Marksheet</span>
                            </Link>

                            {s.slc && (
                              <button
                                onClick={() => setSelectedForPrint(s.slc!)}
                                className="inline-flex items-center gap-1 bg-[#0D1B3D] hover:bg-[#1E3A8A] text-white px-2 py-1 rounded text-[11px] font-bold transition shadow-xs cursor-pointer"
                              >
                                <Printer className="w-3 h-3 text-[#D4AF37]" />
                                <span>Print SLC</span>
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>

      {/* ISSUE SLC MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-2xl w-full max-h-[92vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="p-4 sm:p-5 border-b border-slate-200 bg-[#0D1B3D] text-white flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center border border-[#D4AF37]">
                  <GraduationCap className="w-5 h-5 text-[#D4AF37]" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-white">
                    Issue School Leaving Certificate
                  </h3>
                  <p className="text-[11px] text-slate-300">
                    Generates official A4 Certificate and archives student record as LEFT.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-white/10 transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleIssueSubmit} className="p-5 overflow-y-auto space-y-4 flex-1 text-xs">
              {modalError && (
                <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 flex items-center gap-2 text-xs">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{modalError}</span>
                </div>
              )}

              {/* Data Safety Notice */}
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 text-blue-900 flex items-start gap-2.5 text-[11px]">
                <ShieldCheck className="w-4 h-4 text-blue-700 shrink-0 mt-0.5" />
                <div>
                  <strong>Data Preservation Guarantee:</strong> Issuing this certificate will update the student status to <code>LEFT</code>. Their exam results, fee payments, and attendance will <strong>never be deleted</strong> and will stay permanently archived.
                </div>
              </div>

              {/* Step 1: Select Student */}
              <div className="space-y-1.5 bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                <label className="block font-bold text-slate-800">
                  1. Select Active Student <span className="text-rose-500">*</span>
                </label>
                <select
                  value={selectedStudentId}
                  onChange={(e) => handleStudentSelect(e.target.value)}
                  className="w-full p-2.5 bg-white border border-slate-300 rounded-xl font-medium text-xs focus:outline-none focus:ring-2 focus:ring-[#1E3A8A]"
                  required
                >
                  <option value="">-- Choose an active enrolled student --</option>
                  {activeStudents.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name} (S/O {s.fatherName}) — {s.className} [Roll #{s.rollNumber} {s.grNumber ? `| GR: ${s.grNumber}` : ""}]
                    </option>
                  ))}
                </select>
              </div>

              {/* Step 2: Certificate Metadata */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">
                    Certificate No. <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.certificateNumber}
                    onChange={(e) => setFormData({ ...formData, certificateNumber: e.target.value })}
                    className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg font-mono font-bold text-xs"
                    required
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">General Register (G.R.) No.</label>
                  <input
                    type="text"
                    value={formData.grNumber}
                    onChange={(e) => setFormData({ ...formData, grNumber: e.target.value })}
                    className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg font-mono font-bold text-xs"
                    placeholder="e.g. GR-1002"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Issue Date</label>
                  <input
                    type="date"
                    value={formData.issueDate}
                    onChange={(e) => setFormData({ ...formData, issueDate: e.target.value })}
                    className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg text-xs"
                    required
                  />
                </div>
              </div>

              {/* Step 3: Student Particulars */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">
                    Pupil&apos;s Full Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.studentName}
                    onChange={(e) => setFormData({ ...formData, studentName: e.target.value })}
                    className="w-full p-2 border border-slate-300 rounded-lg text-xs"
                    required
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">
                    Father&apos;s Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.fatherName}
                    onChange={(e) => setFormData({ ...formData, fatherName: e.target.value })}
                    className="w-full p-2 border border-slate-300 rounded-lg text-xs"
                    required
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Caste / Surname</label>
                  <input
                    type="text"
                    value={formData.casteOrSurname}
                    onChange={(e) => setFormData({ ...formData, casteOrSurname: e.target.value })}
                    className="w-full p-2 border border-slate-300 rounded-lg text-xs"
                    placeholder="e.g. Memon, Syed, Rajput, Baloch"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Date of Birth (in Figures)</label>
                  <input
                    type="date"
                    value={formData.dateOfBirth}
                    onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                    className="w-full p-2 border border-slate-300 rounded-lg text-xs"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-slate-700 font-semibold mb-1">Date of Birth (in Words)</label>
                  <input
                    type="text"
                    value={formData.dateOfBirthInWords}
                    onChange={(e) => setFormData({ ...formData, dateOfBirthInWords: e.target.value })}
                    className="w-full p-2 border border-slate-300 rounded-lg text-xs"
                    placeholder="e.g. Fifteenth April Two Thousand Ten"
                  />
                </div>
              </div>

              {/* Step 4: Academic & Leaving Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-slate-200">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Date of Leaving School</label>
                  <input
                    type="date"
                    value={formData.leavingDate}
                    onChange={(e) => setFormData({ ...formData, leavingDate: e.target.value })}
                    className="w-full p-2 border border-slate-300 rounded-lg text-xs"
                    required
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">
                    Class Reading at Leaving <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.leavingClass}
                    onChange={(e) => setFormData({ ...formData, leavingClass: e.target.value })}
                    className="w-full p-2 border border-slate-300 rounded-lg text-xs"
                    placeholder="e.g. Class 9"
                    required
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-slate-700 font-semibold mb-1">
                    Reason for Leaving School <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.leavingReason}
                    onChange={(e) => setFormData({ ...formData, leavingReason: e.target.value })}
                    className="w-full p-2 border border-slate-300 rounded-lg text-xs"
                    placeholder="e.g. Parent's Transfer / Relocation, Further Studies in College"
                    required
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Last Exam Result</label>
                  <input
                    type="text"
                    value={formData.lastExamResult}
                    onChange={(e) => setFormData({ ...formData, lastExamResult: e.target.value })}
                    className="w-full p-2 border border-slate-300 rounded-lg text-xs"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Promotion Status</label>
                  <input
                    type="text"
                    value={formData.qualifiedForPromotion}
                    onChange={(e) => setFormData({ ...formData, qualifiedForPromotion: e.target.value })}
                    className="w-full p-2 border border-slate-300 rounded-lg text-xs"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Fee Clearance Status</label>
                  <input
                    type="text"
                    value={formData.duesClearedMonth}
                    onChange={(e) => setFormData({ ...formData, duesClearedMonth: e.target.value })}
                    className="w-full p-2 border border-slate-300 rounded-lg text-xs"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">General Conduct & Character</label>
                  <input
                    type="text"
                    value={formData.generalConduct}
                    onChange={(e) => setFormData({ ...formData, generalConduct: e.target.value })}
                    className="w-full p-2 border border-slate-300 rounded-lg text-xs"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Days Attended / Total Days</label>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="number"
                      value={formData.daysAttended}
                      onChange={(e) => setFormData({ ...formData, daysAttended: Number(e.target.value) })}
                      className="w-full p-2 border border-slate-300 rounded-lg text-xs"
                      placeholder="Attended"
                    />
                    <input
                      type="number"
                      value={formData.totalWorkingDays}
                      onChange={(e) => setFormData({ ...formData, totalWorkingDays: Number(e.target.value) })}
                      className="w-full p-2 border border-slate-300 rounded-lg text-xs"
                      placeholder="Total"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Headmaster / Principal Name</label>
                  <input
                    type="text"
                    value={formData.headmasterName}
                    onChange={(e) => setFormData({ ...formData, headmasterName: e.target.value })}
                    className="w-full p-2 border border-slate-300 rounded-lg text-xs"
                  />
                </div>
              </div>

              {/* Step 5: Remarks */}
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Remarks</label>
                <textarea
                  value={formData.remarks}
                  onChange={(e) => setFormData({ ...formData, remarks: e.target.value })}
                  rows={2}
                  className="w-full p-2 border border-slate-300 rounded-lg text-xs"
                />
              </div>

              {/* Modal Footer */}
              <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-3 shrink-0">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-50 font-bold transition text-xs cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2.5 rounded-xl bg-[#0D1B3D] hover:bg-[#1E3A8A] text-white font-bold transition text-xs shadow-md flex items-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  <FileCheck className="w-4 h-4 text-[#D4AF37]" />
                  <span>{submitting ? "Issuing..." : "Confirm & Issue SLC"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
