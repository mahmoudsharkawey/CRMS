"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { UserSearch, ShieldCheck, MapPin, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useNav } from "@/components/layout/nav-context";

const navigationItems = [
  {
    name: "البحث عن مجند",
    href: "/",
    icon: UserSearch,
    badge: "الرئيسية",
  },
];

export function Sidebar() {
  const pathname = usePathname();
  const { isMobileNavOpen, closeMobileNav } = useNav();

  return (
    <>
      {/* Mobile Backdrop */}
      {isMobileNavOpen && (
        <div
          onClick={closeMobileNav}
          className="fixed inset-0 bg-[#0F2042]/50 backdrop-blur-xs z-40 lg:hidden transition-opacity"
        />
      )}

      <aside
        className={cn(
          "fixed right-0 top-16 bottom-0 w-72 lg:w-64 bg-white border-l border-slate-200 z-50 flex flex-col justify-between py-4 shadow-[0_1px_4px_rgba(15,32,66,0.06)] transition-transform duration-300 ease-in-out",
          isMobileNavOpen ? "translate-x-0" : "translate-x-full lg:translate-x-0"
        )}
      >
        <div className="px-3 flex flex-col gap-4">
          {/* Mobile drawer header with close button */}
          <div className="flex items-center justify-between pb-2 border-b border-slate-100 lg:hidden">
            <span className="text-xs font-bold text-[#0F2042]">قائمة المنظومة</span>
            <button
              onClick={closeMobileNav}
              className="p-1 rounded-md hover:bg-slate-100 text-slate-500"
              aria-label="إغلاق القائمة"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Sector badge */}
          <div className="p-2.5 bg-amber-50/80 border border-amber-200/80 rounded-lg flex items-center gap-2">
            <MapPin className="w-4 h-4 text-[#C5A059] shrink-0" />
            <div className="flex flex-col">
              <span className="text-xs font-bold text-amber-900">نطاق الاختصاص</span>
              <span className="text-[11px] text-amber-700">مديرية أمن جنوب سيناء</span>
            </div>
          </div>

          {/* Navigation links */}
          <nav className="flex flex-col gap-1">
            {navigationItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={closeMobileNav}
                  className={cn(
                    "flex items-center justify-between px-3.5 py-2.5 rounded-lg text-sm font-semibold transition-all",
                    isActive
                      ? "bg-[#0F2042] text-white shadow-sm"
                      : "text-slate-600 hover:bg-slate-50 hover:text-[#0F2042]"
                  )}
                >
                  <div className="flex items-center gap-2.5">
                    <item.icon className={cn("w-4 h-4", isActive ? "text-[#C5A059]" : "text-slate-400")} />
                    <span>{item.name}</span>
                  </div>
                  {item.badge && (
                    <span
                      className={cn(
                        "text-[10px] px-1.5 py-0.5 rounded font-mono",
                        isActive ? "bg-white/20 text-white" : "bg-slate-100 text-slate-500"
                      )}
                    >
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Security and compliance footnote */}
        <div className="px-4">
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg flex flex-col gap-1.5">
            <div className="flex items-center gap-1.5 text-[#0F2042]">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span className="text-xs font-bold">سجلات مشفرة ومؤمنة</span>
            </div>
            <p className="text-[11px] text-slate-500 leading-4">
              المنظومة مخصصة للاستخدام الإداري المعتمد لضباط شؤون الأفراد.
            </p>
          </div>
        </div>
      </aside>
    </>
  );
}
