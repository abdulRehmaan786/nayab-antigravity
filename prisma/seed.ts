import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { CLASS1_STUDENTS } from "./data/class1_data";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Clearing old data...");
  await prisma.staffAttendance.deleteMany();
  await prisma.staffSalary.deleteMany();
  await prisma.staffMember.deleteMany();
  await prisma.attendanceRecord.deleteMany();
  await prisma.feeRecord.deleteMany();
  await prisma.examResult.deleteMany();
  await prisma.student.deleteMany();
  await prisma.announcement.deleteMany();
  await prisma.user.deleteMany();

  console.log("👤 Creating Admin and Teacher accounts with assigned subjects...");
  const adminPassword = await bcrypt.hash("Admin@123", 10);
  const teacherPassword = await bcrypt.hash("Teacher@123", 10);

  const admin = await prisma.user.create({
    data: {
      name: "Principal / Administrator",
      email: "admin@nayab.edu.pk",
      password: adminPassword,
      role: "ADMIN",
      assignedClasses: JSON.stringify(["All Classes"]),
      assignedSubjects: JSON.stringify([
        { className: "Class 10", subject: "All Subjects" },
        { className: "Class 9", subject: "All Subjects" },
        { className: "Class 8", subject: "All Subjects" },
        { className: "Class 1", subject: "All Subjects" },
      ]),
    },
  });

  const teacher1 = await prisma.user.create({
    data: {
      name: "Sir Tariq Mehmood (Science)",
      email: "teacher.science@nayab.edu.pk",
      password: teacherPassword,
      role: "TEACHER",
      classTeacherOf: "Class 9",
      assignedClasses: JSON.stringify(["Class 8", "Class 9", "Class 10"]),
      assignedSubjects: JSON.stringify([
        { className: "Class 9", subject: "General Science" },
        { className: "Class 8", subject: "General Science" },
        { className: "Class 10", subject: "Physics" },
      ]),
    },
  });

  const teacher2 = await prisma.user.create({
    data: {
      name: "Madam Farzana Begum (Mathematics)",
      email: "teacher.math@nayab.edu.pk",
      password: teacherPassword,
      role: "TEACHER",
      classTeacherOf: "Class 10",
      assignedClasses: JSON.stringify(["Class 9", "Class 10"]),
      assignedSubjects: JSON.stringify([
        { className: "Class 9", subject: "Mathematics" },
        { className: "Class 10", subject: "Mathematics" },
      ]),
    },
  });

  const teacher3 = await prisma.user.create({
    data: {
      name: "Sir Rashid Ali (English)",
      email: "teacher.english@nayab.edu.pk",
      password: teacherPassword,
      role: "TEACHER",
      classTeacherOf: "Class 1",
      assignedClasses: JSON.stringify(["Class 1", "Class 8", "Class 9", "Class 10"]),
      assignedSubjects: JSON.stringify([
        { className: "Class 1", subject: "English" },
        { className: "Class 9", subject: "English" },
        { className: "Class 10", subject: "English" },
        { className: "Class 8", subject: "English" },
      ]),
    },
  });

  console.log("🎓 Creating Students across classes...");
  const studentsData = [
    // Class 9
    { rollNumber: "101", grNumber: "GR-1001", name: "Muhammad Ali", fatherName: "Tariq Mehmood", className: "Class 9", section: "A", gender: "Male", phone: "+92 301 2345671", dateOfBirth: "2010-04-15", address: "Main Bazaar, Mirwah" },
    { rollNumber: "102", grNumber: "GR-1002", name: "Ayesha Khan", fatherName: "Imran Khan", className: "Class 9", section: "A", gender: "Female", phone: "+92 302 3456782", dateOfBirth: "2010-08-22", address: "Station Road, Mirwah" },
    { rollNumber: "103", grNumber: "GR-1003", name: "Bilawal Bhutto", fatherName: "Zulfiqar Ali", className: "Class 9", section: "A", gender: "Male", phone: "+92 303 4567893", dateOfBirth: "2010-01-10", address: "Civil Hospital Road, Mirwah" },
    { rollNumber: "104", grNumber: "GR-1004", name: "Fatima Zahra", fatherName: "Ghulam Mustafa", className: "Class 9", section: "A", gender: "Female", phone: "+92 304 5678904", dateOfBirth: "2010-11-05", address: "Model Colony, Mirwah" },
    { rollNumber: "105", grNumber: "GR-1005", name: "Shahmeer Ali", fatherName: "Rashid Ahmed", className: "Class 9", section: "B", gender: "Male", phone: "+92 305 6789015", dateOfBirth: "2010-06-30", address: "Old City, Mirwah" },
    { rollNumber: "106", grNumber: "GR-1006", name: "Dua Maryam", fatherName: "Naveed Iqbal", className: "Class 9", section: "B", gender: "Female", phone: "+92 306 7890126", dateOfBirth: "2010-09-18", address: "Canal Colony, Mirwah" },

    // Class 10
    { rollNumber: "201", grNumber: "GR-1007", name: "Hamza Farooq", fatherName: "Farooq Sattar", className: "Class 10", section: "A", gender: "Male", phone: "+92 307 8901237", dateOfBirth: "2009-03-12", address: "College Road, Mirwah" },
    { rollNumber: "202", grNumber: "GR-1008", name: "Zainab Bibi", fatherName: "Abdul Rehman", className: "Class 10", section: "A", gender: "Female", phone: "+92 308 9012348", dateOfBirth: "2009-07-25", address: "Bazar Mohalla, Mirwah" },
    { rollNumber: "203", grNumber: "GR-1009", name: "Usama Mir", fatherName: "Mir Muhammad", className: "Class 10", section: "A", gender: "Male", phone: "+92 309 0123459", dateOfBirth: "2009-12-04", address: "Grain Market, Mirwah" },
    { rollNumber: "204", grNumber: "GR-1010", name: "Hania Amir", fatherName: "Amir Sohail", className: "Class 10", section: "A", gender: "Female", phone: "+92 310 1234560", dateOfBirth: "2009-05-19", address: "Green View, Mirwah" },
    { rollNumber: "205", grNumber: "GR-1011", name: "Zeeshan Haider", fatherName: "Haider Abbas", className: "Class 10", section: "B", gender: "Male", phone: "+92 311 2345671", dateOfBirth: "2009-09-14", address: "Shahrah-e-Iqbal, Mirwah" },

    // Class 8
    { rollNumber: "301", grNumber: "GR-1012", name: "Rayyan Ahmed", fatherName: "Ahmed Nawaz", className: "Class 8", section: "A", gender: "Male", phone: "+92 312 3456782", dateOfBirth: "2011-02-18", address: "Gulshan Colony, Mirwah" },
    { rollNumber: "302", grNumber: "GR-1013", name: "Mahnoor Baloch", fatherName: "Akhtar Baloch", className: "Class 8", section: "A", gender: "Female", phone: "+92 313 4567893", dateOfBirth: "2011-10-29", address: "Railway Station Area, Mirwah" },
    { rollNumber: "303", grNumber: "GR-1014", name: "Daniyal Raza", fatherName: "Raza Hussain", className: "Class 8", section: "A", gender: "Male", phone: "+92 314 5678904", dateOfBirth: "2011-06-08", address: "Post Office Chowk, Mirwah" },
  ];

  const createdStudents = [];
  for (const s of studentsData) {
    const student = await prisma.student.create({ data: s });
    createdStudents.push(student);
  }

  console.log("📚 Creating Class 1 Students (102 Students from Official Result Sheet)...");
  const createdClass1Students: { student: any; raw: any }[] = [];
  for (const s of CLASS1_STUDENTS) {
    const student = await prisma.student.create({
      data: {
        rollNumber: s.rollNumber,
        grNumber: s.grNumber,
        name: s.name,
        fatherName: s.fatherName,
        className: s.className,
        section: s.section,
        gender: s.gender,
        phone: "+92 300 000" + s.rollNumber.padStart(4, "0"),
        dateOfBirth: s.dateOfBirth,
        address: "Mirwah Gorchani, Sindh",
      },
    });
    createdStudents.push(student);
    createdClass1Students.push({ student, raw: s });
  }

  console.log("📝 Generating Exam Results...");
  const resultsData = [
    {
      roll: "101",
      class: "Class 9",
      subjects: [
        { subject: "English", maxMarks: 100, obtainedMarks: 91, grade: "A+", remarks: "Outstanding writing skills" },
        { subject: "Urdu", maxMarks: 100, obtainedMarks: 89, grade: "A+", remarks: "Excellent comprehension" },
        { subject: "Mathematics", maxMarks: 100, obtainedMarks: 95, grade: "A+", remarks: "Flawless problem solving" },
        { subject: "General Science", maxMarks: 100, obtainedMarks: 92, grade: "A+", remarks: "High conceptual clarity" },
        { subject: "Islamiyat", maxMarks: 50, obtainedMarks: 45, grade: "A+", remarks: "Excellent" },
        { subject: "Pakistan Studies", maxMarks: 50, obtainedMarks: 40, grade: "A", remarks: "Very good" },
      ],
      remarks: "Exceptional student with strong academic and moral conduct. Ranked 1st in Class 9.",
    },
    {
      roll: "102",
      class: "Class 9",
      subjects: [
        { subject: "English", maxMarks: 100, obtainedMarks: 86, grade: "A+", remarks: "Very expressive" },
        { subject: "Urdu", maxMarks: 100, obtainedMarks: 84, grade: "A", remarks: "Good grammar" },
        { subject: "Mathematics", maxMarks: 100, obtainedMarks: 88, grade: "A+", remarks: "Strong analytical skill" },
        { subject: "General Science", maxMarks: 100, obtainedMarks: 87, grade: "A+", remarks: "Very diligent" },
        { subject: "Islamiyat", maxMarks: 50, obtainedMarks: 43, grade: "A+", remarks: "Excellent" },
        { subject: "Pakistan Studies", maxMarks: 50, obtainedMarks: 40, grade: "A", remarks: "Good" },
      ],
      remarks: "Consistently performs at top tier. Punctual and hardworking.",
    },
    {
      roll: "103",
      class: "Class 9",
      subjects: [
        { subject: "English", maxMarks: 100, obtainedMarks: 72, grade: "A", remarks: "Good" },
        { subject: "Urdu", maxMarks: 100, obtainedMarks: 70, grade: "A", remarks: "Good effort" },
        { subject: "Mathematics", maxMarks: 100, obtainedMarks: 76, grade: "A", remarks: "Capable of higher score" },
        { subject: "General Science", maxMarks: 100, obtainedMarks: 74, grade: "A", remarks: "Solid work" },
        { subject: "Islamiyat", maxMarks: 50, obtainedMarks: 38, grade: "A", remarks: "Good" },
        { subject: "Pakistan Studies", maxMarks: 50, obtainedMarks: 35, grade: "B", remarks: "Satisfactory" },
      ],
      remarks: "Has good analytical potential. Advised to revise weekly.",
    },
    {
      roll: "104",
      class: "Class 9",
      subjects: [
        { subject: "English", maxMarks: 100, obtainedMarks: 65, grade: "B", remarks: "Needs more vocabulary work" },
        { subject: "Urdu", maxMarks: 100, obtainedMarks: 66, grade: "B", remarks: "Satisfactory" },
        { subject: "Mathematics", maxMarks: 100, obtainedMarks: 60, grade: "B", remarks: "Practice equations more" },
        { subject: "General Science", maxMarks: 100, obtainedMarks: 64, grade: "B", remarks: "Steady effort" },
        { subject: "Islamiyat", maxMarks: 50, obtainedMarks: 35, grade: "B", remarks: "Good" },
        { subject: "Pakistan Studies", maxMarks: 50, obtainedMarks: 30, grade: "C", remarks: "Needs attention" },
      ],
      remarks: "Promising student with good attendance. Regular homework revision will lift grades to A band.",
    },
    {
      roll: "105",
      class: "Class 9",
      subjects: [
        { subject: "English", maxMarks: 100, obtainedMarks: 55, grade: "C", remarks: "Fair" },
        { subject: "Urdu", maxMarks: 100, obtainedMarks: 58, grade: "C", remarks: "Fair" },
        { subject: "Mathematics", maxMarks: 100, obtainedMarks: 54, grade: "C", remarks: "Needs focused practice" },
        { subject: "General Science", maxMarks: 100, obtainedMarks: 56, grade: "C", remarks: "Satisfactory" },
        { subject: "Islamiyat", maxMarks: 50, obtainedMarks: 32, grade: "B", remarks: "Satisfactory" },
        { subject: "Pakistan Studies", maxMarks: 50, obtainedMarks: 30, grade: "C", remarks: "Pass" },
      ],
      remarks: "Passed all subjects. Remedial classes recommended for Science and Mathematics.",
    },
    {
      roll: "106",
      class: "Class 9",
      subjects: [
        { subject: "English", maxMarks: 100, obtainedMarks: 45, grade: "F", remarks: "Below passing standard" },
        { subject: "Urdu", maxMarks: 100, obtainedMarks: 48, grade: "F", remarks: "Needs improvement" },
        { subject: "Mathematics", maxMarks: 100, obtainedMarks: 40, grade: "F", remarks: "Weak fundamentals" },
        { subject: "General Science", maxMarks: 100, obtainedMarks: 42, grade: "F", remarks: "Needs coaching" },
        { subject: "Islamiyat", maxMarks: 50, obtainedMarks: 22, grade: "F", remarks: "Fair" },
        { subject: "Pakistan Studies", maxMarks: 50, obtainedMarks: 18, grade: "F", remarks: "Low attendance" },
      ],
      remarks: "Failed mid-term examination. Parent-teacher conference requested immediately.",
    },
    // Class 10
    {
      roll: "201",
      class: "Class 10",
      subjects: [
        { subject: "English", maxMarks: 100, obtainedMarks: 94, grade: "A+", remarks: "Distinction grade" },
        { subject: "Urdu", maxMarks: 100, obtainedMarks: 92, grade: "A+", remarks: "Outstanding" },
        { subject: "Mathematics", maxMarks: 100, obtainedMarks: 98, grade: "A+", remarks: "Top in class" },
        { subject: "Physics", maxMarks: 100, obtainedMarks: 94, grade: "A+", remarks: "Exceptional lab & theory" },
        { subject: "Islamiyat", maxMarks: 50, obtainedMarks: 46, grade: "A+", remarks: "Superb" },
        { subject: "Pakistan Studies", maxMarks: 50, obtainedMarks: 44, grade: "A+", remarks: "Brilliant" },
      ],
      remarks: "Position 1st in Class 10. Outstanding role model for school.",
    },
    {
      roll: "202",
      class: "Class 10",
      subjects: [
        { subject: "English", maxMarks: 100, obtainedMarks: 88, grade: "A+", remarks: "Excellent" },
        { subject: "Urdu", maxMarks: 100, obtainedMarks: 87, grade: "A+", remarks: "Very good" },
        { subject: "Mathematics", maxMarks: 100, obtainedMarks: 89, grade: "A+", remarks: "Strong aptitude" },
        { subject: "Physics", maxMarks: 100, obtainedMarks: 85, grade: "A+", remarks: "Great conceptual grasp" },
        { subject: "Islamiyat", maxMarks: 50, obtainedMarks: 43, grade: "A+", remarks: "Very good" },
        { subject: "Pakistan Studies", maxMarks: 50, obtainedMarks: 43, grade: "A+", remarks: "Excellent" },
      ],
      remarks: "High achiever with 87% score. Well-behaved and disciplined.",
    },
    // Class 8
    {
      roll: "301",
      class: "Class 8",
      subjects: [
        { subject: "English", maxMarks: 100, obtainedMarks: 90, grade: "A+", remarks: "Great writing" },
        { subject: "Urdu", maxMarks: 100, obtainedMarks: 88, grade: "A+", remarks: "Very fluent" },
        { subject: "Mathematics", maxMarks: 100, obtainedMarks: 92, grade: "A+", remarks: "Quick mental math" },
        { subject: "General Science", maxMarks: 100, obtainedMarks: 88, grade: "A+", remarks: "Very curious and sharp" },
        { subject: "Islamiyat", maxMarks: 50, obtainedMarks: 42, grade: "A+", remarks: "Good" },
        { subject: "Social Studies", maxMarks: 50, obtainedMarks: 40, grade: "A", remarks: "Very good" },
      ],
      remarks: "Top performer in Class 8. Shows great intellectual promise.",
    },
  ];

  for (const r of resultsData) {
    const student = createdStudents.find((s) => s.rollNumber === r.roll && s.className === r.class);
    if (!student) continue;

    const totalMarks = r.subjects.reduce((sum, s) => sum + s.maxMarks, 0);
    const obtainedMarks = r.subjects.reduce((sum, s) => sum + s.obtainedMarks, 0);
    const percentage = Number(((obtainedMarks / totalMarks) * 100).toFixed(1));
    let overallGrade = "F";
    let status = "FAIL";
    if (percentage >= 80) {
      overallGrade = "A+";
      status = "PASS";
    } else if (percentage >= 70) {
      overallGrade = "A";
      status = "PASS";
    } else if (percentage >= 60) {
      overallGrade = "B";
      status = "PASS";
    } else if (percentage >= 50) {
      overallGrade = "C";
      status = "PASS";
    }

    await prisma.examResult.create({
      data: {
        studentId: student.id,
        examTerm: "Weekly Test 1 - 2025",
        academicYear: "2024-2025",
        subjectMarks: JSON.stringify(r.subjects),
        totalMarks,
        obtainedMarks,
        percentage,
        overallGrade,
        status,
        remarks: r.remarks,
      },
    });
  }

  console.log("📊 Seeding Annual Examination 2025-26 Results for Class 1 (102 Students)...");
  function getSubGrade(obt: number, max: number): string {
    const pct = (obt / max) * 100;
    if (pct >= 80) return "A+";
    if (pct >= 70) return "A";
    if (pct >= 60) return "B";
    if (pct >= 50) return "C";
    return "F";
  }

  for (const { student, raw } of createdClass1Students) {
    const subjects = [
      {
        subject: "English",
        maxMarks: 100,
        obtainedMarks: raw.marks.english,
        grade: getSubGrade(raw.marks.english, 100),
        remarks: raw.marks.english >= 80 ? "Outstanding writing & reading" : raw.marks.english >= 60 ? "Good comprehension" : "Satisfactory",
      },
      {
        subject: "Urdu",
        maxMarks: 100,
        obtainedMarks: raw.marks.urdu,
        grade: getSubGrade(raw.marks.urdu, 100),
        remarks: raw.marks.urdu >= 80 ? "Excellent reading & grammar" : raw.marks.urdu >= 60 ? "Good" : "Satisfactory",
      },
      {
        subject: "Mathematics",
        maxMarks: 100,
        obtainedMarks: raw.marks.math,
        grade: getSubGrade(raw.marks.math, 100),
        remarks: raw.marks.math >= 80 ? "Sharp analytical thinking" : raw.marks.math >= 60 ? "Good calculation skills" : "Passed",
      },
      {
        subject: "Islamiyat",
        maxMarks: 100,
        obtainedMarks: raw.marks.islamiyat,
        grade: getSubGrade(raw.marks.islamiyat, 100),
        remarks: raw.marks.islamiyat >= 80 ? "Superb knowledge" : raw.marks.islamiyat >= 60 ? "Good" : "Satisfactory",
      },
      {
        subject: "Computer Science",
        maxMarks: 100,
        obtainedMarks: raw.marks.computer,
        grade: getSubGrade(raw.marks.computer, 100),
        remarks: raw.marks.computer >= 80 ? "Excellent practical aptitude" : raw.marks.computer >= 60 ? "Good" : "Satisfactory",
      },
      {
        subject: "General Science",
        maxMarks: 100,
        obtainedMarks: raw.marks.generalScience,
        grade: getSubGrade(raw.marks.generalScience, 100),
        remarks: raw.marks.generalScience >= 80 ? "High conceptual clarity" : raw.marks.generalScience >= 60 ? "Good understanding" : "Satisfactory",
      },
    ];

    const totalMarks = 600;
    const obtainedMarks = raw.marks.total;
    const percentage = Number(((obtainedMarks / totalMarks) * 100).toFixed(1));
    let overallGrade = "F";
    if (percentage >= 80) overallGrade = "A+";
    else if (percentage >= 70) overallGrade = "A";
    else if (percentage >= 60) overallGrade = "B";
    else if (percentage >= 50) overallGrade = "C";

    await prisma.examResult.create({
      data: {
        studentId: student.id,
        examTerm: "Annual Examination 2025-26",
        academicYear: "2025-2026",
        subjectMarks: JSON.stringify(subjects),
        totalMarks,
        obtainedMarks,
        percentage,
        overallGrade,
        status: "PASS",
        remarks: percentage >= 80 ? "Passed with Outstanding Distinction! Promoted to next class." : "Passed and Promoted to next class.",
      },
    });
  }

  console.log("💰 Creating Fee Records...");
  const feeConfigs = [
    { roll: "101", class: "Class 9", status: "PAID", paidDate: "02 Sep 2025", receipt: "NGS-REC-2025-0914" },
    { roll: "102", class: "Class 9", status: "PAID", paidDate: "04 Sep 2025", receipt: "NGS-REC-2025-0925" },
    { roll: "103", class: "Class 9", status: "PENDING", paidDate: null, receipt: null },
    { roll: "104", class: "Class 9", status: "PAID", paidDate: "01 Sep 2025", receipt: "NGS-REC-2025-0902" },
    { roll: "105", class: "Class 9", status: "UNPAID", paidDate: null, receipt: null },
    { roll: "106", class: "Class 9", status: "PENDING", paidDate: null, receipt: null },

    { roll: "201", class: "Class 10", status: "PAID", paidDate: "03 Sep 2025", receipt: "NGS-REC-2025-0918" },
    { roll: "202", class: "Class 10", status: "PENDING", paidDate: null, receipt: null },
    { roll: "203", class: "Class 10", status: "UNPAID", paidDate: null, receipt: null },
    { roll: "204", class: "Class 10", status: "PAID", paidDate: "05 Sep 2025", receipt: "NGS-REC-2025-0931" },
    { roll: "205", class: "Class 10", status: "PAID", paidDate: "06 Sep 2025", receipt: "NGS-REC-2025-0940" },

    { roll: "301", class: "Class 8", status: "PAID", paidDate: "02 Sep 2025", receipt: "NGS-REC-2025-0910" },
    { roll: "302", class: "Class 8", status: "PENDING", paidDate: null, receipt: null },
    { roll: "303", class: "Class 8", status: "PAID", paidDate: "05 Sep 2025", receipt: "NGS-REC-2025-0935" },
  ];

  for (const fc of feeConfigs) {
    const student = createdStudents.find((s) => s.rollNumber === fc.roll && s.className === fc.class);
    if (!student) continue;

    await prisma.feeRecord.create({
      data: {
        studentId: student.id,
        month: "September 2025",
        amount: 2500,
        dueDate: "10 September 2025",
        status: fc.status,
        paidDate: fc.paidDate,
        receiptNumber: fc.receipt,
        notes: "Tuition Fee + Computer/Science Lab Charges",
      },
    });

    await prisma.feeRecord.create({
      data: {
        studentId: student.id,
        month: "August 2025",
        amount: 2500,
        dueDate: "10 August 2025",
        status: "PAID",
        paidDate: "08 Aug 2025",
        receiptNumber: `NGS-REC-2025-08${fc.roll}`,
        notes: "Monthly Tuition Fee",
      },
    });
  }

  console.log("💰 Seeding Fee Records for Class 1 (102 Students)...");
  for (const { student } of createdClass1Students) {
    const rollNum = parseInt(student.rollNumber, 10);
    const isPaid = rollNum % 4 !== 0;
    await prisma.feeRecord.create({
      data: {
        studentId: student.id,
        month: "September 2025",
        amount: 2000,
        dueDate: "10 September 2025",
        status: isPaid ? "PAID" : "PENDING",
        paidDate: isPaid ? "05 Sep 2025" : null,
        receiptNumber: isPaid ? `NGS-C1-${student.rollNumber.padStart(3, "0")}-SEP25` : null,
        notes: "Monthly Tuition Fee - Class 1",
      },
    });

    await prisma.feeRecord.create({
      data: {
        studentId: student.id,
        month: "August 2025",
        amount: 2000,
        dueDate: "10 August 2025",
        status: "PAID",
        paidDate: "06 Aug 2025",
        receiptNumber: `NGS-C1-${student.rollNumber.padStart(3, "0")}-AUG25`,
        notes: "Monthly Tuition Fee - Class 1",
      },
    });
  }

  console.log("📲 Seeding Biometric Attendance Logs...");
  const recentDates = ["2025-09-08", "2025-09-09", "2025-09-10"];

  for (const dateStr of recentDates) {
    for (const student of createdStudents) {
      let status = "PRESENT";
      let checkInTime: string | null = "07:52 AM";
      let remarks = "On-time biometric verification";

      // Create realistic variation
      if (student.rollNumber === "105" && dateStr === "2025-09-10") {
        status = "LATE";
        checkInTime = "08:24 AM";
        remarks = "Late arrival (Traffic delay)";
      } else if (student.rollNumber === "106" && dateStr === "2025-09-09") {
        status = "ABSENT";
        checkInTime = null;
        remarks = "Unexcused absence";
      } else if (student.rollNumber === "203" && dateStr === "2025-09-08") {
        status = "LEAVE";
        checkInTime = null;
        remarks = "Sick leave approved by administration";
      } else if (student.rollNumber === "201") {
        checkInTime = "07:45 AM";
      } else if (student.rollNumber === "101") {
        checkInTime = "07:48 AM";
      } else if (student.className === "Class 1" && student.rollNumber === "1") {
        checkInTime = "07:42 AM";
      }

      await prisma.attendanceRecord.create({
        data: {
          studentId: student.id,
          date: dateStr,
          status,
          checkInTime,
          deviceType: "BIOMETRIC_FINGERPRINT",
          deviceId: student.section === "B" || student.rollNumber.startsWith("2") ? "BIO-GATE-02" : "BIO-GATE-01",
          remarks,
        },
      });
    }
  }

  console.log("📣 Publishing School Announcements...");
  const announcements = [
    {
      title: "Revised Winter School Timings & Uniform Guidelines",
      content:
        "In accordance with regional weather guidelines, Nayab English Grammer High School Mirwah will observe winter timings starting from Monday. School gates open at 7:45 AM, assembly starts promptly at 8:00 AM, and dismissal is at 1:30 PM. All students must wear the proper school uniform: boys in navy blue trousers, white shirts, and navy ties; girls in navy blue frock/shalwar-kameez with white shalwar and school badge. Sweaters or blazers must be plain navy blue.",
      category: "NOTICE",
      isPinned: true,
      publishedBy: "Principal Office",
      date: "September 03, 2025",
    },
    {
      title: "Weekly Test 1 — Results Declared Online",
      content:
        "The Weekly Test 1 results for classes Nursery through Class 10 have been finalized and published. Parents can check results immediately via the homepage Search portal by selecting Class and Roll Number. Official printed report cards with principal seal will be distributed during the upcoming Parent-Teacher Meeting.",
      category: "EXAM",
      isPinned: true,
      publishedBy: "Examination Controller",
      date: "September 02, 2025",
    },
    {
      title: "Annual Sports & Athletics Gala 2025",
      content:
        "Nayab English Grammer High School Mirwah is excited to announce the Annual Inter-House Sports Gala scheduled for October 15–17. Events will include 100m sprint, cricket tournament, badminton, tug-of-war, and relay races. Interested students should register their names with the Physical Education teachers by next Friday.",
      category: "EVENT",
      isPinned: false,
      publishedBy: "Sports Department",
      date: "August 28, 2025",
    },
    {
      title: "Holiday Notification — 12th Rabi-ul-Awwal (Eid Milad-un-Nabi)",
      content:
        "The school will remain closed on Friday, 12th Rabi-ul-Awwal in commemoration of the Holy Prophet’s (P.B.U.H) birth. Normal classes and academic schedule will resume on the following Monday with regular timings.",
      category: "HOLIDAY",
      isPinned: false,
      publishedBy: "Administration",
      date: "August 25, 2025",
    },
    {
      title: "Monthly Parent-Teacher Meeting (PTM)",
      content:
        "A mandatory Parent-Teacher Meeting will be held on Saturday, 20th September 2025 from 9:00 AM to 12:30 PM. Parents are encouraged to meet their children's subject teachers to review weekly test performance and discuss areas for academic enhancement.",
      category: "NOTICE",
      isPinned: false,
      publishedBy: "Academic Coordination Wing",
      date: "August 20, 2025",
    },
  ];

  for (const a of announcements) {
    await prisma.announcement.create({ data: a });
  }

  console.log("👨💼 Creating Staff Members...");
  const staffData = [
    { name: "Sir Tariq Mehmood", role: "TEACHER", designation: "Senior Science Teacher", phone: "+92 300 1111111", cnic: "44201-1234567-1", monthlySalary: 35000, userId: teacher1.id },
    { name: "Madam Farzana Begum", role: "TEACHER", designation: "Mathematics Teacher", phone: "+92 300 2222222", cnic: "44201-2345678-2", monthlySalary: 32000, userId: teacher2.id },
    { name: "Sir Rashid Ali", role: "TEACHER", designation: "English Teacher", phone: "+92 300 3333333", cnic: "44201-3456789-3", monthlySalary: 30000, userId: teacher3.id },
    { name: "Babu Ram", role: "SAFAI_WALA", designation: "Campus Cleaner / Safai Wala", phone: "+92 300 4444444", cnic: "44201-4567890-4", monthlySalary: 15000 },
    { name: "Yaqoob Khan", role: "SECURITY_GUARD", designation: "Security Guard / Chowkidar", phone: "+92 300 5555555", cnic: "44201-5678901-5", monthlySalary: 18000 },
    { name: "Ghulam Nabi", role: "PEON", designation: "Office Peon", phone: "+92 300 6666666", cnic: "44201-6789012-6", monthlySalary: 14000 },
  ];

  const createdStaff = [];
  for (const s of staffData) {
    const staff = await prisma.staffMember.create({ data: s });
    createdStaff.push(staff);
  }

  console.log("💵 Seeding Staff Salary Records...");
  for (const staff of createdStaff) {
    // September 2025 - varied statuses
    const isPaid = ["Sir Tariq Mehmood", "Madam Farzana Begum", "Babu Ram"].includes(staff.name);
    await prisma.staffSalary.create({
      data: {
        staffId: staff.id,
        month: "September 2025",
        basicSalary: staff.monthlySalary,
        allowances: staff.role === "TEACHER" ? 3000 : 1000,
        deductions: 0,
        netSalary: staff.monthlySalary + (staff.role === "TEACHER" ? 3000 : 1000),
        status: isPaid ? "PAID" : "PENDING",
        paidDate: isPaid ? "05 Sep 2025" : null,
        paymentMethod: isPaid ? "CASH" : null,
        receiptNumber: isPaid ? `SAL-${staff.name.split(" ")[0].toUpperCase()}-SEP25` : null,
        notes: "Monthly salary",
      },
    });

    // August 2025 - all paid
    await prisma.staffSalary.create({
      data: {
        staffId: staff.id,
        month: "August 2025",
        basicSalary: staff.monthlySalary,
        allowances: staff.role === "TEACHER" ? 3000 : 1000,
        deductions: 0,
        netSalary: staff.monthlySalary + (staff.role === "TEACHER" ? 3000 : 1000),
        status: "PAID",
        paidDate: "03 Aug 2025",
        paymentMethod: "CASH",
        receiptNumber: `SAL-${staff.name.split(" ")[0].toUpperCase()}-AUG25`,
        notes: "Monthly salary",
      },
    });
  }

  console.log("📋 Seeding Staff Attendance across September...");
  const staffDates = [
    "2025-09-01", "2025-09-02", "2025-09-03", "2025-09-04", "2025-09-05", "2025-09-06",
    "2025-09-08", "2025-09-09", "2025-09-10", "2025-09-11", "2025-09-12", "2025-09-13",
    "2025-09-15", "2025-09-16", "2025-09-17", "2025-09-18", "2025-09-19", "2025-09-20"
  ];
  for (const dateStr of staffDates) {
    for (const staff of createdStaff) {
      let status = "PRESENT";
      let checkInTime: string | null = "07:30 AM";
      let remarks = "On-time arrival";
      
      if (staff.name.includes("Tariq") && dateStr === "2025-09-05") {
        status = "LATE";
        checkInTime = "08:10 AM";
        remarks = "Traffic delay at Mirwah chowk";
      } else if (staff.name.includes("Tariq") && dateStr === "2025-09-12") {
        status = "LEAVE";
        checkInTime = null;
        remarks = "Casual leave approved";
      } else if (staff.name === "Yaqoob Khan" && dateStr === "2025-09-10") {
        status = "LATE";
        checkInTime = "08:15 AM";
        remarks = "Late arrival";
      } else if (staff.name === "Ghulam Nabi" && dateStr === "2025-09-09") {
        status = "LEAVE";
        checkInTime = null;
        remarks = "Sick leave";
      }
      
      await prisma.staffAttendance.create({
        data: {
          staffId: staff.id,
          date: dateStr,
          status,
          checkInTime,
          remarks,
        },
      });
    }
  }

  console.log("✅ Database seeding complete!");
  console.log("Demo Credentials:");
  console.log("  Admin:   admin@nayab.edu.pk | Admin@123");
  console.log("  Science: teacher.science@nayab.edu.pk | Teacher@123");
  console.log("  Math:    teacher.math@nayab.edu.pk | Teacher@123");
  console.log("  English: teacher.english@nayab.edu.pk | Teacher@123");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
