import { redirect } from "next/navigation";
import { getCurrentSession } from "@/lib/auth";
import AdminSidebar from "@/components/layout/AdminSidebar";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getCurrentSession();

  if (!session || session.role !== "ADMIN") {
    redirect("/login");
  }

  return (
    <div className="min-h-screen bg-[#F2F4F7] print:bg-white print:min-h-0 flex flex-col md:flex-row font-sans">
      <AdminSidebar session={session} />
      {/* Main Content Area with mobile-friendly padding */}
      <main className="flex-1 overflow-x-hidden p-3.5 sm:p-6 lg:p-8 print:p-0 print:m-0 w-full max-w-full">
        {children}
      </main>
    </div>
  );
}
