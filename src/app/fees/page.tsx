"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { CreditCard, Search, Sparkles, CheckCircle2, Clock, XCircle, AlertCircle, Building, Smartphone, HelpCircle } from "lucide-react";
import { StudentData, FeeRecordData } from "@/lib/types";

const CLASSES = [
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

const DEMOS = [
  { label: "Class 9 - Roll 101 (Paid)", class: "Class 9", roll: "101" },
  { label: "Class 9 - Roll 103 (Pending)", class: "Class 9", roll: "103" },
  { label: "Class 9 - Roll 105 (Unpaid)", class: "Class 9", roll: "105" },
  { label: "Class 10 - Roll 201 (Paid)", class: "Class 10", roll: "201" },
];

export default function FeesPage() {
  const [selectedClass, setSelectedClass] = useState("Class 9");
  const [rollNumber, setRollNumber] = useState("");
  const [loading, setLoading] = useState(false);
  const [student, setStudent] = useState<StudentData | null>(null);
  const [fees, setFees] = useState<FeeRecordData[]>([]);
  const [error, setError] = useState<string | null>(null);

  const fetchFees = async (cls = selectedClass, roll = rollNumber) => {
    if (!cls || !roll.trim()) {
      setError("Please select your class and enter your roll number.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`/api/search?className=${encodeURIComponent(cls)}&rollNumber=${encodeURIComponent(roll.trim())}`);
      const data = await res.json();

      if (!res.ok || !data.ok) {
        setError(data.error || "No student record found. Please verify roll number.");
        setStudent(null);
        setFees([]);
      } else {
        setStudent(data.student);
        setFees(data.fees || []);
      }
    } catch {
      setError("Unable to connect to fee server. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto mb-8">
        <div className="inline-flex items-center gap-2 bg-[#FCF9EE] border border-[#D4AF37] px-3.5 py-1 rounded-full text-xs font-bold text-[#1B2A4A] mb-3">
          <CreditCard className="w-3.5 h-3.5 text-[#D4AF37]" />
          <span>Accounts & Fee Verification Portal</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1B2A4A] tracking-tight">
          Monthly Fee Status & Challan Lookup
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 mt-2">
          Verify tuition dues, download receipt numbers, and review school fee policies without visiting the accounts counter.
        </p>
      </div>

      {/* Search Bar Card */}
      <div className="bg-white rounded-2xl shadow-md border border-slate-200/90 p-6 sm:p-8 max-w-2xl mx-auto mb-10">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            fetchFees();
          }}
          className="space-y-4"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                Select Class
              </label>
              <select
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
                className="w-full h-12 bg-slate-50 border border-slate-300 rounded-xl px-3.5 text-sm font-medium text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#1B2A4A]"
              >
                {CLASSES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                Roll Number
              </label>
              <input
                type="text"
                value={rollNumber}
                onChange={(e) => setRollNumber(e.target.value)}
                placeholder="Enter Roll Number"
                className="w-full h-12 bg-slate-50 border border-slate-300 rounded-xl px-3.5 text-sm font-medium text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#1B2A4A]"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full h-12 bg-[#1B2A4A] hover:bg-[#111C32] text-white font-bold rounded-xl flex items-center justify-center gap-2 shadow-md transition disabled:opacity-60"
          >
            <Search className="w-4 h-4 text-[#D4AF37]" />
            <span>{loading ? "Checking Status..." : "Check Fee Status"}</span>
          </button>
        </form>

        {/* Demos */}
        <div className="mt-5 pt-4 border-t border-slate-100">
          <p className="text-xs text-slate-500 font-medium mb-2 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" /> Test pre-seeded fee vouchers:
          </p>
          <div className="flex flex-wrap gap-2">
            {DEMOS.map((d) => (
              <button
                key={d.label}
                type="button"
                onClick={() => {
                  setSelectedClass(d.class);
                  setRollNumber(d.roll);
                  fetchFees(d.class, d.roll);
                }}
                className="bg-slate-100 hover:bg-[#FCF9EE] text-slate-700 hover:text-[#1B2A4A] border border-slate-200 hover:border-[#D4AF37] px-3 py-1 rounded-lg text-xs font-semibold transition"
              >
                {d.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Error state */}
      {error && (
        <div className="max-w-2xl mx-auto mb-10 bg-rose-50 border border-rose-200 text-rose-800 p-4 rounded-xl flex items-start gap-3 text-xs sm:text-sm">
          <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
          <div>
            <p className="font-bold">Fee Record Notice</p>
            <p className="text-xs mt-0.5 text-rose-700">{error}</p>
          </div>
        </div>
      )}

      {/* Result Section */}
      {student && (
        <div className="max-w-3xl mx-auto mb-12 space-y-6">
          {/* Student Profile Card */}
          <div className="bg-[#1B2A4A] text-white p-5 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-md">
            <div>
              <h3 className="text-xl font-bold">{student.name}</h3>
              <p className="text-xs text-slate-300 mt-0.5">
                Father: <span className="font-semibold text-white">{student.fatherName}</span> • Class:{" "}
                <span className="font-semibold text-white">{student.className}</span> ({student.section})
              </p>
            </div>
            <div className="text-left sm:text-right">
              <span className="inline-block bg-[#D4AF37] text-[#111C32] text-xs font-bold px-3 py-1 rounded-full uppercase">
                Roll #{student.rollNumber}
              </span>
            </div>
          </div>

          {/* Fee Vouchers List */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
            <h4 className="font-bold text-base text-slate-900 mb-4 pb-2 border-b border-slate-100">
              Fee Records & History
            </h4>

            {fees.length > 0 ? (
              <div className="space-y-4">
                {fees.map((fee) => {
                  const isPaid = fee.status === "PAID";
                  const isPending = fee.status === "PENDING";
                  return (
                    <div
                      key={fee.id}
                      className="p-4 rounded-xl border border-slate-200 bg-[#F8F9FB] flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-base text-[#1B2A4A]">{fee.month}</span>
                          <span className="text-xs text-slate-500 font-medium">({fee.notes || "Monthly Dues"})</span>
                        </div>
                        <p className="text-xs text-slate-600 mt-1">
                          Amount: <strong className="text-slate-900">Rs. {fee.amount.toLocaleString()}</strong> • Due Date: {fee.dueDate}
                        </p>
                        {fee.receiptNumber && (
                          <p className="text-xs text-emerald-700 font-mono mt-1 font-semibold">
                            Receipt No: {fee.receiptNumber} {fee.paidDate && `(Paid on ${fee.paidDate})`}
                          </p>
                        )}
                      </div>

                      <div className="shrink-0">
                        {isPaid && (
                          <span className="inline-flex items-center gap-1.5 bg-emerald-100 text-emerald-800 text-xs font-bold px-3.5 py-1.5 rounded-full border border-emerald-300">
                            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                            PAID IN FULL
                          </span>
                        )}
                        {isPending && (
                          <span className="inline-flex items-center gap-1.5 bg-amber-100 text-amber-800 text-xs font-bold px-3.5 py-1.5 rounded-full border border-amber-300">
                            <Clock className="w-4 h-4 text-amber-600" />
                            PENDING PAYMENT
                          </span>
                        )}
                        {!isPaid && !isPending && (
                          <span className="inline-flex items-center gap-1.5 bg-rose-100 text-rose-800 text-xs font-bold px-3.5 py-1.5 rounded-full border border-rose-300">
                            <XCircle className="w-4 h-4 text-rose-600" />
                            OVERDUE / UNPAID
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-xs text-slate-500 text-center py-6">
                No fee history found for this student.
              </p>
            )}
          </div>
        </div>
      )}

      {/* Official Payment Channels & Guidelines */}
      <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
        {/* Counter Payment */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div className="w-10 h-10 rounded-xl bg-[#1B2A4A]/5 text-[#1B2A4A] flex items-center justify-center mb-3">
            <Building className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-base text-slate-900">1. School Accounts Counter</h3>
          <p className="text-xs text-slate-600 mt-1 leading-relaxed">
            Pay in cash or cross-cheque at the main school administration block.
          </p>
          <ul className="mt-3 space-y-1.5 text-xs text-slate-600">
            <li>• Timings: Monday to Saturday, 8:30 AM – 1:30 PM</li>
            <li>• Bring student roll number or previous fee receipt</li>
            <li>• Computerized payment receipt issued instantly</li>
          </ul>
        </div>

        {/* Online / Digital Transfer */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div className="w-10 h-10 rounded-xl bg-[#1B2A4A]/5 text-[#1B2A4A] flex items-center justify-center mb-3">
            <Smartphone className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-base text-slate-900">2. Online & Mobile Banking</h3>
          <p className="text-xs text-slate-600 mt-1 leading-relaxed">
            Direct bank transfer, EasyPaisa, JazzCash, or Raast deposit.
          </p>
          <ul className="mt-3 space-y-1.5 text-xs text-slate-600">
            <li>• <strong>Bank:</strong> Habib Bank Limited (HBL) / MCB Mirwah</li>
            <li>• <strong>Account Title:</strong> Nayab Grammar School</li>
            <li>• <strong>Challan / Reference:</strong> Enter Student Class & Roll No</li>
            <li>• Share transaction screenshot via WhatsApp to: 0301-2345670</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
