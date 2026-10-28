"use client";

import Link from "next/link";
import { formatNaira } from "@/lib/utils";
import { formatDistanceToNow } from "date-fns";
import type { Order } from "@prisma/client";

const ORDER_STATUS_COLORS: Record<string, string> = {
  PENDING_CONFIRMATION: "badge-pending",
  CONFIRMED:            "badge-blue",
  PREPARING:            "badge-orange",
  READY:                "badge-success",
  OUT_FOR_DELIVERY:     "bg-purple-100 text-purple-800",
  COMPLETED:            "badge-success",
  CANCELLED:            "badge-error",
};

const ORDER_STATUS_LABELS: Record<string, string> = {
  PENDING_CONFIRMATION: "Pending",
  CONFIRMED:            "Confirmed",
  PREPARING:            "Preparing",
  READY:                "Ready",
  OUT_FOR_DELIVERY:     "Delivering",
  COMPLETED:            "Done",
  CANCELLED:            "Cancelled",
};

const PAYMENT_STATUS_COLORS: Record<string, string> = {
  PENDING:   "badge-pending",
  PAID:      "badge-success",
  FAILED:    "badge-error",
  CANCELLED: "badge-gray",
  REFUNDED:  "badge-blue",
};

interface Props {
  orders: Order[];
  compact?: boolean;
}

export default function AdminOrdersTable({ orders, compact }: Props) {
  if (orders.length === 0) {
    return (
      <div className="text-center py-10">
        <p className="text-sm text-charcoal-400">No orders yet</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-charcoal-100" aria-label="Orders table">
        <thead>
          <tr className="bg-charcoal-50">
            <th scope="col" className="px-4 py-3 text-left text-xs font-semibold text-charcoal-500 uppercase tracking-wider">
              Reference
            </th>
            <th scope="col" className="px-4 py-3 text-left text-xs font-semibold text-charcoal-500 uppercase tracking-wider">
              Customer
            </th>
            {!compact && (
              <th scope="col" className="px-4 py-3 text-left text-xs font-semibold text-charcoal-500 uppercase tracking-wider">
                Type
              </th>
            )}
            <th scope="col" className="px-4 py-3 text-left text-xs font-semibold text-charcoal-500 uppercase tracking-wider">
              Status
            </th>
            <th scope="col" className="px-4 py-3 text-left text-xs font-semibold text-charcoal-500 uppercase tracking-wider">
              Payment
            </th>
            <th scope="col" className="px-4 py-3 text-right text-xs font-semibold text-charcoal-500 uppercase tracking-wider">
              Total
            </th>
            <th scope="col" className="px-4 py-3 text-left text-xs font-semibold text-charcoal-500 uppercase tracking-wider">
              Time
            </th>
            <th scope="col" className="px-4 py-3">
              <span className="sr-only">Actions</span>
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-charcoal-50 bg-white">
          {orders.map((order) => (
            <tr key={order.id} className="hover:bg-charcoal-50/50 transition-colors">
              <td className="px-4 py-3 text-sm font-bold text-charcoal-800 whitespace-nowrap">
                {order.reference}
              </td>
              <td className="px-4 py-3">
                <div className="text-sm font-medium text-charcoal-700">
                  {order.customerName}
                </div>
                <div className="text-xs text-charcoal-400">{order.customerPhone}</div>
              </td>
              {!compact && (
                <td className="px-4 py-3 text-xs text-charcoal-500 capitalize whitespace-nowrap">
                  {order.fulfillmentType.toLowerCase()}
                </td>
              )}
              <td className="px-4 py-3 whitespace-nowrap">
                <span className={`badge ${ORDER_STATUS_COLORS[order.orderStatus] || "badge-gray"}`}>
                  {ORDER_STATUS_LABELS[order.orderStatus] || order.orderStatus}
                </span>
              </td>
              <td className="px-4 py-3 whitespace-nowrap">
                <span className={`badge ${PAYMENT_STATUS_COLORS[order.paymentStatus] || "badge-gray"}`}>
                  {order.paymentStatus}
                </span>
              </td>
              <td className="px-4 py-3 text-sm font-semibold text-charcoal-700 text-right whitespace-nowrap">
                {formatNaira(order.totalKobo)}
              </td>
              <td className="px-4 py-3 text-xs text-charcoal-400 whitespace-nowrap">
                {formatDistanceToNow(new Date(order.createdAt), { addSuffix: true })}
              </td>
              <td className="px-4 py-3 text-right">
                <Link
                  href={`/admin/orders/${order.id}`}
                  className="text-xs font-semibold text-tomato-600 hover:text-tomato-800 whitespace-nowrap"
                >
                  View →
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
