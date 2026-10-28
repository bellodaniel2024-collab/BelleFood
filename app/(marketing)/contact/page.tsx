import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { MapPin, Phone, Mail, MessageCircle, Clock } from "lucide-react";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Contact & Location",
  description: "Find Belle Food — get directions, contact us, and check our opening hours.",
};

export const dynamic = "force-dynamic";

export default async function ContactPage() {
  let settings = null;
  try {
    settings = await prisma.restaurantSettings.findFirst();
  } catch { /* database may not be ready yet */ }

  const hours: Array<{ day: string; openTime: string; closeTime: string; closed: boolean }> =
    settings?.openingHours ? JSON.parse(settings.openingHours) : [];

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <div className="bg-gradient-to-br from-charcoal-800 to-charcoal-900 pt-24 pb-14 md:pt-32 md:pb-20">
        <div className="container-belle text-center">
          <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-4 tracking-tight">
            Contact &amp; Location
          </h1>
          <p className="text-charcoal-300 text-base max-w-md mx-auto">
            We&apos;d love to hear from you. Find us, call us, or send a message.
          </p>
        </div>
      </div>

      <div className="section-py bg-white">
        <div className="container-belle">
          <div className="grid lg:grid-cols-2 gap-10 lg:gap-16">
            {/* Contact details */}
            <div className="space-y-6">
              <h2 className="text-2xl font-extrabold text-charcoal-800">Get in Touch</h2>

              {settings?.address ? (
                <div className="flex gap-3">
                  <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-tomato-50 shrink-0">
                    <MapPin className="w-5 h-5 text-tomato-600" aria-hidden="true" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-charcoal-700 mb-0.5">Address</p>
                    <p className="text-sm text-charcoal-500 leading-relaxed">{settings.address}</p>
                    {settings.mapEmbedUrl ? (
                      <a
                        href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(settings.address)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-tomato-600 hover:underline mt-1 inline-block"
                      >
                        Get directions →
                      </a>
                    ) : null}
                  </div>
                </div>
              ) : (
                <div className="flex gap-3 opacity-50">
                  <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-charcoal-100 shrink-0">
                    <MapPin className="w-5 h-5 text-charcoal-400" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-charcoal-600">Address</p>
                    <p className="text-xs text-charcoal-400 italic">Not yet configured</p>
                  </div>
                </div>
              )}

              {settings?.phone ? (
                <div className="flex gap-3">
                  <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-tomato-50 shrink-0">
                    <Phone className="w-5 h-5 text-tomato-600" aria-hidden="true" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-charcoal-700 mb-0.5">Phone</p>
                    <a
                      href={`tel:${settings.phone}`}
                      className="text-sm text-charcoal-500 hover:text-tomato-600 transition-colors"
                    >
                      {settings.phone}
                    </a>
                  </div>
                </div>
              ) : null}

              {settings?.whatsapp ? (
                <div className="flex gap-3">
                  <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-sage-50 shrink-0">
                    <MessageCircle className="w-5 h-5 text-sage-600" aria-hidden="true" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-charcoal-700 mb-0.5">WhatsApp</p>
                    <a
                      href={`https://wa.me/${settings.whatsapp.replace(/[^\d]/g, "")}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-charcoal-500 hover:text-sage-600 transition-colors"
                    >
                      {settings.whatsapp}
                    </a>
                  </div>
                </div>
              ) : null}

              {settings?.email ? (
                <div className="flex gap-3">
                  <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-tomato-50 shrink-0">
                    <Mail className="w-5 h-5 text-tomato-600" aria-hidden="true" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-charcoal-700 mb-0.5">Email</p>
                    <a
                      href={`mailto:${settings.email}`}
                      className="text-sm text-charcoal-500 hover:text-tomato-600 transition-colors"
                    >
                      {settings.email}
                    </a>
                  </div>
                </div>
              ) : null}

              {!settings?.phone && !settings?.email && !settings?.whatsapp && (
                <p className="text-sm text-charcoal-400 italic">
                  Contact details will appear here once configured.
                </p>
              )}

              {/* Opening Hours */}
              {hours.length > 0 && (
                <div className="border-t border-charcoal-100 pt-5">
                  <div className="flex items-center gap-2 mb-3">
                    <Clock className="w-4 h-4 text-orange-500" aria-hidden="true" />
                    <h3 className="text-sm font-bold text-charcoal-700">Opening Hours</h3>
                  </div>
                  <div className="space-y-1.5">
                    {hours.map((entry) => (
                      <div key={entry.day} className="flex justify-between text-sm">
                        <span className="text-charcoal-500">{entry.day}</span>
                        <span className={entry.closed ? "text-charcoal-400" : "text-charcoal-700"}>
                          {entry.closed ? "Closed" : `${entry.openTime} – ${entry.closeTime}`}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Map or placeholder */}
            <div>
              {settings?.mapEmbedUrl ? (
                <div className="rounded-3xl overflow-hidden border border-charcoal-100 shadow-sm">
                  <iframe
                    src={settings.mapEmbedUrl}
                    width="100%"
                    height="400"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="Belle Food location map"
                    aria-label="Map showing Belle Food restaurant location"
                  />
                </div>
              ) : settings?.address ? (
                <div className="rounded-3xl overflow-hidden border border-charcoal-100 shadow-sm">
                  <iframe
                    src={`https://maps.google.com/maps?q=${encodeURIComponent(settings.address)}&t=m&z=15&output=embed`}
                    width="100%"
                    height="400"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    title="Belle Food location map"
                    aria-label="Map showing Belle Food restaurant location"
                  />
                </div>
              ) : (
                <div className="h-80 rounded-3xl bg-charcoal-50 border border-charcoal-100 flex items-center justify-center">
                  <div className="text-center">
                    <MapPin className="w-8 h-8 text-charcoal-200 mx-auto mb-2" aria-hidden="true" />
                    <p className="text-sm text-charcoal-400">
                      Map will appear once the restaurant address is configured.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
