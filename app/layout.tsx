import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { SITE_NAME, SITE_TAGLINE, SITE_URL } from "@/config/site";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: `${SITE_NAME} — ${SITE_TAGLINE}`,
    template: `%s | ${SITE_NAME}`,
  },
  description:
    "Curated directory of 1,000 places across Vietnam with practical guides on trains, eSIM, e-visa, and transfers for international travelers.",
  metadataBase: SITE_URL ? new URL(SITE_URL) : undefined,
  openGraph: {
    title: `${SITE_NAME} — Vietnam Travel Directory & Practical Guides`,
    description:
      "Explore places, regional routes, interactive maps, and authentic practical guides for travelling Vietnam.",
    siteName: SITE_NAME,
    locale: "en_US",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
      <head>
        <link
          rel="stylesheet"
          href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
          integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY="
          crossOrigin=""
        />
      </head>
      <body className="min-h-screen flex flex-col bg-[#FAF7F2] text-travel-text font-sans antialiased selection:bg-teal-100 selection:text-teal-900 relative">
        {/* Traditional Dong Son Bronze Drum Embossed Background Watermark */}
        <div
          className="fixed inset-0 pointer-events-none z-0 opacity-[0.12] bg-repeat bg-center"
          style={{
            backgroundImage: "url('/dong-son-texture.jpg')",
            backgroundSize: "900px auto",
            backgroundAttachment: "fixed",
          }}
          aria-hidden="true"
        />

        {/* Soft radial vignette: leaves center clean & emphasizes patterns on sides and corners */}
        <div
          className="fixed inset-0 pointer-events-none z-0 bg-[radial-gradient(ellipse_at_center,_transparent_30%,_rgba(250,247,242,0.85)_100%)]"
          aria-hidden="true"
        />

        <div className="relative z-10 flex flex-col min-h-screen">
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
