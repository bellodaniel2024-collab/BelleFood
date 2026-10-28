import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { orderStatusUpdateSchema } from "@/lib/validations";
import { VALID_ORDER_TRANSITIONS } from "@/lib/constants";

async function requireStaff() {
  const session = await getServerSession(authOptions);
  if (!session || !["ADMIN", "STAFF"].includes(session.user.role)) {
    return null;
  }
  return session;
}

export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await requireStaff();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const order = await prisma.order.findUnique({
    where: { id: params.id },
    include: { items: { include: { menuItem: true } } },
  });

  if (!order) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json({ success: true, data: order });
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await requireStaff();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const parsed = orderStatusUpdateSchema.safeParse({
    orderId: params.id,
    ...body,
  });

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const order = await prisma.order.findUnique({ where: { id: params.id } });
  if (!order) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  }

  const allowed = VALID_ORDER_TRANSITIONS[order.orderStatus] || [];
  if (!allowed.includes(parsed.data.orderStatus)) {
    return NextResponse.json(
      {
        error: `Invalid transition from ${order.orderStatus} to ${parsed.data.orderStatus}`,
      },
      { status: 422 }
    );
  }

  const updated = await prisma.order.update({
    where: { id: params.id },
    data: {
      orderStatus: parsed.data.orderStatus as typeof order.orderStatus,
      staffNote: parsed.data.staffNote || order.staffNote,
    },
  });

  return NextResponse.json({ success: true, data: updated });
}
