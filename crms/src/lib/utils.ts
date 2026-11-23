import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: Date | string | null | undefined): string {
  if (!date) return "—";
  const d = typeof date === "string" ? new Date(date) : date;
  if (isNaN(d.getTime())) return "—";
  return d.toLocaleDateString("ar-EG", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function formatDateShort(date: Date | string | null | undefined): string {
  if (!date) return "—";
  const d = typeof date === "string" ? new Date(date) : date;
  if (isNaN(d.getTime())) return "—";
  return d.toLocaleDateString("ar-EG", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
}

export function formatDateIso(date: Date | string | null | undefined): string {
  if (!date) return "";
  const d = typeof date === "string" ? new Date(date) : date;
  if (isNaN(d.getTime())) return "";
  return d.toISOString().split("T")[0];
}

export function calculateDays(start: Date | string | null | undefined, end: Date | string | null | undefined): number {
  if (!start || !end) return 0;
  const s = typeof start === "string" ? new Date(start) : start;
  const e = typeof end === "string" ? new Date(end) : end;
  const diffTime = e.getTime() - s.getTime();
  if (diffTime < 0) return 0;
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
}

export function getStatusBadge(status: string) {
  switch (status) {
    case "على القوة":
      return {
        bg: "bg-emerald-50 text-emerald-800 border-emerald-200",
        dot: "bg-emerald-600",
        label: "على القوة",
      };
    case "مستجد":
      return {
        bg: "bg-blue-50 text-blue-800 border-blue-200",
        dot: "bg-blue-600",
        label: "مستجد (مركز التدريب)",
      };
    case "رديف":
      return {
        bg: "bg-amber-50 text-amber-900 border-amber-300",
        dot: "bg-amber-600",
        label: "رديف (قيد التسريح)",
      };
    case "شطب":
      return {
        bg: "bg-slate-100 text-slate-800 border-slate-300",
        dot: "bg-slate-500",
        label: "شطب للغياب",
      };
    case "رفت":
      return {
        bg: "bg-rose-50 text-rose-800 border-rose-200",
        dot: "bg-rose-600",
        label: "رفت انضباطي / طبي",
      };
    default:
      return {
        bg: "bg-gray-100 text-gray-800 border-gray-200",
        dot: "bg-gray-500",
        label: status,
      };
  }
}

export function getRecordTypeBadge(type: string) {
  switch (type) {
    case "كشف طبي":
      return {
        badge: "bg-sky-50 text-sky-800 border-sky-200",
        iconName: "Stethoscope",
        colorHex: "#0284c7",
      };
    case "أشعة":
      return {
        badge: "bg-purple-50 text-purple-800 border-purple-200",
        iconName: "Activity",
        colorHex: "#9333ea",
      };
    case "تقرير طبي":
      return {
        badge: "bg-indigo-50 text-indigo-800 border-indigo-200",
        iconName: "FileText",
        colorHex: "#4f46e5",
      };
    case "دخول مستشفى":
      return {
        badge: "bg-red-50 text-red-800 border-red-200",
        iconName: "Building2",
        colorHex: "#dc2626",
      };
    case "إجازة مرضية":
      return {
        badge: "bg-amber-50 text-amber-900 border-amber-300",
        iconName: "CalendarClock",
        colorHex: "#d97706",
      };
    case "راحة":
      return {
        badge: "bg-teal-50 text-teal-800 border-teal-200",
        iconName: "HeartPulse",
        colorHex: "#0d9488",
      };
    case "أجهزة طبية":
      return {
        badge: "bg-cyan-50 text-cyan-800 border-cyan-200",
        iconName: "Glasses",
        colorHex: "#0891b2",
      };
    case "إجراءات طبية أخرى":
      return {
        badge: "bg-slate-50 text-slate-800 border-slate-200",
        iconName: "ClipboardCheck",
        colorHex: "#475569",
      };
    case "جزاء / أورنيك":
      return {
        badge: "bg-orange-50 text-orange-900 border-orange-300",
        iconName: "Gavel",
        colorHex: "#ea580c",
      };
    default:
      return {
        badge: "bg-gray-50 text-gray-800 border-gray-200",
        iconName: "File",
        colorHex: "#64748b",
      };
  }
}
