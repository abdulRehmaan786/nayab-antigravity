export interface SchoolQA {
  keywords: string[];
  question: string;
  answer: string;
  category: "results" | "fees" | "timings" | "uniform" | "admissions" | "general" | "holidays";
  actionLink?: {
    label: string;
    href: string;
  };
}

export const SCHOOL_INFO = {
  name: "Nayab Grammar School",
  location: "Mirwah, Sindh, Pakistan",
  established: "2012",
  phone: "+92 301 2345670 / +92 312 9876543",
  email: "info@nayab.edu.pk / principal@nayab.edu.pk",
  accountsOffice: "Accounts Branch, Ground Floor, Admin Block (9:00 AM - 1:00 PM)",
  gradesOffered: "Nursery, KG-1, KG-2, and Class 1 through Class 10 (Matriculation Board)",
  timings: {
    summer: "Monday to Thursday & Saturday: 7:45 AM – 1:15 PM | Friday: 7:45 AM – 11:45 AM",
    winter: "Monday to Thursday & Saturday: 8:00 AM – 1:30 PM | Friday: 8:00 AM – 12:00 PM",
  },
  uniform: {
    boys: "White collared shirt, navy blue formal trousers, navy blue tie with school crest, black leather shoes, navy blue socks. Winter: plain navy blue pullover or blazer.",
    girls: "Navy blue frock or shalwar-kameez with white collar piping, white shalwar, navy blue dupatta / scarf, black formal shoes, white socks. Winter: plain navy blue cardigan or blazer.",
  },
  feePolicy: {
    monthlyTuition: "Rs. 2,500 (Class 1 to 10)",
    dueDate: "10th of every calendar month",
    lateFeePolicy: "A nominal late fee surcharge of Rs. 100 is applied after the 15th of the month.",
    paymentMethods: [
      "School Accounts Office counter via cash or cross-cheque (Mon-Sat, 8:30 AM - 1:30 PM)",
      "Direct Bank Deposit at HBL / MCB Mirwah Branch (Account Title: Nayab Grammar School)",
      "Online Banking / Raast / EasyPaisa / JazzCash using the unique student Roll Number as Challan Reference",
    ],
  },
};

export const SCHOOL_KNOWLEDGE_BASE: SchoolQA[] = [
  {
    keywords: ["result", "marks", "grade", "report card", "percentage", "check result", "score", "pass", "fail"],
    question: "How do I check my or my child's exam result?",
    answer:
      "You can check exam results instantly without logging in! Simply go to our homepage search bar or the dedicated 'Result Lookup' page:\n1. Select your child's Class (e.g., Class 9 or Class 10).\n2. Enter their Roll Number (e.g., 101, 201).\n3. Click 'Search Record'.\nYou will see subject-wise marks, percentage, overall grade, and a one-click button to download or print an official report card with the school seal.",
    category: "results",
    actionLink: {
      label: "Go to Result Lookup",
      href: "/results",
    },
  },
  {
    keywords: ["fee", "fees", "challan", "dues", "tuition", "voucher", "pay fee", "unpaid", "pending", "payment"],
    question: "How do I check fee status or pay monthly dues?",
    answer:
      "To check fee status:\n1. Open the 'Fee Status' page from the menu or use the search bar on the homepage with your Class and Roll Number.\n2. You will see whether the current month's fee is Paid, Pending, or Overdue along with the receipt number if already paid.\n\nFee Payment Options:\n• Accounts Office Counter: Mon–Sat, 8:30 AM – 1:30 PM.\n• Online Bank Transfer / EasyPaisa / Raast to Nayab Grammar School account. Keep your transaction ID for receipt confirmation.",
    category: "fees",
    actionLink: {
      label: "Check Fee Status",
      href: "/fees",
    },
  },
  {
    keywords: ["timing", "timings", "time", "hours", "opening", "closing", "schedule", "assembly", "dismissal", "friday"],
    question: "What are the school timings?",
    answer:
      "Current School Timings (Winter Session):\n• Monday to Thursday & Saturday: 8:00 AM – 1:30 PM (Assembly begins at 8:00 AM sharp; gates open at 7:45 AM).\n• Friday: 8:00 AM – 12:00 PM.\nStudents arriving after 8:15 AM are marked late. Please ensure timely arrival.",
    category: "timings",
  },
  {
    keywords: ["uniform", "dress", "clothes", "tie", "trouser", "shoes", "sweater", "blazer", "frock", "shalwar"],
    question: "What is the official school uniform policy?",
    answer:
      "Official Uniform Guidelines:\n• Boys: Crisp white collared shirt, navy blue trousers, navy blue tie, black shoes, and navy socks.\n• Girls: Navy blue frock or shalwar-kameez with white collar, white shalwar, navy dupatta/scarf, black shoes, and white socks.\n• Winter Wear: Plain navy blue pullover sweater or navy blazer. No non-uniform jackets are permitted during class hours.",
    category: "uniform",
  },
  {
    keywords: ["holiday", "vacation", "eid", "off", "closed", "break", "calendar", "rabi ul awwal"],
    question: "When is the next holiday or school break?",
    answer:
      "School holidays follow the official Sindh Education Department calendar. Upcoming notifications include:\n• 12th Rabi-ul-Awwal (Eid Milad-un-Nabi): Friday holiday.\n• Monthly Parent-Teacher Meeting (PTM): Saturday, 20th September.\nPlease check our Announcements board for live updates and urgent weather-related notifications.",
    category: "holidays",
    actionLink: {
      label: "View Announcements",
      href: "/announcements",
    },
  },
  {
    keywords: ["admission", "admit", "apply", "enroll", "seat", "entry test", "documents", "age"],
    question: "What is the admission procedure at Nayab Grammar School?",
    answer:
      "Admissions are open for Nursery through Class 9 at the start of the academic year. Requirements:\n1. Completed Admission Application Form (available at the admin desk).\n2. Child's Birth Certificate (B-Form / NADRA).\n3. Previous School Leaving Certificate (SLC) and Result Card for Class 1 and above.\n4. 4 passport-size photographs of the student.\n5. Copy of Father's / Guardian's CNIC.\nAn age-appropriate diagnostic entry assessment in English, Urdu, and Mathematics is conducted for placement.",
    category: "admissions",
  },
  {
    keywords: ["contact", "phone", "number", "location", "address", "map", "email", "office", "principal"],
    question: "How can I contact Nayab Grammar School administration?",
    answer:
      "You can contact us via:\n• Phone: +92 301 2345670 / +92 312 9876543\n• Email: info@nayab.edu.pk / principal@nayab.edu.pk\n• Address: Main Campus, Mirwah, Sindh, Pakistan\n• Administration Visiting Hours: Monday to Thursday, 9:00 AM – 1:00 PM.",
    category: "general",
  },
];

export function findSchoolKnowledge(query: string): SchoolQA | null {
  const normalized = query.toLowerCase();
  let bestMatch: SchoolQA | null = null;
  let maxScore = 0;

  for (const item of SCHOOL_KNOWLEDGE_BASE) {
    let score = 0;
    for (const kw of item.keywords) {
      if (normalized.includes(kw)) {
        score += 2;
      }
    }
    if (normalized.includes(item.category)) {
      score += 3;
    }
    if (score > maxScore && score >= 2) {
      maxScore = score;
      bestMatch = item;
    }
  }

  return bestMatch;
}
