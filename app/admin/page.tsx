import type { Metadata } from "next";
import { getAdminDashboardStats, getAdminOrders } from "@/actions/admin.actions";
import { formatNaira } from "@/lib/utils";
import Link from "next/link";
import {
  ShoppingBag,
  Clock,
  CheckCircle,
  ChefHat,
  TrendingUp,
  ArrowRight,
  AlertCircle,
} from "lucide-react";
import AdminOrdersTable from "@/components/admin/AdminOrdersTable";

export const metadata: Metadata = { title: "Dashboard" };
export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  const [stats, { orders: recentOrders }] = await Promise.all([
    getAdminDashboardStats(),
    getAdminOrders({ limit: 10 }),
  ]);

  const statCards = [
    {
      label: "Orders Today",
      value: stats.ordersToday,
      icon: ShoppingBag,
      color: "blue",
    },
    {
      label: "Awaiting Confirmation",
      value: stats.pendingOrders,
      icon: AlertCircle,
      color: "amber",
      href: "/admin/orders?status=PENDING_CONFIRMATION",
    },
    {
      label: "Being Prepared",
      value: stats.preparingOrders,
      icon: ChefHat,
      color: "orange",
      href: "/admin/orders?status=PREPARING",
    },
    {
      label: "Ready",
      value: stats.readyOrders,
      icon: CheckCircle,
      color: "green",
      href: "/admin/orders?status=READY",
    },
    {
      label: "Completed Today",
      value: stats.completedOrdersToday,
      icon: TrendingUp,
      color: "sage",
    },
    {
      label: "Revenue Today",
      value: formatNaira(stats.revenueToday),
      icon: TrendingUp,
      color: "tomato",
      note: "Verified payments only",
    },
    {
      label: "Revenue This Month",
      value: formatNaira(stats.revenueThisMonth),
      icon: TrendingUp,
      color: "tomato",
      note: "Verified payments only",
    },
  ];

  const colorMap: Record<string, string> = {
    blue:   "bg-blue-50 text-blue-600",
    amber:  "bg-amber-50 text-amber-600",
    orange: "bg-orange-50 text-orange-600",
    green:  "bg-green-50 text-green-600",
    sage:   "bg-sage-50 text-sage-600",
    tomato: "bg-tomato-50 text-tomato-600",
  };

  return (
    <div className="max-w-7xl">
      <div className="mb-6">
        <h1 className="text-2xl font-extrabold text-charcoal-800">Dashboard</h1>
        <p className="text-sm text-charcoal-400 mt-1">
          Live operational overview for Belle Food
        </p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 mb-8">
        {statCards.map((card) => {
          const content = (
            <div className="card p-4 h-full hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-3">
                <div className={`flex items-center justify-center w-9 h-9 rounded-xl ${colorMap[card.color]}`}>
                  <card.icon className="w-4.5 h-4.5" aria-hidden="true" />
                </div>
                {card.href && (
                  <ArrowRight className="w-3.5 h-3.5 text-charcoal-300" aria-hidden="true" />
                )}
              </div>
              <div className="text-2xl font-extrabold text-charcoal-800 mb-0.5">
                {card.value}
              </div>
              <div className="text-xs text-charcoal-500 font-medium">{card.label}</div>
              {card.note && (
                <div className="text-[10px] text-charcoal-400 mt-0.5">{card.note}</div>
              )}
            </div>
          );

          return card.href ? (
            <Link key={card.label} href={card.href} className="block">
              {content}
            </Link>
          ) : (
            <div key={card.label}>{content}</div>
          );
        })}
      </div>

      {/* Pending orders alert */}
      {stats.pendingOrders > 0 && (
        <div className="flex items-center gap-3 p-4 rounded-2xl bg-amber-50 border border-amber-200 mb-6">
          <AlertCircle className="w-5 h-5 text-amber-500 shrink-0" aria-hidden="true" />
          <div className="flex-1">
            <p className="text-sm font-semibold text-amber-800">
              {stats.pendingOrders} order{stats.pendingOrders > 1 ? "s" : ""} awaiting confirmation
            </p>
            <p className="text-xs text-amber-600 mt-0.5">
              Confirm promptly so the kitchen can begin preparing.
            </p>
          </div>
          <Link
            href="/admin/orders?status=PENDING_CONFIRMATION"
            className="shrink-0 text-xs font-semibold text-amber-700 hover:text-amber-900 underline"
          >
            Review now
          </Link>
        </div>
      )}

      {/* Recent orders */}
      <div className="card overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-charcoal-100">
          <h2 className="text-base font-bold text-charcoal-800">Recent Orders</h2>
          <Link
            href="/admin/orders"
            className="text-xs font-semibold text-tomato-600 hover:text-tomato-700"
          >
            View all
          </Link>
        </div>
        <AdminOrdersTable orders={recentOrders} compact />
      </div>
    </div>
  );
}
