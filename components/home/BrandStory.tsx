"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Flame, Heart, Leaf } from "lucide-react";

const pillars = [
  {
    icon: Flame,
    title: "Authentic Flavours",
    description:
      "Every recipe has been tested and refined to deliver the true taste of Nigerian home cooking.",
  },
  {
    icon: Leaf,
    title: "Fresh Ingredients",
    description:
      "We source fresh produce daily to ensure every dish is prepared at its best.",
  },
  {
    icon: Heart,
    title: "Made with Love",
    description:
      "Food brings people together. We cook every order like it is for family.",
  },
];

export default function BrandStory() {
  return (
    <section
      className="section-py bg-gradient-to-br from-charcoal-800 via-charcoal-800 to-charcoal-900 relative overflow-hidden"
      aria-label="About Belle Food"
    >
      {/* Background texture */}
      <div className="absolute inset-0 bg-dots opacity-5 pointer-events-none" aria-hidden="true" />

      <div className="container-belle relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">

          {/* Image collage */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative"
          >
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-3">
                <div className="food-img h-48 rounded-2xl overflow-hidden">
                  <Image
                    src="https://images.unsplash.com/photo-1567982847191-a8c83f49e0cc?w=400&q=80"
                    alt="Rich egusi soup in a bowl"
                    fill
                    className="object-cover"
                    sizes="200px"
                  />
                </div>
                <div className="food-img h-32 rounded-2xl overflow-hidden">
                  <Image
                    src="https://images.unsplash.com/photo-1544025162-d76694265947?w=400&q=80"
                    alt="Skewered suya with spice rub"
                    fill
                    className="object-cover"
                    sizes="200px"
                  />
                </div>
              </div>
              <div className="space-y-3 pt-6">
                <div className="food-img h-32 rounded-2xl overflow-hidden">
                  <Image
                    src="https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&q=80"
                    alt="Small chops — puff puff and spring rolls"
                    fill
                    className="object-cover"
                    sizes="200px"
                  />
                </div>
                <div className="food-img h-48 rounded-2xl overflow-hidden">
                  <Image
                    src="https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=400&q=80"
                    alt="Peppered chicken pieces"
                    fill
                    className="object-cover"
                    sizes="200px"
                  />
                </div>
              </div>
            </div>

            {/* Floating badge */}
            <motion.div
              animate={{ y: [0, -6, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -bottom-4 -right-4 bg-tomato-600 text-white rounded-2xl px-5 py-3 shadow-xl"
              aria-hidden="true"
            >
              <div className="text-2xl font-extrabold leading-none">100%</div>
              <div className="text-xs font-medium opacity-90 mt-0.5">Authentic</div>
            </motion.div>
          </motion.div>

          {/* Copy */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <div className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-orange-300 mb-4">
              Our Story
            </div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-white leading-tight tracking-tight mb-5">
              Cooking from the{" "}
              <span className="text-orange-400">Heart of Nigeria</span>
            </h2>
            <p className="text-base text-charcoal-300 leading-relaxed mb-5">
              Belle Food was born from a simple belief: that Nigerian cuisine deserves to
              be experienced in all its vibrant, bold, and comforting glory. We bring the
              warmth of a Nigerian kitchen to your table — wherever you are.
            </p>
            <p className="text-base text-charcoal-400 leading-relaxed mb-8">
              {/* Placeholder copy — update with the restaurant owner's real story */}
              Every dish is prepared fresh, seasoned generously, and served with the
              kind of care that only comes from people who truly love what they cook.
            </p>

            {/* Pillars */}
            <div className="space-y-4 mb-8">
              {pillars.map((pillar) => (
                <div key={pillar.title} className="flex gap-3">
                  <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-white/10 shrink-0">
                    <pillar.icon className="w-4.5 h-4.5 text-orange-400" aria-hidden="true" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-white mb-0.5">
                      {pillar.title}
                    </h3>
                    <p className="text-sm text-charcoal-400 leading-relaxed">
                      {pillar.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <Link href="/about" className="btn-outline-cream">
              Learn More About Us
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
