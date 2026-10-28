"use client";

import { CheckCircle, Clock, AlertCircle, Phone, ArrowRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { formatNaira } from "@/lib/utils";
import type { Order, OrderItem, MenuItem } from "@prisma/client";

type OrderWithItems = Order & {
  items: (OrderItem & { menuItem: MenuItem })[];
};

interface Props {
  order: OrderWithItems;
  paymentPending?: boolean;
}

const STATUS_LABELS: Record<string, string> = {
  PENDING_CONFIRMATION: "Awaiting Confirmation",
  CONFIRMED: "Confirmed",
  PREPARING: "Being Prepared",
  READY: "Ready",
  OUT_FOR_DELIVERY: "Out for Delivery",
  COMPLETED: "Completed",
  CANCELLED: "Cancelled",
};

const PAYMENT_STATUS_LABELS: Record<string, string> = {
  PENDING: "Payment Pending",
  PAID: "Payment Confirmed",
  FAILED: "Payment Failed",
  CANCELLED: "Payment Cancelled",
  REFUNDED: "Refunded",
};

export default function OrderConfirmation({ order, paymentPending }: Props) {
  const isPaid = order.paymentStatus === "PAID";
  const isPaymentFailed = order.paymentStatus === "FAILED";

  return (
    <div className="container-belle max-w-2xl py-10 md:py-14">
      {/* Status icon */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        className="flex flex-col items-center text-center mb-8"
      >
        {isPaymentFailed ? (
          <div className="w-16 h-16 rounded-full bg-tomato-100 flex items-center justify-center mb-4">
            <AlertCircle className="w-8 h-8 text-tomato-600" />
          </div>
        ) : paymentPending ? (
          <div className="w-16 h-16 rounded-full bg-amber-100 flex items-center justify-center mb-4">
            <Clock className="w-8 h-8 text-amber-600" />
          </div>
        ) : (
          <div className="w-16 h-16 rounded-full bg-sage-100 flex items-center justify-center mb-4">
            <CheckCircle className="w-8 h-8 text-sage-600" />
          </div>
        )}

        <h1 className="text-2xl md:text-3xl font-extrabold text-charcoal-800 mb-2">
          {isPaymentFailed
            ? "Payment Unsuccessful"
            : paymentPending
            ? "Order Received"
            : "Order Placed!"}
        </h1>
        <p className="text-charcoal-500 text-sm max-w-sm">
          {isPaymentFailed
            ? "Your payment could not be processed. Your order has been saved — please contact us."
            : paymentPending
            ? "We received your order. Payment confirmation may take a few minutes."
            : order.paymentMethod === "ONLINE" && !isPaid
            ? "Your order is saved. We will confirm once payment is verified."
            : "Your order is confirmed and we will begin preparing it soon."}
        </p>
      </motion.div>

      {/* Order card */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="card p-5 md:p-6 space-y-5"
      >
        {/* Reference & status */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-xs text-charcoal-400 mb-0.5">Order Reference</p>
            <p className="text-base font-extrabold text-charcoal-800 tracking-wide">
              {order.reference}
            </p>
          </div>
          <div>
            <p className="text-xs text-charcoal-400 mb-0.5">Order Status</p>
            <span className="inline-flex rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-semibold text-amber-800">
              {STATUS_LABELS[order.orderStatus] || order.orderStatus}
            </span>
          </div>
          <div>
            <p className="text-xs text-charcoal-400 mb-0.5">Payment</p>
            <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ${
              isPaid
                ? "bg-sage-100 text-sage-800"
                : isPaymentFailed
                ? "bg-tomato-100 text-tomato-800"
                : "bg-amber-50 text-amber-700"
            }`}>
              {PAYMENT_STATUS_LABELS[order.paymentStatus] || order.paymentStatus}
            </span>
          </div>
          <div>
            <p className="text-xs text-charcoal-400 mb-0.5">Fulfillment</p>
            <p className="text-sm font-medium text-charcoal-700 capitalize">
              {order.fulfillmentType.toLowerCase()}
            </p>
          </div>
        </div>

        {/* Items */}
        <div className="border-t border-charcoal-100 pt-4">
          <h2 className="text-sm font-bold text-charcoal-700 mb-3">Items Ordered</h2>
          <div className="space-y-2.5">
            {order.items.map((item) => (
              <div key={item.id} className="flex gap-3 items-center text-sm">
                <div className="relative w-9 h-9 rounded-lg overflow-hidden bg-charcoal-100 shrink-0">
                  {item.menuItem.imageUrl ? (
                    <Image
                      src={item.menuItem.imageUrl}
                      alt={item.itemName}
                      fill
                      className="object-cover"
                      sizes="36px"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full text-sm" aria-hidden="true">🍴</div>
                  )}
                </div>
                <span className="flex-1 text-charcoal-700">
                  {item.itemName} ×{item.quantity}
                </span>
                <span className="font-semibold text-charcoal-800">
                  {formatNaira(item.totalKobo)}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Totals */}
        <div className="border-t border-charcoal-100 pt-3 space-y-1.5">
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
          {order.serviceFeeKobo > 0 && (
            <div className="flex justify-between text-sm">
              <span className="text-charcoal-500">Service fee</span>
              <span>{formatNaira(order.serviceFeeKobo)}</span>
            </div>
          )}
          <div className="flex justify-between font-bold text-charcoal-800 text-base border-t border-charcoal-100 pt-2">
            <span>Total</span>
            <span>{formatNaira(order.totalKobo)}</span>
          </div>
        </div>

        {/* Delivery address */}
        {order.deliveryAddress && (
          <div className="border-t border-charcoal-100 pt-3">
            <p className="text-xs text-charcoal-400 mb-1">Delivering to</p>
            <p className="text-sm text-charcoal-700">{order.deliveryAddress}</p>
            {order.deliveryArea && (
              <p className="text-xs text-charcoal-400 mt-0.5">{order.deliveryArea}</p>
            )}
          </div>
        )}
      </motion.div>

      {/* Track order */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="mt-4 p-4 rounded-2xl bg-charcoal-50 text-sm text-charcoal-500 flex items-start gap-2"
      >
        <Phone className="w-4 h-4 shrink-0 mt-0.5 text-charcoal-400" aria-hidden="true" />
        <p>
          Questions about your order? Use reference <strong className="text-charcoal-700">{order.reference}</strong> when you contact us.
        </p>
      </motion.div>

      {/* Actions */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mt-6 flex flex-wrap gap-3"
      >
        <Link href="/menu" className="btn-primary">
          Order Again
          <ArrowRight className="w-4 h-4" aria-hidden="true" />
        </Link>
        <Link href="/contact" className="btn-secondary">
          Contact Us
        </Link>
      </motion.div>
    </div>
  );
}
