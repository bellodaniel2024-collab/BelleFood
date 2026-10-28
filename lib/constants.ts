/**
 * Application-wide constants for Belle Food.
 */

export const ORDER_STATUSES = [
  { value: "PENDING_CONFIRMATION", label: "Awaiting Confirmation", color: "amber" },
  { value: "CONFIRMED",            label: "Confirmed",             color: "blue" },
  { value: "PREPARING",            label: "Preparing",             color: "orange" },
  { value: "READY",                label: "Ready",                 color: "green" },
  { value: "OUT_FOR_DELIVERY",     label: "Out for Delivery",      color: "purple" },
  { value: "COMPLETED",            label: "Completed",             color: "green" },
  { value: "CANCELLED",            label: "Cancelled",             color: "red" },
] as const;

export const PAYMENT_STATUSES = [
  { value: "PENDING",   label: "Payment Pending",  color: "amber" },
  { value: "PAID",      label: "Paid",             color: "green" },
  { value: "FAILED",    label: "Payment Failed",   color: "red" },
  { value: "CANCELLED", label: "Cancelled",        color: "gray" },
  { value: "REFUNDED",  label: "Refunded",         color: "blue" },
] as const;

export const FULFILLMENT_TYPES = [
  { value: "DELIVERY", label: "Delivery" },
  { value: "PICKUP",   label: "Pickup" },
] as const;

export const PAYMENT_METHODS = [
  { value: "ONLINE",           label: "Pay Online (Card/Bank)" },
  { value: "TRANSFER",         label: "Bank Transfer" },
  { value: "PAY_ON_DELIVERY",  label: "Pay on Delivery/Pickup" },
] as const;

export const MAX_CART_QUANTITY = 20;
export const CURRENCY = "NGN";
export const CURRENCY_SYMBOL = "₦";

/**
 * Valid order status transitions.
 * Key = current status, Value = allowed next statuses.
 * Only staff may transition orders.
 */
export const VALID_ORDER_TRANSITIONS: Record<string, string[]> = {
  PENDING_CONFIRMATION: ["CONFIRMED", "CANCELLED"],
  CONFIRMED:            ["PREPARING", "CANCELLED"],
  PREPARING:            ["READY"],
  READY:                ["OUT_FOR_DELIVERY", "COMPLETED"],
  OUT_FOR_DELIVERY:     ["COMPLETED"],
  COMPLETED:            [],
  CANCELLED:            [],
};
