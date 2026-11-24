import { NextRequest, NextResponse } from "next/server";
import { updateRecord, deleteRecord } from "@/lib/json-db";
import { recruitRecordSchema } from "@/lib/validations";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    const body = await request.json();
    const validated = recruitRecordSchema.parse(body);

    const updated = await updateRecord(id, {
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

    return NextResponse.json(updated);
  } catch (error: any) {
    console.error("Update record error:", error);
    return NextResponse.json(
      { error: error.message || "فشل تعديل القيد" },
      { status: 400 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    await deleteRecord(id);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Delete record error:", error);
    return NextResponse.json(
      { error: error.message || "فشل حذف القيد" },
      { status: 400 }
    );
  }
}
