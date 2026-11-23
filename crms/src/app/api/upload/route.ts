import { NextRequest, NextResponse } from "next/server";
import { saveFile } from "@/lib/storage";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "لم يتم اختيار ملف" }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const publicUrl = await saveFile(buffer, file.name);

    return NextResponse.json({ url: publicUrl });
  } catch (error: any) {
    console.error("File upload error:", error);
    return NextResponse.json(
      { error: error.message || "فشل رفع الملف" },
      { status: 500 }
    );
  }
}
