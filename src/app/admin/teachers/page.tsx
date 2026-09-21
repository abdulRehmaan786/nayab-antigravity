"use client";

import { useState, useEffect } from "react";
import { GraduationCap, Plus, BookOpen, Edit2, Trash2, X, Check, AlertCircle, ShieldCheck } from "lucide-react";
import { TeacherSubjectAssignment } from "@/lib/types";

interface TeacherItem {
  id: string;
  name: string;
  email: string;
  role: string;
  assignedClasses: string[];
  assignedSubjects: TeacherSubjectAssignment[];
  createdAt: string;
}

const AVAILABLE_CLASSES = ["Class 10", "Class 9", "Class 8", "Class 7", "Class 6", "Class 5", "Class 4", "Class 3", "Class 2", "Class 1"];
const AVAILABLE_SUBJECTS = [
  "General Science",
  "Physics",
  "Mathematics",
  "English",
  "Urdu",
  "Islamiyat",
  "Pakistan Studies",
  "Social Studies",
  "Computer Science",
];

export default function AdminTeachersPage() {
  const [teachers, setTeachers] = useState<TeacherItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Edit Assignment Modal State
  const [editingTeacher, setEditingTeacher] = useState<TeacherItem | null>(null);
  const [editClasses, setEditClasses] = useState<string[]>([]);
  const [editSubjects, setEditSubjects] = useState<TeacherSubjectAssignment[]>([]);
  const [savingEdit, setSavingEdit] = useState(false);
  const [editError, setEditError] = useState<string | null>(null);

  // Create Teacher Modal State
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [createName, setCreateName] = useState("");
  const [createEmail, setCreateEmail] = useState("");
  const [createPassword, setCreatePassword] = useState("");
  const [createClasses, setCreateClasses] = useState<string[]>(["Class 9"]);
  const [createSubjects, setCreateSubjects] = useState<TeacherSubjectAssignment[]>([
    { className: "Class 9", subject: "General Science" },
  ]);
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);

  useEffect(() => {
    loadTeachers();
  }, []);

  const loadTeachers = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/teachers");
      const data = await res.json();
      if (data && data.teachers) {
        setTeachers(data.teachers);
      }
    } catch {
      console.error("Failed to load teachers");
    } finally {
      setLoading(false);
    }
  };

  const openEditModal = (t: TeacherItem) => {
    setEditingTeacher(t);
    setEditClasses([...t.assignedClasses]);
    setEditSubjects([...t.assignedSubjects]);
    setEditError(null);
  };

  const handleToggleClass = (cls: string) => {
    if (editClasses.includes(cls)) {
      setEditClasses(editClasses.filter((c) => c !== cls));
      setEditSubjects(editSubjects.filter((s) => s.className !== cls));
    } else {
      setEditClasses([...editClasses, cls]);
    }
  };

  const handleAddSubjectToClass = (cls: string, sub: string) => {
    const exists = editSubjects.some(
      (s) => s.className.toLowerCase() === cls.toLowerCase() && s.subject.toLowerCase() === sub.toLowerCase()
    );
    if (!exists) {
      setEditSubjects([...editSubjects, { className: cls, subject: sub }]);
    }
  };

  const handleRemoveSubjectFromClass = (cls: string, sub: string) => {
    setEditSubjects(
      editSubjects.filter(
        (s) => !(s.className.toLowerCase() === cls.toLowerCase() && s.subject.toLowerCase() === sub.toLowerCase())
      )
    );
  };

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTeacher) return;

    setSavingEdit(true);
    setEditError(null);

    try {
      const res = await fetch("/api/teachers", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: editingTeacher.id,
          assignedClasses: editClasses,
          assignedSubjects: editSubjects,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.ok) {
        setEditError(data.error || "Failed to update assignments.");
      } else {
        setEditingTeacher(null);
        loadTeachers();
      }
    } catch {
      setEditError("Network error while saving.");
    } finally {
      setSavingEdit(false);
    }
  };

  const handleCreateTeacher = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreating(true);
    setCreateError(null);

    try {
      const res = await fetch("/api/teachers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: createName,
          email: createEmail,
          password: createPassword,
          assignedClasses: createClasses,
          assignedSubjects: createSubjects,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.ok) {
        setCreateError(data.error || "Failed to create teacher.");
      } else {
        setIsCreateOpen(false);
        setCreateName("");
        setCreateEmail("");
        setCreatePassword("");
        loadTeachers();
      }
    } catch {
      setCreateError("Network error while creating teacher.");
    } finally {
      setCreating(false);
    }
  };

  const handleDeleteTeacher = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to remove teacher account for "${name}"?`)) return;

    try {
      const res = await fetch(`/api/teachers?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        setTeachers((prev) => prev.filter((t) => t.id !== id));
      }
    } catch {
      alert("Failed to delete teacher");
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <GraduationCap className="w-6 h-6 text-[#1B2A4A]" />
            <span>Teacher Management & Subject Allocation</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Assign specific classes and subjects to teachers. Teachers can only enter marks for their assigned subjects.
          </p>
        </div>

        <button
          onClick={() => setIsCreateOpen(true)}
          className="inline-flex items-center gap-2 bg-[#1B2A4A] hover:bg-[#111C32] text-white px-4 py-2.5 rounded-xl text-xs font-bold shadow transition"
        >
          <Plus className="w-4 h-4 text-[#D4AF37]" />
          <span>Add New Teacher</span>
        </button>
      </div>

      {/* Teachers Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-16 text-center text-xs text-slate-500">Loading teacher profiles...</div>
        ) : teachers.length === 0 ? (
          <div className="p-16 text-center text-xs text-slate-500">No teachers registered yet.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-[#1B2A4A] text-white">
                  <th className="p-3.5 font-bold">Teacher Name</th>
                  <th className="p-3.5 font-bold">Email</th>
                  <th className="p-3.5 font-bold">Assigned Classes</th>
                  <th className="p-3.5 font-bold">Assigned Subjects (Restricted Access)</th>
                  <th className="p-3.5 font-bold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {teachers.map((t, idx) => (
                  <tr key={t.id} className={idx % 2 === 0 ? "bg-white" : "bg-slate-50/50"}>
                    <td className="p-3.5 font-bold text-slate-900">{t.name}</td>
                    <td className="p-3.5 font-mono text-slate-600">{t.email}</td>
                    <td className="p-3.5">
                      <div className="flex flex-wrap gap-1">
                        {t.assignedClasses.map((c) => (
                          <span
                            key={c}
                            className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-semibold border border-slate-200"
                          >
                            {c}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="p-3.5">
                      <div className="flex flex-wrap gap-1.5">
                        {t.assignedSubjects.length > 0 ? (
                          t.assignedSubjects.map((s, sIdx) => (
                            <span
                              key={sIdx}
                              className="inline-flex items-center gap-1 bg-[#FCF9EE] border border-[#D4AF37]/50 text-[#1B2A4A] px-2 py-0.5 rounded-md font-bold text-[11px]"
                            >
                              <BookOpen className="w-3 h-3 text-[#D4AF37]" />
                              <span>
                                {s.className}: {s.subject}
                              </span>
                            </span>
                          ))
                        ) : (
                          <span className="text-slate-400 italic">No subjects assigned</span>
                        )}
                      </div>
                    </td>
                    <td className="p-3.5 text-right space-x-2">
                      <button
                        onClick={() => openEditModal(t)}
                        className="inline-flex items-center gap-1 bg-slate-100 hover:bg-[#1B2A4A] hover:text-white px-2.5 py-1 rounded-lg text-[11px] font-bold transition"
                      >
                        <Edit2 className="w-3 h-3" />
                        <span>Assign Subjects</span>
                      </button>
                      <button
                        onClick={() => handleDeleteTeacher(t.id, t.name)}
                        className="p-1 text-slate-400 hover:text-rose-600 transition"
                        title="Remove Teacher"
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

      {/* Edit Subject Allocation Modal */}
      {editingTeacher && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-5">
              <div>
                <h3 className="font-extrabold text-lg text-slate-900 flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-[#1B2A4A]" />
                  <span>Assign Subjects & Classes</span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Instructor: <strong className="text-slate-800">{editingTeacher.name}</strong> ({editingTeacher.email})
                </p>
              </div>
              <button onClick={() => setEditingTeacher(null)} className="text-slate-400 hover:text-slate-700 p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            {editError && (
              <div className="bg-rose-50 border border-rose-200 text-rose-700 p-3 rounded-xl text-xs flex items-center gap-2 mb-4">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{editError}</span>
              </div>
            )}

            <form onSubmit={handleSaveEdit} className="space-y-5 text-xs">
              {/* Select Assigned Classes */}
              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider mb-2">
                  1. Select Assigned Classes
                </label>
                <div className="flex flex-wrap gap-2">
                  {AVAILABLE_CLASSES.map((cls) => {
                    const isSelected = editClasses.includes(cls);
                    return (
                      <button
                        key={cls}
                        type="button"
                        onClick={() => handleToggleClass(cls)}
                        className={`px-3 py-1.5 rounded-xl font-bold transition flex items-center gap-1.5 ${
                          isSelected
                            ? "bg-[#1B2A4A] text-white shadow-sm"
                            : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                        }`}
                      >
                        {isSelected && <Check className="w-3.5 h-3.5 text-[#D4AF37]" />}
                        <span>{cls}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Configure Subjects per Class */}
              <div className="border-t border-slate-100 pt-4">
                <label className="block font-bold text-slate-700 uppercase tracking-wider mb-3">
                  2. Allocate Specific Subjects (Teacher can only enter marks for these)
                </label>

                {editClasses.length === 0 ? (
                  <p className="text-slate-400 italic text-xs">Please select at least one class above.</p>
                ) : (
                  <div className="space-y-4">
                    {editClasses.map((cls) => {
                      const classSubjects = editSubjects.filter(
                        (s) => s.className.toLowerCase() === cls.toLowerCase()
                      );

                      return (
                        <div key={cls} className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-extrabold text-sm text-[#1B2A4A]">{cls}</h4>
                            <span className="text-[10px] text-slate-400">
                              {classSubjects.length} subject(s) allocated
                            </span>
                          </div>

                          {/* Active Subjects Pills */}
                          <div className="flex flex-wrap gap-1.5 mb-3">
                            {classSubjects.length > 0 ? (
                              classSubjects.map((s) => (
                                <span
                                  key={s.subject}
                                  className="inline-flex items-center gap-1 bg-white border border-[#D4AF37] text-[#1B2A4A] px-2.5 py-1 rounded-lg font-bold text-xs shadow-xs"
                                >
                                  <span>{s.subject}</span>
                                  <button
                                    type="button"
                                    onClick={() => handleRemoveSubjectFromClass(cls, s.subject)}
                                    className="hover:text-rose-600 text-slate-400 ml-1"
                                  >
                                    <X className="w-3 h-3" />
                                  </button>
                                </span>
                              ))
                            ) : (
                              <span className="text-[11px] text-slate-400 italic">
                                No subjects allocated yet for {cls}
                              </span>
                            )}
                          </div>

                          {/* Add Subject Dropdown/Buttons */}
                          <div className="flex items-center gap-2 pt-2 border-t border-slate-200/60">
                            <span className="text-[11px] text-slate-500 font-semibold">Add Subject:</span>
                            <select
                              onChange={(e) => {
                                if (e.target.value) {
                                  handleAddSubjectToClass(cls, e.target.value);
                                  e.target.value = "";
                                }
                              }}
                              defaultValue=""
                              className="bg-white border border-slate-300 rounded-lg px-2 py-1 text-xs text-slate-800 font-medium"
                            >
                              <option value="" disabled>
                                Select subject to add...
                              </option>
                              {AVAILABLE_SUBJECTS.map((sub) => (
                                <option key={sub} value={sub}>
                                  + {sub}
                                </option>
                              ))}
                            </select>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              <div className="pt-4 flex items-center justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setEditingTeacher(null)}
                  className="px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 font-bold hover:bg-slate-50 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingEdit}
                  className="px-5 py-2.5 rounded-xl bg-[#1B2A4A] text-white font-bold hover:bg-[#111C32] transition disabled:opacity-60"
                >
                  {savingEdit ? "Saving..." : "Save Subject Allocations"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add New Teacher Modal — Multi-Subject Assignment */}
      {isCreateOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-5">
              <h3 className="font-extrabold text-lg text-slate-900 flex items-center gap-2">
                <GraduationCap className="w-5 h-5 text-[#1B2A4A]" />
                <span>Create Teacher Account</span>
              </h3>
              <button onClick={() => setIsCreateOpen(false)} className="text-slate-400 hover:text-slate-700 p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            {createError && (
              <div className="bg-rose-50 border border-rose-200 text-rose-700 p-3 rounded-xl text-xs flex items-center gap-2 mb-4">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{createError}</span>
              </div>
            )}

            <form onSubmit={handleCreateTeacher} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Teacher Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Sir Tariq Mehmood"
                  value={createName}
                  onChange={(e) => setCreateName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 font-medium text-slate-900 focus:bg-white focus:ring-2 focus:ring-[#1B2A4A]"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Official Email Address</label>
                <input
                  type="email"
                  required
                  placeholder="teacher.name@nayab.edu.pk"
                  value={createEmail}
                  onChange={(e) => setCreateEmail(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 font-medium text-slate-900 focus:bg-white focus:ring-2 focus:ring-[#1B2A4A]"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Initial Password</label>
                <input
                  type="password"
                  required
                  placeholder="Minimum 6 characters"
                  value={createPassword}
                  onChange={(e) => setCreatePassword(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 font-medium text-slate-900 focus:bg-white focus:ring-2 focus:ring-[#1B2A4A]"
                />
              </div>

              {/* Multi-Subject Assignment Matrix */}
              <div className="border-t border-slate-100 pt-4">
                <label className="block font-bold text-slate-700 uppercase tracking-wider mb-3">
                  Assign Classes & Subjects
                </label>

                {/* Current Assignments Chips */}
                {createSubjects.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mb-3">
                    {createSubjects.map((s, idx) => (
                      <span
                        key={idx}
                        className="inline-flex items-center gap-1 bg-[#FCF9EE] border border-[#D4AF37] text-[#1B2A4A] px-2.5 py-1 rounded-lg font-bold text-[11px]"
                      >
                        <BookOpen className="w-3 h-3 text-[#D4AF37]" />
                        <span>{s.className}: {s.subject}</span>
                        <button
                          type="button"
                          onClick={() => {
                            const updated = createSubjects.filter((_, i) => i !== idx);
                            setCreateSubjects(updated);
                            setCreateClasses(Array.from(new Set(updated.map((u) => u.className))));
                          }}
                          className="hover:text-rose-600 text-slate-400 ml-0.5"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}

                {/* Add New Subject Row */}
                <div className="flex flex-col sm:flex-row sm:items-end gap-2 bg-slate-50/80 p-3 rounded-2xl border border-slate-200">
                  <div className="flex-1">
                    <label className="block text-[10px] text-slate-500 font-semibold mb-0.5">Class</label>
                    <select
                      id="create-new-class"
                      defaultValue="Class 9"
                      className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 font-medium text-xs text-slate-800"
                    >
                      {AVAILABLE_CLASSES.map((c) => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>
                  <div className="flex-1">
                    <label className="block text-[10px] text-slate-500 font-semibold mb-0.5">Subject</label>
                    <select
                      id="create-new-subject"
                      defaultValue="General Science"
                      className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 font-medium text-xs text-slate-800"
                    >
                      {AVAILABLE_SUBJECTS.map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      const clsEl = document.getElementById("create-new-class") as HTMLSelectElement;
                      const subEl = document.getElementById("create-new-subject") as HTMLSelectElement;
                      const cls = clsEl?.value || "Class 9";
                      const sub = subEl?.value || "General Science";
                      const exists = createSubjects.some(
                        (s) => s.className === cls && s.subject === sub
                      );
                      if (!exists) {
                        const updated = [...createSubjects, { className: cls, subject: sub }];
                        setCreateSubjects(updated);
                        setCreateClasses(Array.from(new Set(updated.map((u) => u.className))));
                      }
                    }}
                    className="inline-flex items-center justify-center gap-1 bg-[#1B2A4A] hover:bg-[#111C32] text-white px-4 py-2.5 rounded-xl text-xs font-bold transition whitespace-nowrap w-full sm:w-auto"
                  >
                    <Plus className="w-3.5 h-3.5 text-[#D4AF37]" />
                    <span>Add Subject</span>
                  </button>
                </div>

                {createSubjects.length === 0 && (
                  <p className="text-[10px] text-slate-400 mt-2 italic">
                    Add at least one class and subject assignment above.
                  </p>
                )}
              </div>

              <div className="pt-3 flex items-center justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsCreateOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 font-bold hover:bg-slate-50 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={creating}
                  className="px-5 py-2.5 rounded-xl bg-[#1B2A4A] text-white font-bold hover:bg-[#111C32] transition disabled:opacity-60"
                >
                  {creating ? "Creating..." : "Create Teacher Account"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
