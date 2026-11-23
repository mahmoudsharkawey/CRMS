import path from "path";
import fs from "fs";

const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads");

export function ensureUploadDir(): void {
  if (!fs.existsSync(UPLOAD_DIR)) {
    fs.mkdirSync(UPLOAD_DIR, { recursive: true });
  }
}

export function getUploadPath(filename: string): string {
  return path.join(UPLOAD_DIR, filename);
}

export function getPublicUrl(filename: string): string {
  return `/uploads/${filename}`;
}

export async function saveFile(
  buffer: Buffer,
  filename: string
): Promise<string> {
  ensureUploadDir();
  const safeFilename = `${Date.now()}_${filename.replace(/[^a-zA-Z0-9._-]/g, "_")}`;
  const filePath = getUploadPath(safeFilename);
  await fs.promises.writeFile(filePath, buffer);
  return getPublicUrl(safeFilename);
}

export async function deleteFile(publicUrl: string): Promise<void> {
  const filename = publicUrl.replace("/uploads/", "");
  const filePath = getUploadPath(filename);
  if (fs.existsSync(filePath)) {
    await fs.promises.unlink(filePath);
  }
}
