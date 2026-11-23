import { z } from "zod";

export const recordTypes = [
  "كشف طبي",
  "أشعة",
  "تقرير طبي",
  "دخول مستشفى",
  "إجازة مرضية",
  "راحة",
  "أجهزة طبية",
  "إجراءات طبية أخرى",
  "جزاء / أورنيك",
] as const;

export const administrativeStatuses = [
  "على القوة",
  "مستجد",
  "رديف",
  "شطب",
  "رفت",
] as const;

export const recruitSchema = z.object({
  fullName: z.string().min(3, "الاسم الرباعي مطلوب"),
  nationalId: z.string().min(14, "الرقم القومي يجب أن يتكون من 14 رقم").max(14),
  policeNumber: z.string().min(2, "رقم الشرطة مطلوب"),
  fileNumber: z.string().min(2, "رقم الملف مطلوب"),
  militaryNumber: z.string().optional().nullable(),
  photo: z.string().optional().nullable(),
  dateOfBirth: z.string().optional().nullable(),
  education: z.string().optional().nullable(),
  serviceInformation: z.string().optional().nullable(),
  administrativeStatus: z.enum(administrativeStatuses).default("على القوة"),
});

export const recruitRecordSchema = z.object({
  recruitId: z.string().min(1, "معرف المجند مطلوب"),
  type: z.enum(recordTypes),
  date: z.string().min(1, "التاريخ مطلوب"),
  entity: z.string().optional().nullable(),
  description: z.string().optional().nullable(),
  details: z.string().optional().nullable(),
  startDate: z.string().optional().nullable(),
  endDate: z.string().optional().nullable(),
  duration: z.string().optional().nullable(),
  attachment: z.string().optional().nullable(),
});

export const statusChangeSchema = z.object({
  recruitId: z.string().min(1, "معرف المجند مطلوب"),
  newStatus: z.enum(administrativeStatuses),
  reason: z.string().optional().nullable(),
});

export type RecruitInput = z.infer<typeof recruitSchema>;
export type RecruitRecordInput = z.infer<typeof recruitRecordSchema>;
export type StatusChangeInput = z.infer<typeof statusChangeSchema>;
