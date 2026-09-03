# 🎓 Nayab Grammar School, Mirwah — School Management System
### Final Year Capstone Project (Production-Grade Web Application)

A minimalist, high-speed, mobile-first School Management System built specifically for **Nayab Grammar School, Mirwah**. Designed with modern product principles (Linear / Stripe aesthetic) to ensure non-technical parents and staff can manage marks, verify fee statuses, and publish school notices without friction.

---

## 🌟 Key Features

1. **Parent & Student Front Door (No Login Required)**
   - Single-click search bar on the homepage: Select Class + Enter Roll Number.
   - Instantly renders student bio, latest exam summary, fee payment status, and school notices.
   - 100% mobile-optimized with large touch targets (44px+ minimum).

2. **Official Printable Report Card Engine**
   - Formal school progress report card styled with official school emblem header and subtle security watermark.
   - Tabular subject marks (English, Urdu, Math, Science, Islamiyat, Pak Studies), grand totals, percentage, and letter grade (A+, A, B, C, F).
   - Dedicated `@media print` rules for clean, one-page A4 printing with teacher and principal signature lines.

3. **Monthly Fee Status Tracker**
   - Color-coded badges: Green (`PAID`), Amber (`PENDING`), Red (`UNPAID`).
   - Parents can review fee payment history and computerized receipt numbers.
   - Admin Fee Register provides 1-click status toggles, payment date recording, and filterable summaries.
   - Transparent payment guidelines (School accounts counter, HBL/MCB bank accounts, EasyPaisa, Raast).

4. **Interactive Teacher Marks Entry Sheet**
   - Spreadsheet-style grading interface for teachers.
   - Real-time automatic calculation of Total Marks, Percentage, Letter Grade, and Pass/Fail status as marks are typed.
   - Instant 1-click publishing to the live student portal.

5. **School Circulars & Announcements Board**
   - Categorized badges: `NOTICE`, `EVENT`, `HOLIDAY`, `EXAM`.
   - Pinned notices featured directly on the homepage banner.
   - Searchable and filterable public notice board.

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

### 1. Prerequisites
- **Node.js** v18.18+ or v20+ (tested on Node v26)
- **npm** (or `pnpm` / `yarn`)

### 2. Installation
Clone or navigate to the project directory:
```bash
cd "d:\Final Year Project\antigravity"
```

Install dependencies:
```bash
npm install
```

### 3. Database Setup & Seeding
Initialize the SQLite database and seed realistic demo records:
```bash
npx prisma db push
npm run seed     # or: npx tsx prisma/seed.ts
```

### 4. Run the Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🔑 Pre-Seeded Demo Credentials

| Role | Email | Password | Access Capabilities |
| :--- | :--- | :--- | :--- |
| **School Administrator** | `admin@nayab.edu.pk` | `Admin@123` | Full control: Student directory, Fee register, Marks, Announcements |
| **Science Teacher** | `teacher.science@nayab.edu.pk` | `Teacher@123` | Marks entry grid for Classes 8, 9, 10, Class notices |
| **Mathematics Teacher**| `teacher.math@nayab.edu.pk` | `Teacher@123` | Marks entry grid for Classes 9 & 10 |
| **Parent / Student** | *No login needed* | *Public* | Search by Class + Roll Number (e.g. Class 9 Roll 101, Class 10 Roll 201) |

> 💡 **Tip**: The `/login` page includes 1-click **"Admin Login"** and **"Teacher Login"** demo buttons for instant evaluation.

---

## 📋 Quick Test Roll Numbers

| Class | Roll No | Student Name | Performance Summary | Fee Status |
| :--- | :--- | :--- | :--- | :--- |
| **Class 9** | `101` | Muhammad Ali | 90.4% — Grade A+ (1st Position) | **PAID** (Receipt: NGS-REC-2025-0914) |
| **Class 9** | `102` | Ayesha Khan | 85.6% — Grade A+ (Pass) | **PAID** (Receipt: NGS-REC-2025-0925) |
| **Class 9** | `103` | Bilawal Bhutto | 73.0% — Grade A (Pass) | **PENDING** (Due: 10 Sep) |
| **Class 9** | `105` | Shahmeer Ali | 57.0% — Grade C (Pass) | **UNPAID** (Overdue) |
| **Class 9** | `106` | Dua Maryam | 43.0% — Grade F (Needs Help) | **PENDING** |
| **Class 10**| `201` | Hamza Farooq | 93.6% — Grade A+ (Matric Top) | **PAID** |
| **Class 8** | `301` | Rayyan Ahmed | 88.0% — Grade A+ (Middle Top) | **PAID** |

---

## 🔄 How to Plug In the School's Real Data

### 1. Change the School Logo
Replace the image located at:
```
public/images/school-logo.png
```
Keep the same filename or update the image path in `Navbar.tsx`, `Footer.tsx`, and `ReportCard.tsx`.

### 2. Updating Students & Real Enrollments
- **Via Admin UI**: Navigate to `/admin/students` and click **"Add New Student"**.
- **Via Database Seed**: Open `prisma/seed.ts` and modify the `studentsData` array with the school's actual student roster, then run `npx tsx prisma/seed.ts`.

### 3. Modifying Subjects & Grading Scale
- Default subjects and max marks are defined in `src/app/teacher/marks-entry/page.tsx` (`DEFAULT_SUBJECTS`).
- Grade bands and criteria are located in `src/lib/grading.ts` (`calculateGrade` and `GRADE_CRITERIA`).

### 4. Updating School Fee Structure & Bank Accounts
- Fee amounts can be adjusted in `src/app/admin/fees/page.tsx`.
- Bank account details and accounts office timings can be customized in:
  - `src/app/fees/page.tsx`
  - `src/lib/school-knowledge.ts` (so the AI chatbot always gives the updated account info)

### 5. Deploying to Cloud (Vercel / Railway / Render)
1. **Frontend (Vercel)**: Push to GitHub, import to Vercel. Works out-of-the-box.
2. **Database (PostgreSQL / Supabase)**: In `prisma/schema.prisma`, change `provider = "sqlite"` to `provider = "postgresql"` and provide your `DATABASE_URL` in the environment variables.

---

## 🏫 About Nayab Grammar School, Mirwah
- **Location**: Mirwah, Sindh, Pakistan
- **Established**: 2012
- **Colors**: Navy Blue (`#1B2A4A`) & Warm Gold (`#D4AF37`)
- **Contact**: +92 301 2345670 • info@nayab.edu.pk
