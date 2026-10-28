"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ShoppingBag, Star, ArrowRight } from "lucide-react";
import { useCart } from "@/hooks/useCart";
import { formatNaira } from "@/lib/utils";
import { toast } from "sonner";
import type { MenuItemWithCategory } from "@/types";

interface Props {
  items: MenuItemWithCategory[];
}

export default function FeaturedDishes({ items }: Props) {
  if (items.length === 0) {
    return null; // No featured items configured yet
  }

  return (
    <section className="section-py bg-white" aria-label="Featured dishes">
      <div className="container-belle">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10 md:mb-14">
          <div>
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-1.5 rounded-full bg-tomato-50 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-tomato-600 mb-3"
            >
              <Star className="w-3 h-3 fill-tomato-400 text-tomato-400" aria-hidden="true" />
              Chef&apos;s Selection
            </motion.div>
            <motion.h2
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.05 }}
              className="section-title text-charcoal-800"
            >
              Dishes to Love
            </motion.h2>
          </div>
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <Link
              href="/menu"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-tomato-600 hover:text-tomato-700 transition-colors group"
            >
              View full menu
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
            </Link>
          </motion.div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
          {items.map((item, index) => (
            <FeaturedCard key={item.id} item={item} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}

function FeaturedCard({
  item,
  index,
}: {
  item: MenuItemWithCategory;
  index: number;
}) {
  const addItem = useCart((s) => s.addItem);

  function handleAddToCart() {
    addItem({
      menuItemId: item.id,
      name: item.name,
      priceKobo: item.priceKobo,
      imageUrl: item.imageUrl,
    });
    toast.success(`${item.name} added to cart`);
  }

  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.08 }}
      className="group card card-hover overflow-hidden flex flex-col"
    >
      {/* Image */}
      <div className="relative h-52 overflow-hidden bg-charcoal-100">
        {item.imageUrl ? (
          <Image
            src={item.imageUrl}
            alt={item.name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        ) : (
          <div className="flex items-center justify-center h-full bg-gradient-to-br from-orange-100 to-tomato-100">
            <span className="text-5xl" aria-hidden="true">🍽️</span>
          </div>
        )}
        {/* Category badge */}
        <div className="absolute top-3 left-3">
          <span className="inline-flex rounded-full bg-white/90 backdrop-blur-sm px-2.5 py-0.5 text-xs font-semibold text-charcoal-700 shadow-sm">
            {item.category.name}
          </span>
        </div>
        {/* Unavailable overlay */}
        {!item.isAvailable && (
          <div className="absolute inset-0 bg-charcoal-900/60 flex items-center justify-center">
            <span className="bg-white/90 rounded-full px-3 py-1 text-xs font-semibold text-charcoal-700">
              Not Available
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col p-4">
        <h3 className="font-bold text-charcoal-800 text-base mb-1 leading-snug">
          {item.name}
        </h3>
        {item.description && (
          <p className="text-sm text-charcoal-500 leading-relaxed mb-3 line-clamp-2 flex-1">
            {item.description}
          </p>
        )}
        <div className="flex items-center justify-between mt-auto pt-2">
          <span className="text-lg font-extrabold text-charcoal-800">
            {formatNaira(item.priceKobo)}
          </span>
          <button
            onClick={handleAddToCart}
            disabled={!item.isAvailable}
            className="inline-flex items-center gap-1.5 rounded-full bg-tomato-600 hover:bg-tomato-700 disabled:bg-charcoal-200 disabled:cursor-not-allowed text-white px-4 py-2 text-xs font-semibold transition-all duration-200 active:scale-95"
            aria-label={`Add ${item.name} to cart`}
          >
            <ShoppingBag className="w-3.5 h-3.5" aria-hidden="true" />
            {item.isAvailable ? "Add" : "Unavailable"}
          </button>
        </div>
      </div>
    </motion.article>
  );
}
