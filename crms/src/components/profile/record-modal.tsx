"use client";

import { useState, useEffect } from "react";
import {
  X,
  PlusCircle,
  FileCheck,
  Calendar,
  Building2,
  FileText,
  Clock,
  Paperclip,
  AlertCircle,
  UploadCloud,
  CheckCircle2,
  Trash2,
} from "lucide-react";
import { recordTypes, type RecruitRecordInput } from "@/lib/validations";
import { formatDateIso } from "@/lib/utils";
import type { RecruitRecord } from "@/types";

interface RecordModalProps {
  isOpen: boolean;
  onClose: () => void;
  recruitId: string;
  recruitName: string;
  policeNumber: string;
  recordToEdit?: RecruitRecord | null;
  onSuccess: (savedRecord: RecruitRecord) => void;
}

export function RecordModal({
  isOpen,
  onClose,
  recruitId,
  recruitName,
  policeNumber,
  recordToEdit,
  onSuccess,
}: RecordModalProps) {
  const isEditing = Boolean(recordToEdit);

  const [type, setType] = useState<string>("كشف طبي");
  const [date, setDate] = useState<string>(formatDateIso(new Date()));
  const [entity, setEntity] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [details, setDetails] = useState<string>("");
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [duration, setDuration] = useState<string>("");
  const [attachment, setAttachment] = useState<string>("");
  const [uploading, setUploading] = useState<boolean>(false);

  const [error, setError] = useState<string>("");
  const [submitting, setSubmitting] = useState<boolean>(false);

  // Auto-fill when editing
  useEffect(() => {
    if (recordToEdit) {
      setType(recordToEdit.type);
      setDate(formatDateIso(recordToEdit.date));
      setEntity(recordToEdit.entity || "");
      setDescription(recordToEdit.description || "");
      setDetails(recordToEdit.details || "");
      setStartDate(formatDateIso(recordToEdit.startDate));
      setEndDate(formatDateIso(recordToEdit.endDate));
      setDuration(recordToEdit.duration || "");
      setAttachment(recordToEdit.attachment || "");
    } else {
      // Reset
      setType("كشف طبي");
      setDate(formatDateIso(new Date()));
      setEntity("");
      setDescription("");
      setDetails("");
      setStartDate("");
      setEndDate("");
      setDuration("");
      setAttachment("");
    }
    setError("");
  }, [recordToEdit, isOpen]);

  // Compute duration automatically for leaves if start & end dates are given
  useEffect(() => {
    if ((type === "إجازة مرضية" || type === "راحة") && startDate && endDate) {
      const s = new Date(startDate);
      const e = new Date(endDate);
      const diff = Math.ceil((e.getTime() - s.getTime()) / (1000 * 60 * 60 * 24)) + 1;
      if (diff > 0) {
        setDuration(`${diff} يوم`);
      }
    }
  }, [startDate, endDate, type]);

  if (!isOpen) return null;

  // Determine which fields apply based on record type
  const isLeaveOrRest = type === "إجازة مرضية" || type === "راحة";
  const isPenalty = type === "جزاء / أورنيك";
  const isHospital = type === "دخول مستشفى";

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        throw new Error("فشل رفع الملف");
      }

      const data = await res.json();
      setAttachment(data.url);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "خطأ أثناء رفع المرفق";
      setError(msg);
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      if (!description.trim()) {
        throw new Error("يرجى كتابة وصف أو بيان الإجراء / الواقعة");
      }

      const payload: RecruitRecordInput = {
        recruitId,
        type: type as any,
        date,
        entity: entity.trim() || undefined,
        description: description.trim(),
        details: details.trim() || undefined,
        startDate: (isLeaveOrRest || isHospital) && startDate ? startDate : undefined,
        endDate: (isLeaveOrRest || isHospital) && endDate ? endDate : undefined,
        duration: duration.trim() || undefined,
        attachment: attachment || undefined,
      };

      const url = isEditing ? `/api/records/${recordToEdit!.id}` : "/api/records";
      const method = isEditing ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "فشل حفظ السجل");
      }

      const saved = await res.json();
      onSuccess(saved);
      onClose();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "حدث خطأ غير متوقع";
      setError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0F2042]/60 backdrop-blur-xs">
      <div className="bg-white w-full max-w-2xl max-h-[90vh] flex flex-col rounded-xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Modal Header */}
        <div className="bg-[#0F2042] px-4 py-3 sm:px-6 sm:py-4 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5 sm:gap-3">
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-white/10 flex items-center justify-center text-[#C5A059] shrink-0">
              <FileCheck className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-bold">
                {isEditing ? "تعديل قيد بالسجل الطبي أو الإداري" : "إضافة قيد جديد بالسجل الطبي أو الإداري"}
              </h2>
              <p className="text-[11px] sm:text-xs text-slate-300">
                المجند: <strong className="text-white">{recruitName}</strong> • رقم الشرطة: <span className="font-mono text-[#C5A059]">{policeNumber}</span>
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 flex items-center justify-center transition-colors shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-700 text-xs font-semibold">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Grid: Type & Date */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                نوع القيد / البيان <span className="text-red-500">*</span>
              </label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="w-full h-10 px-3 bg-slate-50 border border-slate-300 rounded-lg text-xs font-semibold text-[#0F2042] focus:outline-none focus:ring-2 focus:ring-[#1E3A8A] focus:bg-white transition-all cursor-pointer"
              >
                {recordTypes.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                تاريخ الإجراء / الواقعة <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full h-10 px-3 bg-slate-50 border border-slate-300 rounded-lg text-xs font-medium text-[#0F2042] focus:outline-none focus:ring-2 focus:ring-[#1E3A8A] focus:bg-white transition-all"
              />
            </div>
          </div>

          {/* Issuing Entity / Hospital */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              {isPenalty ? "الجهة المصدرة للجزاء / الوحدة" : "المستشفى أو العيادة أو الجهة المعنية"}
            </label>
            <div className="relative">
              <input
                type="text"
                value={entity}
                onChange={(e) => setEntity(e.target.value)}
                placeholder={
                  isPenalty
                    ? "مثال: قيادة معسكر أمن الطور - كتيبة التأمين"
                    : "مثال: مستشفى الطور العام / مستشفى هيئة الشرطة بالعجوزة"
                }
                className="w-full h-10 pl-3 pr-9 bg-slate-50 border border-slate-300 rounded-lg text-xs font-medium text-[#0F2042] placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#1E3A8A] focus:bg-white transition-all"
              />
              <Building2 className="w-4 h-4 text-slate-400 absolute right-3 top-3 pointer-events-none" />
            </div>
          </div>

          {/* Conditional Dates & Duration for Leaves, Rest, Hospitalization */}
          {(isLeaveOrRest || isHospital) && (
            <div className="p-3.5 bg-amber-50/60 border border-amber-200/80 rounded-lg space-y-3">
              <div className="flex items-center gap-1.5 text-xs font-bold text-amber-900">
                <Clock className="w-4 h-4 text-[#C5A059]" />
                <span>فترة وسريان {isLeaveOrRest ? "الإجازة أو الراحة" : "الحجز بالمستشفى"}</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                    تاريخ البدء
                  </label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full h-9 px-2.5 bg-white border border-slate-300 rounded-md text-xs text-[#0F2042] focus:ring-1 focus:ring-[#1E3A8A]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                    تاريخ الانتهاء
                  </label>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full h-9 px-2.5 bg-white border border-slate-300 rounded-md text-xs text-[#0F2042] focus:ring-1 focus:ring-[#1E3A8A]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                    المدة المحسوبة
                  </label>
                  <input
                    type="text"
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    placeholder="مثال: 3 أيام"
                    className="w-full h-9 px-2.5 bg-white border border-slate-300 rounded-md text-xs text-[#0F2042] font-semibold focus:ring-1 focus:ring-[#1E3A8A]"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Conditional Duration for Penalties (Ornik) */}
          {isPenalty && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  مدة الجزاء / الحبس (إن وجدت)
                </label>
                <input
                  type="text"
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  placeholder="مثال: يومان حجز بالمعسكر / 24 ساعة"
                  className="w-full h-10 px-3 bg-slate-50 border border-slate-300 rounded-lg text-xs font-medium text-[#0F2042] focus:ring-2 focus:ring-[#1E3A8A]"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  رقم الأورنيك / القرار الانضباطي
                </label>
                <input
                  type="text"
                  value={details}
                  onChange={(e) => setDetails(e.target.value)}
                  placeholder="مثال: أورنيك رقم (412/ج) لسنة 2024"
                  className="w-full h-10 px-3 bg-slate-50 border border-slate-300 rounded-lg text-xs font-medium text-[#0F2042] focus:ring-2 focus:ring-[#1E3A8A]"
                />
              </div>
            </div>
          )}

          {/* Main Description */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              {isPenalty ? "وصف المخالفة وموجبات الجزاء" : "التشخيص / الوصف الرئيسي للإجراء"} <span className="text-red-500">*</span>
            </label>
            <textarea
              required
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="اكتب التوصيف الرسمي الدقيق أو التشخيص الطبي..."
              className="w-full p-3 bg-slate-50 border border-slate-300 rounded-lg text-xs font-medium text-[#0F2042] placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#1E3A8A] focus:bg-white transition-all leading-relaxed"
            />
          </div>

          {/* Secondary Details (if not penalty where details is used for ornik number) */}
          {!isPenalty && (
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                تفاصيل إضافية / توصيات العلاج أو رقم التقرير
              </label>
              <textarea
                rows={2}
                value={details}
                onChange={(e) => setDetails(e.target.value)}
                placeholder="مثال: صرف علاج ومضادات حيوية مع إعفاء من التدريب البدني الشاق..."
                className="w-full p-3 bg-slate-50 border border-slate-300 rounded-lg text-xs font-medium text-[#0F2042] placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#1E3A8A] focus:bg-white transition-all"
              />
            </div>
          )}

          {/* Attachment Upload */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              إرفاق مستند أو صورة (تقرير، أشعة، أورنيك، تذكرة طبية)
            </label>

            {attachment ? (
              <div className="flex items-center justify-between p-3 bg-slate-50 border border-slate-200 rounded-lg">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span className="text-xs font-medium text-slate-700 truncate max-w-xs" dir="ltr">
                    {attachment}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setAttachment("")}
                  className="text-xs text-red-600 hover:text-red-800 flex items-center gap-1"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>إزالة</span>
                </button>
              </div>
            ) : (
              <div className="relative border-2 border-dashed border-slate-300 hover:border-[#1E3A8A] rounded-lg p-4 text-center cursor-pointer transition-colors bg-slate-50/50">
                <input
                  type="file"
                  accept="image/*,.pdf"
                  onChange={handleFileUpload}
                  className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                />
                <div className="flex flex-col items-center gap-1 text-slate-500">
                  <UploadCloud className="w-6 h-6 text-[#1E3A8A]" />
                  <span className="text-xs font-semibold text-[#0F2042]">
                    {uploading ? "جارٍ رفع المستند..." : "انقر لتصفح الملفات أو اسحب الملف هنا"}
                  </span>
                  <span className="text-[11px] text-slate-400">PDF أو JPG أو PNG</span>
                </div>
              </div>
            )}
          </div>
        </form>

        {/* Modal Footer */}
        <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-white border border-slate-300 hover:bg-slate-100 text-slate-700 text-xs font-semibold rounded-lg transition-colors cursor-pointer"
          >
            إلغاء التراجع
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={submitting}
            className="px-6 py-2 bg-[#0F2042] hover:bg-[#1E3A8A] text-white text-xs font-bold rounded-lg shadow-sm transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {submitting ? (
              <>
                <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>جارٍ الحفظ...</span>
              </>
            ) : (
              <>
                <FileCheck className="w-4 h-4 text-[#C5A059]" />
                <span>{isEditing ? "تحديث القيد بالسجل" : "حفظ القيد بالسجل"}</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
