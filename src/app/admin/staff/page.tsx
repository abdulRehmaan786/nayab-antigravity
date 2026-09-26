"use client";

import { useState, useEffect } from "react";
import {
  Briefcase,
  Plus,
  X,
  AlertCircle,
  Search,
  Filter,
  Printer,
  CheckCircle2,
  Clock,
  UserMinus,
  DollarSign,
  Calendar,
  Users,
} from "lucide-react";

interface StaffMemberData {
  id: string;
  name: string;
  role: string;
  designation: string;
  phone: string | null;
  cnic: string | null;
  monthlySalary: number;
  userId: string | null;
  status: string;
  attendances?: StaffAttendanceData[];
  salaries?: StaffSalaryData[];
}

interface StaffAttendanceData {
  id: string;
  staffId: string;
  staff?: StaffMemberData;
  date: string;
  status: string;
  checkInTime: string | null;
  remarks: string | null;
}

interface StaffSalaryData {
  id: string;
  staffId: string;
  staff?: StaffMemberData;
  month: string;
  basicSalary: number;
  allowances: number;
  deductions: number;
  netSalary: number;
  status: string;
  paidDate: string | null;
  paymentMethod: string | null;
  receiptNumber: string | null;
  notes: string | null;
}

const STAFF_ROLES = [
  { value: "TEACHER", label: "Teacher" },
  { value: "SAFAI_WALA", label: "Safai Wala (Cleaner)" },
  { value: "SECURITY_GUARD", label: "Security Guard" },
  { value: "PEON", label: "Peon" },
  { value: "CLERK", label: "Office Clerk" },
  { value: "LAB_ASSISTANT", label: "Lab Assistant" },
];

const ROLE_LABELS: Record<string, string> = {
  TEACHER: "Teacher",
  SAFAI_WALA: "Safai Wala",
  SECURITY_GUARD: "Security Guard",
  PEON: "Peon",
  CLERK: "Clerk",
  LAB_ASSISTANT: "Lab Assistant",
};

const ATTENDANCE_STATUSES = ["PRESENT", "LATE", "ABSENT", "LEAVE"];

const STATUS_COLORS: Record<string, string> = {
  PRESENT: "bg-emerald-100 text-emerald-800",
  LATE: "bg-amber-100 text-amber-800",
  ABSENT: "bg-rose-100 text-rose-800",
  LEAVE: "bg-blue-100 text-blue-800",
};

const SALARY_COLORS: Record<string, string> = {
  PAID: "bg-emerald-100 text-emerald-800",
  PENDING: "bg-amber-100 text-amber-800",
  UNPAID: "bg-rose-100 text-rose-800",
};

