"use client";

import { useState, useEffect } from "react";
import { Fingerprint, CheckCircle2, Clock, XCircle, Filter, Calendar, AlertCircle } from "lucide-react";

interface AttendanceItem {
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

export default function TeacherAttendancePage() {
  const [selectedClass, setSelectedClass] = useState("Class 9");
  const [date, setDate] = useState("2025-09-10");
  const [items, setItems] = useState<AttendanceItem[]>([]);
  const [summary, setSummary] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAttendance();
  }, [selectedClass, date]);

  const loadAttendance = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/attendance?className=${encodeURIComponent(selectedClass)}&date=${date}`);
      const data = await res.json();
      if (data && data.items) {
        setItems(data.items);
        setSummary(data.summary);
      }
    } catch {
      console.error("Failed to load attendance");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (studentId: string, status: "PRESENT" | "LATE" | "ABSENT" | "LEAVE") => {
    try {
      const res = await fetch("/api/attendance", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ studentId, date, status, remarks: `Status adjusted to ${status} by class teacher` }),
      });
      if (res.ok) {
        loadAttendance();
      }
    } catch {
      alert("Failed to update status");
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 bg-[#FCF9EE] border border-[#D4AF37] px-3 py-0.5 rounded-full text-xs font-bold text-[#1B2A4A] mb-1.5">
            <Fingerprint className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span>Biometric Gate Verification</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <span>Class Attendance Register</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Real-time biometric scanner logs, arrival timestamps, and attendance monitoring.
          </p>
        </div>
      </div>

      {/* Summary KPI Cards */}
      {summary && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
            <span className="text-[11px] font-bold text-slate-400 uppercase">Class Attendance</span>
            <p className="text-2xl font-black text-[#1B2A4A] mt-0.5">{summary.attendancePercentage}%</p>
            <p className="text-[10px] text-slate-500">{summary.totalStudents} total students</p>
          </div>

          <div className="bg-emerald-50/70 p-4 rounded-2xl border border-emerald-200 shadow-sm">
            <span className="text-[11px] font-bold text-emerald-800 uppercase flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" /> On-Time Present
            </span>
            <p className="text-2xl font-black text-emerald-800 mt-0.5">{summary.presentCount}</p>
            <p className="text-[10px] text-emerald-600">Before 8:15 AM</p>
          </div>

          <div className="bg-amber-50/70 p-4 rounded-2xl border border-amber-200 shadow-sm">
            <span className="text-[11px] font-bold text-amber-800 uppercase flex items-center gap-1">
              <Clock className="w-3 h-3" /> Late Arrivals
            </span>
            <p className="text-2xl font-black text-amber-800 mt-0.5">{summary.lateCount}</p>
            <p className="text-[10px] text-amber-600">After 8:15 AM cut-off</p>
          </div>

          <div className="bg-rose-50/70 p-4 rounded-2xl border border-rose-200 shadow-sm">
            <span className="text-[11px] font-bold text-rose-800 uppercase flex items-center gap-1">
              <XCircle className="w-3 h-3" /> Absent / Unrecorded
            </span>
            <p className="text-2xl font-black text-rose-800 mt-0.5">
              {summary.absentCount + summary.notMarkedCount}
            </p>
            <p className="text-[10px] text-rose-600">No punch detected</p>
          </div>
        </div>
      )}

      {/* Filter Controls */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-3">
          <div>
            <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">Class</label>
            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="bg-slate-50 border border-slate-300 rounded-xl px-3 py-1.5 text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#1B2A4A]"
            >
              <option value="Class 10">Class 10</option>
              <option value="Class 9">Class 9</option>
              <option value="Class 8">Class 8</option>
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1 flex items-center gap-1">
              <Calendar className="w-3 h-3" /> Date
            </label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="bg-slate-50 border border-slate-300 rounded-xl px-3 py-1.5 text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#1B2A4A]"
            />
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-16 text-center text-xs text-slate-500">Loading attendance register...</div>
        ) : items.length === 0 ? (
          <div className="p-16 text-center text-xs text-slate-500">No students found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-[#1B2A4A] text-white">
                  <th className="p-3.5 font-bold">Roll #</th>
                  <th className="p-3.5 font-bold">Student Name</th>
                  <th className="p-3.5 font-bold">Father&apos;s Name</th>
                  <th className="p-3.5 font-bold text-center">Biometric Punch Time</th>
                  <th className="p-3.5 font-bold text-center">Device Stamp</th>
                  <th className="p-3.5 font-bold text-center">Status</th>
                  <th className="p-3.5 font-bold text-right">Quick Override</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {items.map((item, idx) => {
                  const isPresent = item.status === "PRESENT";
                  const isLate = item.status === "LATE";
                  const isAbsent = item.status === "ABSENT";
                  const isLeave = item.status === "LEAVE";

                  return (
                    <tr
                      key={item.studentId}
                      className={`hover:bg-slate-50/70 transition ${
                        idx % 2 === 0 ? "bg-white" : "bg-slate-50/40"
                      }`}
                    >
                      <td className="p-3.5 font-mono font-bold text-[#1B2A4A]">{item.rollNumber}</td>
                      <td className="p-3.5 font-bold text-slate-900">{item.name}</td>
                      <td className="p-3.5 text-slate-600">{item.fatherName}</td>
                      <td className="p-3.5 text-center font-mono font-semibold text-slate-800">
                        {item.checkInTime ? (
                          <span className="inline-flex items-center gap-1">
                            <Clock className="w-3 h-3 text-[#D4AF37]" />
                            {item.checkInTime}
                          </span>
                        ) : (
                          <span className="text-slate-400 italic text-[11px]">No punch recorded</span>
                        )}
                      </td>
                      <td className="p-3.5 text-center">
                        {item.deviceId ? (
                          <span className="font-mono text-[10px] bg-slate-100 px-2 py-0.5 rounded border border-slate-200 font-bold text-slate-700">
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
                      <td className="p-3.5 text-right">
                        <div className="inline-flex items-center gap-1 bg-slate-100 p-0.5 rounded-lg border border-slate-200">
                          <button
                            onClick={() => handleUpdateStatus(item.studentId, "PRESENT")}
                            className="px-2 py-0.5 rounded text-[10px] font-bold hover:bg-emerald-600 hover:text-white transition"
                          >
                            Present
                          </button>
                          <button
                            onClick={() => handleUpdateStatus(item.studentId, "LEAVE")}
                            className="px-2 py-0.5 rounded text-[10px] font-bold hover:bg-blue-600 hover:text-white transition"
                          >
                            Leave
                          </button>
                          <button
                            onClick={() => handleUpdateStatus(item.studentId, "ABSENT")}
                            className="px-2 py-0.5 rounded text-[10px] font-bold hover:bg-rose-600 hover:text-white transition"
                          >
                            Absent
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
