import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import AdminMenuItemForm from "@/components/admin/AdminMenuItemForm";

export const metadata: Metadata = { title: "Edit Menu Item" };
export const dynamic = "force-dynamic";

export default async function AdminEditMenuItemPage({
  params,
}: {
  params: { id: string };
}) {
  const [item, categories] = await Promise.all([
    prisma.menuItem.findUnique({ where: { id: params.id } }),
    prisma.category.findMany({ where: { isActive: true }, orderBy: { sortOrder: "asc" } }),
  ]);

  if (!item) notFound();

  return (
    <div className="max-w-2xl">
      <div className="mb-6">
        <h1 className="text-2xl font-extrabold text-charcoal-800">
          Edit: {item.name}
        </h1>
      </div>
      <AdminMenuItemForm categories={categories} item={item} />
    </div>
  );
}
