import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { ensureSeedData } from "@/lib/seed-helper";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const q = searchParams.get("q")?.trim() || "";

  try {
    // Auto-seed if database is empty on Vercel or fresh deploy
    await ensureSeedData();

    const recruits = await prisma.recruit.findMany({
      where: q
        ? {
            OR: [
              { fullName: { contains: q } },
              { policeNumber: { contains: q } },
              { fileNumber: { contains: q } },
              { nationalId: { contains: q } },
            ],
          }
        : {},
      select: {
        id: true,
        fullName: true,
        nationalId: true,
        policeNumber: true,
        fileNumber: true,
        militaryNumber: true,
        administrativeStatus: true,
        photo: true,
        education: true,
        serviceInformation: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: { fullName: "asc" },
    });

    return NextResponse.json(recruits);
  } catch (error) {
    console.error("Recruits search error:", error);
    return NextResponse.json(
      { error: "حدث خطأ أثناء البحث في سجلات المجندين" },
      { status: 500 }
    );
  }
}
