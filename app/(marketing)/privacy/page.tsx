import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Belle Food Privacy Policy — how we handle your personal information.",
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="bg-charcoal-800 pt-24 pb-10 md:pt-28 md:pb-12">
        <div className="container-belle">
          <h1 className="text-3xl font-extrabold text-white">Privacy Policy</h1>
          <p className="text-charcoal-300 text-sm mt-2">
            Last updated: {new Date().toLocaleDateString("en-NG", { year: "numeric", month: "long", day: "numeric" })}
          </p>
        </div>
      </div>

      <div className="container-belle py-10 md:py-14 max-w-3xl">
        <div className="prose prose-charcoal max-w-none text-charcoal-700 space-y-6">
          <section>
            <h2 className="text-xl font-bold text-charcoal-800">Information We Collect</h2>
            <p className="leading-relaxed">
              When you place an order on the Belle Food website, we collect the information
              necessary to process and fulfil your order. This includes your name, phone
              number, email address (if provided), and delivery address. We do not collect
              or store payment card details — all card payments are processed directly by
              our payment provider (Paystack).
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-charcoal-800">How We Use Your Information</h2>
            <p className="leading-relaxed">
              We use your information exclusively to process and deliver your order, and
              to communicate with you about your order status. We do not sell your
              personal information to any third party. We do not use your information for
              unsolicited marketing without your consent.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-charcoal-800">Data Security</h2>
            <p className="leading-relaxed">
              We implement reasonable technical and organisational measures to protect
              your personal data from unauthorised access, disclosure, or misuse. Order
              data is stored securely and is accessible only to authorised restaurant
              staff for operational purposes.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-charcoal-800">Your Rights</h2>
            <p className="leading-relaxed">
              You may request access to, correction of, or deletion of your personal
              information at any time by contacting us directly.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-charcoal-800">Contact</h2>
            <p className="leading-relaxed">
              If you have any questions about this policy, please contact Belle Food directly
              via the contact page.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
