import * as fs from "fs";
import * as path from "path";
import { initialRecruits } from "../data/initial-data";
import type { Recruit, RecruitRecord, StatusHistory } from "../types";

// Determine persistence path (use /tmp on serverless/Vercel or local data dir)
const IS_VERCEL = Boolean(process.env.VERCEL);
const DATA_DIR = IS_VERCEL ? "/tmp" : path.join(process.cwd(), "data");
const DB_FILE = path.join(DATA_DIR, "recruits.json");

// In-memory cache for fast access across requests in the same process
let inMemoryRecruits: Recruit[] | null = null;

function ensureDataFile(): void {
  if (inMemoryRecruits) return;

  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }

    if (fs.existsSync(DB_FILE)) {
      const content = fs.readFileSync(DB_FILE, "utf8");
      inMemoryRecruits = JSON.parse(content);
    } else {
      inMemoryRecruits = JSON.parse(JSON.stringify(initialRecruits));
      fs.writeFileSync(DB_FILE, JSON.stringify(inMemoryRecruits, null, 2), "utf8");
    }
  } catch (err) {
    console.warn("[json-db] Fallback to in-memory store:", err);
    inMemoryRecruits = JSON.parse(JSON.stringify(initialRecruits));
  }
}

function persistData(): void {
  if (!inMemoryRecruits) return;
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(DB_FILE, JSON.stringify(inMemoryRecruits, null, 2), "utf8");
  } catch (err) {
    console.warn("[json-db] Could not write to disk, kept in memory:", err);
  }
}

function getAll(): Recruit[] {
  ensureDataFile();
  return inMemoryRecruits || [];
}

// 1. Get recruits with optional search query
export async function getRecruits(q: string = ""): Promise<Recruit[]> {
  const recruits = getAll();
  const trimmed = q.trim().toLowerCase();

  if (!trimmed) {
    return recruits.map(({ records, statusHistory, paperDocuments, ...rest }) => rest as Recruit);
  }

  return recruits
    .filter(
      (r) =>
        r.fullName.toLowerCase().includes(trimmed) ||
        r.policeNumber.toLowerCase().includes(trimmed) ||
        r.fileNumber.toLowerCase().includes(trimmed) ||
        r.nationalId.toLowerCase().includes(trimmed)
    )
    .map(({ records, statusHistory, paperDocuments, ...rest }) => rest as Recruit);
}

// 2. Get single recruit by id with sorted relations
export async function getRecruitById(id: string): Promise<Recruit | null> {
  const recruits = getAll();
  const recruit = recruits.find((r) => r.id === id);
  if (!recruit) return null;

  // Clone and sort records by date desc
  const cloned: Recruit = JSON.parse(JSON.stringify(recruit));
  if (cloned.records) {
    cloned.records.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }
  if (cloned.statusHistory) {
    cloned.statusHistory.sort(
      (a, b) => new Date(b.changeDate).getTime() - new Date(a.changeDate).getTime()
    );
  }

  return cloned;
}

// 3. Update basic recruit info
export async function updateRecruit(id: string, data: Partial<Recruit>): Promise<Recruit> {
  const recruits = getAll();
  const index = recruits.findIndex((r) => r.id === id);
  if (index === -1) {
    throw new Error("لم يتم العثور على المجند");
  }

  const existing = recruits[index];
  const updated: Recruit = {
    ...existing,
    ...data,
    updatedAt: new Date(),
  };

  recruits[index] = updated;
  persistData();
  return updated;
}

// 4. Update administrative status and append to status history
export async function updateRecruitStatus(
  id: string,
  newStatus: string,
  reason?: string | null
): Promise<{ recruit: Recruit; history: StatusHistory }> {
  const recruits = getAll();
  const index = recruits.findIndex((r) => r.id === id);
  if (index === -1) {
    throw new Error("لم يتم العثور على المجند");
  }

  const recruit = recruits[index];
  const previousStatus = recruit.administrativeStatus;

  const historyEntry: StatusHistory = {
    id: `hist_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    recruitId: id,
    previousStatus,
    newStatus,
    changeDate: new Date(),
    reason: reason || null,
  };

  recruit.administrativeStatus = newStatus;
  recruit.statusHistory = recruit.statusHistory || [];
  recruit.statusHistory.unshift(historyEntry);
  recruit.updatedAt = new Date();

  persistData();
  return { recruit, history: historyEntry };
}

// 5. Add a timeline record
export async function addRecord(
  data: Omit<RecruitRecord, "id" | "createdAt" | "updatedAt">
): Promise<RecruitRecord> {
  const recruits = getAll();
  const recruit = recruits.find((r) => r.id === data.recruitId);
  if (!recruit) {
    throw new Error("لم يتم العثور على المجند المطلوب");
  }

  const newRecord: RecruitRecord = {
    ...data,
    id: `rec_item_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  recruit.records = recruit.records || [];
  recruit.records.unshift(newRecord);
  recruit.updatedAt = new Date();

  persistData();
  return newRecord;
}

// 6. Update a timeline record
export async function updateRecord(
  recordId: string,
  data: Partial<RecruitRecord>
): Promise<RecruitRecord> {
  const recruits = getAll();

  for (const recruit of recruits) {
    if (!recruit.records) continue;
    const recIndex = recruit.records.findIndex((r) => r.id === recordId);
    if (recIndex !== -1) {
      const existing = recruit.records[recIndex];
      const updated: RecruitRecord = {
        ...existing,
        ...data,
        updatedAt: new Date(),
      };
      recruit.records[recIndex] = updated;
      recruit.updatedAt = new Date();
      persistData();
      return updated;
    }
  }

  throw new Error("لم يتم العثور على القيد المطلوب تعديله");
}

// 7. Delete a timeline record
export async function deleteRecord(recordId: string): Promise<boolean> {
  const recruits = getAll();

  for (const recruit of recruits) {
    if (!recruit.records) continue;
    const recIndex = recruit.records.findIndex((r) => r.id === recordId);
    if (recIndex !== -1) {
      recruit.records.splice(recIndex, 1);
      recruit.updatedAt = new Date();
      persistData();
      return true;
    }
  }

  throw new Error("لم يتم العثور على القيد لحذفه");
}
