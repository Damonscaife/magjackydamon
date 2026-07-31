import type { Metadata } from "next";
import { Cormorant_Garamond, Inter } from "next/font/google";
import "./globals.css";

const serif = Cormorant_Garamond({
  variable: "--font-serif",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});
const sans = Inter({ variable: "--font-sans", subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL("https://magjacky.com"),
  title: "MagJacky — Clarity for the path ahead",
  description:
    "Intuitive tarot, astrology, and thoughtful AI guidance for modern life.",
  openGraph: {
    title: "MagJacky",
    description: "Clarity for the path ahead.",
    url: "https://magjacky.com",
    siteName: "MagJacky",
    images: [{ url: "/og.png", width: 1200, height: 630 }],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "MagJacky",
    description: "Clarity for the path ahead.",
    images: ["/og.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={`${serif.variable} ${sans.variable}`}>{children}</body>
    </html>
  );
}
