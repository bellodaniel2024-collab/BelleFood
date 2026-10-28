import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import AdminMenuItemForm from "@/components/admin/AdminMenuItemForm";

export const metadata: Metadata = { title: "Add Menu Item" };

export default async function AdminNewMenuItemPage() {
  const categories = await prisma.category.findMany({
    where: { isActive: true },
    orderBy: { sortOrder: "asc" },
  });

  return (
    <div className="max-w-2xl">
      <div className="mb-6">
        <h1 className="text-2xl font-extrabold text-charcoal-800">Add Menu Item</h1>
      </div>
      <AdminMenuItemForm categories={categories} />
    </div>
  );
}
