/**
 * Paystack integration helpers (server-side only).
 * Never import this in client-side code.
 */
import crypto from "crypto";

const PAYSTACK_BASE = "https://api.paystack.co";

function getSecretKey(): string {
  const key = process.env.PAYSTACK_SECRET_KEY;
  if (!key) {
    throw new Error(
      "PAYSTACK_SECRET_KEY is not configured. Set it in .env.local"
    );
  }
  return key;
}

export interface PaystackInitResponse {
  status: boolean;
  message: string;
  data: {
    authorization_url: string;
    access_code: string;
    reference: string;
  };
}

export interface PaystackVerifyResponse {
  status: boolean;
  message: string;
  data: {
    id: number;
    status: "success" | "failed" | "abandoned" | "pending";
    reference: string;
    amount: number; // in kobo
    currency: string;
    paid_at: string;
    channel: string;
    customer: {
      email: string;
      phone: string;
    };
    metadata?: Record<string, unknown>;
  };
}

/**
 * Initializes a Paystack payment.
 * Must be called server-side only.
 * @param email Customer email
 * @param amountKobo Amount in kobo (1 Naira = 100 kobo)
 * @param reference Unique order reference
 * @param metadata Additional metadata to attach
 * @param callbackUrl URL Paystack redirects to after payment
 */
export async function initializePaystackPayment({
  email,
  amountKobo,
  reference,
  metadata,
  callbackUrl,
}: {
  email: string;
  amountKobo: number;
  reference: string;
  metadata?: Record<string, unknown>;
  callbackUrl: string;
}): Promise<PaystackInitResponse> {
  const response = await fetch(`${PAYSTACK_BASE}/transaction/initialize`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${getSecretKey()}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email,
      amount: amountKobo,
      reference,
      metadata,
      callback_url: callbackUrl,
      currency: "NGN",
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Paystack initialization failed: ${error}`);
  }

  return response.json();
}

/**
 * Verifies a Paystack transaction by reference.
 * Must be called server-side only — never trust client-side redirect.
 */
export async function verifyPaystackPayment(
  reference: string
): Promise<PaystackVerifyResponse> {
  const response = await fetch(
    `${PAYSTACK_BASE}/transaction/verify/${encodeURIComponent(reference)}`,
    {
      headers: {
        Authorization: `Bearer ${getSecretKey()}`,
      },
    }
  );

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Paystack verification failed: ${error}`);
  }

  return response.json();
}

/**
 * Verifies a Paystack webhook signature.
 * @param payload Raw request body (Buffer or string)
 * @param signature X-Paystack-Signature header value
 */
export function verifyPaystackWebhookSignature(
  payload: string,
  signature: string
): boolean {
  const secret = getSecretKey();
  const hash = crypto
    .createHmac("sha512", secret)
    .update(payload)
    .digest("hex");
  return hash === signature;
}
