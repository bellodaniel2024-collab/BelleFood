"use server";
/**
 * Admin server actions for order management and settings.
 */

import { prisma } from "@/lib/prisma";
import { orderStatusUpdateSchema, restaurantSettingsSchema } from "@/lib/validations";
import { VALID_ORDER_TRANSITIONS } from "@/lib/constants";
import { nairaToKobo } from "@/lib/utils";
import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import type { ApiResponse } from "@/types";
import type { Order, RestaurantSettings } from "@prisma/client";

async function requireAdminOrStaff() {
  const session = await getServerSession(authOptions);
  if (!session || !["ADMIN", "STAFF"].includes(session.user.role)) {
    throw new Error("Unauthorized");
  }
  return session;
}

async function requireAdmin() {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "ADMIN") {
    throw new Error("Only administrators can perform this action");
  }
  return session;
}

// ─── Order Management ─────────────────────────────────────────────────────────

export async function updateOrderStatus(
  input: unknown
): Promise<ApiResponse<Order>> {
  await requireAdminOrStaff();

  const parsed = orderStatusUpdateSchema.safeParse(input);
  if (!parsed.success) {
    return {
      success: false,
      error: "Invalid input",
      details: parsed.error.flatten().fieldErrors as Record<string, string[]>,
    };
  }

  const { orderId, orderStatus, staffNote } = parsed.data;

  // Fetch current order
  const order = await prisma.order.findUnique({ where: { id: orderId } });
  if (!order) return { success: false, error: "Order not found" };

  // Validate transition
  const allowedTransitions = VALID_ORDER_TRANSITIONS[order.orderStatus] || [];
  if (!allowedTransitions.includes(orderStatus)) {
    return {
      success: false,
      error: `Cannot transition from ${order.orderStatus} to ${orderStatus}.`,
    };
  }

  const updated = await prisma.order.update({
    where: { id: orderId },
    data: {
      orderStatus: orderStatus as Order["orderStatus"],
      staffNote: staffNote || order.staffNote,
    },
  });

  revalidatePath("/admin/orders");
  revalidatePath(`/admin/orders/${orderId}`);

  return { success: true, data: updated };
}

export async function getAdminOrders(params?: {
  status?: string;
  limit?: number;
  page?: number;
}) {
  await requireAdminOrStaff();

  const { status, limit = 50, page = 1 } = params || {};
  const skip = (page - 1) * limit;

  const where = status ? { orderStatus: status as Order["orderStatus"] } : {};

  const [orders, total] = await Promise.all([
    prisma.order.findMany({
      where,
      include: { items: { include: { menuItem: true } } },
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,
    }),
    prisma.order.count({ where }),
  ]);

  return { orders, total, page, limit };
}

export async function getAdminDashboardStats() {
  await requireAdminOrStaff();

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

  const [
    ordersToday,
    pendingOrders,
    confirmedOrders,
    preparingOrders,
    readyOrders,
    completedToday,
    revenueToday,
    revenueThisMonth,
  ] = await Promise.all([
    prisma.order.count({ where: { createdAt: { gte: today } } }),
    prisma.order.count({ where: { orderStatus: "PENDING_CONFIRMATION" } }),
    prisma.order.count({ where: { orderStatus: "CONFIRMED" } }),
    prisma.order.count({ where: { orderStatus: "PREPARING" } }),
    prisma.order.count({ where: { orderStatus: "READY" } }),
    prisma.order.count({
      where: { orderStatus: "COMPLETED", updatedAt: { gte: today } },
    }),
    prisma.order.aggregate({
      _sum: { totalKobo: true },
      where: {
        paymentStatus: "PAID",
        createdAt: { gte: today },
      },
    }),
    prisma.order.aggregate({
      _sum: { totalKobo: true },
      where: {
        paymentStatus: "PAID",
        createdAt: { gte: startOfMonth },
      },
    }),
  ]);

  return {
    ordersToday,
    pendingOrders,
    confirmedOrders,
    preparingOrders,
    readyOrders,
    completedOrdersToday: completedToday,
    revenueToday: revenueToday._sum.totalKobo ?? 0,
    revenueThisMonth: revenueThisMonth._sum.totalKobo ?? 0,
  };
}

// ─── Restaurant Settings ──────────────────────────────────────────────────────

export async function updateRestaurantSettings(
  input: unknown
): Promise<ApiResponse<RestaurantSettings>> {
  await requireAdmin();

  const parsed = restaurantSettingsSchema.safeParse(input);
  if (!parsed.success) {
    return {
      success: false,
      error: "Validation failed",
      details: parsed.error.flatten().fieldErrors as Record<string, string[]>,
    };
  }

  const { minimumOrderNaira, ...rest } = parsed.data;

  const settings = await prisma.restaurantSettings.upsert({
    where: { id: "singleton" },
    create: {
      id: "singleton",
      ...rest,
      minimumOrderKobo: nairaToKobo(minimumOrderNaira),
    },
    update: {
      ...rest,
      minimumOrderKobo: nairaToKobo(minimumOrderNaira),
    },
  });

  revalidatePath("/");
  revalidatePath("/contact");
  revalidatePath("/admin/settings");

  return { success: true, data: settings };
}

export async function getRestaurantSettings(): Promise<RestaurantSettings | null> {
  return prisma.restaurantSettings.findFirst();
}
