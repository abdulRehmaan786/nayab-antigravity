export type Role = "ADMIN" | "TEACHER" | "STUDENT";

export interface SubjectMark {
  subject: string;
  maxMarks: number;
  obtainedMarks: number;
  grade: string;
  remarks?: string;
}

export interface StudentData {
  id: string;
  rollNumber: string;
  name: string;
  fatherName: string;
  className: string;
  section: string;
  gender: string;
  phone?: string | null;
  dateOfBirth?: string | null;
  address?: string | null;
}

export interface ExamResultData {
  id: string;
  studentId: string;
  student?: StudentData;
  examTerm: string;
  academicYear: string;
  subjectMarks: SubjectMark[] | string;
  totalMarks: number;
  obtainedMarks: number;
  percentage: number;
  overallGrade: string;
  status: "PASS" | "FAIL" | string;
  remarks?: string | null;
  publishedAt: string | Date;
}

export interface FeeRecordData {
  id: string;
  studentId: string;
  student?: StudentData;
  month: string;
  amount: number;
  dueDate: string;
  status: "PAID" | "PENDING" | "UNPAID";
  paidDate?: string | null;
  receiptNumber?: string | null;
  notes?: string | null;
}

export interface AnnouncementData {
  id: string;
  title: string;
  content: string;
  category: "NOTICE" | "EVENT" | "HOLIDAY" | "EXAM";
  isPinned: boolean;
  publishedBy: string;
  date: string;
  createdAt: string | Date;
}

export interface AuthSession {
  userId: string;
  name: string;
  email: string;
  role: "ADMIN" | "TEACHER";
  assignedClasses: string[];
}
