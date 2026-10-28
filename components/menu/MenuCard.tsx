"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { ShoppingBag, Check } from "lucide-react";
import { useState } from "react";
import { useCart } from "@/hooks/useCart";
import { formatNaira } from "@/lib/utils";
import { toast } from "sonner";
import type { MenuItemWithCategory } from "@/types";

interface Props {
  item: MenuItemWithCategory;
  index?: number;
}

export default function MenuCard({ item, index = 0 }: Props) {
  const [justAdded, setJustAdded] = useState(false);
  const addItem = useCart((s) => s.addItem);

  function handleAddToCart() {
    if (!item.isAvailable || justAdded) return;
    addItem({
      menuItemId: item.id,
      name: item.name,
      priceKobo: item.priceKobo,
      imageUrl: item.imageUrl,
    });
    setJustAdded(true);
    toast.success(`${item.name} added to cart`, {
      action: { label: "View cart", onClick: () => window.location.href = "/cart" },
    });
    setTimeout(() => setJustAdded(false), 2000);
  }

  return (
    <motion.article
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: Math.min(index * 0.04, 0.3) }}
      className="group card card-hover overflow-hidden flex flex-col"
      role="listitem"
    >
      {/* Image */}
      <div className="relative h-44 overflow-hidden bg-charcoal-100">
        {item.imageUrl ? (
          <Image
            src={item.imageUrl}
            alt={item.name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            loading="lazy"
          />
        ) : (
          <div className="flex items-center justify-center h-full bg-gradient-to-br from-orange-50 to-amber-100">
            <span className="text-4xl" aria-hidden="true">🍴</span>
          </div>
        )}
        {/* Category tag */}
        <div className="absolute top-2.5 left-2.5">
          <span className="inline-flex rounded-full bg-white/90 backdrop-blur-sm px-2 py-0.5 text-[10px] font-semibold text-charcoal-600 shadow-sm">
            {item.category.name}
          </span>
        </div>
        {/* Unavailable */}
        {!item.isAvailable && (
          <div className="absolute inset-0 bg-charcoal-900/50 flex items-center justify-center">
            <span className="bg-white/90 rounded-full px-3 py-1 text-xs font-bold text-charcoal-700">
              Unavailable
            </span>
          </div>
        )}
      </div>

      {/* Body */}
      <div className="flex flex-col flex-1 p-4">
        <h3 className="text-sm font-bold text-charcoal-800 leading-snug mb-1 line-clamp-2">
          {item.name}
        </h3>
        {item.description && (
          <p className="text-xs text-charcoal-500 leading-relaxed line-clamp-2 flex-1 mb-3">
            {item.description}
          </p>
        )}
        {!item.description && <div className="flex-1" />}

        <div className="flex items-center justify-between mt-auto pt-2 border-t border-charcoal-50">
          <span className="text-base font-extrabold text-charcoal-800">
            {formatNaira(item.priceKobo)}
          </span>

          <button
            onClick={handleAddToCart}
            disabled={!item.isAvailable}
            className={`inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-semibold transition-all duration-200 active:scale-95 ${
              justAdded
                ? "bg-sage-600 text-white"
                : item.isAvailable
                ? "bg-tomato-600 hover:bg-tomato-700 text-white"
                : "bg-charcoal-100 text-charcoal-400 cursor-not-allowed"
            }`}
            aria-label={
              !item.isAvailable
                ? `${item.name} is unavailable`
                : justAdded
                ? `${item.name} added`
                : `Add ${item.name} to cart`
            }
          >
            {justAdded ? (
              <>
                <Check className="w-3 h-3" aria-hidden="true" />
                Added
              </>
            ) : (
              <>
                <ShoppingBag className="w-3 h-3" aria-hidden="true" />
                {item.isAvailable ? "Add" : "Unavailable"}
              </>
            )}
          </button>
        </div>
      </div>
    </motion.article>
  );
}
