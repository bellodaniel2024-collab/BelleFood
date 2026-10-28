import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

async function requireStaff() {
  const session = await getServerSession(authOptions);
  return session && ["ADMIN", "STAFF"].includes(session.user.role) ? session : null;
}

export async function POST(req: NextRequest) {
  const session = await requireStaff();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { name, feeKobo } = await req.json();
  if (!name) return NextResponse.json({ error: "Name required" }, { status: 400 });

  const area = await prisma.deliveryArea.create({
    data: { name, feeKobo: Math.round(feeKobo) || 0, isActive: true },
  });

  return NextResponse.json({ success: true, data: area });
}
