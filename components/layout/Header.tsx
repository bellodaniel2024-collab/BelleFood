"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ShoppingBag, Menu, X, ChefHat } from "lucide-react";
import { useCart } from "@/hooks/useCart";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

const navLinks = [
  { href: "/",        label: "Home" },
  { href: "/menu",    label: "Our Menu" },
  { href: "/order",   label: "Order Online" },
  { href: "/about",   label: "About" },
  { href: "/contact", label: "Contact" },
];

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();
  const items = useCart((s) => s.items);
  const totalItems = items.reduce((s, i) => s + i.quantity, 0);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  const isHome = pathname === "/";

  return (
    <>
      <header
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
          isScrolled || !isHome
            ? "bg-white shadow-sm border-b border-charcoal-100"
            : "bg-transparent"
        )}
      >
        <div className="container-belle">
          <div className="flex h-16 md:h-18 items-center justify-between gap-4">
            {/* Logo */}
            <Link
              href="/"
              className="flex items-center gap-2 shrink-0 group"
              aria-label="Belle Food Home"
            >
              <div className={cn(
                "flex items-center justify-center w-9 h-9 rounded-xl transition-colors",
                isScrolled || !isHome ? "bg-tomato-700" : "bg-white/20 backdrop-blur-sm"
              )}>
                <ChefHat
                  className={cn(
                    "w-5 h-5",
                    isScrolled || !isHome ? "text-white" : "text-white"
                  )}
                  aria-hidden="true"
                />
              </div>
              <span className={cn(
                "text-xl font-extrabold tracking-tight transition-colors",
                isScrolled || !isHome ? "text-charcoal-800" : "text-white"
              )}>
                Belle<span className={cn(
                  "transition-colors",
                  isScrolled || !isHome ? "text-tomato-600" : "text-orange-300"
                )}>Food</span>
              </span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-1" aria-label="Main navigation">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                    pathname === link.href
                      ? (isScrolled || !isHome ? "text-tomato-600 bg-tomato-50" : "text-white bg-white/20")
                      : (isScrolled || !isHome ? "text-charcoal-600 hover:text-tomato-600 hover:bg-tomato-50" : "text-white/80 hover:text-white hover:bg-white/10")
                  )}
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* Right actions */}
            <div className="flex items-center gap-2">
              {/* Cart */}
              <Link
                href="/cart"
                className={cn(
                  "relative flex items-center justify-center w-10 h-10 rounded-full transition-colors",
                  isScrolled || !isHome
                    ? "text-charcoal-600 hover:bg-charcoal-50 hover:text-tomato-600"
                    : "text-white hover:bg-white/10"
                )}
                aria-label={`Shopping cart — ${totalItems} items`}
              >
                <ShoppingBag className="w-5 h-5" aria-hidden="true" />
                {totalItems > 0 && (
                  <motion.span
                    key={totalItems}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-0.5 -right-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-tomato-600 text-[10px] font-bold text-white"
                    aria-hidden="true"
                  >
                    {totalItems > 9 ? "9+" : totalItems}
                  </motion.span>
                )}
              </Link>

              {/* Order Now CTA (desktop) */}
              <Link
                href="/order"
                className={cn(
                  "hidden md:inline-flex items-center gap-1.5 rounded-full px-5 py-2 text-sm font-semibold transition-all duration-200 active:scale-95",
                  isScrolled || !isHome
                    ? "bg-tomato-700 text-white hover:bg-tomato-800 shadow-sm hover:shadow"
                    : "bg-white text-tomato-700 hover:bg-white/95"
                )}
              >
                Order Now
              </Link>

              {/* Mobile menu toggle */}
              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className={cn(
                  "md:hidden flex items-center justify-center w-10 h-10 rounded-full transition-colors",
                  isScrolled || !isHome
                    ? "text-charcoal-600 hover:bg-charcoal-50"
                    : "text-white hover:bg-white/10"
                )}
                aria-label={mobileOpen ? "Close menu" : "Open menu"}
                aria-expanded={mobileOpen}
                aria-controls="mobile-menu"
              >
                {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile menu overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-40 bg-charcoal-900/50 backdrop-blur-sm md:hidden"
              onClick={() => setMobileOpen(false)}
              aria-hidden="true"
            />
            <motion.div
              id="mobile-menu"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 28, stiffness: 250 }}
              className="fixed top-0 right-0 bottom-0 z-50 w-80 max-w-full bg-white shadow-2xl md:hidden flex flex-col"
              aria-label="Mobile navigation"
            >
              {/* Mobile header */}
              <div className="flex items-center justify-between px-5 py-4 border-b border-charcoal-100">
                <div className="flex items-center gap-2">
                  <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-tomato-700">
                    <ChefHat className="w-4 h-4 text-white" aria-hidden="true" />
                  </div>
                  <span className="text-lg font-extrabold text-charcoal-800">
                    Belle<span className="text-tomato-600">Food</span>
                  </span>
                </div>
                <button
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center justify-center w-9 h-9 rounded-full hover:bg-charcoal-50 text-charcoal-500"
                  aria-label="Close menu"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Mobile nav links */}
              <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto" aria-label="Mobile navigation">
                {navLinks.map((link, i) => (
                  <motion.div
                    key={link.href}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 + 0.1 }}
                  >
                    <Link
                      href={link.href}
                      className={cn(
                        "flex items-center px-4 py-3 rounded-xl text-base font-medium transition-colors",
                        pathname === link.href
                          ? "bg-tomato-50 text-tomato-700"
                          : "text-charcoal-600 hover:bg-charcoal-50 hover:text-charcoal-900"
                      )}
                    >
                      {link.label}
                    </Link>
                  </motion.div>
                ))}
              </nav>

              {/* Mobile CTA */}
              <div className="p-4 border-t border-charcoal-100 space-y-2">
                <Link
                  href="/order"
                  className="btn-primary w-full text-center"
                >
                  Order Now
                </Link>
                <Link
                  href="/cart"
                  className="flex items-center justify-center gap-2 w-full rounded-full border-2 border-charcoal-200 py-2.5 text-sm font-semibold text-charcoal-600 hover:border-charcoal-300 transition-colors"
                >
                  <ShoppingBag className="w-4 h-4" />
                  Cart {totalItems > 0 && `(${totalItems})`}
                </Link>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
