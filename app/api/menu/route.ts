import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const category = searchParams.get("category");
  const q = searchParams.get("q");

  const where: Record<string, unknown> = {
    isAvailable: true,
  };

  if (category) {
    where.category = { slug: category };
  }

  if (q) {
    where.OR = [
      { name: { contains: q, mode: "insensitive" } },
      { description: { contains: q, mode: "insensitive" } },
    ];
  }

  const items = await prisma.menuItem.findMany({
    where,
    include: { category: true },
    orderBy: [{ categoryId: "asc" }, { sortOrder: "asc" }],
  });

  return NextResponse.json({ success: true, data: items });
}
