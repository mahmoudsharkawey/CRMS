export interface Recruit {
  id: string;
  fullName: string;
  nationalId: string;
  policeNumber: string;
  fileNumber: string;
  militaryNumber?: string | null;
  photo?: string | null;
  dateOfBirth?: string | Date | null;
  education?: string | null;
  serviceInformation?: string | null;
  administrativeStatus: string;
  createdAt: string | Date;
  updatedAt: string | Date;
  records?: RecruitRecord[];
  statusHistory?: StatusHistory[];
  paperDocuments?: PaperDocument[];
}

export interface RecruitRecord {
  id: string;
  recruitId: string;
  type: string;
  date: string | Date;
  entity?: string | null;
  description?: string | null;
  details?: string | null;
  startDate?: string | Date | null;
  endDate?: string | Date | null;
  duration?: string | null;
  attachment?: string | null;
  createdAt: string | Date;
  updatedAt: string | Date;
}

export interface StatusHistory {
  id: string;
  recruitId: string;
  previousStatus: string;
  newStatus: string;
  changeDate: string | Date;
  reason?: string | null;
}

export interface PaperDocument {
  id: string;
  recruitId: string;
  documentName: string;
  filePath: string;
  createdAt: string | Date;
}
