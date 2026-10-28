"use server";
/**
 * Server actions for menu management (admin).
 */

import { prisma } from "@/lib/prisma";
import { menuItemSchema, categorySchema } from "@/lib/validations";
import { slugify, nairaToKobo } from "@/lib/utils";
import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import type { ApiResponse } from "@/types";
import type { MenuItem, Category } from "@prisma/client";

/**
 * Asserts the current session user is ADMIN or STAFF.
 * Throws if not authorized.
 */
async function requireAdminOrStaff() {
  const session = await getServerSession(authOptions);
  if (!session || !["ADMIN", "STAFF"].includes(session.user.role)) {
    throw new Error("Unauthorized");
  }
  return session;
}

// ─── Menu Items ───────────────────────────────────────────────────────────────

export async function createMenuItem(
  input: unknown
): Promise<ApiResponse<MenuItem>> {
  await requireAdminOrStaff();

  const parsed = menuItemSchema.safeParse(input);
  if (!parsed.success) {
    return {
      success: false,
      error: "Validation failed",
      details: parsed.error.flatten().fieldErrors as Record<string, string[]>,
    };
  }

  const { name, description, priceNaira, imageUrl, isAvailable, isFeatured, categoryId, sortOrder } =
    parsed.data;
  const slug = parsed.data.slug || slugify(name);

  // Check slug uniqueness
  const existing = await prisma.menuItem.findUnique({ where: { slug } });
  if (existing) {
    return {
      success: false,
      error: `A menu item with the slug "${slug}" already exists. Please use a different name.`,
    };
  }

  const item = await prisma.menuItem.create({
    data: {
      name,
      slug,
      description,
      priceKobo: nairaToKobo(priceNaira),
      imageUrl: imageUrl || null,
      isAvailable,
      isFeatured,
      categoryId,
      sortOrder,
    },
  });

  revalidatePath("/menu");
  revalidatePath("/admin/menu");

  return { success: true, data: item };
}

export async function updateMenuItem(
  id: string,
  input: unknown
): Promise<ApiResponse<MenuItem>> {
  await requireAdminOrStaff();

  const parsed = menuItemSchema.safeParse(input);
  if (!parsed.success) {
    return {
      success: false,
      error: "Validation failed",
      details: parsed.error.flatten().fieldErrors as Record<string, string[]>,
    };
  }

  const { name, description, priceNaira, imageUrl, isAvailable, isFeatured, categoryId, sortOrder } =
    parsed.data;

  const item = await prisma.menuItem.update({
    where: { id },
    data: {
      name,
      description,
      priceKobo: nairaToKobo(priceNaira),
      imageUrl: imageUrl || null,
      isAvailable,
      isFeatured,
      categoryId,
      sortOrder,
    },
  });

  revalidatePath("/menu");
  revalidatePath("/admin/menu");
  revalidatePath(`/admin/menu/${id}/edit`);

  return { success: true, data: item };
}

export async function deleteMenuItem(
  id: string
): Promise<ApiResponse<{ deleted: boolean }>> {
  await requireAdminOrStaff();

  // Soft-delete: just mark unavailable rather than deleting
  // This preserves historical order accuracy
  await prisma.menuItem.update({
    where: { id },
    data: { isAvailable: false },
  });

  revalidatePath("/menu");
  revalidatePath("/admin/menu");

  return { success: true, data: { deleted: true } };
}

export async function toggleMenuItemAvailability(
  id: string
): Promise<ApiResponse<MenuItem>> {
  await requireAdminOrStaff();

  const item = await prisma.menuItem.findUnique({ where: { id } });
  if (!item) return { success: false, error: "Menu item not found" };

  const updated = await prisma.menuItem.update({
    where: { id },
    data: { isAvailable: !item.isAvailable },
  });

  revalidatePath("/menu");
  revalidatePath("/admin/menu");

  return { success: true, data: updated };
}

// ─── Categories ───────────────────────────────────────────────────────────────

export async function createCategory(
  input: unknown
): Promise<ApiResponse<Category>> {
  await requireAdminOrStaff();

  const parsed = categorySchema.safeParse(input);
  if (!parsed.success) {
    return {
      success: false,
      error: "Validation failed",
      details: parsed.error.flatten().fieldErrors as Record<string, string[]>,
    };
  }

  const { name, description, imageUrl, sortOrder, isActive } = parsed.data;
  const slug = parsed.data.slug || slugify(name);

  const category = await prisma.category.create({
    data: { name, slug, description, imageUrl: imageUrl || null, sortOrder, isActive },
  });

  revalidatePath("/menu");
  revalidatePath("/admin/menu");

  return { success: true, data: category };
}
