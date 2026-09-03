"use client";

import { useState, useEffect } from "react";
import { CreditCard, Filter, Plus, CheckCircle2, Clock, XCircle, Search, RefreshCw, X, AlertCircle } from "lucide-react";
import { FeeRecordData, StudentData } from "@/lib/types";

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
];

const MONTHS = [
  "ALL",
  "September 2025",
  "August 2025",
  "July 2025",
  "June 2025",
  "May 2025",
  "April 2025",
];

const STATUSES = ["ALL", "PAID", "PENDING", "UNPAID"];

export default function AdminFeesPage() {
  const [fees, setFees] = useState<FeeRecordData[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedClass, setSelectedClass] = useState("All Classes");
  const [selectedMonth, setSelectedMonth] = useState("September 2025");
  const [selectedStatus, setSelectedStatus] = useState("ALL");
  const [searchQuery, setSearchQuery] = useState("");

  // Create Fee Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [students, setStudents] = useState<StudentData[]>([]);
  const [newFeeStudentId, setNewFeeStudentId] = useState("");
  const [newFeeMonth, setNewFeeMonth] = useState("September 2025");
  const [newFeeAmount, setNewFeeAmount] = useState(2500);
  const [newFeeDueDate, setNewFeeDueDate] = useState("10 September 2025");
  const [newFeeStatus, setNewFeeStatus] = useState<"PAID" | "PENDING" | "UNPAID">("PENDING");
  const [creatingFee, setCreatingFee] = useState(false);
  const [modalError, setModalError] = useState<string | null>(null);

  useEffect(() => {
    loadFees();
  }, [selectedClass, selectedMonth, selectedStatus]);

  useEffect(() => {
    // Pre-load students for the modal dropdown
    fetch("/api/students")
      .then((r) => r.json())
      .then((data) => {
        if (data.students) {
          setStudents(data.students);
          if (data.students[0]) setNewFeeStudentId(data.students[0].id);
        }
      });
  }, []);

  const loadFees = async () => {
    setLoading(true);
    try {
      const cls = selectedClass === "All Classes" ? "all" : selectedClass;
      const res = await fetch(
        `/api/fees?className=${encodeURIComponent(cls)}&month=${encodeURIComponent(selectedMonth)}&status=${encodeURIComponent(selectedStatus)}`
      );
      const data = await res.json();
      if (data && data.fees) {
        setFees(data.fees);
      }
    } catch {
      console.error("Failed to load fees");
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async (fee: FeeRecordData, newStatus: "PAID" | "PENDING" | "UNPAID") => {
    try {
      const res = await fetch("/api/fees", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: fee.id,
          status: newStatus,
        }),
      });

      const data = await res.json();
      if (res.ok && data.ok) {
        setFees((prev) =>
          prev.map((f) => (f.id === fee.id ? { ...f, status: newStatus, receiptNumber: data.fee.receiptNumber, paidDate: data.fee.paidDate } : f))
        );
      }
    } catch {
      alert("Failed to update status.");
    }
  };

  const handleCreateFee = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFeeStudentId) {
      setModalError("Please select a student");
      return;
    }

    setCreatingFee(true);
    setModalError(null);

    try {
      const res = await fetch("/api/fees", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          studentId: newFeeStudentId,
          month: newFeeMonth,
          amount: newFeeAmount,
          dueDate: newFeeDueDate,
          status: newFeeStatus,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.ok) {
        setModalError(data.error || "Failed to issue fee voucher.");
      } else {
        setIsModalOpen(false);
        loadFees();
      }
    } catch {
      setModalError("Network error issuing voucher.");
    } finally {
      setCreatingFee(false);
    }
  };

  const filtered = fees.filter((f) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    const sName = f.student?.name?.toLowerCase() || "";
    const sRoll = f.student?.rollNumber?.toLowerCase() || "";
    const recNo = f.receiptNumber?.toLowerCase() || "";
    return sName.includes(q) || sRoll.includes(q) || recNo.includes(q);
  });

  const totalAmount = filtered.reduce((sum, f) => sum + f.amount, 0);
  const totalPaid = filtered.filter((f) => f.status === "PAID").reduce((sum, f) => sum + f.amount, 0);
  const totalPending = filtered.filter((f) => f.status !== "PAID").reduce((sum, f) => sum + f.amount, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <CreditCard className="w-6 h-6 text-[#1B2A4A]" />
            <span>Monthly Fee Register</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Track student vouchers, update payment statuses, and issue official receipts.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center gap-2 bg-[#1B2A4A] hover:bg-[#111C32] text-white px-4 py-2.5 rounded-xl text-xs font-bold shadow transition"
        >
          <Plus className="w-4 h-4 text-[#D4AF37]" />
          <span>Issue Fee Voucher</span>
        </button>
      </div>

      {/* Summary Stat Pills */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-slate-400 uppercase">Filtered Total</span>
            <p className="text-xl font-black text-slate-900 mt-0.5">Rs. {totalAmount.toLocaleString()}</p>
          </div>
          <span className="text-xs font-semibold text-slate-500">{filtered.length} records</span>
        </div>

        <div className="bg-emerald-50/70 p-4 rounded-2xl border border-emerald-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-emerald-800 uppercase">Total Collected</span>
            <p className="text-xl font-black text-emerald-800 mt-0.5">Rs. {totalPaid.toLocaleString()}</p>
          </div>
          <CheckCircle2 className="w-6 h-6 text-emerald-600" />
        </div>

        <div className="bg-amber-50/70 p-4 rounded-2xl border border-amber-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-amber-800 uppercase">Total Outstanding</span>
            <p className="text-xl font-black text-amber-800 mt-0.5">Rs. {totalPending.toLocaleString()}</p>
          </div>
          <Clock className="w-6 h-6 text-amber-600" />
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          {/* Class filter */}
          <select
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
            className="bg-slate-50 border border-slate-300 rounded-xl px-3 py-1.5 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#1B2A4A]"
          >
            {CLASSES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>

          {/* Month filter */}
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="bg-slate-50 border border-slate-300 rounded-xl px-3 py-1.5 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#1B2A4A]"
          >
            {MONTHS.map((m) => (
              <option key={m} value={m}>
                {m === "ALL" ? "All Months" : m}
              </option>
            ))}
          </select>

          {/* Status filter */}
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="bg-slate-50 border border-slate-300 rounded-xl px-3 py-1.5 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#1B2A4A]"
          >
            {STATUSES.map((s) => (
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
            placeholder="Search student, roll, receipt..."
            className="w-full pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#1B2A4A]"
          />
        </div>
      </div>

      {/* Fees Data Table with 1-Click Status Buttons */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-xs text-slate-500">
            Loading fee records...
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center text-slate-500">
            <p className="font-bold text-slate-700 text-sm">No fee vouchers found</p>
            <p className="text-xs text-slate-400 mt-1">Try broadening your search or class filter.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-[#1B2A4A] text-white">
                  <th className="p-3.5 font-bold">Student</th>
                  <th className="p-3.5 font-bold">Class & Roll</th>
                  <th className="p-3.5 font-bold">Month</th>
                  <th className="p-3.5 font-bold">Amount</th>
                  <th className="p-3.5 font-bold">Due Date</th>
                  <th className="p-3.5 font-bold">Receipt Details</th>
                  <th className="p-3.5 font-bold text-center">Status</th>
                  <th className="p-3.5 font-bold text-right">Quick Update</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((fee, idx) => {
                  const isPaid = fee.status === "PAID";
                  const isPending = fee.status === "PENDING";
                  return (
                    <tr key={fee.id} className={idx % 2 === 0 ? "bg-white" : "bg-slate-50/60"}>
                      <td className="p-3.5 font-bold text-slate-900">
                        {fee.student?.name || "Student"}
                        <span className="block text-[11px] font-normal text-slate-500">
                          S/O {fee.student?.fatherName}
                        </span>
                      </td>
                      <td className="p-3.5">
                        <span className="font-semibold text-slate-800">{fee.student?.className}</span>
                        <span className="block font-mono text-slate-500 text-[11px]">
                          Roll #{fee.student?.rollNumber}
                        </span>
                      </td>
                      <td className="p-3.5 font-semibold text-slate-700">{fee.month}</td>
                      <td className="p-3.5 font-bold text-slate-900">Rs. {fee.amount.toLocaleString()}</td>
                      <td className="p-3.5 text-slate-500">{fee.dueDate}</td>
                      <td className="p-3.5">
                        {fee.receiptNumber ? (
                          <div>
                            <span className="font-mono text-emerald-800 font-bold block">{fee.receiptNumber}</span>
                            <span className="text-[10px] text-slate-400">Paid: {fee.paidDate}</span>
                          </div>
                        ) : (
                          <span className="text-slate-400 italic text-[11px]">Uncollected</span>
                        )}
                      </td>
                      <td className="p-3.5 text-center">
                        {isPaid && (
                          <span className="inline-flex items-center gap-1 bg-emerald-100 text-emerald-800 font-bold px-2.5 py-0.5 rounded-full text-[11px]">
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Paid
                          </span>
                        )}
                        {isPending && (
                          <span className="inline-flex items-center gap-1 bg-amber-100 text-amber-800 font-bold px-2.5 py-0.5 rounded-full text-[11px]">
                            <Clock className="w-3 h-3 text-amber-600" /> Pending
                          </span>
                        )}
                        {!isPaid && !isPending && (
                          <span className="inline-flex items-center gap-1 bg-rose-100 text-rose-800 font-bold px-2.5 py-0.5 rounded-full text-[11px]">
                            <XCircle className="w-3 h-3 text-rose-600" /> Unpaid
                          </span>
                        )}
                      </td>
                      <td className="p-3.5 text-right">
                        <div className="inline-flex items-center gap-1 bg-slate-100 p-0.5 rounded-lg border border-slate-200">
                          <button
                            onClick={() => handleToggleStatus(fee, "PAID")}
                            className={`px-2 py-0.5 rounded text-[10px] font-bold transition ${
                              isPaid ? "bg-emerald-700 text-white shadow-xs" : "text-slate-600 hover:text-emerald-700"
                            }`}
                            title="Mark as Paid"
                          >
                            Paid
                          </button>
                          <button
                            onClick={() => handleToggleStatus(fee, "PENDING")}
                            className={`px-2 py-0.5 rounded text-[10px] font-bold transition ${
                              isPending ? "bg-amber-600 text-white shadow-xs" : "text-slate-600 hover:text-amber-700"
                            }`}
                            title="Mark as Pending"
                          >
                            Pending
                          </button>
                          <button
                            onClick={() => handleToggleStatus(fee, "UNPAID")}
                            className={`px-2 py-0.5 rounded text-[10px] font-bold transition ${
                              !isPaid && !isPending
                                ? "bg-rose-700 text-white shadow-xs"
                                : "text-slate-600 hover:text-rose-700"
                            }`}
                            title="Mark as Unpaid"
                          >
                            Unpaid
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

      {/* Issue Fee Voucher Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-5">
              <h3 className="font-extrabold text-lg text-slate-900 flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-[#1B2A4A]" />
                <span>Issue Student Fee Voucher</span>
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

            <form onSubmit={handleCreateFee} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Select Student</label>
                <select
                  value={newFeeStudentId}
                  onChange={(e) => setNewFeeStudentId(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 font-medium text-slate-900 focus:bg-white focus:ring-2 focus:ring-[#1B2A4A]"
                >
                  {students.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.className} - Roll {s.rollNumber}: {s.name} (S/O {s.fatherName})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Month</label>
                <select
                  value={newFeeMonth}
                  onChange={(e) => setNewFeeMonth(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 font-medium text-slate-900 focus:bg-white focus:ring-2 focus:ring-[#1B2A4A]"
                >
                  {MONTHS.filter((m) => m !== "ALL").map((m) => (
                    <option key={m} value={m}>
                      {m}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Fee Amount (Rs.)</label>
                  <input
                    type="number"
                    value={newFeeAmount}
                    onChange={(e) => setNewFeeAmount(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 font-medium text-slate-900 focus:bg-white focus:ring-2 focus:ring-[#1B2A4A]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Due Date</label>
                  <input
                    type="text"
                    value={newFeeDueDate}
                    onChange={(e) => setNewFeeDueDate(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 font-medium text-slate-900 focus:bg-white focus:ring-2 focus:ring-[#1B2A4A]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Initial Status</label>
                <select
                  value={newFeeStatus}
                  onChange={(e) => setNewFeeStatus(e.target.value as "PAID" | "PENDING" | "UNPAID")}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 font-medium text-slate-900 focus:bg-white focus:ring-2 focus:ring-[#1B2A4A]"
                >
                  <option value="PENDING">PENDING</option>
                  <option value="PAID">PAID</option>
                  <option value="UNPAID">UNPAID</option>
                </select>
              </div>

              <div className="pt-3 flex items-center justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-300 text-slate-700 font-bold hover:bg-slate-50 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={creatingFee}
                  className="px-5 py-2 rounded-xl bg-[#1B2A4A] text-white font-bold hover:bg-[#111C32] transition disabled:opacity-60"
                >
                  {creatingFee ? "Issuing..." : "Issue Voucher"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
