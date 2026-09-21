export type Role = "ADMIN" | "TEACHER" | "STUDENT";

export interface SubjectMark {
  subject: string;
  maxMarks: number;
  obtainedMarks: number;
  grade: string;
  remarks?: string;
}

export interface TeacherSubjectAssignment {
  className: string;
  subject: string;
  maxMarks?: number;
}

export interface AttendanceRecordData {
  id: string;
  studentId: string;
  student?: StudentData;
  date: string;
  status: "PRESENT" | "LATE" | "ABSENT" | "LEAVE";
  checkInTime?: string | null;
  deviceType: "BIOMETRIC_FINGERPRINT" | "RFID_CARD" | "MANUAL" | string;
  deviceId?: string | null;
  remarks?: string | null;
  createdAt: string | Date;
}

export interface AttendanceSummary {
  totalDays: number;
  presentDays: number;
  lateDays: number;
  absentDays: number;
  leaveDays: number;
  percentage: number;
  todayStatus?: {
    status: "PRESENT" | "LATE" | "ABSENT" | "LEAVE" | "NOT_RECORDED";
    checkInTime?: string | null;
    deviceId?: string | null;
    deviceType?: string | null;
  };
}

export interface StudentData {
  id: string;
  rollNumber: string;
  grNumber?: string | null;
  name: string;
  fatherName: string;
  className: string;
  section: string;
  gender: string;
  phone?: string | null;
  dateOfBirth?: string | null;
  address?: string | null;
  attendances?: AttendanceRecordData[];
}

export interface StaffMemberData {
  id: string;
  name: string;
  role: "TEACHER" | "SAFAI_WALA" | "SECURITY_GUARD" | "PEON" | "CLERK" | "LAB_ASSISTANT" | string;
  designation: string;
  phone?: string | null;
  cnic?: string | null;
  monthlySalary: number;
  userId?: string | null;
  status: "ACTIVE" | "INACTIVE" | "ON_LEAVE" | string;
  attendances?: StaffAttendanceData[];
  salaries?: StaffSalaryData[];
}

export interface StaffAttendanceData {
  id: string;
  staffId: string;
  date: string;
  status: "PRESENT" | "LATE" | "ABSENT" | "LEAVE" | string;
  checkInTime?: string | null;
  remarks?: string | null;
}

export interface StaffSalaryData {
  id: string;
  staffId: string;
  month: string;
  basicSalary: number;
  allowances: number;
  deductions: number;
  netSalary: number;
  status: "PAID" | "PENDING" | "UNPAID" | string;
  paidDate?: string | null;
  paymentMethod?: string | null;
  receiptNumber?: string | null;
  notes?: string | null;
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
  assignedSubjects: TeacherSubjectAssignment[];
}
