import { redirect } from "next/navigation";
import { getCurrentSession } from "@/lib/auth";
import TeacherSidebar from "@/components/layout/TeacherSidebar";

export default async function TeacherLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getCurrentSession();

  if (!session || (session.role !== "TEACHER" && session.role !== "ADMIN")) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen bg-[#F8F9FB] flex flex-col md:flex-row">
      <TeacherSidebar session={session} />
      {/* Main Content Area with mobile responsive padding */}
      <main className="flex-1 overflow-x-hidden p-3.5 sm:p-6 lg:p-8 w-full max-w-full">
        {children}
      </main>
    </div>
  );
}
