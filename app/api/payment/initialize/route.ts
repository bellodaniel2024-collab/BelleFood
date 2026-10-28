import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { initializePaystackPayment } from "@/lib/paystack";

export async function POST(req: NextRequest) {
  try {
    const { orderId, email } = await req.json();

    if (!orderId || !email) {
      return NextResponse.json(
        { success: false, error: "orderId and email are required" },
        { status: 400 }
      );
    }

    // Fetch the order from DB — use server-authoritative amount
    const order = await prisma.order.findUnique({ where: { id: orderId } });
    if (!order) {
      return NextResponse.json(
        { success: false, error: "Order not found" },
        { status: 404 }
      );
    }

    // Don't initialize payment if already paid
    if (order.paymentStatus === "PAID") {
      return NextResponse.json(
        { success: false, error: "Order is already paid" },
        { status: 409 }
      );
    }

    const baseUrl =
      process.env.NEXTAUTH_URL || `https://${req.headers.get("host")}`;
    const callbackUrl = `${baseUrl}/checkout/success?trxref={PAYSTACK_REFERENCE}`;

    // Initialize Paystack transaction — amount is from the trusted DB, not the client
    const paystackResponse = await initializePaystackPayment({
      email,
      amountKobo: order.totalKobo,
      reference: order.reference,
      callbackUrl,
      metadata: {
        orderId: order.id,
        orderReference: order.reference,
        customerName: order.customerName,
        customerPhone: order.customerPhone,
      },
    });

    if (!paystackResponse.status) {
      return NextResponse.json(
        { success: false, error: "Payment initialization failed" },
        { status: 502 }
      );
    }

    // Store the Paystack reference
    await prisma.order.update({
      where: { id: orderId },
      data: { paystackReference: paystackResponse.data.reference },
    });

    return NextResponse.json({
      success: true,
      authorizationUrl: paystackResponse.data.authorization_url,
      reference: paystackResponse.data.reference,
    });
  } catch (err) {
    console.error("[payment/initialize]", err);
    return NextResponse.json(
      { success: false, error: "Payment initialization failed" },
      { status: 500 }
    );
  }
}
