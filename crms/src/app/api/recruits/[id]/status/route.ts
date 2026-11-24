import { NextRequest, NextResponse } from "next/server";
import { updateRecruitStatus } from "@/lib/json-db";
import { statusChangeSchema } from "@/lib/validations";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    const body = await request.json();
    const validated = statusChangeSchema.parse({
      ...body,
      recruitId: id,
    });

    const result = await updateRecruitStatus(
      id,
      validated.newStatus,
      validated.reason || null
    );

    return NextResponse.json(result);
  } catch (error: any) {
    console.error("Status change error:", error);
    return NextResponse.json(
      { error: error.message || "فشل تغيير الحالة الإدارية" },
      { status: 400 }
    );
  }
}
