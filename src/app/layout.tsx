import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import BottomNav from "@/components/layout/BottomNav";
import AskNayabModal from "@/components/chatbot/AskNayabModal";

export const metadata: Metadata = {
  title: "Nayab English Grammer High School Mirwah — Official Portal",
  description:
    "Official school management portal for Nayab English Grammer High School Mirwah. Fast public result lookup, fee status tracking, announcements, and AI assistance.",
  icons: {
    icon: "/images/school-logo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body className="min-h-full flex flex-col bg-[#F8F9FB] text-slate-900 selection:bg-[#D4AF37]/30 selection:text-[#111C32]">
        <Navbar />
        <main className="flex-1 pb-16 md:pb-0">{children}</main>
        <Footer />
        <BottomNav />
        <AskNayabModal />
      </body>
    </html>
  );
}
