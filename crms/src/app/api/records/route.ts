import { NextRequest, NextResponse } from "next/server";
import { addRecord } from "@/lib/json-db";
import { recruitRecordSchema } from "@/lib/validations";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validated = recruitRecordSchema.parse(body);

    const record = await addRecord({
      recruitId: validated.recruitId,
      type: validated.type,
      date: new Date(validated.date),
      entity: validated.entity || null,
      description: validated.description || null,
      details: validated.details || null,
      startDate: validated.startDate ? new Date(validated.startDate) : null,
      endDate: validated.endDate ? new Date(validated.endDate) : null,
      duration: validated.duration || null,
      attachment: validated.attachment || null,
    });

    return NextResponse.json(record, { status: 201 });
  } catch (error: any) {
    console.error("Create record error:", error);
    return NextResponse.json(
      { error: error.message || "فشل حفظ القيد بالسجل" },
      { status: 400 }
    );
  }
}
