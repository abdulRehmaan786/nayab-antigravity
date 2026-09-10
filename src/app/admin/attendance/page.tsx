"use client";

import { useState, useEffect } from "react";
import {
  Fingerprint,
  CheckCircle2,
  Clock,
  XCircle,
  Search,
  Filter,
  Calendar,
  Radio,
  Sparkles,
  Zap,
  Check,
  AlertCircle,
  UserCheck,
} from "lucide-react";

interface AttendanceRecordItem {
  studentId: string;
  rollNumber: string;
  name: string;
  fatherName: string;
  className: string;
  section: string;
  attendanceId: string | null;
  status: "PRESENT" | "LATE" | "ABSENT" | "LEAVE" | "NOT_MARKED";
  checkInTime: string | null;
  deviceId: string | null;
  deviceType: string | null;
  remarks: string | null;
}

const DEVICES = [
  { id: "BIO-GATE-01", name: "Gate 1 — Main Campus Entrance" },
  { id: "BIO-GATE-02", name: "Gate 2 — Girls Wing & Primary Block" },
  { id: "BIO-LAB-01", name: "Lab Gate — Computer & Science Complex" },
];

const CLASSES = ["All Classes", "Class 10", "Class 9", "Class 8"];
const STATUS_FILTERS = ["ALL", "PRESENT", "LATE", "ABSENT", "LEAVE"];

