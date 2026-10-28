/**
 * Belle Food — Shared TypeScript types
 * These augment the auto-generated Prisma types for UI/API use.
 */

import type {
  MenuItem,
  Category,
  Order,
  OrderItem,
  OrderStatus,
  PaymentStatus,
  FulfillmentType,
  PaymentMethod,
  UserRole,
  DeliveryArea,
  RestaurantSettings,
} from "@prisma/client";

// ─── Re-export Prisma enums ───────────────────────────────────────────────────
export type {
  OrderStatus,
  PaymentStatus,
  FulfillmentType,
  PaymentMethod,
  UserRole,
};

// ─── Menu ─────────────────────────────────────────────────────────────────────

export type MenuItemWithCategory = MenuItem & {
  category: Category;
};

export type CategoryWithItems = Category & {
  items: MenuItem[];
};

// ─── Cart ─────────────────────────────────────────────────────────────────────

export interface CartItem {
  menuItemId: string;
  name: string;
  priceKobo: number;
  imageUrl: string | null;
  quantity: number;
  selectedOptions?: Record<string, string>;
}

export interface CartState {
  items: CartItem[];
  addItem: (item: Omit<CartItem, "quantity"> & { quantity?: number }) => void;
  removeItem: (menuItemId: string) => void;
  updateQuantity: (menuItemId: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  subtotalKobo: number;
}

// ─── Orders ──────────────────────────────────────────────────────────────────

export type OrderWithItems = Order & {
  items: (OrderItem & {
    menuItem: MenuItem;
  })[];
};

export type OrderSummary = {
  id: string;
  reference: string;
  customerName: string;
  customerPhone: string;
  orderStatus: OrderStatus;
  paymentStatus: PaymentStatus;
  paymentMethod: PaymentMethod;
  fulfillmentType: FulfillmentType;
  totalKobo: number;
  itemCount: number;
  createdAt: Date;
};

// ─── Restaurant Settings ──────────────────────────────────────────────────────

export type { RestaurantSettings, DeliveryArea };

export interface OpeningHoursEntry {
  day: string;
  openTime: string;
  closeTime: string;
  closed: boolean;
}

// ─── API Responses ────────────────────────────────────────────────────────────

export interface ApiSuccess<T> {
  success: true;
  data: T;
}

export interface ApiError {
  success: false;
  error: string;
  details?: Record<string, string[]>;
}

export type ApiResponse<T> = ApiSuccess<T> | ApiError;

// ─── Admin Dashboard Stats ────────────────────────────────────────────────────

export interface DashboardStats {
  ordersToday: number;
  pendingOrders: number;
  confirmedOrders: number;
  preparingOrders: number;
  readyOrders: number;
  completedOrdersToday: number;
  revenueToday: number; // kobo
  revenueThisMonth: number; // kobo
}

// ─── Session augmentation ─────────────────────────────────────────────────────

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      role: UserRole;
    };
  }

  interface User {
    id: string;
    role: UserRole;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role: UserRole;
  }
}
