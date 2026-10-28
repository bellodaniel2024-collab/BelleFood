import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Toaster } from "sonner";

export const metadata: Metadata = {
  title: {
    default: "Belle Food — Authentic Nigerian Cuisine",
    template: "%s | Belle Food",
  },
  description:
    "Fresh, home-style Nigerian dishes crafted with love. Order online for delivery or pickup.",
  keywords: [
    "Nigerian food",
    "jollof rice",
    "Nigerian restaurant",
    "suya",
    "egusi soup",
    "Belle Food",
    "online food ordering",
    "Nigerian cuisine",
  ],
  authors: [{ name: "Belle Food" }],
  creator: "Belle Food",
  openGraph: {
    type: "website",
    locale: "en_NG",
    siteName: "Belle Food",
    title: "Belle Food — Authentic Nigerian Cuisine",
    description:
      "Fresh, home-style Nigerian dishes crafted with love. Order online for delivery or pickup.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Belle Food — Authentic Nigerian Cuisine",
    description: "Fresh, home-style Nigerian dishes. Order online today.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#c41c14",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;1,400;1,500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen bg-white font-sans antialiased">
        {children}
        <Toaster
          position="top-right"
          richColors
          toastOptions={{
            style: { fontFamily: "var(--font-plus-jakarta)" },
          }}
        />
      </body>
    </html>
  );
}
