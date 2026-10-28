"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Phone } from "lucide-react";

export default function OrderCTA() {
  return (
    <section
      className="relative overflow-hidden bg-gradient-to-br from-tomato-700 via-tomato-600 to-orange-500 section-py"
      aria-label="Order online call to action"
    >
      {/* Decorative circles */}
      <div
        className="absolute top-0 right-0 w-96 h-96 rounded-full bg-white/5 translate-x-1/3 -translate-y-1/3 pointer-events-none"
        aria-hidden="true"
      />
      <div
        className="absolute bottom-0 left-0 w-72 h-72 rounded-full bg-black/10 -translate-x-1/4 translate-y-1/4 pointer-events-none"
        aria-hidden="true"
      />

      <div className="container-belle relative z-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <p className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-white/90 mb-5">
            Ready to Order?
          </p>
          <h2 className="section-title text-white mb-4 max-w-2xl mx-auto">
            Your Next Favourite Meal is One Click Away
          </h2>
          <p className="text-base md:text-lg text-white/80 max-w-xl mx-auto mb-8 leading-relaxed">
            Browse our full menu, build your order, and enjoy fresh Nigerian food
            delivered to your door or ready for pickup.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/order"
              className="inline-flex items-center gap-2 rounded-full bg-white text-tomato-700 hover:bg-white/95 px-7 py-3.5 text-sm font-bold shadow-lg hover:shadow-xl transition-all duration-200 active:scale-95"
            >
              Order Now
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </Link>
            <Link
              href="/menu"
              className="inline-flex items-center gap-2 rounded-full border-2 border-white/50 hover:border-white text-white hover:bg-white/10 px-7 py-3.5 text-sm font-semibold transition-all duration-200"
            >
              Browse Menu
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
