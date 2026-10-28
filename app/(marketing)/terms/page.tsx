import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms & Ordering Policy",
  description: "Belle Food Terms of Use and Ordering Policy.",
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="bg-charcoal-800 pt-24 pb-10 md:pt-28 md:pb-12">
        <div className="container-belle">
          <h1 className="text-3xl font-extrabold text-white">
            Terms &amp; Ordering Policy
          </h1>
          <p className="text-charcoal-300 text-sm mt-2">
            Last updated: {new Date().toLocaleDateString("en-NG", { year: "numeric", month: "long", day: "numeric" })}
          </p>
        </div>
      </div>

      <div className="container-belle py-10 md:py-14 max-w-3xl">
        <div className="prose max-w-none text-charcoal-700 space-y-6">
          <section>
            <h2 className="text-xl font-bold text-charcoal-800">Ordering</h2>
            <p className="leading-relaxed">
              By placing an order through the Belle Food website, you confirm that
              the information you have provided is accurate and that you are authorised
              to use the selected payment method. All orders are subject to availability
              and confirmation by Belle Food.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-charcoal-800">Pricing</h2>
            <p className="leading-relaxed">
              All prices displayed are in Nigerian Naira (₦) and are inclusive of any
              applicable service charges. Delivery fees are charged separately and depend
              on your selected delivery area. Prices are confirmed at the time of order
              placement and are binding once the order is acknowledged by the server.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-charcoal-800">Payment</h2>
            <p className="leading-relaxed">
              Online payments are processed by Paystack, a secure third-party payment
              provider. Belle Food does not store payment card details. Orders paid for
              online will only be confirmed once payment is verified by our payment
              provider. Pay-on-delivery orders are subject to confirmation at the
              restaurant&apos;s discretion.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-charcoal-800">Cancellations</h2>
            <p className="leading-relaxed">
              Cancellations may be requested before an order enters the preparing stage.
              Once food preparation has begun, cancellations may not be possible. Please
              contact us immediately if you need to cancel or amend your order.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-charcoal-800">Delivery</h2>
            <p className="leading-relaxed">
              Delivery times are estimates only and may vary depending on order volume,
              traffic, and delivery distance. Belle Food is not liable for delays caused
              by circumstances outside our control. Delivery is available only within
              configured delivery areas.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-charcoal-800">Contact</h2>
            <p className="leading-relaxed">
              If you have any concerns with your order, please contact us using the
              details on our Contact page. We are committed to resolving genuine
              complaints promptly and fairly.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
