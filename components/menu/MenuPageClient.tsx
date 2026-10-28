"use client";

import { useState, useMemo, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search, X, SlidersHorizontal } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import MenuCard from "./MenuCard";
import type { Category, MenuItem } from "@prisma/client";
import type { MenuItemWithCategory } from "@/types";

interface Props {
  categories: Category[];
  items: (MenuItem & { category: Category })[];
  initialCategory?: string;
  initialSearch?: string;
}

export default function MenuPageClient({
  categories,
  items,
  initialCategory,
  initialSearch,
}: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [selectedCategory, setSelectedCategory] = useState<string>(
    initialCategory || "all"
  );
  const [searchQuery, setSearchQuery] = useState(initialSearch || "");
  const [showUnavailable, setShowUnavailable] = useState(false);

  // Sync URL params
  useEffect(() => {
    const params = new URLSearchParams();
    if (selectedCategory !== "all") params.set("category", selectedCategory);
    if (searchQuery) params.set("q", searchQuery);
    const queryStr = params.toString();
    router.replace(`/menu${queryStr ? `?${queryStr}` : ""}`, { scroll: false });
  }, [selectedCategory, searchQuery, router]);

  const filteredItems = useMemo(() => {
    let result = items;

    if (!showUnavailable) {
      result = result.filter((i) => i.isAvailable);
    }

    if (selectedCategory !== "all") {
      result = result.filter((i) => i.category.slug === selectedCategory);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (i) =>
          i.name.toLowerCase().includes(q) ||
          i.description?.toLowerCase().includes(q) ||
          i.category.name.toLowerCase().includes(q)
      );
    }

    return result;
  }, [items, selectedCategory, searchQuery, showUnavailable]);

  function handleCategorySelect(slug: string) {
    setSelectedCategory(slug);
    setSearchQuery("");
  }

  return (
    <div className="container-belle py-8 md:py-10">
      {/* Filter toolbar */}
      <div className="sticky top-16 md:top-18 z-30 bg-white/95 backdrop-blur-sm py-4 -mx-4 px-4 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8 border-b border-charcoal-100 mb-6">
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Search */}
          <div className="relative flex-1 max-w-sm">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-charcoal-400"
              aria-hidden="true"
            />
            <input
              type="search"
              placeholder="Search dishes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-8 py-2.5 text-sm rounded-xl border border-charcoal-200 bg-white focus:border-tomato-400 focus:ring-2 focus:ring-tomato-100 focus:outline-none"
              aria-label="Search menu"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-charcoal-400 hover:text-charcoal-600"
                aria-label="Clear search"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Category pills — scrollable on mobile */}
          <div
            className="flex gap-2 overflow-x-auto pb-1 sm:pb-0 flex-1 scrollbar-none"
            role="tablist"
            aria-label="Filter by category"
          >
            <button
              role="tab"
              aria-selected={selectedCategory === "all"}
              onClick={() => handleCategorySelect("all")}
              className={`shrink-0 rounded-full px-4 py-2 text-xs font-semibold transition-colors whitespace-nowrap ${
                selectedCategory === "all"
                  ? "bg-charcoal-800 text-white"
                  : "bg-charcoal-100 text-charcoal-600 hover:bg-charcoal-200"
              }`}
            >
              All Dishes
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                role="tab"
                aria-selected={selectedCategory === cat.slug}
                onClick={() => handleCategorySelect(cat.slug)}
                className={`shrink-0 rounded-full px-4 py-2 text-xs font-semibold transition-colors whitespace-nowrap ${
                  selectedCategory === cat.slug
                    ? "bg-tomato-600 text-white"
                    : "bg-charcoal-100 text-charcoal-600 hover:bg-charcoal-200"
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>

          {/* Show unavailable toggle */}
          <button
            onClick={() => setShowUnavailable(!showUnavailable)}
            className={`shrink-0 flex items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-medium transition-colors ${
              showUnavailable
                ? "bg-charcoal-700 text-white"
                : "bg-charcoal-100 text-charcoal-500 hover:bg-charcoal-200"
            }`}
            aria-pressed={showUnavailable}
          >
            <SlidersHorizontal className="w-3.5 h-3.5" aria-hidden="true" />
            <span className="hidden sm:inline">Show all</span>
          </button>
        </div>
      </div>

      {/* Results count */}
      <div className="flex items-center justify-between mb-5">
        <p className="text-sm text-charcoal-500">
          {filteredItems.length === 0
            ? "No dishes found"
            : `${filteredItems.length} ${filteredItems.length === 1 ? "dish" : "dishes"}`}
          {selectedCategory !== "all" && ` in ${categories.find(c => c.slug === selectedCategory)?.name}`}
          {searchQuery && ` for "${searchQuery}"`}
        </p>
      </div>

      {/* Empty state */}
      {filteredItems.length === 0 && (
        <div className="text-center py-16">
          <div className="text-5xl mb-4" aria-hidden="true">🍽️</div>
          <h3 className="text-lg font-bold text-charcoal-700 mb-2">
            {searchQuery ? "No results found" : "No dishes available"}
          </h3>
          <p className="text-sm text-charcoal-400 mb-4">
            {searchQuery
              ? `We couldn't find anything matching "${searchQuery}".`
              : "Check back later or browse a different category."}
          </p>
          {(searchQuery || selectedCategory !== "all") && (
            <button
              onClick={() => {
                setSearchQuery("");
                setSelectedCategory("all");
              }}
              className="btn-primary text-sm"
            >
              Clear filters
            </button>
          )}
        </div>
      )}

      {/* Menu grid */}
      <AnimatePresence mode="wait">
        <motion.div
          key={`${selectedCategory}-${searchQuery}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5"
          role="list"
          aria-label="Menu items"
        >
          {filteredItems.map((item, index) => (
            <MenuCard
              key={item.id}
              item={item as MenuItemWithCategory}
              index={index}
            />
          ))}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
