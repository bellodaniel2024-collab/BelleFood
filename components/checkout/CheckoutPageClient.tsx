"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import {
  MapPin, Package, CreditCard, ArrowRight, ShoppingBag, AlertCircle, Loader2
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { checkoutSchema, type CheckoutInput } from "@/lib/validations";
import { createOrder } from "@/actions/order.actions";
import { useCart } from "@/hooks/useCart";
import { formatNaira } from "@/lib/utils";
import { toast } from "sonner";
import type { RestaurantSettings, DeliveryArea } from "@prisma/client";

interface Props {
  settings: RestaurantSettings | null;
  deliveryAreas: DeliveryArea[];
}

export default function CheckoutPageClient({ settings, deliveryAreas }: Props) {
  const router = useRouter();
  const items = useCart((s) => s.items);
  const subtotalKobo = useCart((s) => s.subtotalKobo);
  const clearCart = useCart((s) => s.clearCart);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [selectedDeliveryFeeKobo, setSelectedDeliveryFeeKobo] = useState(0);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<CheckoutInput>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      fulfillmentType: "DELIVERY",
      paymentMethod: "ONLINE",
    },
  });

  const fulfillmentType = watch("fulfillmentType");
  const paymentMethod = watch("paymentMethod");
  const deliveryAreaValue = watch("deliveryArea");

  // Update delivery fee when area changes
  function handleDeliveryAreaChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const area = deliveryAreas.find((a) => a.name === e.target.value);
    setSelectedDeliveryFeeKobo(area?.feeKobo ?? 0);
    setValue("deliveryArea", e.target.value);
  }

  // Cart empty state
  if (items.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4 py-16">
        <ShoppingBag className="w-12 h-12 text-charcoal-200 mb-4" aria-hidden="true" />
        <h1 className="text-xl font-bold text-charcoal-700 mb-2">Your cart is empty</h1>
        <p className="text-charcoal-400 mb-5">Add some dishes before checking out.</p>
        <Link href="/menu" className="btn-primary">
          Browse Menu
        </Link>
      </div>
    );
  }

  // Orders closed
  if (settings && !settings.acceptingOrders) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center text-center px-4 py-16">
        <AlertCircle className="w-12 h-12 text-orange-400 mb-4" aria-hidden="true" />
        <h1 className="text-xl font-bold text-charcoal-700 mb-2">
          We&apos;re not accepting orders right now
        </h1>
        <p className="text-charcoal-400 max-w-sm">
          {settings.orderClosedMessage ||
            "Thank you for your patience — please check back soon."}
        </p>
      </div>
    );
  }

  const totalKobo = subtotalKobo + selectedDeliveryFeeKobo;

  async function onSubmit(data: CheckoutInput) {
    setIsSubmitting(true);
    setServerError(null);

    try {
      const result = await createOrder({
        ...data,
        items: items.map((i) => ({
          menuItemId: i.menuItemId,
          quantity: i.quantity,
        })),
      });

      if (!result.success) {
        setServerError(result.error);
        toast.error(result.error);
        return;
      }

      // Payment routing
      if (data.paymentMethod === "ONLINE") {
        // Initialize Paystack payment
        const payRes = await fetch("/api/payment/initialize", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            orderId: result.data.orderId,
            email: data.customerEmail || `${data.customerPhone}@bellefood.ng`,
          }),
        });
        const payData = await payRes.json();

        if (payData.success && payData.authorizationUrl) {
          clearCart();
          // Redirect to Paystack payment page
          window.location.href = payData.authorizationUrl;
          return;
        } else {
          // Payment initialization failed but order was saved
          // Don't clear cart; redirect to order page with info
          toast.warning("Payment gateway unavailable. Your order was saved — please contact us to complete payment.");
          router.push(
            `/checkout/success?ref=${result.data.reference}&paymentPending=true`
          );
          clearCart();
          return;
        }
      }

      // Non-online payment — order confirmed
      clearCart();
      router.push(`/checkout/success?ref=${result.data.reference}`);
    } catch (err) {
      console.error("Checkout error:", err);
      setServerError(
        "An unexpected error occurred. Please try again or contact us directly."
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="container-belle py-8 md:py-10">
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-extrabold text-charcoal-800">
          Checkout
        </h1>
        <p className="text-sm text-charcoal-400 mt-1">
          Complete your order details below
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <div className="grid lg:grid-cols-3 gap-6 lg:gap-8">
          {/* Left: Form */}
          <div className="lg:col-span-2 space-y-5">

            {/* Contact info */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              className="card p-5"
            >
              <h2 className="text-base font-bold text-charcoal-800 mb-4 flex items-center gap-2">
                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-tomato-100 text-tomato-700 text-xs font-extrabold">1</span>
                Contact Information
              </h2>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="customerName" className="form-label">
                    Full Name <span className="text-tomato-500">*</span>
                  </label>
                  <input
                    id="customerName"
                    type="text"
                    autoComplete="name"
                    placeholder="Your name"
                    className={`form-input ${errors.customerName ? "border-tomato-400 focus:border-tomato-400" : ""}`}
                    {...register("customerName")}
                  />
                  {errors.customerName && (
                    <p className="form-error">{errors.customerName.message}</p>
                  )}
                </div>
                <div>
                  <label htmlFor="customerPhone" className="form-label">
                    Phone Number <span className="text-tomato-500">*</span>
                  </label>
                  <input
                    id="customerPhone"
                    type="tel"
                    autoComplete="tel"
                    placeholder="e.g. 08012345678"
                    className={`form-input ${errors.customerPhone ? "border-tomato-400" : ""}`}
                    {...register("customerPhone")}
                  />
                  {errors.customerPhone && (
                    <p className="form-error">{errors.customerPhone.message}</p>
                  )}
                </div>
                <div className="sm:col-span-2">
                  <label htmlFor="customerEmail" className="form-label">
                    Email Address <span className="text-charcoal-400">(optional)</span>
                  </label>
                  <input
                    id="customerEmail"
                    type="email"
                    autoComplete="email"
                    placeholder="For order confirmation"
                    className={`form-input ${errors.customerEmail ? "border-tomato-400" : ""}`}
                    {...register("customerEmail")}
                  />
                  {errors.customerEmail && (
                    <p className="form-error">{errors.customerEmail.message}</p>
                  )}
                </div>
              </div>
            </motion.div>

            {/* Fulfillment */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 }}
              className="card p-5"
            >
              <h2 className="text-base font-bold text-charcoal-800 mb-4 flex items-center gap-2">
                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-tomato-100 text-tomato-700 text-xs font-extrabold">2</span>
                Delivery or Pickup
              </h2>

              <div className="grid sm:grid-cols-2 gap-3 mb-4">
                {[
                  {
                    value: "DELIVERY",
                    label: "Delivery",
                    desc: "Delivered to your door",
                    icon: MapPin,
                    disabled: !(settings?.deliveryEnabled ?? true),
                  },
                  {
                    value: "PICKUP",
                    label: "Pickup",
                    desc: "Collect from us",
                    icon: Package,
                    disabled: !(settings?.pickupEnabled ?? true),
                  },
                ].map((option) => (
                  <label
                    key={option.value}
                    className={`relative flex gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                      fulfillmentType === option.value
                        ? "border-tomato-500 bg-tomato-50"
                        : option.disabled
                        ? "border-charcoal-100 opacity-50 cursor-not-allowed"
                        : "border-charcoal-200 hover:border-charcoal-300"
                    }`}
                  >
                    <input
                      type="radio"
                      value={option.value}
                      disabled={option.disabled}
                      className="sr-only"
                      {...register("fulfillmentType")}
                    />
                    <option.icon
                      className={`w-5 h-5 mt-0.5 shrink-0 ${
                        fulfillmentType === option.value
                          ? "text-tomato-600"
                          : "text-charcoal-400"
                      }`}
                      aria-hidden="true"
                    />
                    <div>
                      <div className="text-sm font-semibold text-charcoal-800">
                        {option.label}
                        {option.disabled && (
                          <span className="ml-2 text-xs text-charcoal-400 font-normal">
                            Unavailable
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-charcoal-500">{option.desc}</div>
                    </div>
                  </label>
                ))}
              </div>

              {/* Delivery fields */}
              {fulfillmentType === "DELIVERY" && (
                <div className="space-y-3">
                  {deliveryAreas.length > 0 ? (
                    <div>
                      <label htmlFor="deliveryArea" className="form-label">
                        Delivery Area <span className="text-tomato-500">*</span>
                      </label>
                      <select
                        id="deliveryArea"
                        className={`form-input ${errors.deliveryArea ? "border-tomato-400" : ""}`}
                        defaultValue=""
                        onChange={handleDeliveryAreaChange}
                      >
                        <option value="" disabled>
                          Select delivery area
                        </option>
                        {deliveryAreas.map((area) => (
                          <option key={area.id} value={area.name}>
                            {area.name} — {formatNaira(area.feeKobo)}
                          </option>
                        ))}
                      </select>
                      {errors.deliveryArea && (
                        <p className="form-error">{errors.deliveryArea.message}</p>
                      )}
                    </div>
                  ) : (
                    <div className="p-3 rounded-xl bg-amber-50 border border-amber-100">
                      <p className="text-xs text-amber-700">
                        Delivery areas have not been configured yet. Please call us to arrange delivery, or select pickup.
                      </p>
                    </div>
                  )}

                  <div>
                    <label htmlFor="deliveryAddress" className="form-label">
                      Delivery Address <span className="text-tomato-500">*</span>
                    </label>
                    <textarea
                      id="deliveryAddress"
                      rows={2}
                      placeholder="House/flat number, street, landmark"
                      className={`form-input resize-none ${errors.deliveryAddress ? "border-tomato-400" : ""}`}
                      {...register("deliveryAddress")}
                    />
                    {errors.deliveryAddress && (
                      <p className="form-error">{errors.deliveryAddress.message}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="deliveryNote" className="form-label">
                      Delivery Note <span className="text-charcoal-400">(optional)</span>
                    </label>
                    <input
                      id="deliveryNote"
                      type="text"
                      placeholder="Gate colour, landmark, etc."
                      className="form-input"
                      {...register("deliveryNote")}
                    />
                  </div>
                </div>
              )}

              {/* Pickup address */}
              {fulfillmentType === "PICKUP" && settings?.address && (
                <div className="flex gap-2 p-3 rounded-xl bg-sage-50 border border-sage-200">
                  <MapPin className="w-4 h-4 text-sage-600 shrink-0 mt-0.5" aria-hidden="true" />
                  <div>
                    <p className="text-xs font-semibold text-sage-700">Pickup address</p>
                    <p className="text-xs text-sage-600 mt-0.5">{settings.address}</p>
                  </div>
                </div>
              )}
            </motion.div>

            {/* Payment method */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="card p-5"
            >
              <h2 className="text-base font-bold text-charcoal-800 mb-4 flex items-center gap-2">
                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-tomato-100 text-tomato-700 text-xs font-extrabold">3</span>
                Payment Method
              </h2>

              <div className="space-y-2.5">
                {[
                  {
                    value: "ONLINE",
                    label: "Pay Online",
                    desc: "Card or bank transfer via Paystack",
                    icon: "💳",
                  },
                  {
                    value: "TRANSFER",
                    label: "Bank Transfer",
                    desc: "Manual transfer — we confirm before preparing",
                    icon: "🏦",
                  },
                  {
                    value: "PAY_ON_DELIVERY",
                    label: "Pay on Delivery / Pickup",
                    desc: "Cash or card when your order arrives",
                    icon: "💵",
                  },
                ].map((option) => (
                  <label
                    key={option.value}
                    className={`flex gap-3 p-3.5 rounded-xl border-2 cursor-pointer transition-all ${
                      paymentMethod === option.value
                        ? "border-tomato-500 bg-tomato-50"
                        : "border-charcoal-200 hover:border-charcoal-300"
                    }`}
                  >
                    <input
                      type="radio"
                      value={option.value}
                      className="sr-only"
                      {...register("paymentMethod")}
                    />
                    <span className="text-xl" aria-hidden="true">{option.icon}</span>
                    <div>
                      <div className="text-sm font-semibold text-charcoal-800">
                        {option.label}
                      </div>
                      <div className="text-xs text-charcoal-500">{option.desc}</div>
                    </div>
                  </label>
                ))}
              </div>

              {paymentMethod === "ONLINE" && !process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY?.startsWith("pk_") && (
                <p className="mt-3 text-xs text-amber-600 bg-amber-50 rounded-xl p-2.5 border border-amber-100">
                  Online payment is not yet configured. Please select bank transfer or pay on delivery.
                </p>
              )}
            </motion.div>

            {/* Order note */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="card p-5"
            >
              <label htmlFor="customerNote" className="form-label text-base font-bold text-charcoal-800 mb-0">
                Order Notes <span className="text-charcoal-400 font-normal">(optional)</span>
              </label>
              <p className="text-xs text-charcoal-400 mb-3">Special instructions, allergies, or preferences</p>
              <textarea
                id="customerNote"
                rows={3}
                placeholder="e.g. No pepper on the jollof, extra plantain, etc."
                className="form-input resize-none"
                {...register("customerNote")}
              />
            </motion.div>

            {/* Server error */}
            {serverError && (
              <div className="flex gap-2 p-4 rounded-xl bg-tomato-50 border border-tomato-200">
                <AlertCircle className="w-4 h-4 text-tomato-500 shrink-0 mt-0.5" aria-hidden="true" />
                <p className="text-sm text-tomato-700">{serverError}</p>
              </div>
            )}
          </div>

          {/* Right: Order summary */}
          <div className="lg:col-span-1">
            <div className="card p-5 sticky top-24">
              <h2 className="text-base font-bold text-charcoal-800 mb-4">
                Your Order
              </h2>

              {/* Items */}
              <div className="space-y-2.5 mb-4 max-h-48 overflow-y-auto">
                {items.map((item) => (
                  <div
                    key={item.menuItemId}
                    className="flex gap-2 items-center text-sm"
                  >
                    <div className="relative w-9 h-9 rounded-lg overflow-hidden bg-charcoal-100 shrink-0">
                      {item.imageUrl ? (
                        <Image
                          src={item.imageUrl}
                          alt={item.name}
                          fill
                          className="object-cover"
                          sizes="36px"
                        />
                      ) : (
                        <div className="flex items-center justify-center h-full text-sm" aria-hidden="true">🍴</div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <span className="text-charcoal-700 font-medium truncate block">
                        {item.name}
                      </span>
                      <span className="text-charcoal-400 text-xs">×{item.quantity}</span>
                    </div>
                    <span className="text-charcoal-700 font-semibold shrink-0 text-xs">
                      {formatNaira(item.priceKobo * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>

              <div className="border-t border-charcoal-100 pt-3 space-y-2 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-charcoal-500">Subtotal</span>
                  <span className="font-semibold">{formatNaira(subtotalKobo)}</span>
                </div>
                {fulfillmentType === "DELIVERY" && (
                  <div className="flex justify-between text-sm">
                    <span className="text-charcoal-500">Delivery</span>
                    <span className="font-semibold">
                      {selectedDeliveryFeeKobo > 0
                        ? formatNaira(selectedDeliveryFeeKobo)
                        : "Select area above"}
                    </span>
                  </div>
                )}
                <div className="flex justify-between font-bold text-charcoal-800 text-base border-t border-charcoal-100 pt-2">
                  <span>Total</span>
                  <span>{formatNaira(totalKobo)}</span>
                </div>
                <p className="text-[10px] text-charcoal-400">
                  * Final total confirmed by server at order creation
                </p>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="btn-primary w-full justify-center"
                aria-busy={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />
                    Placing order…
                  </>
                ) : (
                  <>
                    {paymentMethod === "ONLINE" ? "Pay Now" : "Place Order"}
                    <ArrowRight className="w-4 h-4" aria-hidden="true" />
                  </>
                )}
              </button>
              <p className="text-xs text-charcoal-400 text-center mt-2">
                By ordering, you agree to our{" "}
                <Link href="/terms" className="underline hover:text-charcoal-600">
                  ordering policy
                </Link>
              </p>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