export default function AdminAttendancePage() {
  const [date, setDate] = useState("2025-09-10");
  const [selectedClass, setSelectedClass] = useState("All Classes");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [searchQuery, setSearchQuery] = useState("");

  const [items, setItems] = useState<AttendanceRecordItem[]>([]);
  const [summary, setSummary] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Biometric Scanner Simulator State
  const [selectedDevice, setSelectedDevice] = useState("BIO-GATE-01");
  const [simClass, setSimClass] = useState("Class 9");
  const [simRoll, setSimRoll] = useState("101");
  const [simCustomTime, setSimCustomTime] = useState("");
  const [scanning, setScanning] = useState(false);
  const [punchFeedback, setPunchFeedback] = useState<any>(null);

  useEffect(() => {
    loadAttendance();
  }, [date, selectedClass]);

  const loadAttendance = async () => {
    setLoading(true);
    try {
      const clsParam = selectedClass === "All Classes" ? "all" : selectedClass;
      const res = await fetch(`/api/attendance?date=${date}&className=${encodeURIComponent(clsParam)}`);
      const data = await res.json();
      if (data && data.items) {
        setItems(data.items);
        setSummary(data.summary);
      }
    } catch {
      console.error("Failed to load attendance records");
    } finally {
      setLoading(false);
    }
  };

  // Simulate Biometric Fingerprint / RFID Card Punch
  const handleBiometricPunch = async (overrideRoll?: string, overrideClass?: string) => {
    const roll = overrideRoll || simRoll;
    const cls = overrideClass || simClass;

    if (!roll || !cls) return;

    setScanning(true);
    setPunchFeedback(null);

    try {
      const res = await fetch("/api/attendance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          rollNumber: roll,
          className: cls,
          deviceId: selectedDevice,
          deviceType: "BIOMETRIC_FINGERPRINT",
          date,
          customTime: simCustomTime.trim() || undefined,
        }),
      });

      const data = await res.json();
      if (res.ok && data.ok) {
        setPunchFeedback({
          success: true,
          message: data.message,
          student: data.student,
          record: data.record,
        });
        loadAttendance();
      } else {
        setPunchFeedback({
          success: false,
          message: data.error || "Biometric scan verification failed.",
        });
      }
    } catch {
      setPunchFeedback({
        success: false,
        message: "Hardware communication timeout.",
      });
    } finally {
      setScanning(false);
    }
  };

  const handleManualOverride = async (studentId: string, newStatus: "PRESENT" | "LATE" | "ABSENT" | "LEAVE") => {
    try {
      const res = await fetch("/api/attendance", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          studentId,
          date,
          status: newStatus,
          remarks: `Manual override by Admin`,
        }),
      });
      if (res.ok) {
        loadAttendance();
      }
    } catch {
      alert("Failed to override attendance");
    }
  };

  const filtered = items.filter((item) => {
    if (statusFilter !== "ALL" && item.status !== statusFilter) return false;
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return item.name.toLowerCase().includes(q) || item.rollNumber.toLowerCase().includes(q);
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <Fingerprint className="w-7 h-7 text-[#1B2A4A]" />
            <span>Biometric Attendance & Gate Control</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Real-time biometric device sync, arrival verification, and attendance registers for Nayab Grammar School.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 bg-emerald-100 border border-emerald-300 text-emerald-800 text-xs font-bold px-3 py-1.5 rounded-full">
            <Radio className="w-3.5 h-3.5 text-emerald-600 animate-pulse" />
            <span>Biometric Terminals Online</span>
          </span>
        </div>
      </div>

      {/* Summary KPI Cards */}
      {summary && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-sm">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              School Attendance Rate
            </span>
            <p className="text-3xl font-black text-[#1B2A4A] mt-1">{summary.attendancePercentage}%</p>
            <p className="text-[11px] text-slate-500 mt-0.5">{summary.totalStudents} enrolled students</p>
          </div>

          <div className="bg-emerald-50/80 p-4 sm:p-5 rounded-2xl border border-emerald-200 shadow-sm">
            <span className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> Present (On-Time)
            </span>
            <p className="text-3xl font-black text-emerald-800 mt-1">{summary.presentCount}</p>
            <p className="text-[11px] text-emerald-600 mt-0.5">Punched before 8:15 AM</p>
          </div>

          <div className="bg-amber-50/80 p-4 sm:p-5 rounded-2xl border border-amber-200 shadow-sm">
            <span className="text-[11px] font-bold text-amber-800 uppercase tracking-wider flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" /> Late Arrivals
            </span>
            <p className="text-3xl font-black text-amber-800 mt-1">{summary.lateCount}</p>
            <p className="text-[11px] text-amber-600 mt-0.5">Punched after 8:15 AM cut-off</p>
          </div>

          <div className="bg-rose-50/80 p-4 sm:p-5 rounded-2xl border border-rose-200 shadow-sm">
            <span className="text-[11px] font-bold text-rose-800 uppercase tracking-wider flex items-center gap-1">
              <XCircle className="w-3.5 h-3.5" /> Absent / Unrecorded
            </span>
            <p className="text-3xl font-black text-rose-800 mt-1">
              {summary.absentCount + summary.notMarkedCount}
            </p>
            <p className="text-[11px] text-rose-600 mt-0.5">No gate punch registered</p>
          </div>
        </div>
      )}

      {/* Interactive Biometric Scanner Simulator Widget */}
      <div className="bg-gradient-to-r from-[#1B2A4A] to-[#253966] text-white p-6 sm:p-7 rounded-3xl shadow-xl border border-[#D4AF37]/40 relative overflow-hidden">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2 max-w-lg">
            <div className="inline-flex items-center gap-2 bg-[#D4AF37] text-[#111C32] px-3 py-0.5 rounded-full text-xs font-black uppercase tracking-wider">
              <Zap className="w-3.5 h-3.5" />
              <span>Interactive Biometric Hardware Simulator</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white">
              Simulate Gate Biometric Verification
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Test real-time optical fingerprint verification or RFID smart badge tap. Check-ins before 8:15 AM
              are automatically verified as <strong className="text-emerald-300">PRESENT</strong>; arrivals
              after 8:15 AM are categorized as <strong className="text-amber-300">LATE</strong>.
            </p>
          </div>

          {/* Scanner Controls Form */}
          <div className="w-full lg:w-auto bg-white/10 p-5 rounded-2xl border border-white/20 backdrop-blur-md space-y-3">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
              <div>
                <label className="block text-[10px] uppercase font-bold text-[#D4AF37] mb-1">Terminal Device</label>
                <select
                  value={selectedDevice}
                  onChange={(e) => setSelectedDevice(e.target.value)}
                  className="w-full bg-[#111C32] border border-white/20 rounded-xl px-2.5 py-1.5 text-xs text-white font-mono"
                >
                  {DEVICES.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.id} ({d.name.split("—")[0].trim()})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[10px] uppercase font-bold text-[#D4AF37] mb-1">Select Class</label>
                <select
                  value={simClass}
                  onChange={(e) => setSimClass(e.target.value)}
                  className="w-full bg-[#111C32] border border-white/20 rounded-xl px-2.5 py-1.5 text-xs text-white"
                >
                  <option value="Class 9">Class 9</option>
                  <option value="Class 10">Class 10</option>
                  <option value="Class 8">Class 8</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] uppercase font-bold text-[#D4AF37] mb-1">Roll Number</label>
                <input
                  type="text"
                  value={simRoll}
                  onChange={(e) => setSimRoll(e.target.value)}
                  placeholder="e.g. 101, 102"
                  className="w-full bg-[#111C32] border border-white/20 rounded-xl px-2.5 py-1.5 text-xs text-white font-mono"
                />
              </div>
            </div>

            <div className="flex items-center gap-2 text-xs">
              <input
                type="text"
                value={simCustomTime}
                onChange={(e) => setSimCustomTime(e.target.value)}
                placeholder="Optional time override e.g. 07:55 AM or 08:24 AM"
                className="flex-1 bg-[#111C32] border border-white/20 rounded-xl px-3 py-1.5 text-xs text-white placeholder:text-slate-400 font-mono"
              />

              <button
                type="button"
                onClick={() => handleBiometricPunch()}
                disabled={scanning}
                className="bg-[#D4AF37] hover:bg-[#c29e2c] active:scale-95 text-[#111C32] font-black px-4 py-2 rounded-xl text-xs flex items-center gap-1.5 transition shadow disabled:opacity-60 shrink-0"
              >
                <Fingerprint className={`w-4 h-4 ${scanning ? "animate-spin" : ""}`} />
                <span>{scanning ? "Scanning..." : "Tap Biometric Punch"}</span>
              </button>
            </div>

            {/* Fast Test Chips */}
            <div className="pt-2 border-t border-white/10 flex flex-wrap items-center gap-1.5 text-[10px]">
              <span className="text-[#D4AF37] font-bold">Fast Test:</span>
              <button
                type="button"
                onClick={() => {
                  setSimClass("Class 9");
                  setSimRoll("101");
                  setSimCustomTime("07:50 AM");
                  handleBiometricPunch("101", "Class 9");
                }}
                className="bg-white/10 hover:bg-white/20 px-2 py-0.5 rounded border border-white/20"
              >
                Roll 101 (On-Time 7:50 AM)
              </button>
              <button
                type="button"
                onClick={() => {
                  setSimClass("Class 9");
                  setSimRoll("105");
                  setSimCustomTime("08:25 AM");
                  handleBiometricPunch("105", "Class 9");
                }}
                className="bg-white/10 hover:bg-white/20 px-2 py-0.5 rounded border border-white/20"
              >
                Roll 105 (Late 8:25 AM)
              </button>
              <button
                type="button"
                onClick={() => {
                  setSimClass("Class 10");
                  setSimRoll("201");
                  setSimCustomTime("07:45 AM");
                  handleBiometricPunch("201", "Class 10");
                }}
                className="bg-white/10 hover:bg-white/20 px-2 py-0.5 rounded border border-white/20"
              >
                Roll 201 (Class 10 - 7:45 AM)
              </button>
            </div>
          </div>
        </div>

        {/* Live Feedback Banner */}
        {punchFeedback && (
          <div
            className={`mt-4 p-4 rounded-2xl border text-xs flex items-center justify-between gap-3 animate-in fade-in slide-in-from-top-2 ${
              punchFeedback.success
                ? punchFeedback.record?.status === "LATE"
                  ? "bg-amber-400/20 border-amber-400 text-amber-200"
                  : "bg-emerald-400/20 border-emerald-400 text-emerald-200"
                : "bg-rose-400/20 border-rose-400 text-rose-200"
            }`}
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center shrink-0">
                {punchFeedback.success ? (
                  <CheckCircle2 className="w-5 h-5 text-white" />
                ) : (
                  <AlertCircle className="w-5 h-5 text-white" />
                )}
              </div>
              <div>
                <p className="font-extrabold text-white text-sm">{punchFeedback.message}</p>
                {punchFeedback.record && (
                  <p className="text-[11px] text-slate-300 mt-0.5">
                    Device: <strong className="text-white">{punchFeedback.record.deviceId}</strong> • Time:{" "}
                    <strong className="text-white">{punchFeedback.record.checkInTime}</strong> • Verification Method:{" "}
                    <strong className="text-[#D4AF37]">Optical Fingerprint Match (99.8%)</strong>
                  </p>
                )}
              </div>
            </div>
            <button
              onClick={() => setPunchFeedback(null)}
              className="text-white/60 hover:text-white p-1"
            >
              <XCircle className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* Filter and Date Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          {/* Date Picker */}
          <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-300 rounded-xl px-3 py-1.5 text-xs font-bold text-slate-800">
            <Calendar className="w-3.5 h-3.5 text-slate-500" />
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="bg-transparent focus:outline-none"
            />
          </div>

          {/* Class Filter */}
          <select
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
            className="bg-slate-50 border border-slate-300 rounded-xl px-3 py-1.5 text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#1B2A4A]"
          >
            {CLASSES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-slate-50 border border-slate-300 rounded-xl px-3 py-1.5 text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#1B2A4A]"
          >
            {STATUS_FILTERS.map((s) => (
              <option key={s} value={s}>
                {s === "ALL" ? "All Statuses" : s}
              </option>
            ))}
          </select>
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-64">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search student or roll number..."
            className="w-full pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#1B2A4A]"
          />
        </div>
      </div>

      {/* Attendance Register Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-16 text-center text-xs text-slate-500">
            Querying biometric access logs for {date}...
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-16 text-center text-xs text-slate-500">
            No attendance records match the selected filters.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-[#1B2A4A] text-white">
                  <th className="p-3.5 font-bold">Roll #</th>
                  <th className="p-3.5 font-bold">Student Name</th>
                  <th className="p-3.5 font-bold">Class & Sec</th>
                  <th className="p-3.5 font-bold text-center">Gate Punch Time</th>
                  <th className="p-3.5 font-bold text-center">Terminal Device</th>
                  <th className="p-3.5 font-bold text-center">Biometric Status</th>
                  <th className="p-3.5 font-bold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((item, idx) => {
                  const isPresent = item.status === "PRESENT";
                  const isLate = item.status === "LATE";
                  const isAbsent = item.status === "ABSENT";
                  const isLeave = item.status === "LEAVE";

                  return (
                    <tr
                      key={item.studentId}
                      className={`hover:bg-slate-50/70 transition ${
                        idx % 2 === 0 ? "bg-white" : "bg-slate-50/50"
                      }`}
                    >
                      <td className="p-3.5 font-mono font-bold text-[#1B2A4A]">{item.rollNumber}</td>
                      <td className="p-3.5 font-bold text-slate-900">
                        {item.name}
                        <span className="block text-[10px] text-slate-400 font-normal">
                          S/O {item.fatherName}
                        </span>
                      </td>
                      <td className="p-3.5">
                        <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-semibold border border-slate-200">
                          {item.className} - {item.section}
                        </span>
                      </td>
                      <td className="p-3.5 text-center font-mono font-bold text-slate-800">
                        {item.checkInTime ? (
                          <span className="inline-flex items-center gap-1 bg-slate-100 border border-slate-200 px-2 py-0.5 rounded text-[11px]">
                            <Clock className="w-3 h-3 text-[#1B2A4A]" />
                            {item.checkInTime}
                          </span>
                        ) : (
                          <span className="text-slate-400 italic text-[11px]">No punch</span>
                        )}
                      </td>
                      <td className="p-3.5 text-center">
                        {item.deviceId ? (
                          <span className="font-mono text-[10px] bg-[#FCF9EE] border border-[#D4AF37]/50 text-[#1B2A4A] font-bold px-2 py-0.5 rounded">
                            {item.deviceId}
                          </span>
                        ) : (
                          <span className="text-slate-400 text-[11px]">—</span>
                        )}
                      </td>
                      <td className="p-3.5 text-center">
                        {isPresent && (
                          <span className="inline-flex items-center gap-1 bg-emerald-100 text-emerald-800 text-[11px] font-bold px-2.5 py-0.5 rounded-full">
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" /> PRESENT
                          </span>
                        )}
                        {isLate && (
                          <span className="inline-flex items-center gap-1 bg-amber-100 text-amber-800 text-[11px] font-bold px-2.5 py-0.5 rounded-full">
                            <Clock className="w-3 h-3 text-amber-600" /> LATE
                          </span>
                        )}
                        {isAbsent && (
                          <span className="inline-flex items-center gap-1 bg-rose-100 text-rose-800 text-[11px] font-bold px-2.5 py-0.5 rounded-full">
                            <XCircle className="w-3 h-3 text-rose-600" /> ABSENT
                          </span>
                        )}
                        {isLeave && (
                          <span className="inline-flex items-center gap-1 bg-blue-100 text-blue-800 text-[11px] font-bold px-2.5 py-0.5 rounded-full">
                            LEAVE
                          </span>
                        )}
                        {item.status === "NOT_MARKED" && (
                          <span className="text-[11px] text-slate-400 italic">Not Marked</span>
                        )}
                      </td>
                      <td className="p-3.5 text-right space-x-1.5">
                        <button
                          onClick={() => handleBiometricPunch(item.rollNumber, item.className)}
                          className="inline-flex items-center gap-1 bg-[#FCF9EE] hover:bg-[#D4AF37] hover:text-[#111C32] text-[#1B2A4A] border border-[#D4AF37] px-2 py-1 rounded-lg text-[10px] font-extrabold transition shadow-xs"
                          title="Trigger Biometric Punch for this student"
                        >
                          <Fingerprint className="w-3 h-3" />
                          <span>Scan</span>
                        </button>

                        <div className="inline-flex items-center gap-0.5 bg-slate-100 p-0.5 rounded-lg border border-slate-200">
                          <button
                            onClick={() => handleManualOverride(item.studentId, "PRESENT")}
                            className="px-1.5 py-0.5 rounded text-[10px] font-bold hover:bg-emerald-600 hover:text-white transition"
                            title="Force Mark Present"
                          >
                            P
                          </button>
                          <button
                            onClick={() => handleManualOverride(item.studentId, "LEAVE")}
                            className="px-1.5 py-0.5 rounded text-[10px] font-bold hover:bg-blue-600 hover:text-white transition"
                            title="Excuse Leave"
                          >
                            L
                          </button>
                          <button
                            onClick={() => handleManualOverride(item.studentId, "ABSENT")}
                            className="px-1.5 py-0.5 rounded text-[10px] font-bold hover:bg-rose-600 hover:text-white transition"
                            title="Force Mark Absent"
                          >
                            A
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
