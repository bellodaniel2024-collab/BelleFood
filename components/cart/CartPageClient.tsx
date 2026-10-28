"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight, AlertTriangle } from "lucide-react";
import { useState } from "react";
import { useCart } from "@/hooks/useCart";
import { formatNaira } from "@/lib/utils";
import { toast } from "sonner";

export default function CartPageClient() {
  const items = useCart((s) => s.items);
  const updateQuantity = useCart((s) => s.updateQuantity);
  const removeItem = useCart((s) => s.removeItem);
  const clearCart = useCart((s) => s.clearCart);
  const subtotalKobo = useCart((s) => s.subtotalKobo);
  const [clearConfirm, setClearConfirm] = useState(false);

  function handleRemove(menuItemId: string, name: string) {
    removeItem(menuItemId);
    toast.info(`${name} removed from cart`);
  }

  function handleClear() {
    if (!clearConfirm) {
      setClearConfirm(true);
      setTimeout(() => setClearConfirm(false), 3000);
      return;
    }
    clearCart();
    setClearConfirm(false);
    toast.info("Cart cleared");
  }

  if (items.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4 py-16">
        <div className="w-20 h-20 rounded-full bg-charcoal-50 flex items-center justify-center mb-5">
          <ShoppingBag className="w-9 h-9 text-charcoal-300" aria-hidden="true" />
        </div>
        <h1 className="text-2xl font-bold text-charcoal-800 mb-2">Your cart is empty</h1>
        <p className="text-charcoal-400 mb-6 max-w-sm">
          You haven&apos;t added anything yet. Browse our menu to get started.
        </p>
        <Link href="/menu" className="btn-primary">
          Browse Menu
          <ArrowRight className="w-4 h-4" aria-hidden="true" />
        </Link>
      </div>
    );
  }

  return (
    <div className="container-belle py-8 md:py-10">
      <div className="mb-6 md:mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-charcoal-800">
            Your Cart
          </h1>
          <p className="text-sm text-charcoal-400 mt-1">
            {items.reduce((s, i) => s + i.quantity, 0)} items
          </p>
        </div>
        <button
          onClick={handleClear}
          className={`text-xs font-medium px-3 py-1.5 rounded-full transition-colors ${
            clearConfirm
              ? "bg-tomato-100 text-tomato-700"
              : "text-charcoal-400 hover:text-charcoal-600 hover:bg-charcoal-50"
          }`}
          aria-label="Clear all cart items"
        >
          {clearConfirm ? "Confirm clear?" : "Clear cart"}
        </button>
      </div>

      <div className="grid lg:grid-cols-3 gap-6 lg:gap-8">
        {/* Items list */}
        <div className="lg:col-span-2 space-y-3">
          <AnimatePresence initial={false}>
            {items.map((item) => (
              <motion.div
                key={item.menuItemId}
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
                className="card p-4 flex gap-4"
              >
                {/* Image */}
                <div className="relative w-20 h-20 rounded-xl overflow-hidden shrink-0 bg-charcoal-100">
                  {item.imageUrl ? (
                    <Image
                      src={item.imageUrl}
                      alt={item.name}
                      fill
                      className="object-cover"
                      sizes="80px"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <span className="text-2xl" aria-hidden="true">🍴</span>
                    </div>
                  )}
                </div>

                {/* Details */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <h3 className="text-sm font-bold text-charcoal-800 leading-snug">
                      {item.name}
                    </h3>
                    <button
                      onClick={() => handleRemove(item.menuItemId, item.name)}
                      className="shrink-0 flex items-center justify-center w-7 h-7 rounded-full hover:bg-tomato-50 text-charcoal-300 hover:text-tomato-500 transition-colors"
                      aria-label={`Remove ${item.name} from cart`}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="flex items-center justify-between">
                    {/* Quantity controls */}
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() =>
                          updateQuantity(item.menuItemId, item.quantity - 1)
                        }
                        className="flex items-center justify-center w-7 h-7 rounded-full border border-charcoal-200 hover:border-charcoal-400 text-charcoal-600 transition-colors"
                        aria-label={`Decrease quantity of ${item.name}`}
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="text-sm font-semibold text-charcoal-700 w-5 text-center">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() =>
                          updateQuantity(item.menuItemId, item.quantity + 1)
                        }
                        disabled={item.quantity >= 20}
                        className="flex items-center justify-center w-7 h-7 rounded-full border border-charcoal-200 hover:border-charcoal-400 text-charcoal-600 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                        aria-label={`Increase quantity of ${item.name}`}
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>

                    {/* Item total */}
                    <span className="text-sm font-extrabold text-charcoal-800">
                      {formatNaira(item.priceKobo * item.quantity)}
                    </span>
                  </div>
                  <p className="text-xs text-charcoal-400 mt-1">
                    {formatNaira(item.priceKobo)} each
                  </p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Continue shopping */}
          <div className="pt-2">
            <Link
              href="/menu"
              className="text-sm font-medium text-tomato-600 hover:text-tomato-700 transition-colors"
            >
              ← Continue shopping
            </Link>
          </div>
        </div>

        {/* Order summary */}
        <div className="lg:col-span-1">
          <div className="card p-5 sticky top-24">
            <h2 className="text-base font-bold text-charcoal-800 mb-4">
              Order Summary
            </h2>

            <div className="space-y-2.5 mb-4">
              <div className="flex justify-between text-sm">
                <span className="text-charcoal-500">Subtotal</span>
                <span className="font-semibold text-charcoal-700">
                  {formatNaira(subtotalKobo)}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-charcoal-400 italic">Delivery</span>
                <span className="text-charcoal-400 italic text-xs">
                  Calculated at checkout
                </span>
              </div>
            </div>

            <div className="border-t border-charcoal-100 pt-3 mb-4">
              <div className="flex justify-between">
                <span className="font-semibold text-charcoal-700">Subtotal</span>
                <span className="font-extrabold text-charcoal-800 text-lg">
                  {formatNaira(subtotalKobo)}
                </span>
              </div>
            </div>

            {/* Notice */}
            <div className="flex gap-2 p-3 rounded-xl bg-amber-50 border border-amber-100 mb-4">
              <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" aria-hidden="true" />
              <p className="text-xs text-amber-700 leading-relaxed">
                Prices and availability are confirmed at checkout. Delivery fees depend on your area.
              </p>
            </div>

            <Link href="/checkout" className="btn-primary w-full">
              Proceed to Checkout
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
