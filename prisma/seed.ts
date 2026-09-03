import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Clearing old data...");
  await prisma.feeRecord.deleteMany();
  await prisma.examResult.deleteMany();
  await prisma.student.deleteMany();
  await prisma.announcement.deleteMany();
  await prisma.user.deleteMany();

  console.log("👤 Creating Admin and Teacher accounts...");
  const adminPassword = await bcrypt.hash("Admin@123", 10);
  const teacherPassword = await bcrypt.hash("Teacher@123", 10);

  const admin = await prisma.user.create({
    data: {
      name: "Principal / Administrator",
      email: "admin@nayab.edu.pk",
      password: adminPassword,
      role: "ADMIN",
      assignedClasses: JSON.stringify(["All Classes"]),
    },
  });

  const teacher1 = await prisma.user.create({
    data: {
      name: "Sir Tariq Mehmood (Science)",
      email: "teacher.science@nayab.edu.pk",
      password: teacherPassword,
      role: "TEACHER",
      assignedClasses: JSON.stringify(["Class 8", "Class 9", "Class 10"]),
    },
  });

  const teacher2 = await prisma.user.create({
    data: {
      name: "Madam Farzana Begum (Mathematics)",
      email: "teacher.math@nayab.edu.pk",
      password: teacherPassword,
      role: "TEACHER",
      assignedClasses: JSON.stringify(["Class 9", "Class 10"]),
    },
  });

  console.log("🎓 Creating Students across classes...");
  const studentsData = [
    // Class 9
    { rollNumber: "101", name: "Muhammad Ali", fatherName: "Tariq Mehmood", className: "Class 9", section: "A", gender: "Male", phone: "+92 301 2345671", dateOfBirth: "2010-04-15", address: "Main Bazaar, Mirwah" },
    { rollNumber: "102", name: "Ayesha Khan", fatherName: "Imran Khan", className: "Class 9", section: "A", gender: "Female", phone: "+92 302 3456782", dateOfBirth: "2010-08-22", address: "Station Road, Mirwah" },
    { rollNumber: "103", name: "Bilawal Bhutto", fatherName: "Zulfiqar Ali", className: "Class 9", section: "A", gender: "Male", phone: "+92 303 4567893", dateOfBirth: "2010-01-10", address: "Civil Hospital Road, Mirwah" },
    { rollNumber: "104", name: "Fatima Zahra", fatherName: "Ghulam Mustafa", className: "Class 9", section: "A", gender: "Female", phone: "+92 304 5678904", dateOfBirth: "2010-11-05", address: "Model Colony, Mirwah" },
    { rollNumber: "105", name: "Shahmeer Ali", fatherName: "Rashid Ahmed", className: "Class 9", section: "B", gender: "Male", phone: "+92 305 6789015", dateOfBirth: "2010-06-30", address: "Old City, Mirwah" },
    { rollNumber: "106", name: "Dua Maryam", fatherName: "Naveed Iqbal", className: "Class 9", section: "B", gender: "Female", phone: "+92 306 7890126", dateOfBirth: "2010-09-18", address: "Canal Colony, Mirwah" },

    // Class 10
    { rollNumber: "201", name: "Hamza Farooq", fatherName: "Farooq Sattar", className: "Class 10", section: "A", gender: "Male", phone: "+92 307 8901237", dateOfBirth: "2009-03-12", address: "College Road, Mirwah" },
    { rollNumber: "202", name: "Zainab Bibi", fatherName: "Abdul Rehman", className: "Class 10", section: "A", gender: "Female", phone: "+92 308 9012348", dateOfBirth: "2009-07-25", address: "Bazar Mohalla, Mirwah" },
    { rollNumber: "203", name: "Usama Mir", fatherName: "Mir Muhammad", className: "Class 10", section: "A", gender: "Male", phone: "+92 309 0123459", dateOfBirth: "2009-12-04", address: "Grain Market, Mirwah" },
    { rollNumber: "204", name: "Hania Amir", fatherName: "Amir Sohail", className: "Class 10", section: "A", gender: "Female", phone: "+92 310 1234560", dateOfBirth: "2009-05-19", address: "Green View, Mirwah" },
    { rollNumber: "205", name: "Zeeshan Haider", fatherName: "Haider Abbas", className: "Class 10", section: "B", gender: "Male", phone: "+92 311 2345671", dateOfBirth: "2009-09-14", address: "Shahrah-e-Iqbal, Mirwah" },

    // Class 8
    { rollNumber: "301", name: "Rayyan Ahmed", fatherName: "Ahmed Nawaz", className: "Class 8", section: "A", gender: "Male", phone: "+92 312 3456782", dateOfBirth: "2011-02-18", address: "Gulshan Colony, Mirwah" },
    { rollNumber: "302", name: "Mahnoor Baloch", fatherName: "Akhtar Baloch", className: "Class 8", section: "A", gender: "Female", phone: "+92 313 4567893", dateOfBirth: "2011-10-29", address: "Railway Station Area, Mirwah" },
    { rollNumber: "303", name: "Daniyal Raza", fatherName: "Raza Hussain", className: "Class 8", section: "A", gender: "Male", phone: "+92 314 5678904", dateOfBirth: "2011-06-08", address: "Post Office Chowk, Mirwah" },
  ];

  const createdStudents = [];
  for (const s of studentsData) {
    const student = await prisma.student.create({ data: s });
    createdStudents.push(student);
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
        examTerm: "Midterm Examination 2025",
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

  console.log("💰 Creating Fee Records...");
  const feeConfigs = [
    // Class 9
    { roll: "101", class: "Class 9", status: "PAID", paidDate: "02 Sep 2025", receipt: "NGS-REC-2025-0914" },
    { roll: "102", class: "Class 9", status: "PAID", paidDate: "04 Sep 2025", receipt: "NGS-REC-2025-0925" },
    { roll: "103", class: "Class 9", status: "PENDING", paidDate: null, receipt: null },
    { roll: "104", class: "Class 9", status: "PAID", paidDate: "01 Sep 2025", receipt: "NGS-REC-2025-0902" },
    { roll: "105", class: "Class 9", status: "UNPAID", paidDate: null, receipt: null },
    { roll: "106", class: "Class 9", status: "PENDING", paidDate: null, receipt: null },

    // Class 10
    { roll: "201", class: "Class 10", status: "PAID", paidDate: "03 Sep 2025", receipt: "NGS-REC-2025-0918" },
    { roll: "202", class: "Class 10", status: "PENDING", paidDate: null, receipt: null },
    { roll: "203", class: "Class 10", status: "UNPAID", paidDate: null, receipt: null },
    { roll: "204", class: "Class 10", status: "PAID", paidDate: "05 Sep 2025", receipt: "NGS-REC-2025-0931" },
    { roll: "205", class: "Class 10", status: "PAID", paidDate: "06 Sep 2025", receipt: "NGS-REC-2025-0940" },

    // Class 8
    { roll: "301", class: "Class 8", status: "PAID", paidDate: "02 Sep 2025", receipt: "NGS-REC-2025-0910" },
    { roll: "302", class: "Class 8", status: "PENDING", paidDate: null, receipt: null },
    { roll: "303", class: "Class 8", status: "PAID", paidDate: "05 Sep 2025", receipt: "NGS-REC-2025-0935" },
  ];

  for (const fc of feeConfigs) {
    const student = createdStudents.find((s) => s.rollNumber === fc.roll && s.className === fc.class);
    if (!student) continue;

    // September 2025 record
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

    // Also an August 2025 paid record for realistic fee history
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

  console.log("📣 Publishing School Announcements...");
  const announcements = [
    {
      title: "Revised Winter School Timings & Uniform Guidelines",
      content:
        "In accordance with regional weather guidelines, Nayab Grammar School will observe winter timings starting from Monday. School gates open at 7:45 AM, assembly starts promptly at 8:00 AM, and dismissal is at 1:30 PM. All students must wear the proper school uniform: boys in navy blue trousers, white shirts, and navy ties; girls in navy blue frock/shalwar-kameez with white shalwar and school badge. Sweaters or blazers must be plain navy blue.",
      category: "NOTICE",
      isPinned: true,
      publishedBy: "Principal Office",
      date: "September 03, 2025",
    },
    {
      title: "Midterm Examination 2025 — Official Results Declared Online",
      content:
        "The Midterm Examination results for classes Nursery through Class 10 have been finalized and published. Parents can check results immediately via the homepage Search portal by selecting Class and Roll Number. Official printed report cards with principal seal will be distributed during the upcoming Parent-Teacher Meeting.",
      category: "EXAM",
      isPinned: true,
      publishedBy: "Examination Controller",
      date: "September 02, 2025",
    },
    {
      title: "Annual Sports & Athletics Gala 2025",
      content:
        "Nayab Grammar School is excited to announce the Annual Inter-House Sports Gala scheduled for October 15–17. Events will include 100m sprint, cricket tournament, badminton, tug-of-war, and relay races. Interested students should register their names with the Physical Education teachers by next Friday.",
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
        "A mandatory Parent-Teacher Meeting will be held on Saturday, 20th September 2025 from 9:00 AM to 12:30 PM. Parents are encouraged to meet their children's subject teachers to review midterm performance and discuss areas for academic enhancement.",
      category: "NOTICE",
      isPinned: false,
      publishedBy: "Academic Coordination Wing",
      date: "August 20, 2025",
    },
  ];

  for (const a of announcements) {
    await prisma.announcement.create({ data: a });
  }

  console.log("✅ Database seeding complete!");
  console.log("Demo Credentials:");
  console.log("  Admin:   admin@nayab.edu.pk | Admin@123");
  console.log("  Teacher: teacher.science@nayab.edu.pk | Teacher@123");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
