"use client";

import { useState, useEffect, use, Suspense } from "react";
import Link from "next/link";
import {
  ArrowRight,
  User,
  Shield,
  FileText,
  Calendar,
  Building2,
  Clock,
  Printer,
  PlusCircle,
  Edit,
  History,
  FileCheck2,
  Paperclip,
  ZoomIn,
  AlertTriangle,
  Stethoscope,
  Activity,
  CalendarClock,
  HeartPulse,
  Glasses,
  ClipboardCheck,
  Gavel,
  Building,
  CheckCircle2,
  FileDown,
} from "lucide-react";
import {
  formatDate,
  formatDateShort,
  getStatusBadge,
  getRecordTypeBadge,
  cn,
} from "@/lib/utils";
import type { Recruit, RecruitRecord, StatusHistory, PaperDocument } from "@/types";
import { RecordModal } from "@/components/profile/record-modal";
import { StatusModal } from "@/components/profile/status-modal";
import { EditBasicInfoModal } from "@/components/profile/edit-basic-info-modal";
import { LeaveReportModal } from "@/components/profile/leave-report-modal";
import { PaperRecordModal } from "@/components/profile/paper-record-modal";

interface PageProps {
  params: Promise<{ id: string }>;
}

function RecruitProfileContent({ recruitId }: { recruitId: string }) {
  const [recruit, setRecruit] = useState<Recruit | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Modals state
  const [isRecordModalOpen, setIsRecordModalOpen] = useState(false);
  const [recordToEdit, setRecordToEdit] = useState<RecruitRecord | null>(null);

  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [isEditBasicInfoOpen, setIsEditBasicInfoOpen] = useState(false);
  const [isLeaveReportOpen, setIsLeaveReportOpen] = useState(false);
  const [isPaperRecordOpen, setIsPaperRecordOpen] = useState(false);

  // Timeline category filter
  const [timelineFilter, setTimelineFilter] = useState<string>("الكل");

  const fetchRecruit = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/recruits/${recruitId}`);
      if (!res.ok) {
        throw new Error("لم يتم العثور على المجند");
      }
      const data = await res.json();
      setRecruit(data);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "خطأ أثناء تحميل الملف";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecruit();
  }, [recruitId]);

  if (loading) {
    return (
      <div className="py-24 flex flex-col items-center justify-center gap-3">
        <div className="w-9 h-9 border-3 border-[#1E3A8A] border-t-transparent rounded-full animate-spin"></div>
        <span className="text-xs text-slate-500 font-semibold">جارٍ تحميل السجل الشامل للمجند...</span>
      </div>
    );
  }

  if (error || !recruit) {
    return (
      <div className="py-20 flex flex-col items-center justify-center text-center">
        <AlertTriangle className="w-12 h-12 text-rose-500 mb-3" />
        <h2 className="text-base font-bold text-slate-800">{error || "تعذر فتح السجل"}</h2>
        <Link
          href="/"
          className="mt-4 px-4 py-2 bg-[#0F2042] text-white text-xs font-semibold rounded-lg"
        >
          العودة لشاشة البحث
        </Link>
      </div>
    );
  }

  const statusBadge = getStatusBadge(recruit.administrativeStatus);

  // Filter records
  const allRecords = recruit.records || [];
  const filteredRecords = allRecords.filter((r) => {
    if (timelineFilter === "الكل") return true;
    if (timelineFilter === "طبي") {
      return r.type !== "جزاء / أورنيك";
    }
    if (timelineFilter === "إجازات") {
      return r.type === "إجازة مرضية" || r.type === "راحة";
    }
    if (timelineFilter === "انضباطي") {
      return r.type === "جزاء / أورنيك";
    }
    return true;
  });

  // Main paper document (if any, or fallback to first)
  const mainPaperDoc = recruit.paperDocuments?.[0];

  return (
    <div className="flex flex-col gap-6 w-full max-w-7xl mx-auto pb-12">
      {/* 1. Top Action and Navigation Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-200">
        <div className="flex items-center gap-2">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-slate-600 hover:text-[#0F2042] hover:bg-slate-100 text-xs font-semibold transition-colors"
          >
            <ArrowRight className="w-4 h-4" />
            <span>العودة لشاشة البحث</span>
          </Link>
          <span className="text-slate-300">/</span>
          <span className="text-xs font-semibold text-slate-500">الملف الفردي المعتمد</span>
        </div>

        {/* Primary Printing Actions (EXACTLY the two required printing actions) */}
        <div className="grid grid-cols-2 sm:flex sm:items-center gap-2 w-full sm:w-auto">
          {/* Action 1: طباعة السجل الورقي */}
          <button
            type="button"
            onClick={() => setIsPaperRecordOpen(true)}
            className="inline-flex items-center justify-center gap-1.5 px-3 sm:px-4 py-2 bg-white border border-slate-300 hover:bg-slate-50 text-[#0F2042] text-xs font-bold rounded-lg shadow-xs transition-all cursor-pointer"
          >
            <FileText className="w-4 h-4 text-[#1E3A8A]" />
            <span>طباعة السجل الورقي</span>
          </button>

          {/* Action 2: طباعة بيان الإجازات */}
          <button
            type="button"
            onClick={() => setIsLeaveReportOpen(true)}
            className="inline-flex items-center justify-center gap-1.5 px-3 sm:px-4 py-2 bg-[#C5A059] hover:bg-[#b08d47] text-[#0F2042] text-xs font-bold rounded-lg shadow-xs transition-all cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span>طباعة بيان الإجازات</span>
          </button>

          {/* Add Record Button */}
          <button
            type="button"
            onClick={() => {
              setRecordToEdit(null);
              setIsRecordModalOpen(true);
            }}
            className="col-span-2 sm:col-span-1 inline-flex items-center justify-center gap-1.5 px-3 sm:px-4 py-2 bg-[#0F2042] hover:bg-[#1E3A8A] text-white text-xs font-bold rounded-lg shadow-sm transition-all cursor-pointer"
          >
            <PlusCircle className="w-4 h-4 text-[#C5A059]" />
            <span>إضافة قيد بالسجل</span>
          </button>
        </div>
      </div>

      {/* 2. Conscript Profile Dossier Card (Basic Info & Administrative Status) */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-6">
          {/* Profile Photo */}
          <div className="shrink-0 text-center">
            <div className="w-28 h-32 sm:w-32 sm:h-36 rounded-xl bg-slate-100 border-2 border-slate-200 overflow-hidden shadow-xs flex items-center justify-center p-0.5">
              {recruit.photo ? (
                <img
                  src={recruit.photo}
                  alt={recruit.fullName}
                  className="w-full h-full object-cover rounded-lg"
                />
              ) : (
                <User className="w-16 h-16 text-slate-300" />
              )}
            </div>
            <div className="mt-2 text-center">
              <span className="text-[10px] font-mono text-slate-400 bg-slate-50 px-2 py-0.5 rounded border border-slate-200">
                سجل معتمد
              </span>
            </div>
          </div>

          {/* Main Info Header & Status */}
          <div className="flex-1 w-full flex flex-col justify-between">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs px-2 py-0.5 bg-slate-100 border border-slate-200 rounded font-semibold text-slate-700">
                    جندي مجند
                  </span>
                  <span className="text-xs text-slate-500">
                    قوات أمن جنوب سيناء
                  </span>
                </div>
                <h1 className="text-lg sm:text-2xl font-bold text-[#0F2042] tracking-tight">
                  {recruit.fullName}
                </h1>
              </div>

              {/* Administrative Status Widget */}
              <div className="flex items-center gap-2 self-start sm:self-auto">
                <div
                  className={cn(
                    "inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border shadow-xs text-xs font-bold",
                    statusBadge.bg
                  )}
                >
                  <span className={cn("w-2.5 h-2.5 rounded-full animate-pulse", statusBadge.dot)}></span>
                  <span>الحالة: {recruit.administrativeStatus}</span>
                </div>

                <button
                  type="button"
                  onClick={() => setIsStatusModalOpen(true)}
                  className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300 text-xs font-semibold rounded-lg transition-colors cursor-pointer"
                  title="تغيير الحالة الإدارية"
                >
                  تغيير الحالة
                </button>
              </div>
            </div>

            {/* Basic Information Grid (8 core data points) */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 py-4">
              <div>
                <span className="block text-[11px] font-semibold text-slate-400">الرقم القومي</span>
                <span className="text-xs font-mono font-bold text-slate-800 tracking-wider">
                  {recruit.nationalId}
                </span>
              </div>

              <div>
                <span className="block text-[11px] font-semibold text-slate-400">رقم الشرطة (العسكري)</span>
                <span className="text-xs font-mono font-bold text-[#1E3A8A] tracking-wider">
                  {recruit.policeNumber}
                </span>
              </div>

              <div>
                <span className="block text-[11px] font-semibold text-slate-400">رقم الملف الدفتري</span>
                <span className="text-xs font-mono font-semibold text-slate-800">
                  {recruit.fileNumber}
                </span>
              </div>

              <div>
                <span className="block text-[11px] font-semibold text-slate-400">الرقم العسكري الثلاثي</span>
                <span className="text-xs font-mono font-semibold text-slate-700">
                  {recruit.militaryNumber || "—"}
                </span>
              </div>

              <div>
                <span className="block text-[11px] font-semibold text-slate-400">تاريخ الميلاد</span>
                <span className="text-xs font-medium text-slate-700">
                  {formatDateShort(recruit.dateOfBirth)}
                </span>
              </div>

              <div>
                <span className="block text-[11px] font-semibold text-slate-400">المؤهل الدراسي</span>
                <span className="text-xs font-medium text-slate-700 truncate" title={recruit.education || ""}>
                  {recruit.education || "غير مسجل"}
                </span>
              </div>

              <div className="col-span-2">
                <span className="block text-[11px] font-semibold text-slate-400">الوحدة وبيان الخدمة</span>
                <span className="text-xs font-semibold text-[#0F2042] truncate" title={recruit.serviceInformation || ""}>
                  {recruit.serviceInformation || "سرية الحراسات وتأمين المنشآت - معسكر الطور"}
                </span>
              </div>
            </div>

            {/* Footer with Edit Basic Info button */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 pt-2 border-t border-slate-100">
              <span className="text-[11px] text-slate-400">
                آخر تحديث للسجل: {formatDate(recruit.updatedAt)}
              </span>
              <button
                type="button"
                onClick={() => setIsEditBasicInfoOpen(true)}
                className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 text-xs font-semibold rounded-md transition-colors cursor-pointer"
              >
                <Edit className="w-3.5 h-3.5" />
                <span>تعديل البيانات الأساسية</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Main Two-Column Layout (Timeline + Side Panels) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Main Column: Medical and Administrative Timeline (8 cols) */}
        <div className="lg:col-span-8 flex flex-col gap-4">
          {/* Timeline Header & Filters */}
          <div className="bg-white p-3.5 sm:p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <FileCheck2 className="w-5 h-5 text-[#1E3A8A]" />
              <h2 className="text-xs sm:text-sm font-bold text-[#0F2042]">
                السجل الزمني الموحد (الطبي والإداري)
              </h2>
              <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 text-xs font-bold font-mono">
                {allRecords.length} وقائع
              </span>
            </div>

            {/* Quick Filter tabs */}
            <div className="flex items-center gap-1 bg-slate-50 p-1 rounded-lg border border-slate-200 overflow-x-auto scrollbar-none">
              {["الكل", "طبي", "إجازات", "انضباطي"].map((tab) => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setTimelineFilter(tab)}
                  className={cn(
                    "px-2.5 sm:px-3 py-1 text-xs font-bold rounded-md transition-all cursor-pointer shrink-0",
                    timelineFilter === tab
                      ? "bg-[#0F2042] text-white shadow-xs"
                      : "text-slate-600 hover:text-slate-900"
                  )}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          {/* Chronological Timeline Container */}
          <div className="relative pl-2 pr-6 flex flex-col gap-4">
            {/* Vertical timeline spine */}
            <div className="absolute right-2.5 top-3 bottom-3 w-0.5 bg-slate-200"></div>

            {filteredRecords.length === 0 ? (
              <div className="bg-white p-12 rounded-xl border border-dashed border-slate-300 text-center text-slate-500 text-xs">
                لا توجد قيود مسجلة تطابق التصفية الحالية.
              </div>
            ) : (
              filteredRecords.map((rec) => {
                const badge = getRecordTypeBadge(rec.type);
                return (
                  <div
                    key={rec.id}
                    className="relative flex flex-col w-full bg-white rounded-xl border border-slate-200 shadow-xs p-4 hover:border-slate-300 transition-all group"
                  >
                    {/* Timeline bullet node */}
                    <div
                      className="absolute -right-[21px] top-5 w-3 h-3 rounded-full bg-white shadow-xs"
                      style={{
                        boxShadow: `0 0 0 3px ${badge.colorHex}`,
                      }}
                    ></div>

                    {/* Entry Header */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2.5 mb-2.5 border-b border-slate-100">
                      <div className="flex items-center gap-2">
                        <span
                          className={cn(
                            "text-xs px-2.5 py-0.5 rounded font-bold border",
                            badge.badge
                          )}
                        >
                          {rec.type}
                        </span>
                        <span className="text-xs font-mono font-semibold text-slate-500">
                          {formatDateShort(rec.date)}
                        </span>
                      </div>

                      <div className="flex items-center gap-1.5 text-xs text-slate-500">
                        <Building2 className="w-3.5 h-3.5 text-slate-400" />
                        <span>{rec.entity || "معسكر أمن الطور"}</span>
                      </div>
                    </div>

                    {/* Entry Description */}
                    <p className="text-xs text-slate-800 leading-relaxed font-medium mb-3">
                      {rec.description}
                    </p>

                    {/* Entry Details & Additional Metadata */}
                    {rec.details && (
                      <div className="p-2.5 bg-slate-50 rounded-lg text-xs text-slate-600 mb-3 border border-slate-100">
                        <strong className="text-slate-700">التفاصيل والتوصيات: </strong>
                        <span>{rec.details}</span>
                      </div>
                    )}

                    {/* Duration / Dates / Attachments row */}
                    <div className="flex flex-wrap items-center justify-between gap-3 pt-1 text-xs">
                      <div className="flex flex-wrap items-center gap-4 text-slate-500">
                        {rec.duration && (
                          <div className="flex items-center gap-1 font-semibold text-[#0F2042]">
                            <Clock className="w-3.5 h-3.5 text-[#C5A059]" />
                            <span>المدة: {rec.duration}</span>
                          </div>
                        )}

                        {rec.startDate && (
                          <div className="flex items-center gap-1 font-mono">
                            <span>الفترة:</span>
                            <span>{formatDateShort(rec.startDate)}</span>
                            {rec.endDate && (
                              <>
                                <span>-</span>
                                <span>{formatDateShort(rec.endDate)}</span>
                              </>
                            )}
                          </div>
                        )}

                        {rec.attachment && (
                          <a
                            href={rec.attachment}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1 text-[#1E3A8A] hover:underline font-semibold"
                          >
                            <Paperclip className="w-3.5 h-3.5" />
                            <span>مستند مرفق</span>
                          </a>
                        )}
                      </div>

                      {/* Edit entry action */}
                      <button
                        type="button"
                        onClick={() => {
                          setRecordToEdit(rec);
                          setIsRecordModalOpen(true);
                        }}
                        className="inline-flex items-center gap-1 text-[#1E3A8A] hover:text-[#0F2042] font-semibold text-xs transition-colors cursor-pointer"
                      >
                        <Edit className="w-3.5 h-3.5" />
                        <span>تعديل القيد</span>
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Side Column: Paper Record Preview & Historical Audit Log (4 cols) */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          {/* Section D: Paper Record Card */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 flex flex-col gap-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-[#1E3A8A]" />
                <h3 className="text-xs font-bold text-[#0F2042]">
                  السجل الورقي المعتمد للمجند
                </h3>
              </div>
              <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-mono">
                أرشيف دفتري
              </span>
            </div>

            <p className="text-[11px] text-slate-500 leading-4">
              صورة طبق الأصل لدفتر السجل العسكري وبطاقة الكشف الطبي الرسمية الممسوحة ضوئياً.
            </p>

            {/* Document Thumbnail / Viewer Trigger */}
            <div
              onClick={() => setIsPaperRecordOpen(true)}
              className="relative group rounded-lg overflow-hidden border border-slate-200 aspect-[3/4] bg-slate-100 flex items-center justify-center cursor-pointer shadow-xs"
            >
              <img
                src={mainPaperDoc?.filePath || "/paper-records/demo-record.png"}
                alt="السجل الورقي"
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                onError={(e) => {
                  e.currentTarget.src = "https://images.unsplash.com/photo-1568667256549-094345857637?auto=format&fit=crop&q=80&w=800";
                }}
              />
              <div className="absolute inset-0 bg-[#0F2042]/70 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2 p-4 text-white">
                <ZoomIn className="w-8 h-8 text-[#C5A059]" />
                <span className="text-xs font-bold">انقر للمعاينة والطباعة</span>
              </div>
              <div className="absolute bottom-2 right-2 bg-black/60 backdrop-blur text-white text-[10px] px-2 py-0.5 rounded font-mono">
                دقة 300 DPI
              </div>
            </div>

            {/* Action Buttons for Paper Record */}
            <div className="grid grid-cols-2 gap-2 pt-1">
              <button
                type="button"
                onClick={() => setIsPaperRecordOpen(true)}
                className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-[#0F2042] text-xs font-bold rounded-lg transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <ZoomIn className="w-3.5 h-3.5 text-[#1E3A8A]" />
                <span>معاينة مكبرة</span>
              </button>

              <button
                type="button"
                onClick={() => setIsPaperRecordOpen(true)}
                className="px-3 py-2 bg-[#0F2042] hover:bg-[#1E3A8A] text-white text-xs font-bold rounded-lg transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5 text-[#C5A059]" />
                <span>طباعة السجل</span>
              </button>
            </div>
          </div>

          {/* Historical Administrative Status Log */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 flex flex-col gap-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <History className="w-4 h-4 text-[#1E3A8A]" />
                <h3 className="text-xs font-bold text-[#0F2042]">
                  سجل التغييرات الإدارية التاريخي
                </h3>
              </div>
              <span className="text-[10px] text-slate-400">تراكمي</span>
            </div>

            <div className="flex flex-col gap-2.5">
              {(recruit.statusHistory || []).length === 0 ? (
                <div className="p-3 bg-slate-50 rounded-lg text-slate-500 text-xs text-center">
                  الحالة مسجلة عند التجنيد دون تعديلات تاريخية سابقة.
                </div>
              ) : (
                (recruit.statusHistory || []).map((h) => (
                  <div
                    key={h.id}
                    className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg flex flex-col gap-1 text-xs"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-[#0F2042]">
                        {h.previousStatus} ← {h.newStatus}
                      </span>
                      <span className="text-[10px] font-mono text-slate-500">
                        {formatDateShort(h.changeDate)}
                      </span>
                    </div>
                    {h.reason && (
                      <p className="text-[11px] text-slate-600 leading-4">
                        السبب: {h.reason}
                      </p>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      <RecordModal
        isOpen={isRecordModalOpen}
        onClose={() => {
          setIsRecordModalOpen(false);
          setRecordToEdit(null);
        }}
        recruitId={recruit.id}
        recruitName={recruit.fullName}
        policeNumber={recruit.policeNumber}
        recordToEdit={recordToEdit}
        onSuccess={() => {
          fetchRecruit();
        }}
      />

      <StatusModal
        isOpen={isStatusModalOpen}
        onClose={() => setIsStatusModalOpen(false)}
        recruitId={recruit.id}
        recruitName={recruit.fullName}
        currentStatus={recruit.administrativeStatus}
        onSuccess={() => {
          fetchRecruit();
        }}
      />

      <EditBasicInfoModal
        isOpen={isEditBasicInfoOpen}
        onClose={() => setIsEditBasicInfoOpen(false)}
        recruit={recruit}
        onSuccess={() => {
          fetchRecruit();
        }}
      />

      <LeaveReportModal
        isOpen={isLeaveReportOpen}
        onClose={() => setIsLeaveReportOpen(false)}
        recruit={recruit}
      />

      <PaperRecordModal
        isOpen={isPaperRecordOpen}
        onClose={() => setIsPaperRecordOpen(false)}
        documentPath={mainPaperDoc?.filePath}
        recruitName={recruit.fullName}
        policeNumber={recruit.policeNumber}
      />
    </div>
  );
}

export default function RecruitProfilePage({ params }: PageProps) {
  const resolvedParams = use(params);
  return (
    <Suspense
      fallback={
        <div className="py-24 flex flex-col items-center justify-center gap-3">
          <div className="w-9 h-9 border-3 border-[#1E3A8A] border-t-transparent rounded-full animate-spin"></div>
          <span className="text-xs text-slate-500 font-semibold">جارٍ تحميل السجل...</span>
        </div>
      }
    >
      <RecruitProfileContent recruitId={resolvedParams.id} />
    </Suspense>
  );
}