export default function AdminStaffPage() {
  const [activeTab, setActiveTab] = useState<"directory" | "salary" | "attendance">("directory");
  const [staff, setStaff] = useState<StaffMemberData[]>([]);
  const [salaries, setSalaries] = useState<StaffSalaryData[]>([]);
  const [attendanceRecords, setAttendanceRecords] = useState<StaffAttendanceData[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterRole, setFilterRole] = useState("ALL");
  const [searchQuery, setSearchQuery] = useState("");

  // Create Staff Modal
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [createData, setCreateData] = useState({
    name: "",
    role: "PEON",
    designation: "",
    phone: "",
    cnic: "",
    monthlySalary: "15000",
  });
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);

  // Salary Month Filter
  const [salaryMonth, setSalaryMonth] = useState("September 2025");

  // Attendance Date Filter
  const today = new Date().toISOString().split("T")[0];
  const [attendanceDate, setAttendanceDate] = useState(today);

  useEffect(() => {
    loadStaff();
  }, []);

  useEffect(() => {
    if (activeTab === "salary") loadSalaries();
    if (activeTab === "attendance") loadAttendance();
  }, [activeTab, salaryMonth, attendanceDate]);

  const loadStaff = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/staff");
      const data = await res.json();
      if (data?.staff) setStaff(data.staff);
    } catch {
      console.error("Failed to load staff");
    } finally {
      setLoading(false);
    }
  };

  const loadSalaries = async () => {
    try {
      const res = await fetch(`/api/staff/salaries?month=${encodeURIComponent(salaryMonth)}`);
      const data = await res.json();
      if (data?.salaries) setSalaries(data.salaries);
    } catch {
      console.error("Failed to load salaries");
    }
  };

  const loadAttendance = async () => {
    try {
      const res = await fetch(`/api/staff/attendance?date=${attendanceDate}`);
      const data = await res.json();
      if (data?.records) setAttendanceRecords(data.records);
    } catch {
      console.error("Failed to load attendance");
    }
  };

  const handleCreateStaff = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreating(true);
    setCreateError(null);
    try {
      const res = await fetch("/api/staff", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(createData),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) {
        setCreateError(data.error || "Failed to create staff member.");
      } else {
        setIsCreateOpen(false);
        setCreateData({ name: "", role: "PEON", designation: "", phone: "", cnic: "", monthlySalary: "15000" });
        loadStaff();
      }
    } catch {
      setCreateError("Network error.");
    } finally {
      setCreating(false);
    }
  };

  const handleToggleSalaryStatus = async (salaryId: string, currentStatus: string) => {
    const newStatus = currentStatus === "PAID" ? "PENDING" : "PAID";
    try {
      const res = await fetch("/api/staff/salaries", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: salaryId, status: newStatus }),
      });
      if (res.ok) loadSalaries();
    } catch {
      alert("Failed to update salary status.");
    }
  };

  const handleMarkAttendance = async (staffId: string, status: string) => {
    try {
      const now = new Date();
      const checkInTime = status === "PRESENT" || status === "LATE"
        ? now.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: true })
        : null;

      await fetch("/api/staff/attendance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          staffId,
          date: attendanceDate,
          status,
          checkInTime,
          remarks: status === "LATE" ? "Late arrival" : status === "LEAVE" ? "On leave" : null,
        }),
      });
      loadAttendance();
    } catch {
      alert("Failed to mark attendance.");
    }
  };

  const handleDeleteStaff = async (id: string, name: string) => {
    if (!confirm(`Remove staff member "${name}"? This will also delete their salary and attendance records.`)) return;
    try {
      const res = await fetch(`/api/staff?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        setStaff((prev) => prev.filter((s) => s.id !== id));
      }
    } catch {
      alert("Failed to delete staff.");
    }
  };

  const filteredStaff = staff.filter((s) => {
    if (filterRole !== "ALL" && s.role !== filterRole) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return s.name.toLowerCase().includes(q) || s.designation.toLowerCase().includes(q);
    }
    return true;
  });

  const tabs = [
    { id: "directory" as const, label: "Staff Directory", icon: Users },
    { id: "salary" as const, label: "Salary Register", icon: DollarSign },
    { id: "attendance" as const, label: "Daily Attendance", icon: Calendar },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <Briefcase className="w-6 h-6 text-[#1B2A4A]" />
            <span>Staff & Payroll Management</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Manage all teaching and support staff — salary, attendance, and records.
          </p>
        </div>
        <button
          onClick={() => setIsCreateOpen(true)}
          className="inline-flex items-center gap-2 bg-[#1B2A4A] hover:bg-[#111C32] text-white px-4 py-2.5 rounded-xl text-xs font-bold shadow transition"
        >
          <Plus className="w-4 h-4 text-[#D4AF37]" />
          <span>Add Staff Member</span>
        </button>
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-1 bg-white p-1 rounded-xl border border-slate-200 shadow-sm">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-xs font-bold transition ${
                activeTab === tab.id
                  ? "bg-[#1B2A4A] text-white shadow"
                  : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              <Icon className={`w-4 h-4 ${activeTab === tab.id ? "text-[#D4AF37]" : ""}`} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="w-4 h-4 text-slate-400 shrink-0" />
          <select
            value={filterRole}
            onChange={(e) => setFilterRole(e.target.value)}
            className="bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800"
          >
            <option value="ALL">All Staff</option>
            {STAFF_ROLES.map((r) => (
              <option key={r.value} value={r.value}>{r.label}</option>
            ))}
          </select>
          <span className="text-xs text-slate-400 ml-2">({filteredStaff.length} members)</span>
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name or designation..."
            className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#1B2A4A]"
          />
        </div>
      </div>

      {/* ===== TAB 1: Staff Directory ===== */}
      {activeTab === "directory" && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          {loading ? (
            <div className="p-16 text-center text-xs text-slate-500">Loading staff records...</div>
          ) : filteredStaff.length === 0 ? (
            <div className="p-16 text-center text-xs text-slate-500">No staff members found.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-[#1B2A4A] text-white">
                    <th className="p-3.5 font-bold">Name</th>
                    <th className="p-3.5 font-bold">Role</th>
                    <th className="p-3.5 font-bold">Designation</th>
                    <th className="p-3.5 font-bold">Phone</th>
                    <th className="p-3.5 font-bold">CNIC</th>
                    <th className="p-3.5 font-bold text-right">Monthly Salary</th>
                    <th className="p-3.5 font-bold text-center">Status</th>
                    <th className="p-3.5 font-bold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredStaff.map((s, idx) => (
                    <tr key={s.id} className={idx % 2 === 0 ? "bg-white" : "bg-slate-50/50"}>
                      <td className="p-3.5 font-bold text-slate-900">{s.name}</td>
                      <td className="p-3.5">
                        <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-semibold border border-slate-200 text-[11px]">
                          {ROLE_LABELS[s.role] || s.role}
                        </span>
                      </td>
                      <td className="p-3.5 text-slate-600">{s.designation}</td>
                      <td className="p-3.5 text-slate-500 font-mono">{s.phone || "—"}</td>
                      <td className="p-3.5 text-slate-500 font-mono text-[11px]">{s.cnic || "—"}</td>
                      <td className="p-3.5 text-right font-bold text-[#1B2A4A]">
                        Rs. {s.monthlySalary.toLocaleString()}
                      </td>
                      <td className="p-3.5 text-center">
                        <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                          s.status === "ACTIVE" ? "bg-emerald-100 text-emerald-800" : "bg-slate-100 text-slate-600"
                        }`}>
                          {s.status}
                        </span>
                      </td>
                      <td className="p-3.5 text-right">
                        <button
                          onClick={() => handleDeleteStaff(s.id, s.name)}
                          className="p-1 text-slate-400 hover:text-rose-600 transition"
                          title="Remove Staff"
                        >
                          <UserMinus className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* ===== TAB 2: Salary Register ===== */}
      {activeTab === "salary" && (
        <div className="space-y-4">
          {/* Month Selector */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <label className="text-xs font-bold text-slate-700 whitespace-nowrap">Salary Month:</label>
              <select
                value={salaryMonth}
                onChange={(e) => setSalaryMonth(e.target.value)}
                className="bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-semibold w-full sm:w-auto"
              >
                <option value="September 2025">September 2025</option>
                <option value="August 2025">August 2025</option>
                <option value="July 2025">July 2025</option>
                <option value="October 2025">October 2025</option>
              </select>
            </div>

            {/* Summary Cards */}
            <div className="flex items-center justify-between sm:justify-end gap-3 w-full sm:w-auto pt-3 sm:pt-0 border-t sm:border-t-0 border-slate-100">
              <div className="text-center">
                <p className="text-[10px] text-slate-400 uppercase font-semibold">Total Payroll</p>
                <p className="text-sm font-black text-[#1B2A4A]">
                  Rs. {salaries.reduce((sum, s) => sum + s.netSalary, 0).toLocaleString()}
                </p>
              </div>
              <div className="text-center">
                <p className="text-[10px] text-slate-400 uppercase font-semibold">Paid</p>
                <p className="text-sm font-black text-emerald-600">
                  {salaries.filter((s) => s.status === "PAID").length}
                </p>
              </div>
              <div className="text-center">
                <p className="text-[10px] text-slate-400 uppercase font-semibold">Pending</p>
                <p className="text-sm font-black text-amber-600">
                  {salaries.filter((s) => s.status !== "PAID").length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-[#1B2A4A] text-white">
                    <th className="p-3.5 font-bold">Staff Member</th>
                    <th className="p-3.5 font-bold">Role</th>
                    <th className="p-3.5 font-bold text-right">Basic</th>
                    <th className="p-3.5 font-bold text-right">Allowances</th>
                    <th className="p-3.5 font-bold text-right">Deductions</th>
                    <th className="p-3.5 font-bold text-right">Net Salary</th>
                    <th className="p-3.5 font-bold text-center">Status</th>
                    <th className="p-3.5 font-bold">Receipt</th>
                    <th className="p-3.5 font-bold text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {salaries.length === 0 ? (
                    <tr>
                      <td colSpan={9} className="p-12 text-center text-slate-400">
                        No salary records for {salaryMonth}. Generate salaries from the Staff Directory.
                      </td>
                    </tr>
                  ) : (
                    salaries.filter((sal) => {
                      if (filterRole === "ALL") return true;
                      return sal.staff?.role === filterRole;
                    }).map((sal, idx) => (
                      <tr key={sal.id} className={idx % 2 === 0 ? "bg-white" : "bg-slate-50/50"}>
                        <td className="p-3.5 font-bold text-slate-900">{sal.staff?.name || "—"}</td>
                        <td className="p-3.5">
                          <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-semibold border border-slate-200 text-[11px]">
                            {ROLE_LABELS[sal.staff?.role || ""] || sal.staff?.role}
                          </span>
                        </td>
                        <td className="p-3.5 text-right font-mono">Rs. {sal.basicSalary.toLocaleString()}</td>
                        <td className="p-3.5 text-right font-mono text-emerald-600">+{sal.allowances.toLocaleString()}</td>
                        <td className="p-3.5 text-right font-mono text-rose-600">-{sal.deductions.toLocaleString()}</td>
                        <td className="p-3.5 text-right font-black text-[#1B2A4A]">Rs. {sal.netSalary.toLocaleString()}</td>
                        <td className="p-3.5 text-center">
                          <span className={`px-2 py-0.5 rounded text-[11px] font-black ${SALARY_COLORS[sal.status] || "bg-slate-100 text-slate-600"}`}>
                            {sal.status}
                          </span>
                        </td>
                        <td className="p-3.5 font-mono text-[11px] text-slate-500">{sal.receiptNumber || "—"}</td>
                        <td className="p-3.5 text-right">
                          <button
                            onClick={() => handleToggleSalaryStatus(sal.id, sal.status)}
                            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-bold transition ${
                              sal.status === "PAID"
                                ? "bg-amber-100 text-amber-800 hover:bg-amber-200"
                                : "bg-emerald-100 text-emerald-800 hover:bg-emerald-200"
                            }`}
                          >
                            {sal.status === "PAID" ? (
                              <>
                                <Clock className="w-3 h-3" />
                                <span>Mark Pending</span>
                              </>
                            ) : (
                              <>
                                <CheckCircle2 className="w-3 h-3" />
                                <span>Mark Paid</span>
                              </>
                            )}
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ===== TAB 3: Daily Staff Attendance ===== */}
      {activeTab === "attendance" && (
        <div className="space-y-4">
          {/* Date Selector */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <label className="text-xs font-bold text-slate-700 whitespace-nowrap">Attendance Date:</label>
              <input
                type="date"
                value={attendanceDate}
                onChange={(e) => setAttendanceDate(e.target.value)}
                className="bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-semibold w-full sm:w-auto"
              />
            </div>

            {/* Summary */}
            <div className="flex items-center justify-between sm:justify-end gap-3 w-full sm:w-auto pt-3 sm:pt-0 border-t sm:border-t-0 border-slate-100">
              <div className="text-center">
                <p className="text-[10px] text-emerald-600 uppercase font-semibold">Present</p>
                <p className="text-sm font-black text-emerald-600">
                  {attendanceRecords.filter((r) => r.status === "PRESENT").length}
                </p>
              </div>
              <div className="text-center">
                <p className="text-[10px] text-amber-600 uppercase font-semibold">Late</p>
                <p className="text-sm font-black text-amber-600">
                  {attendanceRecords.filter((r) => r.status === "LATE").length}
                </p>
              </div>
              <div className="text-center">
                <p className="text-[10px] text-rose-600 uppercase font-semibold">Absent</p>
                <p className="text-sm font-black text-rose-600">
                  {attendanceRecords.filter((r) => r.status === "ABSENT").length}
                </p>
              </div>
              <div className="text-center">
                <p className="text-[10px] text-blue-600 uppercase font-semibold">Leave</p>
                <p className="text-sm font-black text-blue-600">
                  {attendanceRecords.filter((r) => r.status === "LEAVE").length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-[#1B2A4A] text-white">
                    <th className="p-3.5 font-bold">Staff Member</th>
                    <th className="p-3.5 font-bold">Role</th>
                    <th className="p-3.5 font-bold text-center">Check-In</th>
                    <th className="p-3.5 font-bold text-center">Current Status</th>
                    <th className="p-3.5 font-bold text-center">Mark Attendance</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredStaff.map((s, idx) => {
                    const record = attendanceRecords.find((r) => r.staffId === s.id);
                    const currentStatus = record?.status || "NOT_MARKED";

                    return (
                      <tr key={s.id} className={idx % 2 === 0 ? "bg-white" : "bg-slate-50/50"}>
                        <td className="p-3.5 font-bold text-slate-900">{s.name}</td>
                        <td className="p-3.5">
                          <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-semibold border border-slate-200 text-[11px]">
                            {ROLE_LABELS[s.role] || s.role}
                          </span>
                        </td>
                        <td className="p-3.5 text-center font-mono text-slate-500">
                          {record?.checkInTime || "—"}
                        </td>
                        <td className="p-3.5 text-center">
                          <span className={`px-2 py-0.5 rounded text-[11px] font-black ${
                            STATUS_COLORS[currentStatus] || "bg-slate-100 text-slate-500"
                          }`}>
                            {currentStatus === "NOT_MARKED" ? "Not Marked" : currentStatus}
                          </span>
                        </td>
                        <td className="p-3.5 text-center">
                          <div className="flex items-center justify-center gap-1.5">
                            {ATTENDANCE_STATUSES.map((status) => (
                              <button
                                key={status}
                                onClick={() => handleMarkAttendance(s.id, status)}
                                className={`px-2 py-1 rounded-lg text-[10px] font-bold transition border ${
                                  currentStatus === status
                                    ? STATUS_COLORS[status] + " border-transparent shadow-sm"
                                    : "bg-white border-slate-200 text-slate-500 hover:bg-slate-100"
                                }`}
                              >
                                {status === "PRESENT" ? "P" : status === "LATE" ? "L" : status === "ABSENT" ? "A" : "LV"}
                              </button>
                            ))}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ===== Create Staff Modal ===== */}
      {isCreateOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-5">
              <h3 className="font-extrabold text-lg text-slate-900 flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-[#1B2A4A]" />
                <span>Add Staff Member</span>
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

            <form onSubmit={handleCreateStaff} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Babu Ram"
                  value={createData.name}
                  onChange={(e) => setCreateData({ ...createData, name: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 font-medium text-slate-900 focus:bg-white focus:ring-2 focus:ring-[#1B2A4A]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Role</label>
                  <select
                    value={createData.role}
                    onChange={(e) => setCreateData({ ...createData, role: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 font-medium"
                  >
                    {STAFF_ROLES.map((r) => (
                      <option key={r.value} value={r.value}>{r.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Designation</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Campus Cleaner"
                    value={createData.designation}
                    onChange={(e) => setCreateData({ ...createData, designation: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 font-medium text-slate-900 focus:bg-white focus:ring-2 focus:ring-[#1B2A4A]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Phone</label>
                  <input
                    type="text"
                    placeholder="+92 300 1234567"
                    value={createData.phone}
                    onChange={(e) => setCreateData({ ...createData, phone: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 font-medium text-slate-900 focus:bg-white focus:ring-2 focus:ring-[#1B2A4A]"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">CNIC</label>
                  <input
                    type="text"
                    placeholder="44201-1234567-1"
                    value={createData.cnic}
                    onChange={(e) => setCreateData({ ...createData, cnic: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 font-medium text-slate-900 focus:bg-white focus:ring-2 focus:ring-[#1B2A4A]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Monthly Salary (PKR)</label>
                <input
                  type="number"
                  required
                  min="0"
                  value={createData.monthlySalary}
                  onFocus={(e) => e.target.select()}
                  onChange={(e) => {
                    const raw = e.target.value;
                    const cleaned = raw.replace(/^0+(?=\d)/, "");
                    setCreateData({ ...createData, monthlySalary: cleaned });
                  }}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 font-medium text-slate-900 focus:bg-white focus:ring-2 focus:ring-[#1B2A4A]"
                />
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
                  {creating ? "Adding..." : "Add Staff Member"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
