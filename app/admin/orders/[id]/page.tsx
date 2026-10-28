import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { formatNaira } from "@/lib/utils";
import { formatDistanceToNow } from "date-fns";
import Link from "next/link";
import OrderStatusUpdater from "@/components/admin/OrderStatusUpdater";
import Image from "next/image";

export const metadata: Metadata = { title: "Order Detail" };
export const dynamic = "force-dynamic";

export default async function AdminOrderDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const order = await prisma.order.findUnique({
    where: { id: params.id },
    include: { items: { include: { menuItem: true } } },
  });

  if (!order) notFound();

  const STATUS_LABELS: Record<string, string> = {
    PENDING_CONFIRMATION: "Awaiting Confirmation",
    CONFIRMED: "Confirmed",
    PREPARING: "Preparing",
    READY: "Ready",
    OUT_FOR_DELIVERY: "Out for Delivery",
    COMPLETED: "Completed",
    CANCELLED: "Cancelled",
  };

  const PAYMENT_LABELS: Record<string, string> = {
    PENDING: "Pending",
    PAID: "Paid ✓",
    FAILED: "Failed",
    CANCELLED: "Cancelled",
    REFUNDED: "Refunded",
  };

  return (
    <div className="max-w-3xl">
      <div className="flex items-center gap-3 mb-6">
        <Link
          href="/admin/orders"
          className="text-sm text-charcoal-400 hover:text-charcoal-700"
        >
          ← Orders
        </Link>
        <span className="text-charcoal-300">/</span>
        <h1 className="text-lg font-extrabold text-charcoal-800">
          {order.reference}
        </h1>
      </div>

      <div className="grid md:grid-cols-2 gap-5">
        {/* Order details */}
        <div className="card p-5 space-y-4 md:col-span-2">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div>
              <p className="text-xs text-charcoal-400 mb-0.5">Reference</p>
              <p className="text-sm font-bold text-charcoal-800">{order.reference}</p>
            </div>
            <div>
              <p className="text-xs text-charcoal-400 mb-0.5">Placed</p>
              <p className="text-sm text-charcoal-700">
                {formatDistanceToNow(new Date(order.createdAt), { addSuffix: true })}
              </p>
            </div>
            <div>
              <p className="text-xs text-charcoal-400 mb-0.5">Fulfillment</p>
              <p className="text-sm text-charcoal-700 capitalize">
                {order.fulfillmentType.toLowerCase()}
              </p>
            </div>
            <div>
              <p className="text-xs text-charcoal-400 mb-0.5">Payment</p>
              <p className={`text-sm font-semibold ${
                order.paymentStatus === "PAID" ? "text-sage-700" :
                order.paymentStatus === "FAILED" ? "text-tomato-600" :
                "text-amber-700"
              }`}>
                {PAYMENT_LABELS[order.paymentStatus] || order.paymentStatus}
              </p>
            </div>
          </div>
        </div>

        {/* Customer info */}
        <div className="card p-5">
          <h2 className="text-sm font-bold text-charcoal-700 mb-3">Customer</h2>
          <div className="space-y-2 text-sm">
            <div>
              <span className="text-charcoal-400">Name: </span>
              <span className="text-charcoal-800">{order.customerName}</span>
            </div>
            <div>
              <span className="text-charcoal-400">Phone: </span>
              <a href={`tel:${order.customerPhone}`} className="text-tomato-600 hover:underline">
                {order.customerPhone}
              </a>
            </div>
            {order.customerEmail && (
              <div>
                <span className="text-charcoal-400">Email: </span>
                <span className="text-charcoal-800">{order.customerEmail}</span>
              </div>
            )}
            {order.deliveryAddress && (
              <div>
                <span className="text-charcoal-400">Address: </span>
                <span className="text-charcoal-800">{order.deliveryAddress}</span>
              </div>
            )}
            {order.deliveryArea && (
              <div>
                <span className="text-charcoal-400">Area: </span>
                <span className="text-charcoal-800">{order.deliveryArea}</span>
              </div>
            )}
            {order.customerNote && (
              <div className="mt-2 p-2 bg-amber-50 rounded-lg">
                <span className="text-xs text-amber-700 font-medium">Note: </span>
                <span className="text-xs text-amber-800">{order.customerNote}</span>
              </div>
            )}
          </div>
        </div>

        {/* Status updater */}
        <div className="card p-5">
          <h2 className="text-sm font-bold text-charcoal-700 mb-3">Update Status</h2>
          <div className="mb-3">
            <p className="text-xs text-charcoal-400 mb-1">Current status</p>
            <p className="text-sm font-semibold text-charcoal-800">
              {STATUS_LABELS[order.orderStatus] || order.orderStatus}
            </p>
          </div>
          <OrderStatusUpdater
            orderId={order.id}
            currentStatus={order.orderStatus}
          />
        </div>

        {/* Items */}
        <div className="card p-5 md:col-span-2">
          <h2 className="text-sm font-bold text-charcoal-700 mb-4">Items Ordered</h2>
          <div className="space-y-3">
            {order.items.map((item) => (
              <div key={item.id} className="flex gap-3 items-center">
                <div className="relative w-10 h-10 rounded-lg overflow-hidden bg-charcoal-100 shrink-0">
                  {item.menuItem.imageUrl ? (
                    <Image
                      src={item.menuItem.imageUrl}
                      alt={item.itemName}
                      fill
                      className="object-cover"
                      sizes="40px"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full text-sm">🍴</div>
                  )}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-charcoal-800">
                    {item.itemName} ×{item.quantity}
                  </p>
                  <p className="text-xs text-charcoal-400">
                    {formatNaira(item.unitPriceKobo)} each
                  </p>
                </div>
                <p className="text-sm font-semibold text-charcoal-700">
                  {formatNaira(item.totalKobo)}
                </p>
              </div>
            ))}
          </div>

          <div className="border-t border-charcoal-100 pt-3 mt-4 space-y-1.5">
            <div className="flex justify-between text-sm">
              <span className="text-charcoal-500">Subtotal</span>
              <span>{formatNaira(order.subtotalKobo)}</span>
            </div>
            {order.deliveryFeeKobo > 0 && (
              <div className="flex justify-between text-sm">
                <span className="text-charcoal-500">Delivery</span>
                <span>{formatNaira(order.deliveryFeeKobo)}</span>
              </div>
            )}
            <div className="flex justify-between font-bold text-charcoal-800">
              <span>Total</span>
              <span>{formatNaira(order.totalKobo)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
