import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import OrderConfirmation from "@/components/checkout/OrderConfirmation";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Order Confirmed",
  description: "Your Belle Food order has been placed.",
};

export const dynamic = "force-dynamic";

export default async function CheckoutSuccessPage({
  searchParams,
}: {
  searchParams: { ref?: string; paymentPending?: string; trxref?: string };
}) {
  const ref = searchParams.ref || searchParams.trxref;

  if (!ref) {
    redirect("/");
  }

  // Verify payment if this is a Paystack redirect
  if (searchParams.trxref && !searchParams.ref) {
    // Paystack redirect — verify payment server-side
    try {
      const { verifyPaystackPayment } = await import("@/lib/paystack");
      const verification = await verifyPaystackPayment(searchParams.trxref);

      if (verification.status && verification.data.status === "success") {
        // Update order payment status
        await prisma.order.updateMany({
          where: { paystackReference: searchParams.trxref },
          data: {
            paymentStatus: "PAID",
            paystackData: JSON.stringify(verification.data),
          },
        });
      }
    } catch (err) {
      // Verification failed — log but still show page; webhook will handle it
      console.error("[checkout/success] Payment verification error:", err);
    }
  }

  // Fetch the order
  const order = await prisma.order.findFirst({
    where: {
      OR: [
        { reference: ref },
        { paystackReference: ref },
      ],
    },
    include: {
      items: { include: { menuItem: true } },
    },
  });

  if (!order) {
    redirect("/");
  }

  return <OrderConfirmation order={order} paymentPending={searchParams.paymentPending === "true"} />;
}
