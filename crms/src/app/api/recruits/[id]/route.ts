import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { recruitSchema } from "@/lib/validations";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    const recruit = await prisma.recruit.findUnique({
      where: { id },
      include: {
        records: {
          orderBy: { date: "desc" },
        },
        statusHistory: {
          orderBy: { changeDate: "desc" },
        },
        paperDocuments: {
          orderBy: { createdAt: "desc" },
        },
      },
    });

    if (!recruit) {
      return NextResponse.json(
        { error: "لم يتم العثور على سجل المجند المطلوب" },
        { status: 404 }
      );
    }

    return NextResponse.json(recruit);
  } catch (error) {
    console.error("Fetch recruit error:", error);
    return NextResponse.json(
      { error: "حدث خطأ أثناء جلب بيانات المجند" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    const body = await request.json();
    const validated = recruitSchema.parse(body);

    const updated = await prisma.recruit.update({
      where: { id },
      data: {
        fullName: validated.fullName,
        nationalId: validated.nationalId,
        policeNumber: validated.policeNumber,
        fileNumber: validated.fileNumber,
        militaryNumber: validated.militaryNumber || null,
        photo: validated.photo || null,
        dateOfBirth: validated.dateOfBirth ? new Date(validated.dateOfBirth) : null,
        education: validated.education || null,
        serviceInformation: validated.serviceInformation || null,
        administrativeStatus: validated.administrativeStatus,
      },
    });

    return NextResponse.json(updated);
  } catch (error: any) {
    console.error("Update recruit error:", error);
    return NextResponse.json(
      { error: error.message || "حدث خطأ أثناء تحديث بيانات المجند" },
      { status: 400 }
    );
  }
}
