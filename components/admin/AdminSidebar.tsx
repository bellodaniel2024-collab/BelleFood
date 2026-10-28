"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import {
  LayoutDashboard,
  ShoppingBag,
  UtensilsCrossed,
  Settings,
  LogOut,
  ChefHat,
  Menu,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { UserRole } from "@prisma/client";

interface Props {
  user: { name?: string | null; email?: string | null; role: UserRole };
}

const navItems = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/admin/orders", label: "Orders", icon: ShoppingBag },
  { href: "/admin/menu", label: "Menu", icon: UtensilsCrossed },
  { href: "/admin/settings", label: "Settings", icon: Settings },
];

export default function AdminSidebar({ user }: Props) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  function isActive(href: string, exact?: boolean) {
    if (exact) return pathname === href;
    return pathname.startsWith(href);
  }

  const sidebarContent = (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="flex items-center gap-2.5 px-4 py-5 border-b border-charcoal-700/50">
        <div className="flex items-center justify-center w-8 h-8 rounded-xl bg-tomato-700">
          <ChefHat className="w-4 h-4 text-white" aria-hidden="true" />
        </div>
        <div>
          <span className="text-base font-extrabold text-white tracking-tight leading-none block">
            BelleFood
          </span>
          <span className="text-[10px] text-charcoal-400 font-medium uppercase tracking-wider">
            Admin
          </span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-0.5" aria-label="Admin navigation">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            onClick={() => setMobileOpen(false)}
            className={cn(
              "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors",
              isActive(item.href, item.exact)
                ? "bg-tomato-700 text-white"
                : "text-charcoal-300 hover:bg-white/10 hover:text-white"
            )}
            aria-current={isActive(item.href, item.exact) ? "page" : undefined}
          >
            <item.icon className="w-4 h-4 shrink-0" aria-hidden="true" />
            {item.label}
          </Link>
        ))}
      </nav>

      {/* User info + logout */}
      <div className="border-t border-charcoal-700/50 p-3">
        <div className="flex items-center gap-2.5 px-2 py-2 mb-1">
          <div className="flex items-center justify-center w-7 h-7 rounded-full bg-charcoal-600 shrink-0">
            <span className="text-xs font-bold text-white">
              {user.name?.[0]?.toUpperCase() || "?"}
            </span>
          </div>
          <div className="min-w-0">
            <p className="text-xs font-semibold text-charcoal-100 truncate">
              {user.name || user.email}
            </p>
            <p className="text-[10px] text-charcoal-400 uppercase tracking-wider">
              {user.role.toLowerCase()}
            </p>
          </div>
        </div>
        <button
          onClick={() => signOut({ callbackUrl: "/" })}
          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm text-charcoal-400 hover:bg-white/10 hover:text-white transition-colors"
        >
          <LogOut className="w-4 h-4" aria-hidden="true" />
          Sign out
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden md:flex flex-col w-60 bg-charcoal-800 fixed inset-y-0 left-0 z-30 shadow-xl">
        {sidebarContent}
      </aside>

      {/* Mobile top bar */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-30 bg-charcoal-800 px-4 py-3 flex items-center justify-between border-b border-charcoal-700">
        <div className="flex items-center gap-2">
          <ChefHat className="w-4 h-4 text-tomato-400" aria-hidden="true" />
          <span className="text-sm font-bold text-white">Belle Food Admin</span>
        </div>
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="text-charcoal-300 hover:text-white p-1"
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
        >
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile drawer */}
      {mobileOpen && (
        <>
          <div
            className="md:hidden fixed inset-0 z-40 bg-black/60"
            onClick={() => setMobileOpen(false)}
            aria-hidden="true"
          />
          <aside className="md:hidden fixed top-0 left-0 bottom-0 z-50 w-60 bg-charcoal-800 shadow-2xl">
            {sidebarContent}
          </aside>
        </>
      )}
    </>
  );
}
