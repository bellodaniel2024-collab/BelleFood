import { Suspense } from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import HeroSection from "@/components/home/HeroSection";
import FeaturedDishes from "@/components/home/FeaturedDishes";
import BrandStory from "@/components/home/BrandStory";
import CategoriesSection from "@/components/home/CategoriesSection";
import OrderCTA from "@/components/home/OrderCTA";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

async function getFeaturedItems() {
  try {
    return await prisma.menuItem.findMany({
      where: { isFeatured: true, isAvailable: true },
      include: { category: true },
      orderBy: { sortOrder: "asc" },
      take: 6,
    });
  } catch {
    return [];
  }
}

async function getCategories() {
  try {
    return await prisma.category.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: "asc" },
      include: { _count: { select: { items: true } } },
    });
  } catch {
    return [];
  }
}

export default async function HomePage() {
  const [featuredItems, categories] = await Promise.all([
    getFeaturedItems(),
    getCategories(),
  ]);

  return (
    <>
      <Header />
      <main id="main-content">
        <HeroSection />
        <Suspense fallback={<div className="h-96 animate-pulse bg-charcoal-50" />}>
          <FeaturedDishes items={featuredItems} />
        </Suspense>
        <BrandStory />
        <Suspense fallback={<div className="h-64 animate-pulse bg-white" />}>
          <CategoriesSection categories={categories} />
        </Suspense>
        <OrderCTA />
      </main>
      <Footer />
    </>
  );
}
