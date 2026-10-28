import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { formatNaira } from "@/lib/utils";
import Link from "next/link";
import { Plus, Edit, ToggleLeft, ToggleRight } from "lucide-react";
import Image from "next/image";

export const metadata: Metadata = { title: "Menu Management" };
export const dynamic = "force-dynamic";

export default async function AdminMenuPage() {
  const [categories, items] = await Promise.all([
    prisma.category.findMany({ orderBy: { sortOrder: "asc" } }),
    prisma.menuItem.findMany({
      include: { category: true },
      orderBy: [{ categoryId: "asc" }, { sortOrder: "asc" }],
    }),
  ]);

  return (
    <div className="max-w-5xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-extrabold text-charcoal-800">Menu</h1>
          <p className="text-sm text-charcoal-400 mt-1">
            {items.length} items across {categories.length} categories
          </p>
        </div>
        <Link href="/admin/menu/new" className="btn-primary text-sm">
          <Plus className="w-4 h-4" />
          Add Item
        </Link>
      </div>

      {/* Items grouped by category */}
      {categories.map((category) => {
        const categoryItems = items.filter((i) => i.categoryId === category.id);
        if (categoryItems.length === 0) return null;

        return (
          <div key={category.id} className="mb-6">
            <h2 className="text-sm font-bold text-charcoal-600 uppercase tracking-wider mb-3">
              {category.name}
            </h2>
            <div className="card overflow-hidden">
              <table className="min-w-full divide-y divide-charcoal-100">
                <thead className="bg-charcoal-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-charcoal-500 uppercase">Item</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-charcoal-500 uppercase">Price</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-charcoal-500 uppercase">Status</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-charcoal-500 uppercase">Featured</th>
                    <th className="px-4 py-3">
                      <span className="sr-only">Actions</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-charcoal-50">
                  {categoryItems.map((item) => (
                    <tr key={item.id} className="hover:bg-charcoal-50/50">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="relative w-9 h-9 rounded-lg overflow-hidden bg-charcoal-100 shrink-0">
                            {item.imageUrl ? (
                              <Image
                                src={item.imageUrl}
                                alt={item.name}
                                fill
                                className="object-cover"
                                sizes="36px"
                              />
                            ) : (
                              <div className="flex items-center justify-center h-full text-sm">🍴</div>
                            )}
                          </div>
                          <div>
                            <p className="text-sm font-medium text-charcoal-800">{item.name}</p>
                            {item.description && (
                              <p className="text-xs text-charcoal-400 line-clamp-1 max-w-xs">
                                {item.description}
                              </p>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm font-semibold text-charcoal-700 whitespace-nowrap">
                        {formatNaira(item.priceKobo)}
                      </td>
                      <td className="px-4 py-3">
                        <span className={`badge ${item.isAvailable ? "badge-success" : "badge-error"}`}>
                          {item.isAvailable ? "Available" : "Unavailable"}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-charcoal-400">
                        {item.isFeatured ? "⭐" : "—"}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <Link
                          href={`/admin/menu/${item.id}/edit`}
                          className="inline-flex items-center gap-1 text-xs font-semibold text-charcoal-500 hover:text-tomato-600 transition-colors"
                        >
                          <Edit className="w-3 h-3" />
                          Edit
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );
      })}
    </div>
  );
}
