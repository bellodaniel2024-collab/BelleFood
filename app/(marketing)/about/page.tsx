import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Flame, Heart, Leaf, Award, ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "About Us",
  description: "Learn about Belle Food — our story, our values, and our passion for authentic Nigerian cuisine.",
};

export default function AboutPage() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <div className="bg-gradient-to-br from-charcoal-800 to-charcoal-900 pt-24 pb-14 md:pt-32 md:pb-20">
        <div className="container-belle text-center">
          <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-4 tracking-tight">
            About <span className="text-orange-400">Belle Food</span>
          </h1>
          <p className="text-charcoal-300 text-base md:text-lg max-w-xl mx-auto leading-relaxed">
            Authentic Nigerian flavours, prepared fresh, served with pride.
          </p>
        </div>
      </div>

      {/* Story */}
      <section className="section-py bg-white">
        <div className="container-belle">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-1.5 rounded-full bg-orange-50 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-orange-600 mb-4">
                Our Story
              </div>
              <h2 className="text-3xl md:text-4xl font-extrabold text-charcoal-800 mb-5 leading-tight">
                Food Made with Purpose
              </h2>
              <p className="text-charcoal-500 leading-relaxed mb-4">
                Belle Food was built on a simple belief: everyone deserves access to
                genuine, nourishing Nigerian home cooking — not just the generic version,
                but the real thing. The kind that brings families to the table and makes
                occasions memorable.
              </p>
              <p className="text-charcoal-400 leading-relaxed mb-6">
                {/* Placeholder — replace with the actual restaurant story before launch */}
                Every ingredient is carefully sourced, every recipe time-tested, every
                portion prepared as though it were going to our own families. That
                commitment to quality is what Belle Food is built on.
              </p>
              <Link href="/menu" className="btn-primary">
                Explore Our Menu
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="relative h-80 md:h-[400px] rounded-3xl overflow-hidden shadow-xl">
              <Image
                src="https://images.unsplash.com/photo-1574484284002-952d92a03a05?w=800&q=85"
                alt="Vibrant Nigerian food spread"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="section-py bg-amber-50/40">
        <div className="container-belle">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-extrabold text-charcoal-800 mb-3">
              What We Stand For
            </h2>
          </div>
          <div className="grid sm:grid-cols-3 gap-6">
            {[
              {
                icon: Flame,
                title: "Authentic Flavours",
                description:
                  "Our recipes are rooted in Nigerian culinary tradition — not adapted for convenience, but crafted for genuine taste.",
              },
              {
                icon: Leaf,
                title: "Fresh Every Day",
                description:
                  "We prepare our dishes fresh. No reheated leftovers, no shortcuts — just food made with care.",
              },
              {
                icon: Heart,
                title: "Community First",
                description:
                  "Food is love. We cook for our community and take pride in the connections our food helps build.",
              },
            ].map((v) => (
              <div key={v.title} className="card p-6 text-center">
                <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-tomato-50 mx-auto mb-4">
                  <v.icon className="w-6 h-6 text-tomato-600" aria-hidden="true" />
                </div>
                <h3 className="font-bold text-charcoal-800 mb-2">{v.title}</h3>
                <p className="text-sm text-charcoal-500 leading-relaxed">
                  {v.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-py bg-charcoal-800">
        <div className="container-belle text-center">
          <h2 className="text-3xl font-extrabold text-white mb-4">
            Ready to taste Belle Food?
          </h2>
          <p className="text-charcoal-300 mb-7 max-w-md mx-auto">
            Browse our menu and place your order online for delivery or pickup.
          </p>
          <Link href="/order" className="inline-flex items-center gap-2 rounded-full bg-tomato-600 hover:bg-tomato-700 text-white px-7 py-3.5 text-sm font-bold transition-all">
            Order Now
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}
