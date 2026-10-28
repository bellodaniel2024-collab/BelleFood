import Link from "next/link";
import { ChefHat, MapPin, Phone, Mail, Instagram, Twitter, Facebook, Clock } from "lucide-react";
import { prisma } from "@/lib/prisma";

async function getSettings() {
  try {
    return await prisma.restaurantSettings.findFirst();
  } catch {
    return null;
  }
}

export default async function Footer() {
  const settings = await getSettings();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-charcoal-800 text-charcoal-100" role="contentinfo">
      {/* Main footer */}
      <div className="container-belle py-14 md:py-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12">

          {/* Brand */}
          <div className="sm:col-span-2 lg:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-tomato-700">
                <ChefHat className="w-5 h-5 text-white" aria-hidden="true" />
              </div>
              <span className="text-xl font-extrabold text-white tracking-tight">
                Belle<span className="text-orange-400">Food</span>
              </span>
            </div>
            <p className="text-sm text-charcoal-300 leading-relaxed max-w-xs mb-5">
              Authentic Nigerian cuisine crafted with the finest ingredients and time-honoured recipes.
            </p>

            {/* Social links */}
            {(settings?.instagramUrl || settings?.twitterUrl || settings?.facebookUrl || settings?.tiktokUrl) && (
              <div className="flex gap-2">
                {settings?.instagramUrl && (
                  <a
                    href={settings.instagramUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center w-9 h-9 rounded-full bg-charcoal-700 hover:bg-tomato-700 text-charcoal-300 hover:text-white transition-colors"
                    aria-label="Belle Food on Instagram"
                  >
                    <Instagram className="w-4 h-4" />
                  </a>
                )}
                {settings?.twitterUrl && (
                  <a
                    href={settings.twitterUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center w-9 h-9 rounded-full bg-charcoal-700 hover:bg-tomato-700 text-charcoal-300 hover:text-white transition-colors"
                    aria-label="Belle Food on Twitter/X"
                  >
                    <Twitter className="w-4 h-4" />
                  </a>
                )}
                {settings?.facebookUrl && (
                  <a
                    href={settings.facebookUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center w-9 h-9 rounded-full bg-charcoal-700 hover:bg-tomato-700 text-charcoal-300 hover:text-white transition-colors"
                    aria-label="Belle Food on Facebook"
                  >
                    <Facebook className="w-4 h-4" />
                  </a>
                )}
              </div>
            )}
          </div>

          {/* Navigation */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-charcoal-400 mb-4">
              Explore
            </h3>
            <ul className="space-y-2.5">
              {[
                { href: "/", label: "Home" },
                { href: "/menu", label: "Our Menu" },
                { href: "/order", label: "Order Online" },
                { href: "/about", label: "About Us" },
                { href: "/contact", label: "Contact" },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-charcoal-300 hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Opening Hours */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-charcoal-400 mb-4">
              Opening Hours
            </h3>
            {settings?.openingHours ? (
              <OpeningHoursDisplay hoursJson={settings.openingHours} />
            ) : (
              <p className="text-sm text-charcoal-400 italic">
                Hours not configured yet
              </p>
            )}
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-charcoal-400 mb-4">
              Contact Us
            </h3>
            <ul className="space-y-3">
              {settings?.address ? (
                <li className="flex gap-2.5 text-sm text-charcoal-300">
                  <MapPin className="w-4 h-4 mt-0.5 text-orange-400 shrink-0" aria-hidden="true" />
                  <span>{settings.address}</span>
                </li>
              ) : null}

              {settings?.phone ? (
                <li>
                  <a
                    href={`tel:${settings.phone}`}
                    className="flex gap-2.5 text-sm text-charcoal-300 hover:text-white transition-colors"
                  >
                    <Phone className="w-4 h-4 mt-0.5 text-orange-400 shrink-0" aria-hidden="true" />
                    <span>{settings.phone}</span>
                  </a>
                </li>
              ) : null}

              {settings?.email ? (
                <li>
                  <a
                    href={`mailto:${settings.email}`}
                    className="flex gap-2.5 text-sm text-charcoal-300 hover:text-white transition-colors"
                  >
                    <Mail className="w-4 h-4 mt-0.5 text-orange-400 shrink-0" aria-hidden="true" />
                    <span>{settings.email}</span>
                  </a>
                </li>
              ) : null}

              {!settings?.address && !settings?.phone && !settings?.email && (
                <li className="text-sm text-charcoal-400 italic">
                  Contact details coming soon
                </li>
              )}
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-charcoal-700">
        <div className="container-belle py-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-charcoal-400">
            © {currentYear} Belle Food. All rights reserved.
          </p>
          <div className="flex gap-4">
            <Link
              href="/privacy"
              className="text-xs text-charcoal-400 hover:text-charcoal-200 transition-colors"
            >
              Privacy Policy
            </Link>
            <Link
              href="/terms"
              className="text-xs text-charcoal-400 hover:text-charcoal-200 transition-colors"
            >
              Terms
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

function OpeningHoursDisplay({ hoursJson }: { hoursJson: string }) {
  try {
    const hours: Array<{
      day: string;
      openTime: string;
      closeTime: string;
      closed: boolean;
    }> = JSON.parse(hoursJson);

    // Group consecutive days with same hours
    return (
      <ul className="space-y-1.5">
        {hours.map((entry) => (
          <li key={entry.day} className="flex justify-between gap-4 text-sm">
            <span className="text-charcoal-300">{entry.day.slice(0, 3)}</span>
            <span className={entry.closed ? "text-charcoal-500" : "text-charcoal-200"}>
              {entry.closed ? "Closed" : `${entry.openTime} – ${entry.closeTime}`}
            </span>
          </li>
        ))}
      </ul>
    );
  } catch {
    return (
      <div className="flex items-center gap-1.5 text-sm text-charcoal-400">
        <Clock className="w-3.5 h-3.5" />
        <span>Check with us for hours</span>
      </div>
    );
  }
}
