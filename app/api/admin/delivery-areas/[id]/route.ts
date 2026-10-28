import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

async function requireStaff() {
  const session = await getServerSession(authOptions);
  return session && ["ADMIN", "STAFF"].includes(session.user.role) ? session : null;
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await requireStaff();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const area = await prisma.deliveryArea.update({
    where: { id: params.id },
    data: {
      ...(typeof body.isActive === "boolean" && { isActive: body.isActive }),
      ...(typeof body.feeKobo === "number" && { feeKobo: body.feeKobo }),
      ...(typeof body.name === "string" && { name: body.name }),
    },
  });

  return NextResponse.json({ success: true, data: area });
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await requireStaff();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await prisma.deliveryArea.delete({ where: { id: params.id } });
  return NextResponse.json({ success: true });
}
