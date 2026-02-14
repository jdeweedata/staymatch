import type { Metadata, Viewport } from "next";
import { DM_Sans, Playfair_Display, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
  display: "swap",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
  display: "swap",
});

export const metadata: Metadata = {
  title: "StayMatch | Stop Searching. Start Matching.",
  description:
    "AI-powered accommodation matching. Swipe to build your taste profile, get curated hotel matches with verified data from real travelers.",
  keywords: [
    "hotel booking",
    "accommodation",
    "travel",
    "digital nomad",
    "remote work",
    "AI travel",
  ],
  authors: [{ name: "StayMatch" }],
  openGraph: {
    title: "StayMatch | Stop Searching. Start Matching.",
    description:
      "AI-powered accommodation matching with verified traveler data.",
    url: "https://staymatch.co",
    siteName: "StayMatch",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "StayMatch | Stop Searching. Start Matching.",
    description:
      "AI-powered accommodation matching with verified traveler data.",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#FFFFFF",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${dmSans.variable} ${playfair.variable} ${jetbrainsMono.variable}`}
    >
      <body className="min-h-screen bg-background font-sans">
        {children}
      </body>
    </html>
  );
}
