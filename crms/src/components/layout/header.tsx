"use client";

import { Shield, Clock, Menu, X } from "lucide-react";
import { useNav } from "@/components/layout/nav-context";

export function Header() {
  const { isMobileNavOpen, toggleMobileNav } = useNav();

  return (
    <header className="fixed top-0 inset-x-0 h-16 z-50 bg-white shadow-[0_1px_4px_rgba(15,32,66,0.06)] border-b border-slate-200">
      <div className="h-16 w-full px-3.5 sm:px-6 flex items-center justify-between">
        {/* Title and Ministry context */}
        <div className="flex items-center gap-2.5 sm:gap-3.5">
          <button
            type="button"
            onClick={toggleMobileNav}
            aria-label="القائمة الجانبية"
            className="lg:hidden w-9 h-9 rounded-lg border border-slate-200 bg-slate-50 flex items-center justify-center text-[#0F2042] hover:bg-slate-100 transition-colors cursor-pointer shrink-0"
          >
            {isMobileNavOpen ? <X className="w-5 h-5 text-rose-600" /> : <Menu className="w-5 h-5" />}
          </button>

          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-[#0F2042] flex items-center justify-center text-[#C5A059] shadow-sm shrink-0">
            <Shield className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>
          <div className="flex flex-col">
            <span className="text-xs sm:text-base font-bold text-[#0F2042] tracking-tight leading-4 sm:leading-5">
              إدارة شؤون المجندين
            </span>
            <span className="text-[10px] sm:text-xs text-slate-500 font-medium leading-3 sm:leading-4">
              إدارة قوات أمن جنوب سيناء
            </span>
          </div>
        </div>

        {/* System Badges & Indicators */}
        <div className="flex items-center gap-2 sm:gap-4">
          {/* Mobile compact badge */}
          <div className="flex md:hidden items-center gap-1.5 bg-emerald-50 border border-emerald-200/80 px-2 py-1 rounded-md">
            <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse"></span>
            <span className="text-[10px] font-bold text-emerald-800">تشغيل آمن</span>
          </div>

          {/* Desktop full indicator */}
          <div className="hidden md:flex items-center gap-2.5 bg-slate-50 border border-slate-200 px-3.5 py-1.5 rounded-lg">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse"></span>
              <span className="text-xs font-semibold text-slate-700">النظام: تشغيل محلي مؤمن</span>
            </div>
            <span className="text-slate-300">|</span>
            <div className="flex items-center gap-1 text-slate-500 text-xs">
              <Clock className="w-3.5 h-3.5" />
              <span>نسخة تجريبية (بيانات افتراضية)</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
