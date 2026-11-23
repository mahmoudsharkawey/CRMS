"use client";

import { Shield, Clock } from "lucide-react";

export function Header() {
  return (
    <header className="fixed top-0 inset-x-0 h-16 z-50 bg-white shadow-[0_1px_4px_rgba(15,32,66,0.06)] border-b border-slate-200">
      <div className="h-16 w-full px-6 flex items-center justify-between">
        {/* Title and Ministry context */}
        <div className="flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-lg bg-[#0F2042] flex items-center justify-center text-[#C5A059] shadow-sm">
            <Shield className="w-5 h-5" />
          </div>
          <div className="flex flex-col">
            <span className="text-base font-bold text-[#0F2042] tracking-tight leading-5">
              إدارة شؤون المجندين
            </span>
            <span className="text-xs text-slate-500 font-medium leading-4">
              إدارة قوات أمن جنوب سيناء
            </span>
          </div>
        </div>

        {/* System Badges & Indicators */}
        <div className="flex items-center gap-4">
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
