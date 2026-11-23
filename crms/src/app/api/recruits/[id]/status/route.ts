import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
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

    // Check current recruit
    const currentRecruit = await prisma.recruit.findUnique({
      where: { id },
      select: { administrativeStatus: true },
    });

    if (!currentRecruit) {
      return NextResponse.json(
        { error: "لم يتم العثور على المجند" },
        { status: 404 }
      );
    }

    // Run transaction: update status AND create status history entry
    const [updatedRecruit, historyEntry] = await prisma.$transaction([
      prisma.recruit.update({
        where: { id },
        data: {
          administrativeStatus: validated.newStatus,
        },
      }),
      prisma.statusHistory.create({
        data: {
          recruitId: id,
          previousStatus: currentRecruit.administrativeStatus,
          newStatus: validated.newStatus,
          changeDate: new Date(),
          reason: validated.reason || null,
        },
      }),
    ]);

    return NextResponse.json({
      recruit: updatedRecruit,
      history: historyEntry,
    });
  } catch (error: any) {
    console.error("Status change error:", error);
    return NextResponse.json(
      { error: error.message || "فشل تغيير الحالة الإدارية" },
      { status: 400 }
    );
  }
}
