/**
 * Zod validation schemas — shared between client and server.
 * Always validate on the server; client validation is UX only.
 */
import { z } from "zod";

// ─── Checkout / Order ────────────────────────────────────────────────────────

export const cartItemSchema = z.object({
  menuItemId: z.string().cuid("Invalid menu item ID"),
  quantity: z.number().int().min(1, "Quantity must be at least 1").max(20, "Maximum 20 of any item"),
  selectedOptions: z.record(z.string()).optional(),
});

export const checkoutSchema = z.object({
  customerName: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name too long")
    .trim(),
  customerEmail: z
    .string()
    .email("Please enter a valid email address")
    .optional()
    .or(z.literal("")),
  customerPhone: z
    .string()
    .min(10, "Please enter a valid phone number")
    .max(20, "Phone number too long")
    .regex(
      /^[+]?[\d\s\-()]{10,20}$/,
      "Please enter a valid Nigerian phone number"
    ),
  fulfillmentType: z.enum(["DELIVERY", "PICKUP"]),
  deliveryAddress: z.string().min(5, "Please enter a delivery address").max(500).optional(),
  deliveryArea: z.string().min(1, "Please select a delivery area").optional(),
  deliveryNote: z.string().max(300, "Note too long").optional(),
  customerNote: z.string().max(500, "Note too long").optional(),
  paymentMethod: z.enum(["ONLINE", "TRANSFER", "PAY_ON_DELIVERY"]),
  items: z
    .array(cartItemSchema)
    .min(1, "Your cart is empty"),
}).superRefine((data, ctx) => {
  if (data.fulfillmentType === "DELIVERY") {
    if (!data.deliveryAddress || data.deliveryAddress.trim().length < 5) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Delivery address is required",
        path: ["deliveryAddress"],
      });
    }
    if (!data.deliveryArea || data.deliveryArea.trim().length < 1) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Please select a delivery area",
        path: ["deliveryArea"],
      });
    }
  }
});

export type CheckoutInput = z.infer<typeof checkoutSchema>;
export type CartItemInput = z.infer<typeof cartItemSchema>;

// ─── Admin: Menu Item ────────────────────────────────────────────────────────

export const menuItemSchema = z.object({
  name: z.string().min(2, "Name too short").max(100, "Name too long").trim(),
  slug: z
    .string()
    .min(2)
    .max(100)
    .regex(/^[a-z0-9-]+$/, "Slug must be lowercase with hyphens only")
    .optional(),
  description: z.string().max(500, "Description too long").optional(),
  priceNaira: z
    .number()
    .min(1, "Price must be at least ₦1")
    .max(1000000, "Price seems too high — check the amount"),
  imageUrl: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  isAvailable: z.boolean().default(true),
  isFeatured: z.boolean().default(false),
  categoryId: z.string().cuid("Please select a valid category"),
  sortOrder: z.number().int().min(0).default(0),
});

export type MenuItemInput = z.infer<typeof menuItemSchema>;

// ─── Admin: Category ─────────────────────────────────────────────────────────

export const categorySchema = z.object({
  name: z.string().min(2).max(50).trim(),
  slug: z
    .string()
    .min(2)
    .max(50)
    .regex(/^[a-z0-9-]+$/)
    .optional(),
  description: z.string().max(300).optional(),
  imageUrl: z.string().url().optional().or(z.literal("")),
  sortOrder: z.number().int().min(0).default(0),
  isActive: z.boolean().default(true),
});

export type CategoryInput = z.infer<typeof categorySchema>;

// ─── Admin: Order Status Update ──────────────────────────────────────────────

export const orderStatusUpdateSchema = z.object({
  orderId: z.string().cuid(),
  orderStatus: z.enum([
    "PENDING_CONFIRMATION",
    "CONFIRMED",
    "PREPARING",
    "READY",
    "OUT_FOR_DELIVERY",
    "COMPLETED",
    "CANCELLED",
  ]),
  staffNote: z.string().max(500).optional(),
});

export type OrderStatusUpdateInput = z.infer<typeof orderStatusUpdateSchema>;

// ─── Auth ─────────────────────────────────────────────────────────────────────

export const loginSchema = z.object({
  email: z.string().email("Please enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export type LoginInput = z.infer<typeof loginSchema>;

// ─── Restaurant Settings ──────────────────────────────────────────────────────

export const restaurantSettingsSchema = z.object({
  restaurantName: z.string().min(1).max(100),
  phone: z.string().max(30).optional().or(z.literal("")),
  whatsapp: z.string().max(30).optional().or(z.literal("")),
  email: z.string().email().optional().or(z.literal("")),
  address: z.string().max(500).optional().or(z.literal("")),
  mapEmbedUrl: z.string().url().optional().or(z.literal("")),
  deliveryEnabled: z.boolean(),
  pickupEnabled: z.boolean(),
  minimumOrderNaira: z.number().min(0),
  acceptingOrders: z.boolean(),
  orderClosedMessage: z.string().max(300).optional(),
  instagramUrl: z.string().url().optional().or(z.literal("")),
  twitterUrl: z.string().url().optional().or(z.literal("")),
  facebookUrl: z.string().url().optional().or(z.literal("")),
  tiktokUrl: z.string().url().optional().or(z.literal("")),
  estPrepMinutes: z.number().int().min(0).max(480).optional(),
  estDeliveryMinutes: z.number().int().min(0).max(480).optional(),
});

export type RestaurantSettingsInput = z.infer<typeof restaurantSettingsSchema>;
