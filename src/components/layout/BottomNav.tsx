"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, FileText, CreditCard, Bell, User } from "lucide-react";

export default function BottomNav() {
  const pathname = usePathname();

  const tabs = [
    { name: "Home", href: "/", icon: Home },
    { name: "Results", href: "/results", icon: FileText },
    { name: "Fees", href: "/fees", icon: CreditCard },
    { name: "Notices", href: "/announcements", icon: Bell },
    { name: "Portal", href: "/login", icon: User },
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#1B2A4A] border-t border-[#D4AF37]/40 shadow-2xl print-hide">
      <nav className="flex items-center justify-around px-2 py-1.5 safe-area-bottom">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = pathname === tab.href;
          return (
            <Link
              key={tab.name}
              href={tab.href}
              className={`flex flex-col items-center justify-center min-w-[64px] min-h-[48px] py-1 px-2 rounded-xl transition ${
                isActive
                  ? "text-[#D4AF37] font-semibold"
                  : "text-slate-300 hover:text-white"
              }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? "stroke-[2.5]" : "stroke-[1.75]"}`} />
              <span className="text-[10px] tracking-tight mt-1">{tab.name}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
