"use server";
/**
 * Server actions for order creation and management.
 * These run exclusively server-side — never in the browser.
 */

import { prisma } from "@/lib/prisma";
import { checkoutSchema } from "@/lib/validations";
import { generateOrderReference } from "@/lib/utils";
import { revalidatePath } from "next/cache";
import type { CheckoutInput } from "@/lib/validations";
import type { ApiResponse, OrderWithItems } from "@/types";
import {
  FulfillmentType,
  PaymentMethod,
  PaymentStatus,
  OrderStatus,
} from "@prisma/client";

/**
 * Creates a new order after full server-side validation.
 * This is the authoritative order creation function.
 * Browser-supplied prices are IGNORED — we fetch trusted prices from the DB.
 */
export async function createOrder(
  input: CheckoutInput
): Promise<ApiResponse<{ orderId: string; reference: string; totalKobo: number }>> {
  // 1. Validate the request shape
  const parsed = checkoutSchema.safeParse(input);
  if (!parsed.success) {
    return {
      success: false,
      error: "Validation failed",
      details: parsed.error.flatten().fieldErrors as Record<string, string[]>,
    };
  }
  const data = parsed.data;

  // 2. Check restaurant settings
  const settings = await prisma.restaurantSettings.findFirst();
  if (settings && !settings.acceptingOrders) {
    return {
      success: false,
      error:
        settings.orderClosedMessage ||
        "Sorry, we are not accepting orders at this time. Please try again later.",
    };
  }

  // 3. Fetch menu items from trusted DB source (ignore any prices sent by client)
  const menuItemIds = data.items.map((i) => i.menuItemId);
  const menuItems = await prisma.menuItem.findMany({
    where: { id: { in: menuItemIds } },
  });

  // 4. Validate all products exist and are available
  const unavailableItems: string[] = [];
  for (const cartItem of data.items) {
    const found = menuItems.find((m) => m.id === cartItem.menuItemId);
    if (!found) {
      return {
        success: false,
        error: `A menu item in your cart is no longer available. Please refresh and try again.`,
      };
    }
    if (!found.isAvailable) {
      unavailableItems.push(found.name);
    }
  }
  if (unavailableItems.length > 0) {
    return {
      success: false,
      error: `The following items are currently unavailable: ${unavailableItems.join(", ")}. Please remove them from your cart.`,
    };
  }

  // 5. Validate quantities
  for (const cartItem of data.items) {
    if (cartItem.quantity < 1 || cartItem.quantity > 20) {
      return {
        success: false,
        error: "Invalid quantity. Each item must be between 1 and 20.",
      };
    }
  }

  // 6. Calculate authoritative subtotal using trusted prices
  let subtotalKobo = 0;
  const orderItemsData = data.items.map((cartItem) => {
    const menuItem = menuItems.find((m) => m.id === cartItem.menuItemId)!;
    const unitPriceKobo = menuItem.priceKobo;
    const totalKobo = unitPriceKobo * cartItem.quantity;
    subtotalKobo += totalKobo;
    return {
      menuItemId: cartItem.menuItemId,
      quantity: cartItem.quantity,
      unitPriceKobo,
      totalKobo,
      itemName: menuItem.name,
      selectedOptions: cartItem.selectedOptions
        ? JSON.stringify(cartItem.selectedOptions)
        : null,
    };
  });

  // 7. Calculate delivery fee
  let deliveryFeeKobo = 0;
  if (data.fulfillmentType === "DELIVERY") {
    if (!data.deliveryArea) {
      return { success: false, error: "Please select a delivery area." };
    }
    const area = await prisma.deliveryArea.findFirst({
      where: { name: data.deliveryArea, isActive: true },
    });
    if (!area) {
      return {
        success: false,
        error: `Sorry, we do not currently deliver to "${data.deliveryArea}". Please select a supported area or choose pickup.`,
      };
    }
    deliveryFeeKobo = area.feeKobo;
  }

  // 8. Check minimum order
  const minimumOrderKobo = settings?.minimumOrderKobo ?? 0;
  if (subtotalKobo < minimumOrderKobo) {
    const { formatNaira } = await import("@/lib/utils");
    return {
      success: false,
      error: `Minimum order is ${formatNaira(minimumOrderKobo)}. Please add more items.`,
    };
  }

  // 9. Calculate service fee
  let serviceFeeKobo = 0;
  if (settings?.serviceFeeEnabled && settings.serviceFeePercent > 0) {
    serviceFeeKobo = Math.round(
      subtotalKobo * (settings.serviceFeePercent / 100)
    );
  }

  const totalKobo = subtotalKobo + deliveryFeeKobo + serviceFeeKobo;

  // 10. Generate unique order reference
  const reference = generateOrderReference();

  // 11. Create the order in a transaction
  try {
    const order = await prisma.$transaction(async (tx) => {
      // Idempotency: check for duplicate reference (extremely unlikely but safe)
      const existing = await tx.order.findUnique({ where: { reference } });
      if (existing) {
        throw new Error("Reference collision — please retry");
      }

      return tx.order.create({
        data: {
          reference,
          customerName: data.customerName,
          customerEmail: data.customerEmail || null,
          customerPhone: data.customerPhone,
          fulfillmentType: data.fulfillmentType as FulfillmentType,
          deliveryAddress: data.deliveryAddress || null,
          deliveryArea: data.deliveryArea || null,
          deliveryNote: data.deliveryNote || null,
          customerNote: data.customerNote || null,
          subtotalKobo,
          deliveryFeeKobo,
          serviceFeeKobo,
          totalKobo,
          paymentMethod: data.paymentMethod as PaymentMethod,
          paymentStatus: PaymentStatus.PENDING,
          orderStatus: OrderStatus.PENDING_CONFIRMATION,
          items: {
            create: orderItemsData,
          },
        },
      });
    });

    revalidatePath("/admin/orders");

    return {
      success: true,
      data: {
        orderId: order.id,
        reference: order.reference,
        totalKobo: order.totalKobo,
      },
    };
  } catch (err) {
    console.error("[createOrder] Database error:", err);
    return {
      success: false,
      error:
        "We could not save your order. Please try again. If the problem persists, contact us directly.",
    };
  }
}

/**
 * Fetches a single order by ID or reference (public — returns limited data).
 * Does not expose other customers' orders.
 */
export async function getOrderByReference(
  reference: string,
  customerPhone: string
): Promise<ApiResponse<OrderWithItems>> {
  if (!reference || !customerPhone) {
    return { success: false, error: "Order reference and phone are required." };
  }

  const order = await prisma.order.findFirst({
    where: {
      reference: reference.toUpperCase().trim(),
      customerPhone: { contains: customerPhone.replace(/\s/g, "").slice(-8) },
    },
    include: {
      items: { include: { menuItem: true } },
    },
  });

  if (!order) {
    return {
      success: false,
      error:
        "Order not found. Please check your reference and phone number, or contact us for help.",
    };
  }

  return { success: true, data: order as OrderWithItems };
}
