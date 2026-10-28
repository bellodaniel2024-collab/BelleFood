import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyPaystackWebhookSignature } from "@/lib/paystack";

/**
 * Paystack webhook handler.
 * Paystack sends POST requests here when a payment event occurs.
 * Configure this URL in your Paystack dashboard:
 *   https://your-domain.com/api/webhooks/paystack
 *
 * Security:
 * - Validates the HMAC-SHA512 signature on every request
 * - Processes events idempotently
 * - Does not accept requests from other origins
 */
export async function POST(req: NextRequest) {
  // 1. Read raw body for signature verification
  const rawBody = await req.text();
  const signature = req.headers.get("x-paystack-signature") || "";

  // 2. Verify webhook signature
  if (!verifyPaystackWebhookSignature(rawBody, signature)) {
    console.warn("[paystack-webhook] Invalid signature");
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  let event: { event: string; data: Record<string, unknown> };
  try {
    event = JSON.parse(rawBody);
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  // 3. Handle payment events
  try {
    switch (event.event) {
      case "charge.success": {
        const data = event.data as {
          reference: string;
          status: string;
          amount: number;
          currency: string;
          metadata?: { orderId?: string };
        };

        if (data.status !== "success") break;

        const reference = data.reference;

        // Idempotency: check if we already processed this reference
        const order = await prisma.order.findFirst({
          where: {
            OR: [
              { reference },
              { paystackReference: reference },
            ],
          },
        });

        if (!order) {
          console.warn(`[paystack-webhook] No order found for reference: ${reference}`);
          break;
        }

        // Already processed
        if (order.paymentStatus === "PAID") {
          break;
        }

        // Validate amount
        if (data.amount !== order.totalKobo) {
          console.error(
            `[paystack-webhook] Amount mismatch for ${reference}. ` +
            `Expected ${order.totalKobo} kobo, got ${data.amount} kobo`
          );
          // Do not mark as paid if amounts don't match
          break;
        }

        // Update payment status
        await prisma.order.update({
          where: { id: order.id },
          data: {
            paymentStatus: "PAID",
            paystackReference: reference,
            paystackData: JSON.stringify(data),
          },
        });

        console.log(`[paystack-webhook] Payment verified for order ${order.reference}`);
        break;
      }

      case "charge.failed": {
        const data = event.data as { reference: string };
        await prisma.order.updateMany({
          where: {
            OR: [
              { reference: data.reference },
              { paystackReference: data.reference },
            ],
            paymentStatus: "PENDING",
          },
          data: { paymentStatus: "FAILED" },
        });
        break;
      }

      default:
        // Unhandled event type — ignore
        break;
    }
  } catch (err) {
    console.error("[paystack-webhook] Processing error:", err);
    // Return 200 to prevent Paystack from retrying on internal errors
    // The order data is preserved — we can reconcile manually if needed
    return NextResponse.json({ received: true, error: "Processing error" });
  }

  return NextResponse.json({ received: true });
}
