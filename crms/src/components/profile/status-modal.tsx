"use client";

import { useState } from "react";
import { X, ShieldAlert, CheckCircle2, History } from "lucide-react";
import { administrativeStatuses } from "@/lib/validations";
import { getStatusBadge } from "@/lib/utils";

interface StatusModalProps {
  isOpen: boolean;
  onClose: () => void;
  recruitId: string;
  recruitName: string;
  currentStatus: string;
  onSuccess: (newStatus: string) => void;
}

export function StatusModal({
  isOpen,
  onClose,
  recruitId,
  recruitName,
  currentStatus,
  onSuccess,
}: StatusModalProps) {
  const [newStatus, setNewStatus] = useState<string>(currentStatus);
  const [reason, setReason] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newStatus === currentStatus) {
      setError("يرجى اختيار حالة إدارية مختلفة عن الحالة الحالية");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await fetch(`/api/recruits/${recruitId}/status`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          newStatus,
          reason: reason.trim() || undefined,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "فشل تغيير الحالة الإدارية");
      }

      onSuccess(newStatus);
      onClose();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "خطأ أثناء تحديث الحالة";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const currentBadge = getStatusBadge(currentStatus);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0F2042]/60 backdrop-blur-xs">
      <div className="bg-white w-full max-w-md rounded-xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="bg-[#0F2042] px-5 py-4 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <ShieldAlert className="w-5 h-5 text-[#C5A059]" />
            <div>
              <h2 className="text-sm font-bold">تعديل الحالة الإدارية للمجند</h2>
              <p className="text-[11px] text-slate-300 truncate max-w-xs">
                المجند: {recruitName}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded text-slate-300 hover:text-white hover:bg-white/10 flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          {error && (
            <div className="p-2.5 bg-red-50 border border-red-200 rounded-lg text-xs font-semibold text-red-700">
              {error}
            </div>
          )}

          {/* Current status display */}
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg flex items-center justify-between">
            <span className="text-xs font-medium text-slate-600">الحالة الإدارية الحالية:</span>
            <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded text-xs font-bold border ${currentBadge.bg}`}>
              <span className={`w-2 h-2 rounded-full ${currentBadge.dot}`}></span>
              <span>{currentStatus}</span>
            </span>
          </div>

          {/* New status selection */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              الحالة الإدارية الجديدة <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-2 gap-2">
              {administrativeStatuses.map((st) => {
                const isSelected = newStatus === st;
                return (
                  <button
                    key={st}
                    type="button"
                    onClick={() => setNewStatus(st)}
                    className={`py-2 px-3 rounded-lg border text-xs font-bold text-right transition-all flex items-center justify-between ${
                      isSelected
                        ? "bg-[#0F2042] text-white border-[#0F2042] shadow-xs"
                        : "bg-white text-slate-700 border-slate-300 hover:bg-slate-50"
                    }`}
                  >
                    <span>{st}</span>
                    {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-[#C5A059]" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Reason */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              سند وموجب تغيير الحالة (يُسجل بسجل الأرشيف التاريخي)
            </label>
            <textarea
              rows={2}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="مثال: صدور قرار تسريح بالدفعة / انتهاء مدة الخدمة العسكرية / أمر نقل..."
              className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg text-xs font-medium text-[#0F2042] focus:ring-2 focus:ring-[#1E3A8A] focus:bg-white"
            />
          </div>

          <div className="flex items-center gap-2 p-2.5 bg-blue-50/70 border border-blue-200/80 rounded-lg text-blue-900 text-[11px] leading-4">
            <History className="w-4 h-4 text-blue-600 shrink-0" />
            <span>
              لن يتم حذف أو استبدال السجل السابق؛ سيتم حفظ التغيير مع تاريخه وسنده الإداري في السجل التاريخي التراكمي.
            </span>
          </div>

          {/* Buttons */}
          <div className="pt-2 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-lg cursor-pointer"
            >
              إلغاء
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2 bg-[#0F2042] hover:bg-[#1E3A8A] text-white text-xs font-bold rounded-lg shadow-xs transition-all disabled:opacity-50 cursor-pointer"
            >
              {loading ? "جارٍ التحديث..." : "اعتماد وتحديث الحالة"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
