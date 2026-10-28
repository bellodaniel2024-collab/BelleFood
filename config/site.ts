/**
 * Site-wide configuration for Belle Food.
 * Values prefixed NEXT_PUBLIC_ are safe to use in client components.
 * Sensitive values (keys, credentials) must remain server-side only.
 */

export const siteConfig = {
  name: process.env.NEXT_PUBLIC_RESTAURANT_NAME || "Belle Food",
  tagline: "Authentic Nigerian Cuisine",
  description:
    "Fresh, home-style Nigerian dishes crafted with love — delivered to your door or ready for pickup.",
  url: process.env.NEXTAUTH_URL || "http://localhost:3000",

  // Contact — populated from environment variables
  // Leave empty until the restaurant owner supplies verified details
  phone: process.env.NEXT_PUBLIC_RESTAURANT_PHONE || "",
  whatsapp: process.env.NEXT_PUBLIC_RESTAURANT_WHATSAPP || "",
  email: process.env.NEXT_PUBLIC_RESTAURANT_EMAIL || "",
  address: process.env.NEXT_PUBLIC_RESTAURANT_ADDRESS || "",
  mapEmbedUrl: process.env.NEXT_PUBLIC_GOOGLE_MAPS_EMBED_URL || "",
};
