import type { Metadata } from "next";
import { Geist, Space_Grotesk } from "next/font/google";
import { LenisProvider } from "@/shared/animation/LenisProvider";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-display",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AURORA — Light that understands you",
  description:
    "A concept landing page for AURORA, a fictional ambient smart lamp. Scroll-driven storytelling built with GSAP, Lenis and Next.js — an animation craft showcase.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${spaceGrotesk.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-[#08070b] text-zinc-200">
        <LenisProvider>{children}</LenisProvider>
      </body>
    </html>
  );
}
