"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Users, Plus, Search, Filter, Trash2, ExternalLink, X, Check, AlertCircle } from "lucide-react";
import { StudentData } from "@/lib/types";

const CLASSES = [
  "All Classes",
  "Class 10",
  "Class 9",
  "Class 8",
  "Class 7",
  "Class 6",
  "Class 5",
  "Class 4",
  "Class 3",
  "Class 2",
  "Class 1",
  "KG-2",
  "KG-1",
  "Nursery",
];

export default function AdminStudentsPage() {
  const [students, setStudents] = useState<StudentData[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedClass, setSelectedClass] = useState("All Classes");
  const [searchQuery, setSearchQuery] = useState("");

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [modalError, setModalError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    rollNumber: "",
    grNumber: "",
    name: "",
    fatherName: "",
    className: "Class 9",
    section: "A",
    gender: "Male",
    phone: "",
    address: "",
  });

  useEffect(() => {
    loadStudents();
  }, [selectedClass]);

  const loadStudents = async () => {
    setLoading(true);
    try {
      const cls = selectedClass === "All Classes" ? "all" : selectedClass;
      const res = await fetch(`/api/students?className=${encodeURIComponent(cls)}`);
      const data = await res.json();
      if (data && data.students) {
        setStudents(data.students);
      }
    } catch {
      console.error("Failed to load students");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setModalError(null);

    try {
      const res = await fetch("/api/students", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok || !data.ok) {
        setModalError(data.error || "Failed to create student record.");
      } else {
        setIsModalOpen(false);
        setFormData({
          rollNumber: "",
          grNumber: "",
          name: "",
          fatherName: "",
          className: "Class 9",
          section: "A",
          gender: "Male",
          phone: "",
          address: "",
        });
        loadStudents();
      }
    } catch {
      setModalError("Network error while creating student.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to remove student "${name}"? This will also remove their examination results and fee records.`)) {
      return;
    }

    try {
      const res = await fetch(`/api/students?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        setStudents((prev) => prev.filter((s) => s.id !== id));
      }
    } catch {
      alert("Failed to delete student.");
    }
  };

  const filtered = students.filter((s) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    const gr = (s as StudentData & { grNumber?: string }).grNumber || "";
    return s.name.toLowerCase().includes(q) || s.rollNumber.toLowerCase().includes(q) || s.fatherName.toLowerCase().includes(q) || gr.toLowerCase().includes(q);
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <Users className="w-6 h-6 text-[#1B2A4A]" />
            <span>Student Directory</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Manage student enrollments, bio records, and class allocations.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center gap-2 bg-[#1B2A4A] hover:bg-[#111C32] text-white px-4 py-2.5 rounded-xl text-xs font-bold shadow transition"
        >
          <Plus className="w-4 h-4 text-[#D4AF37]" />
          <span>Add New Student</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="w-4 h-4 text-slate-400 shrink-0" />
          <select
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
            className="bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#1B2A4A]"
          >
            {CLASSES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
          <span className="text-xs text-slate-400 ml-2">
            ({filtered.length} students)
          </span>
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name, roll no, GR no, father..."
            className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#1B2A4A]"
          />
        </div>
      </div>

      {/* Students Data Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-xs text-slate-500">
            Loading student records...
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center text-slate-500">
            <p className="font-bold text-slate-700 text-sm">No students found</p>
            <p className="text-xs text-slate-400 mt-1">
              Try adjusting your class filter or click &apos;Add New Student&apos;.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-[#1B2A4A] text-white">
                  <th className="p-3.5 font-bold">Roll #</th>
                  <th className="p-3.5 font-bold">G.R. No.</th>
                  <th className="p-3.5 font-bold">Student Name</th>
                  <th className="p-3.5 font-bold">Father&apos;s Name</th>
                  <th className="p-3.5 font-bold">Class & Sec</th>
                  <th className="p-3.5 font-bold">Gender</th>
                  <th className="p-3.5 font-bold">Contact Phone</th>
                  <th className="p-3.5 font-bold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((s, idx) => (
                  <tr key={s.id} className={idx % 2 === 0 ? "bg-white" : "bg-slate-50/50"}>
                    <td className="p-3.5 font-mono font-bold text-[#1B2A4A]">{s.rollNumber}</td>
                    <td className="p-3.5 font-mono text-slate-500 text-[11px]">{(s as StudentData & { grNumber?: string }).grNumber || "—"}</td>
                    <td className="p-3.5 font-bold text-slate-900">{s.name}</td>
                    <td className="p-3.5 text-slate-600">{s.fatherName}</td>
                    <td className="p-3.5">
                      <span className="bg-slate-100 border border-slate-200 text-slate-700 font-semibold px-2 py-0.5 rounded">
                        {s.className} - {s.section}
                      </span>
                    </td>
                    <td className="p-3.5 text-slate-600">{s.gender}</td>
                    <td className="p-3.5 text-slate-500 font-mono">{s.phone || "—"}</td>
                    <td className="p-3.5 text-right space-x-2">
                      <Link
                        href={`/results?class=${encodeURIComponent(s.className)}&roll=${encodeURIComponent(s.rollNumber)}`}
                        target="_blank"
                        className="inline-flex items-center gap-1 bg-[#FCF9EE] border border-[#D4AF37] text-[#1B2A4A] hover:bg-[#D4AF37] hover:text-[#111C32] px-2.5 py-1 rounded-lg text-[11px] font-bold transition"
                        title="View Official Report Card"
                      >
                        <ExternalLink className="w-3 h-3" />
                        <span>Card</span>
                      </Link>
                      <button
                        onClick={() => handleDelete(s.id, s.name)}
                        className="p-1 text-slate-400 hover:text-rose-600 transition"
                        title="Remove Student"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add Student Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-5">
              <h3 className="font-extrabold text-lg text-slate-900 flex items-center gap-2">
                <Users className="w-5 h-5 text-[#1B2A4A]" />
                <span>Register New Student</span>
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-700 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {modalError && (
              <div className="bg-rose-50 border border-rose-200 text-rose-700 p-3 rounded-xl text-xs flex items-center gap-2 mb-4">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{modalError}</span>
              </div>
            )}

            <form onSubmit={handleCreateStudent} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Class</label>
                  <select
                    value={formData.className}
                    onChange={(e) => setFormData({ ...formData, className: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 font-medium text-slate-900 focus:bg-white focus:ring-2 focus:ring-[#1B2A4A]"
                  >
                    {CLASSES.filter((c) => c !== "All Classes").map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Roll Number</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 107"
                    value={formData.rollNumber}
                    onChange={(e) => setFormData({ ...formData, rollNumber: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 font-medium text-slate-900 focus:bg-white focus:ring-2 focus:ring-[#1B2A4A]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">G.R. Number</label>
                  <input
                    type="text"
                    placeholder="e.g. GR-1015"
                    value={formData.grNumber}
                    onChange={(e) => setFormData({ ...formData, grNumber: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 font-medium text-slate-900 focus:bg-white focus:ring-2 focus:ring-[#1B2A4A]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Student Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Zain Ali"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 font-medium text-slate-900 focus:bg-white focus:ring-2 focus:ring-[#1B2A4A]"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Father&apos;s Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Muhammad Aslam"
                  value={formData.fatherName}
                  onChange={(e) => setFormData({ ...formData, fatherName: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 font-medium text-slate-900 focus:bg-white focus:ring-2 focus:ring-[#1B2A4A]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Section</label>
                  <input
                    type="text"
                    value={formData.section}
                    onChange={(e) => setFormData({ ...formData, section: e.target.value })}
                    placeholder="A or B"
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 font-medium text-slate-900 focus:bg-white focus:ring-2 focus:ring-[#1B2A4A]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Gender</label>
                  <select
                    value={formData.gender}
                    onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 font-medium text-slate-900 focus:bg-white focus:ring-2 focus:ring-[#1B2A4A]"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Parent Phone / Mobile</label>
                <input
                  type="text"
                  placeholder="+92 300 1234567"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 font-medium text-slate-900 focus:bg-white focus:ring-2 focus:ring-[#1B2A4A]"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Residential Address</label>
                <input
                  type="text"
                  placeholder="e.g. Main Bazaar, Mirwah"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 font-medium text-slate-900 focus:bg-white focus:ring-2 focus:ring-[#1B2A4A]"
                />
              </div>

              <div className="pt-3 flex items-center justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 font-bold hover:bg-slate-50 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2.5 rounded-xl bg-[#1B2A4A] text-white font-bold hover:bg-[#111C32] transition disabled:opacity-60"
                >
                  {saving ? "Saving..." : "Save Student"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
