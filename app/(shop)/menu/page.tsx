import { Suspense } from "react";
import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import MenuPageClient from "@/components/menu/MenuPageClient";

export const metadata: Metadata = {
  title: "Our Menu",
  description:
    "Browse the full Belle Food menu — jollof rice, egusi soup, suya, grills, small chops and more.",
};

export const dynamic = "force-dynamic";

async function getMenuData() {
  const [categories, items] = await Promise.all([
    prisma.category.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: "asc" },
    }),
    prisma.menuItem.findMany({
      include: { category: true },
      orderBy: [{ categoryId: "asc" }, { sortOrder: "asc" }],
    }),
  ]);
  return { categories, items };
}

export default async function MenuPage({
  searchParams,
}: {
  searchParams: { category?: string; q?: string };
}) {
  const { categories, items } = await getMenuData();

  return (
    <div className="min-h-screen bg-white">
      {/* Page hero */}
      <div className="bg-gradient-to-br from-charcoal-800 to-charcoal-900 pt-24 pb-12 md:pt-28 md:pb-16">
        <div className="container-belle text-center">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-white mb-3 tracking-tight">
            Our Menu
          </h1>
          <p className="text-base text-charcoal-300 max-w-lg mx-auto">
            Fresh, authentic Nigerian dishes prepared daily. Pick your favourites and order online.
          </p>
        </div>
      </div>

      <Suspense fallback={<MenuSkeleton />}>
        <MenuPageClient
          categories={categories}
          items={items}
          initialCategory={searchParams.category}
          initialSearch={searchParams.q}
        />
      </Suspense>
    </div>
  );
}

function MenuSkeleton() {
  return (
    <div className="container-belle py-8">
      <div className="flex gap-2 mb-8 overflow-x-auto">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="skeleton h-9 w-24 rounded-full shrink-0" />
        ))}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="card overflow-hidden">
            <div className="skeleton h-44 w-full" />
            <div className="p-4 space-y-2">
              <div className="skeleton h-4 w-3/4" />
              <div className="skeleton h-3 w-full" />
              <div className="skeleton h-3 w-2/3" />
              <div className="flex justify-between items-center pt-1">
                <div className="skeleton h-5 w-16" />
                <div className="skeleton h-8 w-20 rounded-full" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
