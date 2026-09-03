export function calculateGrade(percentage: number): { grade: string; remarks: string; isPass: boolean } {
  if (percentage >= 80) {
    return { grade: "A+", remarks: "Outstanding Performance", isPass: true };
  } else if (percentage >= 70) {
    return { grade: "A", remarks: "Excellent Progress", isPass: true };
  } else if (percentage >= 60) {
    return { grade: "B", remarks: "Very Good Effort", isPass: true };
  } else if (percentage >= 50) {
    return { grade: "C", remarks: "Satisfactory / Pass", isPass: true };
  } else {
    return { grade: "F", remarks: "Needs Urgent Improvement", isPass: false };
  }
}

export function calculateSubjectGrade(obtained: number, max: number): string {
  if (max <= 0) return "F";
  const pct = (obtained / max) * 100;
  if (pct >= 80) return "A+";
  if (pct >= 70) return "A";
  if (pct >= 60) return "B";
  if (pct >= 50) return "C";
  return "F";
}

export const GRADE_CRITERIA = [
  { grade: "A+", band: "80% and above", descriptor: "Outstanding", color: "text-emerald-700 bg-emerald-50 border-emerald-200" },
  { grade: "A", band: "70% – 79.9%", descriptor: "Excellent", color: "text-blue-700 bg-blue-50 border-blue-200" },
  { grade: "B", band: "60% – 69.9%", descriptor: "Very Good", color: "text-amber-700 bg-amber-50 border-amber-200" },
  { grade: "C", band: "50% – 59.9%", descriptor: "Satisfactory", color: "text-orange-700 bg-orange-50 border-orange-200" },
  { grade: "F", band: "Below 50%", descriptor: "Fail / Needs Improvement", color: "text-rose-700 bg-rose-50 border-rose-200" },
];
