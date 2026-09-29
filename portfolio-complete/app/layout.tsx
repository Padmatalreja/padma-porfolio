import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Playfair_Display } from "next/font/google";
import "./globals.css";
import { siteUrl } from "@/lib/env";

// Inter — body copy, UI labels, form elements, admin
// Weights: 400 (body) · 500 (medium) · 600 (semibold) · 700 (bold) only — 800/900 not used
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

// Playfair Display — headings, hero, editorial display
// Weights: 400 (body serif) · 600 (semibold) · 700 (bold headings) — 500/800/900 unused
// Both normal and italic styles needed for editorial italics
const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
  weight: ["400", "600", "700"],
  style: ["normal", "italic"],
});

// Static metadata — no DB call needed here.
// The (public) segment layout provides dynamic metadata with revalidate=60.
// This root layout covers admin + error pages only.
export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Padma Kumari Talreja | QA Engineer Portfolio",
    template: "%s | Padma Kumari Talreja",
  },
  description: "Technical Analyst and QA Engineer portfolio — software testing, automation, and quality assurance.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${playfair.variable}`}
      data-scroll-behavior="smooth"
    >
      <body className="antialiased">{children}</body>
    </html>
  );
}
