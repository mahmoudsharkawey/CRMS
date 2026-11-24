"use client";

import { X, Printer, ZoomIn, ZoomOut, Download, FileText, Shield } from "lucide-react";
import { useState } from "react";

interface PaperRecordModalProps {
  isOpen: boolean;
  onClose: () => void;
  documentPath?: string | null;
  recruitName: string;
  policeNumber: string;
}

export function PaperRecordModal({
  isOpen,
  onClose,
  documentPath,
  recruitName,
  policeNumber,
}: PaperRecordModalProps) {
  const [zoom, setZoom] = useState(1);

  if (!isOpen) return null;

  const imageSrc = documentPath || "/paper-records/demo-record.png";

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0F2042]/75 backdrop-blur-xs">
      <div className="bg-white w-full max-w-5xl max-h-[94vh] flex flex-col rounded-xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Modal Header */}
        <div className="bg-[#0F2042] px-4 py-3 sm:px-6 sm:py-4 text-white flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 no-print">
          <div className="flex items-center gap-2.5">
            <FileText className="w-5 h-5 text-[#C5A059] shrink-0" />
            <div>
              <h2 className="text-sm sm:text-base font-bold">معاينة السجل الورقي الممسوح ضوئياً</h2>
              <p className="text-[11px] sm:text-xs text-slate-300">
                المجند: <strong className="text-white">{recruitName}</strong> • رقم الشرطة: <span className="font-mono text-[#C5A059]">{policeNumber}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center justify-end gap-2">
            <div className="flex items-center bg-white/10 rounded-lg p-0.5">
              <button
                onClick={() => setZoom((z) => Math.max(0.6, z - 0.2))}
                className="p-1.5 text-slate-300 hover:text-white transition-colors"
                title="تصغير"
              >
                <ZoomOut className="w-4 h-4" />
              </button>
              <span className="text-xs font-mono px-2 text-slate-300">{Math.round(zoom * 100)}%</span>
              <button
                onClick={() => setZoom((z) => Math.min(2, z + 0.2))}
                className="p-1.5 text-slate-300 hover:text-white transition-colors"
                title="تكبير"
              >
                <ZoomIn className="w-4 h-4" />
              </button>
            </div>

            <button
              onClick={handlePrint}
              className="inline-flex items-center justify-center gap-1.5 px-3 sm:px-4 py-1.5 sm:py-2 bg-[#C5A059] hover:bg-[#b08d47] text-[#0F2042] font-bold text-xs rounded-lg shadow-sm transition-all cursor-pointer flex-1 sm:flex-none"
            >
              <Printer className="w-4 h-4" />
              <span>طباعة السجل الورقي</span>
            </button>

            <button
              onClick={onClose}
              className="w-8 h-8 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 flex items-center justify-center transition-colors shrink-0"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body / Viewer */}
        <div className="flex-1 overflow-auto p-6 bg-slate-900/90 flex items-center justify-center print-area">
          <div
            className="transition-transform duration-200 origin-center bg-white shadow-2xl p-4 rounded-sm border border-slate-300 max-w-3xl"
            style={{ transform: `scale(${zoom})` }}
          >
            {/* Scanned document simulation or actual image */}
            <img
              src={imageSrc}
              alt="السجل الورقي للمجند"
              className="w-full h-auto object-contain block"
              onError={(e) => {
                // Fallback to stylized SVG placeholder if demo image doesn't load
                e.currentTarget.style.display = "none";
                const fallback = document.getElementById("document-svg-fallback");
                if (fallback) fallback.style.display = "block";
              }}
            />

            <div id="document-svg-fallback" style={{ display: "none" }} className="w-full p-8 border-2 border-slate-800 bg-[#fdfbf7] text-slate-900 font-serif min-h-[700px] flex flex-col justify-between">
              <div className="border-b-2 border-slate-800 pb-4 text-center">
                <span className="block text-sm font-bold">جمهورية مصر العربية - وزارة الداخلية</span>
                <span className="block text-xs font-bold text-slate-700">مديرية أمن جنوب سيناء - إدارة قوات الأمن</span>
                <h3 className="text-lg font-bold mt-3 underline underline-offset-4">بطاقة الخدمة والسجل العسكري للمجند</h3>
              </div>

              <div className="my-6 space-y-4 text-xs leading-relaxed">
                <div className="grid grid-cols-2 gap-4 border border-slate-400 p-3 bg-white/60">
                  <div><strong>اسم المجند:</strong> {recruitName}</div>
                  <div><strong>رقم الشرطة:</strong> {policeNumber}</div>
                  <div><strong>الجهة:</strong> معسكر أمن الطور</div>
                  <div><strong>السلاح:</strong> حراسات ومنشآت حيوية</div>
                </div>

                <div className="border border-slate-400 p-3 bg-white/60">
                  <h4 className="font-bold border-b border-slate-300 pb-1 mb-2">بيان اللياقة الطبية والفحوصات الأولية</h4>
                  <p>تم توقيع الكشف الطبي الشامل بمعرفة اللجنة العسكرية المختصة بتاريخ الالتحاق، وثبت لائق للخدمة العسكرية بالمواقع الميدانية بمستوى طبي (أ).</p>
                </div>

                <div className="border border-slate-400 p-3 bg-white/60">
                  <h4 className="font-bold border-b border-slate-300 pb-1 mb-2">التأشيرات والقرارات الإدارية</h4>
                  <p>مقيد بسجلات السلاح، وتخضع كافة الوقائع الطبية والراحات للتأشير الفوري بدفتر السجلات المعتمد بمديرية أمن جنوب سيناء.</p>
                </div>
              </div>

              <div className="pt-6 border-t border-slate-400 flex justify-between text-xs">
                <div>توقيع كاتب السجل: ....................</div>
                <div>اعتماد ضابط السجلات: ....................</div>
                <div>بصمة المجند: [معتمد]</div>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3 bg-white border-t border-slate-200 flex items-center justify-between no-print">
          <span className="text-xs text-slate-500">
            نسخة مؤرشفة ممسوحة ضوئياً بدقة 300 DPI مطابقة للأصل الورقي المحفوظ بقلم السجلات
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg transition-colors cursor-pointer"
          >
            إغلاق
          </button>
        </div>
      </div>
    </div>
  );
}
