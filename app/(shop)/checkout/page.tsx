import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import CheckoutPageClient from "@/components/checkout/CheckoutPageClient";

export const metadata: Metadata = {
  title: "Checkout",
  description: "Complete your Belle Food order.",
};

export const dynamic = "force-dynamic";

async function getCheckoutData() {
  const [settings, deliveryAreas] = await Promise.all([
    prisma.restaurantSettings.findFirst(),
    prisma.deliveryArea.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: "asc" },
    }),
  ]);
  return { settings, deliveryAreas };
}

export default async function CheckoutPage() {
  const { settings, deliveryAreas } = await getCheckoutData();

  return (
    <CheckoutPageClient
      settings={settings}
      deliveryAreas={deliveryAreas}
    />
  );
}
