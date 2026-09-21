"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import ReportCard from "@/components/public/ReportCard";
import { Search, Sparkles, FileText, AlertCircle, ArrowLeft, Printer } from "lucide-react";
import { StudentData, ExamResultData } from "@/lib/types";

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
  { label: "Class 1 - Roll 1 (Aarish Ali)", class: "Class 1", roll: "1" },
  { label: "Class 1 - Roll 43 (Usman - 585/600)", class: "Class 1", roll: "43" },
  { label: "Class 9 - Roll 101", class: "Class 9", roll: "101" },
  { label: "Class 9 - Roll 102", class: "Class 9", roll: "102" },
  { label: "Class 10 - Roll 201", class: "Class 10", roll: "201" },
  { label: "Class 8 - Roll 301", class: "Class 8", roll: "301" },
];

function ResultsContent() {
  const searchParams = useSearchParams();
  const initialClass = searchParams.get("class") || searchParams.get("className") || "Class 9";
  const initialRoll = searchParams.get("roll") || searchParams.get("rollNumber") || "";

  const [selectedClass, setSelectedClass] = useState(initialClass);
  const [rollNumber, setRollNumber] = useState(initialRoll);
  const [loading, setLoading] = useState(false);
  const [student, setStudent] = useState<StudentData | null>(null);
  const [result, setResult] = useState<ExamResultData | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchResult = async (cls: string, roll: string) => {
    if (!cls || !roll.trim()) return;
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`/api/search?className=${encodeURIComponent(cls)}&rollNumber=${encodeURIComponent(roll.trim())}`);
      const data = await res.json();

      if (!res.ok || !data.ok) {
        setError(data.error || "No examination result found for this roll number.");
        setStudent(null);
        setResult(null);
      } else {
        setStudent(data.student);
        setResult(data.latestResult);
        if (!data.latestResult) {
          setError("Student found, but examination results have not been published yet.");
        }
      }
    } catch {
      setError("Unable to connect to the result server. Please check your connection.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (initialRoll) {
      fetchResult(initialClass, initialRoll);
    }
  }, [initialClass, initialRoll]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchResult(selectedClass, rollNumber);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
      {/* If result is loaded, show the official Report Card */}
      {student && result ? (
        <ReportCard
          student={student}
          result={result}
          onBack={() => {
            setStudent(null);
            setResult(null);
          }}
        />
      ) : (
        <div>
          {/* Header */}
          <div className="text-center max-w-2xl mx-auto mb-8">
            <div className="inline-flex items-center gap-2 bg-[#FCF9EE] border border-[#D4AF37] px-3.5 py-1 rounded-full text-xs font-bold text-[#1B2A4A] mb-3">
              <FileText className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>Official Examination Portal</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1B2A4A] tracking-tight">
              Online Result & Progress Report Card
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 mt-2">
              Select your class and enter your roll number to view your subject-wise marksheet and generate an official printable report card.
            </p>
          </div>

          {/* Search Card */}
          <div className="bg-white rounded-2xl shadow-md border border-slate-200/90 p-6 sm:p-8 max-w-2xl mx-auto">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                    Class
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
                    placeholder="Enter Roll Number (e.g. 101)"
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
                <span>{loading ? "Verifying & Generating..." : "Generate Report Card"}</span>
              </button>
            </form>

            {/* Fast Demos */}
            <div className="mt-5 pt-4 border-t border-slate-100">
              <p className="text-xs text-slate-500 font-medium mb-2 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" /> Click to test pre-seeded student cards:
              </p>
              <div className="flex flex-wrap gap-2">
                {DEMOS.map((d) => (
                  <button
                    key={d.label}
                    type="button"
                    onClick={() => {
                      setSelectedClass(d.class);
                      setRollNumber(d.roll);
                      fetchResult(d.class, d.roll);
                    }}
                    className="bg-slate-100 hover:bg-[#FCF9EE] text-slate-700 hover:text-[#1B2A4A] border border-slate-200 hover:border-[#D4AF37] px-3 py-1.5 rounded-lg text-xs font-semibold transition"
                  >
                    {d.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Error State */}
          {error && (
            <div className="mt-6 max-w-2xl mx-auto bg-rose-50 border border-rose-200 text-rose-800 p-4 rounded-xl flex items-start gap-3 text-xs sm:text-sm">
              <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold">Record Search Notice</p>
                <p className="mt-0.5 text-rose-700">{error}</p>
                <p className="mt-2 text-[11px] text-rose-600">
                  Note: Please verify your class and roll number. If your result is still missing, please visit the Examination Office.
                </p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function ResultsPage() {
  return (
    <Suspense
      fallback={
        <div className="max-w-5xl mx-auto p-12 text-center text-slate-500">
          Loading Examination Portal...
        </div>
      }
    >
      <ResultsContent />
    </Suspense>
  );
}
