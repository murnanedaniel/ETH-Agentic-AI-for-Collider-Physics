import type { Metadata } from "next";
import { Geist, Geist_Mono, EB_Garamond } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const ebGaramond = EB_Garamond({
  variable: "--font-serif",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AI in Research — ETH Zürich 2026",
  description: "Agentic AI for Particle Physics · ETH Zürich mini-workshop",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${ebGaramond.variable} h-full antialiased`}
    >
      {/* No body-level overflow-hidden: the deck (Stage) and /embed clip
          themselves (w-screen h-screen overflow-hidden), while /article needs
          the document to scroll. */}
      <body className="min-h-full flex flex-col bg-black text-zinc-100">
        {children}
      </body>
    </html>
  );
}
