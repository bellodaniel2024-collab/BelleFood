"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import type { Category } from "@prisma/client";

type CategoryWithCount = Category & {
  _count: { items: number };
};

// Fallback images for categories that don't have images configured
const CATEGORY_IMAGES: Record<string, string> = {
  "rice-dishes": "https://images.unsplash.com/photo-1574484284002-952d92a03a05?w=400&q=80",
  "soups-stews": "https://images.unsplash.com/photo-1567982847191-a8c83f49e0cc?w=400&q=80",
  "swallows":    "https://images.unsplash.com/photo-1512058564366-18510be2db19?w=400&q=80",
  "proteins":    "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=400&q=80",
  "grills-bbq":  "https://images.unsplash.com/photo-1544025162-d76694265947?w=400&q=80",
  "small-chops": "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&q=80",
  "drinks":      "https://images.unsplash.com/photo-1563227812-0ea4c22e6cc8?w=400&q=80",
};

const CATEGORY_EMOJIS: Record<string, string> = {
  "rice-dishes": "🍚",
  "soups-stews": "🍲",
  "swallows":    "🫓",
  "proteins":    "🍗",
  "grills-bbq":  "🔥",
  "small-chops": "🥟",
  "drinks":      "🥤",
};

interface Props {
  categories: CategoryWithCount[];
}

export default function CategoriesSection({ categories }: Props) {
  if (categories.length === 0) return null;

  return (
    <section className="section-py bg-cream-50 bg-amber-50/50" aria-label="Menu categories">
      <div className="container-belle">
        <div className="text-center mb-10 md:mb-14">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-1.5 rounded-full bg-orange-100 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-orange-700 mb-3"
          >
            Browse by Category
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.05 }}
            className="section-title text-charcoal-800"
          >
            Find Your Favourite
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="section-subtitle mt-3 mx-auto"
          >
            From rice dishes to small chops — explore the full Belle Food menu.
          </motion.p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-4 md:gap-5">
          {categories.map((category, index) => (
            <CategoryCard key={category.id} category={category} index={index} />
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mt-8"
        >
          <Link href="/menu" className="btn-primary">
            View Full Menu
            <ArrowRight className="w-4 h-4" aria-hidden="true" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}

function CategoryCard({
  category,
  index,
}: {
  category: CategoryWithCount;
  index: number;
}) {
  const imgSrc =
    category.imageUrl ||
    CATEGORY_IMAGES[category.slug] ||
    "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&q=80";

  const emoji = CATEGORY_EMOJIS[category.slug] || "🍴";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.06 }}
    >
      <Link
        href={`/menu?category=${category.slug}`}
        className="group relative block overflow-hidden rounded-2xl aspect-square bg-charcoal-100 shadow-sm hover:shadow-lg transition-all duration-300"
        aria-label={`Browse ${category.name}`}
      >
        {/* Background image */}
        <Image
          src={imgSrc}
          alt={category.name}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-110"
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
        />
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-charcoal-900/80 via-charcoal-900/20 to-transparent" />

        {/* Content */}
        <div className="absolute bottom-0 left-0 right-0 p-3 md:p-4">
          <div className="text-2xl mb-1" aria-hidden="true">{emoji}</div>
          <h3 className="font-bold text-white text-sm md:text-base leading-tight">
            {category.name}
          </h3>
          {category._count.items > 0 && (
            <p className="text-xs text-white/70 mt-0.5">
              {category._count.items} {category._count.items === 1 ? "dish" : "dishes"}
            </p>
          )}
        </div>
      </Link>
    </motion.div>
  );
}
