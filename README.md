# 🎓 Nayab English Grammer High School Mirwah — School Management System
### Final Year Capstone Project (Production-Grade Web Application)

A minimalist, high-speed, mobile-first School Management System built specifically for **Nayab English Grammer High School Mirwah**. Designed with modern product principles (Linear / Stripe aesthetic) to ensure non-technical parents and staff can manage marks, verify fee statuses, record biometric gate attendances, and publish school notices without friction.

---

## 🌟 Key Features

1. **Teacher Subject Allocation & Subject-Isolated Grading**
   - **Admin Management (`/admin/teachers`)**: Admin allocates specific classes and subjects to each teacher (e.g. Science Teacher gets *General Science* in Class 9 & Class 8, *Physics* in Class 10; Math Teacher gets *Mathematics*, etc.).
   - **Subject Result Isolation (`/teacher/marks-entry`)**: Teachers can **ONLY** enter and modify marks for their **assigned subject(s)**. Other subject marks are protected as read-only.
   - **Cumulative Auto-Aggregation**: When a subject teacher submits marks for their subject, the system safely merges the scores into the student's unified exam card and recalculates the grand total, percentage, overall letter grade (A+, A, B, C, F), and Pass/Fail status in real time.

2. **Biometric Gate Attendance System**
   - **Interactive Hardware Simulator (`/admin/attendance`)**: Simulates optical fingerprint scanner or RFID smart badge tap across multiple campus terminals (`BIO-GATE-01 Main Campus`, `BIO-GATE-02 Girls Wing`).
   - **Schedule-Based Punctuality Logic**:
     - Check-in before 8:15 AM: **`PRESENT`** (On-time)
     - Check-in after 8:15 AM: **`LATE`** (Flagged late arrival)
     - No gate punch: **`ABSENT`**
   - **Teacher Class Attendance (`/teacher/attendance`)**: Class teachers can monitor their students' morning gate arrivals and excuse approved leaves.
   - **Parent Front Door Visibility**: Parents can check their child's attendance standing (% and today's punch status) directly on the homepage and printable report cards.

3. **Parent & Student Front Door (No Login Required)**
   - Single-click search bar on the homepage: Select Class + Enter Roll Number.
   - Instantly renders student bio, latest exam summary, fee payment status, biometric attendance standing, and school notices.
   - 100% mobile-optimized with large touch targets (44px+ minimum).

4. **Official Printable Report Card Engine**
   - Formal school progress report card styled with official school emblem header and subtle security watermark.
   - Tabular subject marks, grand totals, percentage, letter grade (A+, A, B, C, F), and official **Biometric Attendance Record Block**.
   - Dedicated `@media print` rules for clean, one-page A4 printing with teacher, exam controller, and principal signature lines.

5. **Monthly Fee Status Tracker**
   - Color-coded badges: Green (`PAID`), Amber (`PENDING`), Red (`UNPAID`).
   - Parents can review fee payment history and computerized receipt numbers.
   - Admin Fee Register provides 1-click status toggles, payment date recording, and filterable summaries.

6. **"Ask Nayab" AI Chatbot**
   - Collapsible floating widget available across every page.
   - Strictly grounded in official school data (timings, uniform policy, fee rules, admissions, and step-by-step result lookup guidance).
   - Polite hallucination prevention for out-of-scope inquiries.

---

## 🛠️ Tech Stack

- **Framework**: [Next.js 14+ / 16 (App Router)](https://nextjs.org/) with TypeScript
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) with brand color tokens
- **Icons**: [Lucide React](https://lucide.dev/)
- **Database & ORM**: [SQLite](https://www.sqlite.org/) with [Prisma ORM](https://www.prisma.io/) (Zero-configuration locally, effortlessly swappable to PostgreSQL on Supabase/Railway)
- **Authentication**: JWT cookies with `jose` and `bcryptjs` password hashing

---

## 🚀 Getting Started Locally

### 1. Installation & Setup
```bash
cd "d:\Final Year Project\antigravity"
npm install
npx prisma db push
npx tsx prisma/seed.ts
```

### 2. Run the Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🔑 Pre-Seeded Demo Credentials

| Role | Email | Password | Assigned Scope |
| :--- | :--- | :--- | :--- |
| **School Administrator** | `admin@nayab.edu.pk` | `Admin@123` | Full access: All classes, subjects, fee register, biometric gate |
| **Science Teacher** | `teacher.science@nayab.edu.pk` | `Teacher@123` | *General Science* (Classes 8, 9), *Physics* (Class 10) |
| **Mathematics Teacher**| `teacher.math@nayab.edu.pk` | `Teacher@123` | *Mathematics* (Classes 9, 10) |
| **English Teacher** | `teacher.english@nayab.edu.pk` | `Teacher@123` | *English* (Classes 8, 9, 10) |
| **Parent / Student** | *No login needed* | *Public* | Search by Class + Roll Number (e.g. Class 9 Roll 101, Class 10 Roll 201) |

> 💡 **Tip**: The `/login` page includes 1-click **"Admin Login"** and **"Teacher Login"** demo buttons for instant evaluation.

---

## 📋 Quick Test Roll Numbers

| Class | Roll No | Student Name | Performance Summary | Biometric Attendance | Fee Status |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Class 9** | `101` | Muhammad Ali | 90.4% — Grade A+ (1st Position) | **100% Present** (Checked in 07:48 AM) | **PAID** |
| **Class 9** | `103` | Bilawal Bhutto | 73.0% — Grade A (Pass) | **100% Present** | **PENDING** |
| **Class 9** | `105` | Shahmeer Ali | 57.0% — Grade C (Pass) | **Late Arrival** (08:24 AM at Gate 1) | **UNPAID** |
| **Class 9** | `106` | Dua Maryam | 43.0% — Grade F (Needs Help) | **Absent** on 09 Sep | **PENDING** |
| **Class 10**| `201` | Hamza Farooq | 93.6% — Grade A+ (Matric Top) | **100% Present** (Checked in 07:45 AM) | **PAID** |
| **Class 8** | `301` | Rayyan Ahmed | 88.0% — Grade A+ (Middle Top) | **100% Present** (07:52 AM) | **PAID** |

---

## 🏫 About Nayab English Grammer High School Mirwah
- **Location**: Mirwah, Sindh, Pakistan
- **Established**: 2012
- **Colors**: Navy Blue (`#1B2A4A`) & Warm Gold (`#D4AF37`)
- **Contact**: +92 301 2345670 • info@nayab.edu.pk
