"use client";

import { useState, useEffect } from "react";
import {
  Calendar as CalendarIcon,
  CheckCircle2,
  Clock,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  DollarSign,
  Info,
  Award,
} from "lucide-react";

interface AttendanceRecord {
  id: string;
  staffId: string;
  date: string; // "YYYY-MM-DD"
  status: "PRESENT" | "LATE" | "ABSENT" | "LEAVE";
  checkInTime: string | null;
  remarks: string | null;
}

interface SalaryRecord {
  id: string;
  month: string;
  basicSalary: number;
  allowances: number;
  deductions: number;
  netSalary: number;
  status: string;
  paidDate: string | null;
  paymentMethod: string | null;
  receiptNumber: string | null;
}

interface StaffProfile {
  id: string;
  name: string;
  role: string;
  designation: string;
  monthlySalary: number;
  salaries?: SalaryRecord[];
}

const MONTH_NAMES = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const DAYS_OF_WEEK = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export default function TeacherAttendanceCalendarPage() {
  const [selectedYear, setSelectedYear] = useState(2025);
  const [selectedMonthIndex, setSelectedMonthIndex] = useState(8); // September (0-indexed)
  const [records, setRecords] = useState<AttendanceRecord[]>([]);
  const [profile, setProfile] = useState<StaffProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const monthString = `${selectedYear}-${String(selectedMonthIndex + 1).padStart(2, "0")}`;
  const monthName = `${MONTH_NAMES[selectedMonthIndex]} ${selectedYear}`;

  useEffect(() => {
    loadMonthlyAttendance();
  }, [selectedYear, selectedMonthIndex]);

  const loadMonthlyAttendance = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/staff/attendance?month=${monthString}`);
      const data = await res.json();
      if (data && data.records) {
        setRecords(data.records);
      }
      if (data && data.profile) {
        setProfile(data.profile);
      }
    } catch {
      console.error("Failed to load monthly attendance");
    } finally {
      setLoading(false);
    }
  };

  const handlePrevMonth = () => {
    if (selectedMonthIndex === 0) {
      setSelectedMonthIndex(11);
      setSelectedYear((y) => y - 1);
    } else {
      setSelectedMonthIndex((m) => m - 1);
    }
  };

  const handleNextMonth = () => {
    if (selectedMonthIndex === 11) {
      setSelectedMonthIndex(0);
      setSelectedYear((y) => y + 1);
    } else {
      setSelectedMonthIndex((m) => m + 1);
    }
  };

  // Calendar calculations
  const totalDaysInMonth = new Date(selectedYear, selectedMonthIndex + 1, 0).getDate();
  const firstDayOfWeek = (new Date(selectedYear, selectedMonthIndex, 1).getDay() + 6) % 7; // Monday = 0, Sunday = 6

  // Aggregate stats
  const presentDays = records.filter((r) => r.status === "PRESENT").length;
  const lateDays = records.filter((r) => r.status === "LATE").length;
  const leaveDays = records.filter((r) => r.status === "LEAVE").length;
  const absentDays = records.filter((r) => r.status === "ABSENT").length;
  const totalRecorded = records.length;
  const attendanceRate = totalRecorded > 0 ? Math.round(((presentDays + lateDays) / totalRecorded) * 100) : 0;

  // Matching monthly salary record
  const matchingSalary = profile?.salaries?.find(
    (s) => s.month.toLowerCase() === monthName.toLowerCase()
  );

  return (
    <div className="space-y-6 max-w-7xl mx-auto font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <div className="inline-flex items-center gap-2 bg-[#FCF9EE] border border-[#D4AF37] px-3 py-0.5 rounded-full text-xs font-bold text-[#0D1B3D] mb-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span>Official Faculty Register • View Only</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight font-heading flex items-center gap-2">
            <CalendarIcon className="w-7 h-7 text-[#0D1B3D]" />
            <span>My Attendance & Salary Status</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Faculty Member: <strong className="text-slate-800">{profile?.name || "Teacher"}</strong> ({profile?.designation || "Senior Faculty"})
          </p>
        </div>

        {/* Month Navigation Controls */}
        <div className="flex items-center gap-2 bg-[#F2F4F7] p-1.5 rounded-2xl border border-slate-200">
          <button
            onClick={handlePrevMonth}
            className="p-2 rounded-xl bg-white text-slate-700 hover:text-[#0D1B3D] hover:bg-slate-50 border border-slate-200 transition shadow-xs cursor-pointer"
            title="Previous Month"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="font-extrabold text-sm text-[#0D1B3D] px-3 min-w-[140px] text-center font-heading">
            {monthName}
          </span>
          <button
            onClick={handleNextMonth}
            className="p-2 rounded-xl bg-white text-slate-700 hover:text-[#0D1B3D] hover:bg-slate-50 border border-slate-200 transition shadow-xs cursor-pointer"
            title="Next Month"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* KPI Cards Row */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3.5">
        {/* Attendance Rate */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Attendance Rate</p>
          <h3 className="text-2xl font-black text-[#0D1B3D] mt-1 font-heading">
            {attendanceRate}%
          </h3>
          <p className="text-[11px] text-slate-500 mt-0.5">{totalRecorded} recorded days</p>
        </div>

        {/* Present Days */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
          <p className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" /> Present
          </p>
          <h3 className="text-2xl font-black text-emerald-600 mt-1 font-heading">
            {presentDays}
          </h3>
          <p className="text-[11px] text-slate-500 mt-0.5">On-time check-ins</p>
        </div>

        {/* Late Days */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
          <p className="text-[10px] font-bold uppercase tracking-wider text-amber-600 flex items-center gap-1">
            <Clock className="w-3 h-3" /> Late Arrivals
          </p>
          <h3 className="text-2xl font-black text-amber-600 mt-1 font-heading">
            {lateDays}
          </h3>
          <p className="text-[11px] text-slate-500 mt-0.5">Late logs</p>
        </div>

        {/* Approved Leave */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
          <p className="text-[10px] font-bold uppercase tracking-wider text-blue-600 flex items-center gap-1">
            <Info className="w-3 h-3" /> Leaves
          </p>
          <h3 className="text-2xl font-black text-blue-600 mt-1 font-heading">
            {leaveDays}
          </h3>
          <p className="text-[11px] text-slate-500 mt-0.5">Approved sick/casual</p>
        </div>

        {/* Monthly Salary Status */}
        <div className="bg-white p-4 rounded-2xl border border-[#D4AF37]/50 shadow-sm col-span-2 sm:col-span-1 bg-gradient-to-br from-white to-[#FCF9EE]">
          <p className="text-[10px] font-bold uppercase tracking-wider text-[#0D1B3D] flex items-center gap-1">
            <DollarSign className="w-3 h-3 text-[#D4AF37]" /> Salary Status
          </p>
          <div className="flex items-baseline gap-1 mt-1">
            <h3 className="text-xl font-black text-[#0D1B3D] font-heading">
              Rs. {matchingSalary ? matchingSalary.netSalary.toLocaleString() : (profile?.monthlySalary || 35000).toLocaleString()}
            </h3>
          </div>
          <span
            className={`inline-block mt-1 px-2 py-0.5 rounded text-[10px] font-extrabold ${
              matchingSalary?.status === "PAID"
                ? "bg-emerald-100 text-emerald-800"
                : "bg-amber-100 text-amber-800"
            }`}
          >
            {matchingSalary?.status || "PAID"} {matchingSalary?.paidDate ? `• ${matchingSalary.paidDate}` : ""}
          </span>
        </div>
      </div>

      {/* Main Calendar View */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 sm:p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-slate-900 font-heading flex items-center gap-2">
              <span>Monthly Attendance Calendar</span>
              <span className="text-xs font-normal text-slate-400">— {monthName}</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Green represents on-time arrival. Yellow represents late arrival. Blue represents approved leave.
            </p>
          </div>

          {/* Legend Chips */}
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className="inline-flex items-center gap-1 bg-emerald-50 border border-emerald-200 text-emerald-800 px-2 py-0.5 rounded-md font-semibold text-[11px]">
              <span className="w-2 h-2 rounded-full bg-emerald-500" /> Present
            </span>
            <span className="inline-flex items-center gap-1 bg-amber-50 border border-amber-200 text-amber-800 px-2 py-0.5 rounded-md font-semibold text-[11px]">
              <span className="w-2 h-2 rounded-full bg-amber-500" /> Late
            </span>
            <span className="inline-flex items-center gap-1 bg-blue-50 border border-blue-200 text-blue-800 px-2 py-0.5 rounded-md font-semibold text-[11px]">
              <span className="w-2 h-2 rounded-full bg-blue-500" /> Leave
            </span>
            <span className="inline-flex items-center gap-1 bg-slate-100 border border-slate-200 text-slate-500 px-2 py-0.5 rounded-md font-semibold text-[11px]">
              <span className="w-2 h-2 rounded-full bg-slate-300" /> Sunday / Off
            </span>
          </div>
        </div>

        {/* Days of Week Header */}
        <div className="grid grid-cols-7 gap-1.5 sm:gap-2 text-center text-xs font-extrabold text-slate-500 uppercase tracking-wider py-2 bg-slate-50 rounded-xl border border-slate-100">
          {DAYS_OF_WEEK.map((d) => (
            <div key={d} className={d === "Sun" ? "text-rose-500" : ""}>
              {d}
            </div>
          ))}
        </div>

        {/* Calendar Grid Cells */}
        <div className="grid grid-cols-7 gap-1.5 sm:gap-2">
          {/* Empty padding cells for first week */}
          {Array.from({ length: firstDayOfWeek }).map((_, idx) => (
            <div
              key={`empty-${idx}`}
              className="min-h-[85px] sm:min-h-[105px] rounded-xl border border-dashed border-slate-100 bg-slate-50/40 p-1.5 opacity-40"
            />
          ))}

          {/* Actual Month Days */}
          {Array.from({ length: totalDaysInMonth }).map((_, dayIdx) => {
            const dayNumber = dayIdx + 1;
            const dateStr = `${selectedYear}-${String(selectedMonthIndex + 1).padStart(2, "0")}-${String(dayNumber).padStart(2, "0")}`;
            const dayOfWeek = (firstDayOfWeek + dayIdx) % 7;
            const isSunday = dayOfWeek === 6;

            const record = records.find((r) => r.date === dateStr);

            return (
              <div
                key={dateStr}
                className={`min-h-[85px] sm:min-h-[105px] rounded-xl border p-2 sm:p-2.5 flex flex-col justify-between transition ${
                  isSunday
                    ? "bg-slate-50/70 border-slate-200/80 text-slate-400"
                    : record?.status === "PRESENT"
                    ? "bg-emerald-50/60 border-emerald-200 text-emerald-950 hover:shadow-xs"
                    : record?.status === "LATE"
                    ? "bg-amber-50/80 border-amber-200 text-amber-950 hover:shadow-xs"
                    : record?.status === "LEAVE"
                    ? "bg-blue-50/80 border-blue-200 text-blue-950 hover:shadow-xs"
                    : record?.status === "ABSENT"
                    ? "bg-rose-50 border-rose-200 text-rose-900"
                    : "bg-white border-slate-200/90 text-slate-700"
                }`}
              >
                {/* Top Row: Date Number */}
                <div className="flex items-center justify-between">
                  <span
                    className={`text-xs sm:text-sm font-black font-heading ${
                      isSunday ? "text-rose-400" : "text-slate-900"
                    }`}
                  >
                    {dayNumber}
                  </span>

                  {record?.status === "PRESENT" && (
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  )}
                  {record?.status === "LATE" && (
                    <span className="w-2 h-2 rounded-full bg-amber-500" />
                  )}
                  {record?.status === "LEAVE" && (
                    <span className="w-2 h-2 rounded-full bg-blue-500" />
                  )}
                </div>

                {/* Center / Bottom: Status details */}
                <div className="mt-1 space-y-0.5">
                  {isSunday ? (
                    <span className="text-[10px] text-slate-400 font-semibold block">
                      Sunday Off
                    </span>
                  ) : record ? (
                    <>
                      <span
                        className={`inline-block px-1.5 py-0.5 rounded text-[9px] sm:text-[10px] font-black uppercase tracking-wider ${
                          record.status === "PRESENT"
                            ? "bg-emerald-100 text-emerald-800"
                            : record.status === "LATE"
                            ? "bg-amber-100 text-amber-800"
                            : record.status === "LEAVE"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-rose-100 text-rose-800"
                        }`}
                      >
                        {record.status}
                      </span>
                      {record.checkInTime && (
                        <p className="text-[10px] sm:text-[11px] font-mono font-bold text-slate-700">
                          {record.checkInTime}
                        </p>
                      )}
                      {record.remarks && (
                        <p className="text-[9px] text-slate-400 truncate hidden sm:block" title={record.remarks}>
                          {record.remarks}
                        </p>
                      )}
                    </>
                  ) : (
                    <span className="text-[10px] text-slate-300 font-semibold italic">
                      —
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Official Policy Note */}
      <div className="bg-[#F2F4F7] border border-slate-200 rounded-2xl p-4 sm:p-5 flex items-start gap-3 text-xs text-slate-600">
        <ShieldCheck className="w-5 h-5 text-[#1E3A8A] shrink-0 mt-0.5" />
        <div className="space-y-1">
          <p className="font-bold text-slate-800">
            Attendance Administration Policy
          </p>
          <p>
            Daily morning attendance is maintained and verified directly by the School Administration / Principal Office. Faculty members can monitor their real-time monthly status, arrival times, and salary release records above. For formal leave requests, corrections, or medical certificates, please submit an application to the Administration Office.
          </p>
        </div>
      </div>
    </div>
  );
}
