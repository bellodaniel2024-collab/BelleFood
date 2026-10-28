import type { Metadata } from "next";
import CartPageClient from "@/components/cart/CartPageClient";

export const metadata: Metadata = {
  title: "Your Cart",
  description: "Review your Belle Food order before checkout.",
};

export default function CartPage() {
  return <CartPageClient />;
}
