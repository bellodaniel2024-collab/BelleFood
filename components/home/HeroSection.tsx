"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Star, Clock, MapPin } from "lucide-react";

export default function HeroSection() {
  return (
    <section
      className="relative min-h-screen flex items-center overflow-hidden bg-charcoal-800"
      aria-label="Welcome to Belle Food"
    >
      {/* Background image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="https://images.unsplash.com/photo-1574484284002-952d92a03a05?w=1600&q=85"
          alt="Vibrant Nigerian party jollof rice with assorted proteins"
          fill
          className="object-cover object-center"
          priority
          sizes="100vw"
        />
        {/* Layered gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-charcoal-900/90 via-charcoal-900/60 to-charcoal-900/20" />
        <div className="absolute inset-0 bg-gradient-to-t from-charcoal-900/80 via-transparent to-transparent" />
      </div>

      {/* Decorative elements */}
      <motion.div
        className="absolute top-24 right-[10%] w-64 h-64 rounded-full bg-orange-500/10 blur-3xl pointer-events-none"
        animate={{ scale: [1, 1.1, 1], opacity: [0.5, 0.7, 0.5] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        aria-hidden="true"
      />
      <motion.div
        className="absolute bottom-24 right-[20%] w-48 h-48 rounded-full bg-tomato-600/15 blur-2xl pointer-events-none"
        animate={{ scale: [1, 1.15, 1], opacity: [0.4, 0.6, 0.4] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        aria-hidden="true"
      />

      <div className="container-belle relative z-10 pt-20 pb-16 md:pt-28 md:pb-20">
        <div className="max-w-2xl">
          {/* Tagline pill */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 px-4 py-1.5 mb-6"
          >
            <span className="flex h-2 w-2 rounded-full bg-orange-400 animate-pulse" aria-hidden="true" />
            <span className="text-sm font-medium text-white/90">
              Authentic Nigerian Cuisine
            </span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-extrabold text-white leading-[1.1] tracking-tight mb-6"
          >
            Nigerian Flavours{" "}
            <span className="block text-gradient-gold bg-gradient-to-r from-orange-400 to-gold-400 bg-clip-text text-transparent">
              Worth Savouring
            </span>
          </motion.h1>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-base md:text-lg text-white/75 leading-relaxed mb-8 max-w-xl"
          >
            From smoky party jollof to bold pepper soups — every dish at Belle Food
            is crafted with the finest ingredients and time-honoured recipes.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-wrap gap-3 mb-10"
          >
            <Link
              href="/order"
              className="inline-flex items-center gap-2 rounded-full bg-tomato-600 hover:bg-tomato-700 text-white px-7 py-3.5 text-sm font-semibold shadow-lg hover:shadow-xl transition-all duration-200 active:scale-95"
            >
              Order Now
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </Link>
            <Link
              href="/menu"
              className="inline-flex items-center gap-2 rounded-full border-2 border-white/40 hover:border-white/70 text-white hover:bg-white/10 px-7 py-3.5 text-sm font-semibold transition-all duration-200"
            >
              Explore Menu
            </Link>
          </motion.div>

          {/* Trust signals */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="flex flex-wrap gap-5"
          >
            <div className="flex items-center gap-1.5 text-white/60">
              <Star className="w-4 h-4 fill-gold-400 text-gold-400" aria-hidden="true" />
              <span className="text-sm">Authentic recipes</span>
            </div>
            <div className="flex items-center gap-1.5 text-white/60">
              <Clock className="w-4 h-4 text-orange-400" aria-hidden="true" />
              <span className="text-sm">Fresh daily</span>
            </div>
            <div className="flex items-center gap-1.5 text-white/60">
              <MapPin className="w-4 h-4 text-orange-400" aria-hidden="true" />
              <span className="text-sm">Delivery & pickup</span>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        aria-hidden="true"
      >
        <span className="text-xs text-white/40 uppercase tracking-widest">Scroll</span>
        <motion.div
          className="w-0.5 h-8 bg-white/20 rounded-full overflow-hidden"
        >
          <motion.div
            className="w-full h-3 bg-white/60 rounded-full"
            animate={{ y: ["-100%", "400%"] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          />
        </motion.div>
      </motion.div>
    </section>
  );
}
