"use client";

import { X, Printer, CalendarClock, Shield, Award } from "lucide-react";
import { formatDateShort, calculateDays } from "@/lib/utils";
import type { Recruit, RecruitRecord } from "@/types";

interface LeaveReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  recruit: Recruit;
}

export function LeaveReportModal({
  isOpen,
  onClose,
  recruit,
}: LeaveReportModalProps) {
  if (!isOpen) return null;

  // Filter only leave and rest records (Do not include medical examinations or penalties)
  const leaveRecords = (recruit.records || []).filter(
    (r) => r.type === "إجازة مرضية" || r.type === "راحة"
  );

  // Calculate days for each leave and total days
  const recordsWithDays = leaveRecords.map((rec) => {
    let days = 0;
    if (rec.startDate && rec.endDate) {
      days = calculateDays(rec.startDate, rec.endDate);
    } else if (rec.duration) {
      const match = rec.duration.match(/\d+/);
      days = match ? parseInt(match[0], 10) : 1;
    } else {
      days = 1;
    }
    return { ...rec, calculatedDays: days };
  });

  const totalLeaveDays = recordsWithDays.reduce(
    (acc, cur) => acc + cur.calculatedDays,
    0
  );

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0F2042]/70 backdrop-blur-xs">
      <div className="bg-white w-full max-w-4xl max-h-[92vh] flex flex-col rounded-xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Modal Controls (Not printed) */}
        <div className="bg-[#0F2042] px-4 py-3 sm:px-6 sm:py-4 text-white flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 no-print">
          <div className="flex items-center gap-2.5">
            <CalendarClock className="w-5 h-5 text-[#C5A059] shrink-0" />
            <div>
              <h2 className="text-sm sm:text-base font-bold">بيان الإجازات والراحات المرضية المعتمدة</h2>
              <p className="text-[11px] sm:text-xs text-slate-300">
                مستخرج رسمي مستخرج آلياً من قاعدة بيانات شؤون المجندين
              </p>
            </div>
          </div>
          <div className="flex items-center justify-end gap-2">
            <button
              onClick={handlePrint}
              className="inline-flex items-center justify-center gap-1.5 px-3 sm:px-4 py-1.5 sm:py-2 bg-[#C5A059] hover:bg-[#b08d47] text-[#0F2042] font-bold text-xs rounded-lg shadow-sm transition-all cursor-pointer flex-1 sm:flex-none"
            >
              <Printer className="w-4 h-4" />
              <span>طباعة البيان الرسمي</span>
            </button>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 flex items-center justify-center transition-colors shrink-0"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Official Document Container */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-8 bg-white print-area" id="leave-statement-print">
          {/* Official Document Header */}
          <div className="border-b-2 border-slate-800 pb-5 mb-6">
            <div className="flex items-start justify-between">
              <div className="text-right">
                <span className="block text-sm font-bold text-slate-900">وزارة الداخلية</span>
                <span className="block text-xs font-semibold text-slate-700">قطاع قوات الأمن</span>
                <span className="block text-xs font-semibold text-slate-700">مديرية أمن جنوب سيناء</span>
                <span className="block text-xs text-slate-600">إدارة شؤون المجندين</span>
              </div>
              <div className="text-center flex flex-col items-center">
                <div className="w-12 h-12 rounded-full border-2 border-slate-800 flex items-center justify-center mb-1">
                  <Shield className="w-6 h-6 text-slate-800" />
                </div>
                <span className="text-xs font-mono font-bold text-slate-800">سجل رسمي</span>
              </div>
              <div className="text-left text-xs font-mono text-slate-700">
                <div>التاريخ: {new Date().toLocaleDateString("ar-EG")}</div>
                <div>كود البيان: LEV-{recruit.policeNumber.replace("/", "-")}</div>
                <div>الحالة: معتمد رسمياً</div>
              </div>
            </div>

            <div className="mt-4 text-center">
              <h1 className="text-xl font-bold text-slate-900 tracking-tight">
                بيان رسمي بالإجازات والراحات المرضية المعتمدة
              </h1>
              <p className="text-xs text-slate-600 mt-0.5">
                طبقاً للقيودات الثابتة بدفاتر وسجلات قطاع أمن جنوب سيناء
              </p>
            </div>
          </div>

          {/* Conscript Identity Box */}
          <div className="bg-slate-50 border border-slate-300 rounded-lg p-4 mb-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
              <div>
                <span className="block text-slate-500 font-semibold mb-0.5">اسم المجند:</span>
                <span className="font-bold text-slate-900 text-sm">{recruit.fullName}</span>
              </div>
              <div>
                <span className="block text-slate-500 font-semibold mb-0.5">رقم الشرطة:</span>
                <span className="font-bold text-slate-900 font-mono text-sm">{recruit.policeNumber}</span>
              </div>
              <div>
                <span className="block text-slate-500 font-semibold mb-0.5">رقم الملف الدفتري:</span>
                <span className="font-bold text-slate-900 font-mono text-sm">{recruit.fileNumber}</span>
              </div>
              <div>
                <span className="block text-slate-500 font-semibold mb-0.5">الحالة الإدارية الحالية:</span>
                <span className="font-bold text-slate-900">{recruit.administrativeStatus}</span>
              </div>
            </div>
          </div>

          {/* Leaves Table */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                تفاصيل الإجازات والراحات المرضية المسجلة
              </h3>
              <span className="text-xs font-bold text-slate-600">
                عدد القيود: {recordsWithDays.length}
              </span>
            </div>

            {recordsWithDays.length === 0 ? (
              <div className="p-8 border border-dashed border-slate-300 rounded-lg text-center text-slate-500 text-xs">
                لا توجد إجازات أو راحات مرضية مسجلة لهذا المجند حتى تاريخه.
              </div>
            ) : (
              <table className="w-full text-right border-collapse border border-slate-300 text-xs">
                <thead>
                  <tr className="bg-slate-100 text-slate-800 font-bold border-b border-slate-300">
                    <th className="py-2.5 px-3 border-l border-slate-300 w-12 text-center">م</th>
                    <th className="py-2.5 px-3 border-l border-slate-300">نوع الإجازة / الراحة</th>
                    <th className="py-2.5 px-3 border-l border-slate-300">الجهة المانحة / المستشفى</th>
                    <th className="py-2.5 px-3 border-l border-slate-300">تاريخ البدء</th>
                    <th className="py-2.5 px-3 border-l border-slate-300">تاريخ الانتهاء</th>
                    <th className="py-2.5 px-3 border-l border-slate-300 text-center">عدد الأيام</th>
                    <th className="py-2.5 px-3">التوصيف الطبي والسند</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {recordsWithDays.map((rec, idx) => (
                    <tr key={rec.id} className="hover:bg-slate-50/50">
                      <td className="py-2.5 px-3 border-l border-slate-300 text-center font-mono font-bold">
                        {idx + 1}
                      </td>
                      <td className="py-2.5 px-3 border-l border-slate-300 font-bold text-slate-900">
                        {rec.type}
                      </td>
                      <td className="py-2.5 px-3 border-l border-slate-300 text-slate-700">
                        {rec.entity || "عيادة معسكر أمن الطور"}
                      </td>
                      <td className="py-2.5 px-3 border-l border-slate-300 font-mono text-slate-700">
                        {formatDateShort(rec.startDate || rec.date)}
                      </td>
                      <td className="py-2.5 px-3 border-l border-slate-300 font-mono text-slate-700">
                        {rec.endDate ? formatDateShort(rec.endDate) : "—"}
                      </td>
                      <td className="py-2.5 px-3 border-l border-slate-300 text-center font-mono font-bold text-slate-900">
                        {rec.calculatedDays} يوم
                      </td>
                      <td className="py-2.5 px-3 text-slate-600">
                        {rec.description}
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="bg-slate-100 font-bold text-slate-900 border-t-2 border-slate-400">
                    <td colSpan={5} className="py-2.5 px-3 text-left border-l border-slate-300">
                      إجمالي أيام الإجازات والراحات المسجلة للمجند:
                    </td>
                    <td className="py-2.5 px-3 text-center border-l border-slate-300 font-mono text-sm text-[#0F2042] bg-[#FEF3C7]">
                      {totalLeaveDays} يوم
                    </td>
                    <td className="py-2.5 px-3 text-xs text-slate-500 font-normal">
                      معتمدة بالدفتر الطبي للكتيبة
                    </td>
                  </tr>
                </tfoot>
              </table>
            )}
          </div>

          {/* Official Signatures Section */}
          <div className="pt-8 mt-8 border-t border-slate-300 grid grid-cols-3 gap-6 text-center text-xs">
            <div className="space-y-8">
              <span className="font-bold text-slate-800">مسؤول السجلات الطبية</span>
              <div className="text-slate-400">..............................</div>
            </div>
            <div className="space-y-8">
              <span className="font-bold text-slate-800">ضابط شؤون المجندين</span>
              <div className="text-slate-400">..............................</div>
            </div>
            <div className="space-y-8">
              <span className="font-bold text-slate-800">قائد قوات أمن جنوب سيناء</span>
              <div className="text-slate-400">خاتم شعار الإدارة</div>
            </div>
          </div>
        </div>

        {/* Modal Footer Controls (Not printed) */}
        <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-200 flex items-center justify-between no-print">
          <span className="text-xs text-slate-500">
            * هذا التقرير يقتصر حصراً على الإجازات والراحات ولا يشتمل على الكشوفات أو الجزاءات الانضباطية.
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-semibold rounded-lg transition-colors cursor-pointer"
          >
            إغلاق
          </button>
        </div>
      </div>
    </div>
  );
}
