import { NextRequest, NextResponse } from "next/server";
import { getRecruits } from "@/lib/json-db";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const q = searchParams.get("q") || "";

  try {
    const recruits = await getRecruits(q);
    return NextResponse.json(recruits);
  } catch (error) {
    console.error("Recruits search error:", error);
    return NextResponse.json(
      { error: "حدث خطأ أثناء البحث في سجلات المجندين" },
      { status: 500 }
    );
  }
}
