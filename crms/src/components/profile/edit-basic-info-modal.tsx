"use client";

import { useState } from "react";
import { X, UserCheck, AlertCircle } from "lucide-react";
import { formatDateIso } from "@/lib/utils";
import type { Recruit } from "@/types";

interface EditBasicInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
  recruit: Recruit;
  onSuccess: (updatedRecruit: Recruit) => void;
}

export function EditBasicInfoModal({
  isOpen,
  onClose,
  recruit,
  onSuccess,
}: EditBasicInfoModalProps) {
  const [fullName, setFullName] = useState(recruit.fullName);
  const [nationalId, setNationalId] = useState(recruit.nationalId);
  const [policeNumber, setPoliceNumber] = useState(recruit.policeNumber);
  const [fileNumber, setFileNumber] = useState(recruit.fileNumber);
  const [militaryNumber, setMilitaryNumber] = useState(recruit.militaryNumber || "");
  const [dateOfBirth, setDateOfBirth] = useState(formatDateIso(recruit.dateOfBirth));
  const [education, setEducation] = useState(recruit.education || "");
  const [serviceInformation, setServiceInformation] = useState(recruit.serviceInformation || "");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch(`/api/recruits/${recruit.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: fullName.trim(),
          nationalId: nationalId.trim(),
          policeNumber: policeNumber.trim(),
          fileNumber: fileNumber.trim(),
          militaryNumber: militaryNumber.trim() || undefined,
          dateOfBirth: dateOfBirth || undefined,
          education: education.trim() || undefined,
          serviceInformation: serviceInformation.trim() || undefined,
          administrativeStatus: recruit.administrativeStatus,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "فشل تحديث البيانات الأساسية");
      }

      const updated = await res.json();
      onSuccess(updated);
      onClose();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "خطأ أثناء تحديث البيانات";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0F2042]/60 backdrop-blur-xs">
      <div className="bg-white w-full max-w-xl max-h-[90vh] flex flex-col rounded-xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="bg-[#0F2042] px-4 py-3 sm:px-6 sm:py-4 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <UserCheck className="w-5 h-5 text-[#C5A059] shrink-0" />
            <h2 className="text-sm font-bold">تعديل البيانات الأساسية للمجند</h2>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded text-slate-300 hover:text-white hover:bg-white/10 flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-xs font-semibold text-red-700 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-700 mb-1">
                الاسم الرباعي الكامل <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full h-10 px-3 bg-slate-50 border border-slate-300 rounded-lg text-xs font-semibold text-[#0F2042] focus:ring-2 focus:ring-[#1E3A8A] focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                الرقم القومي (14 رقم) <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                maxLength={14}
                value={nationalId}
                onChange={(e) => setNationalId(e.target.value)}
                className="w-full h-10 px-3 bg-slate-50 border border-slate-300 rounded-lg text-xs font-mono font-bold text-[#0F2042] focus:ring-2 focus:ring-[#1E3A8A] focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                رقم الشرطة (العسكري) <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={policeNumber}
                onChange={(e) => setPoliceNumber(e.target.value)}
                className="w-full h-10 px-3 bg-slate-50 border border-slate-300 rounded-lg text-xs font-mono font-bold text-[#0F2042] focus:ring-2 focus:ring-[#1E3A8A] focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                رقم الملف الدفتري <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={fileNumber}
                onChange={(e) => setFileNumber(e.target.value)}
                className="w-full h-10 px-3 bg-slate-50 border border-slate-300 rounded-lg text-xs font-mono font-bold text-[#0F2042] focus:ring-2 focus:ring-[#1E3A8A] focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                الرقم العسكري الثلاثي
              </label>
              <input
                type="text"
                value={militaryNumber}
                onChange={(e) => setMilitaryNumber(e.target.value)}
                placeholder="مثال: 2023/18420"
                className="w-full h-10 px-3 bg-slate-50 border border-slate-300 rounded-lg text-xs font-mono font-semibold text-[#0F2042] focus:ring-2 focus:ring-[#1E3A8A] focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                تاريخ الميلاد
              </label>
              <input
                type="date"
                value={dateOfBirth}
                onChange={(e) => setDateOfBirth(e.target.value)}
                className="w-full h-10 px-3 bg-slate-50 border border-slate-300 rounded-lg text-xs font-medium text-[#0F2042] focus:ring-2 focus:ring-[#1E3A8A] focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                المؤهل الدراسي
              </label>
              <input
                type="text"
                value={education}
                onChange={(e) => setEducation(e.target.value)}
                placeholder="مثال: مؤهل متوسط - دبلوم فني صناعي"
                className="w-full h-10 px-3 bg-slate-50 border border-slate-300 rounded-lg text-xs font-medium text-[#0F2042] focus:ring-2 focus:ring-[#1E3A8A] focus:bg-white"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-700 mb-1">
                بيان الخدمة والتوزيع الميداني
              </label>
              <input
                type="text"
                value={serviceInformation}
                onChange={(e) => setServiceInformation(e.target.value)}
                placeholder="مثال: سرية تأمين كمين عيون موسى - قطاع شمال الطور"
                className="w-full h-10 px-3 bg-slate-50 border border-slate-300 rounded-lg text-xs font-medium text-[#0F2042] focus:ring-2 focus:ring-[#1E3A8A] focus:bg-white"
              />
            </div>
          </div>
        </form>

        {/* Footer */}
        <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-lg cursor-pointer"
          >
            إلغاء
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={loading}
            className="px-5 py-2 bg-[#0F2042] hover:bg-[#1E3A8A] text-white text-xs font-bold rounded-lg shadow-xs transition-all disabled:opacity-50 cursor-pointer"
          >
            {loading ? "جارٍ الحفظ..." : "حفظ التعديلات"}
          </button>
        </div>
      </div>
    </div>
  );
}
