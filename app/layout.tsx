import type { Metadata } from "next";
import { Geist } from "next/font/google";
import { Instrument_Serif } from "next/font/google";
import { Suspense } from "react";
import "./globals.css";
import { BRAND } from "@/lib/constants";
import { GuestProvider } from "@/components/guest/GuestProvider";
import { Chrome } from "@/components/layout/Chrome";

const sans = Geist({
  variable: "--font-sans",
  subsets: ["latin"],
});

const display = Instrument_Serif({
  variable: "--font-display",
  subsets: ["latin"],
  weight: "400",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://cineverse.local"),
  title: { default: BRAND.name, template: `%s · ${BRAND.name}` },
  description: BRAND.description,
  openGraph: {
    title: BRAND.name,
    description: BRAND.tagline,
    type: "website",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${sans.variable} ${display.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-bg text-ink">
        <a className="skip-link" href="#main">
          Skip to content
        </a>
        <GuestProvider>
          <Suspense fallback={<div className="h-16 border-b border-line" />}>
            <Chrome>{children}</Chrome>
          </Suspense>
        </GuestProvider>
      </body>
    </html>
  );
}
