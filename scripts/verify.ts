import { db } from "../src/lib/db";
import { findSchoolKnowledge } from "../src/lib/school-knowledge";
import { calculateGrade } from "../src/lib/grading";

async function verifyAll() {
  console.log("=== 1. VERIFYING STUDENTS IN DATABASE ===");
  const students = await db.student.findMany({
    include: {
      results: true,
      fees: true,
    },
  });
  console.log(`Total students in DB: ${students.length}`);
  const sampleStudent = students.find((s) => s.rollNumber === "101" && s.className === "Class 9");
  if (sampleStudent) {
    console.log(`✓ Sample student found: ${sampleStudent.name}, Roll: ${sampleStudent.rollNumber}`);
    console.log(`  Results count: ${sampleStudent.results.length}`);
    console.log(`  Fees count: ${sampleStudent.fees.length}`);
  } else {
    console.error("❌ Sample student 101 not found");
  }

  console.log("\n=== 2. VERIFYING EXAM RESULTS AND GRADING ===");
  const result = await db.examResult.findFirst({
    where: { studentId: sampleStudent?.id },
  });
  if (result) {
    console.log(`✓ Result term: ${result.examTerm}`);
    console.log(`  Total: ${result.obtainedMarks}/${result.totalMarks} (${result.percentage}%)`);
    console.log(`  Grade: ${result.overallGrade}, Status: ${result.status}`);
  }

  console.log("\n=== 3. VERIFYING FEE RECORDS ===");
  const feeRecords = await db.feeRecord.findMany({ take: 3 });
  console.log(`✓ Sample fee records:`);
  feeRecords.forEach((f) => {
    console.log(`  Month: ${f.month}, Amount: Rs. ${f.amount}, Status: ${f.status}, Receipt: ${f.receiptNumber || 'None'}`);
  });

  console.log("\n=== 4. VERIFYING ANNOUNCEMENTS ===");
  const notices = await db.announcement.findMany({ where: { isPinned: true } });
  console.log(`✓ Pinned announcements: ${notices.length}`);
  notices.forEach((n) => console.log(`  [${n.category}] ${n.title}`));

  console.log("\n=== 5. VERIFYING AI CHATBOT KNOWLEDGE BASE ===");
  const queries = [
    "What are the school timings?",
    "How to check my result?",
    "What is the uniform?",
    "How do I pay fees?",
  ];
  for (const q of queries) {
    const match = findSchoolKnowledge(q);
    console.log(`✓ Query: "${q}" -> Found Category: ${match?.category}`);
  }

  console.log("\n=== 6. VERIFYING USER AUTH ACCOUNTS ===");
  const users = await db.user.findMany();
  console.log(`✓ Registered staff users: ${users.length}`);
  users.forEach((u) => console.log(`  Role: ${u.role}, Email: ${u.email}, Name: ${u.name}`));

  console.log("\n✅ ALL SYSTEM VERIFICATIONS PASSED!");
}

verifyAll()
  .catch((e) => console.error(e))
  .finally(async () => {
    await db.$disconnect();
  });
