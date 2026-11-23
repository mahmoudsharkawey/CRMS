"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Search,
  User,
  Users,
  Shield,
  FileText,
  BadgeAlert,
  ChevronLeft,
  X,
  RefreshCw,
  FileCheck2,
} from "lucide-react";
import { getStatusBadge, cn } from "@/lib/utils";
import type { Recruit } from "@/types";

export default function ConscriptsSearchPage() {
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("الكل");
  const [recruits, setRecruits] = useState<Recruit[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch recruits
  const fetchRecruits = async (searchQuery: string = "") => {
    setLoading(true);
    try {
      const res = await fetch(`/api/recruits?q=${encodeURIComponent(searchQuery)}`);
      if (res.ok) {
        const data = await res.json();
        setRecruits(data);
      }
    } catch (err) {
      console.error("Error loading recruits:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecruits("");
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchRecruits(query);
  };

  const handleClear = () => {
    setQuery("");
    fetchRecruits("");
  };

  // Filter recruits by administrative status if selected
  const filteredRecruits = recruits.filter((r) => {
    if (statusFilter === "الكل") return true;
    return r.administrativeStatus === statusFilter;
  });

  return (
    <div className="flex flex-col gap-6 w-full max-w-7xl mx-auto">
      {/* Top Banner / Breadcrumb */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-1">
            <span>منظومة شؤون المجندين</span>
            <span>/</span>
            <span className="text-[#1E3A8A] font-semibold">إدارة قوات أمن جنوب سيناء</span>
          </div>
          <h1 className="text-2xl font-bold text-[#0F2042] tracking-tight">
            شاشة البحث والاستعلام عن المجندين
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            البحث في السجلات المركزية بالاسم الرباعي، رقم الشرطة العسكري، أو رقم الملف الدفتري
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => fetchRecruits(query)}
            className="inline-flex items-center gap-1.5 px-3 py-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-lg shadow-sm transition-all"
            title="تحديث البيانات"
          >
            <RefreshCw className={cn("w-3.5 h-3.5", loading && "animate-spin text-[#1E3A8A]")} />
            <span>تحديث</span>
          </button>
        </div>
      </div>

      {/* Advanced Search Box Card */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm flex flex-col gap-4">
        <form onSubmit={handleSearchSubmit} className="flex flex-col gap-3">
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <div className="relative flex-1 w-full">
              <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none text-slate-400">
                <Search className="w-5 h-5 text-[#1E3A8A]" />
              </div>
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="ابحث بالاسم الكامل (مثال: طارق كمال)، رقم الشرطة (مثال: 2023/18420)، أو رقم الملف (مثال: م/1402/ط)..."
                className="w-full pl-10 pr-11 py-3 bg-slate-50/70 border border-slate-300 rounded-lg text-sm text-[#0F2042] placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#1E3A8A] focus:bg-white transition-all font-medium"
                dir="rtl"
              />
              {query && (
                <button
                  type="button"
                  onClick={handleClear}
                  className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400 hover:text-slate-600"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            <button
              type="submit"
              className="w-full sm:w-auto px-6 py-3 bg-[#0F2042] hover:bg-[#1E3A8A] text-white rounded-lg text-sm font-semibold flex items-center justify-center gap-2 shadow-sm transition-all shrink-0 cursor-pointer"
            >
              <Search className="w-4 h-4 text-[#C5A059]" />
              <span>بحث في السجلات</span>
            </button>
          </div>

          {/* Quick status filter pills */}
          <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-slate-100">
            <span className="text-xs font-semibold text-slate-500 ml-1">تصفية حسب الحالة الإدارية:</span>
            {["الكل", "على القوة", "مستجد", "رديف", "شطب", "رفت"].map((status) => {
              const active = statusFilter === status;
              return (
                <button
                  key={status}
                  type="button"
                  onClick={() => setStatusFilter(status)}
                  className={cn(
                    "text-xs px-3 py-1 rounded-md font-semibold transition-all border",
                    active
                      ? "bg-[#0F2042] text-white border-[#0F2042] shadow-xs"
                      : "bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100"
                  )}
                >
                  {status}
                </button>
              );
            })}
          </div>
        </form>
      </div>

      {/* Results Table Card */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm flex flex-col">
        {/* Table Top Bar */}
        <div className="px-5 py-3.5 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-[#1E3A8A]" />
            <h2 className="text-sm font-bold text-[#0F2042]">
              نتائج استعلام المجندين
            </h2>
            <span className="px-2 py-0.5 rounded-full bg-slate-200 text-slate-800 text-xs font-bold font-mono">
              {filteredRecruits.length}
            </span>
          </div>
          <span className="text-xs text-slate-500 font-medium hidden sm:inline">
            انقر على أي سجل للانتقال إلى الملف الشخصي الشامل
          </span>
        </div>

        {/* Table Content */}
        <div className="overflow-x-auto w-full">
          {loading ? (
            <div className="py-20 flex flex-col items-center justify-center gap-3">
              <div className="w-8 h-8 border-3 border-[#1E3A8A] border-t-transparent rounded-full animate-spin"></div>
              <span className="text-xs text-slate-500 font-medium">جارٍ فحص قاعدة بيانات المجندين...</span>
            </div>
          ) : filteredRecruits.length === 0 ? (
            <div className="py-20 flex flex-col items-center justify-center text-center p-6">
              <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 mb-3">
                <FileCheck2 className="w-6 h-6" />
              </div>
              <h3 className="text-sm font-bold text-slate-700">لم يتم العثور على سجلات مطابقة</h3>
              <p className="text-xs text-slate-500 mt-1 max-w-sm">
                تأكد من كتابة الاسم أو رقم الشرطة أو رقم الملف بشكل صحيح، أو اضغط زر التحديث لإعادة ضبط البحث.
              </p>
            </div>
          ) : (
            <table className="w-full text-right border-collapse">
              <thead>
                <tr className="bg-slate-100/70 text-slate-600 text-xs font-bold uppercase border-b border-slate-200 select-none">
                  <th className="py-3 px-4">المجند</th>
                  <th className="py-3 px-4">رقم الشرطة</th>
                  <th className="py-3 px-4">رقم الملف</th>
                  <th className="py-3 px-4">الوحدة والكتيبة</th>
                  <th className="py-3 px-4 text-center">الحالة الإدارية</th>
                  <th className="py-3 px-4 text-center">الإجراء</th>
                </tr>
              </thead>
              <tbody className="text-sm divide-y divide-slate-100">
                {filteredRecruits.map((recruit) => {
                  const statusInfo = getStatusBadge(recruit.administrativeStatus);
                  return (
                    <tr
                      key={recruit.id}
                      className="hover:bg-slate-50/80 transition-colors group cursor-pointer"
                    >
                      {/* Conscript details & photo */}
                      <td className="py-3.5 px-4">
                        <Link
                          href={`/recruits/${recruit.id}`}
                          className="flex items-center gap-3"
                        >
                          <div className="w-12 h-12 rounded-lg bg-slate-100 border border-slate-200 overflow-hidden flex-shrink-0 flex items-center justify-center shadow-xs">
                            {recruit.photo ? (
                              <img
                                src={recruit.photo}
                                alt={recruit.fullName}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <User className="w-6 h-6 text-slate-400" />
                            )}
                          </div>
                          <div className="flex flex-col min-w-0">
                            <span className="text-sm font-bold text-[#0F2042] group-hover:text-[#1E3A8A] transition-colors">
                              {recruit.fullName}
                            </span>
                            <span className="text-xs text-slate-500 truncate max-w-xs">
                              {recruit.education || "المؤهل: غير مسجل"} • الرقم القومي: <span className="font-mono">{recruit.nationalId}</span>
                            </span>
                          </div>
                        </Link>
                      </td>

                      {/* Police Number */}
                      <td className="py-3.5 px-4 font-mono font-bold text-[#0F2042] text-sm">
                        {recruit.policeNumber}
                      </td>

                      {/* File Number */}
                      <td className="py-3.5 px-4">
                        <span className="font-mono text-xs font-semibold px-2 py-1 bg-slate-100 border border-slate-200 rounded text-slate-700">
                          {recruit.fileNumber}
                        </span>
                      </td>

                      {/* Service / Unit */}
                      <td className="py-3.5 px-4 text-xs text-slate-600 font-medium">
                        {recruit.serviceInformation || "معسكر فرق الأمن - الطور"}
                      </td>

                      {/* Administrative Status */}
                      <td className="py-3.5 px-4 text-center">
                        <span
                          className={cn(
                            "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold border",
                            statusInfo.bg
                          )}
                        >
                          <span className={cn("w-2 h-2 rounded-full", statusInfo.dot)}></span>
                          <span>{recruit.administrativeStatus}</span>
                        </span>
                      </td>

                      {/* Action */}
                      <td className="py-3.5 px-4 text-center">
                        <Link
                          href={`/recruits/${recruit.id}`}
                          className="inline-flex items-center gap-1 px-3 py-1.5 bg-[#0F2042] hover:bg-[#1E3A8A] text-white text-xs font-semibold rounded-md shadow-xs transition-all"
                        >
                          <span>فتح الملف</span>
                          <ChevronLeft className="w-3.5 h-3.5" />
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>

        {/* Table Footer */}
        <div className="px-5 py-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
          <span>
            إجمالي المجندين المعروضين: <strong className="text-slate-800 font-bold">{filteredRecruits.length}</strong>
          </span>
          <span>منظومة شؤون الأفراد - قوات أمن جنوب سيناء</span>
        </div>
      </div>
    </div>
  );
}
