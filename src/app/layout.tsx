import type { Metadata } from "next";
import { Geist, Space_Grotesk } from "next/font/google";
import { LenisProvider } from "@/shared/animation/LenisProvider";
import { Preloader } from "@/shared/ui/Preloader";
import { PointerGlow } from "@/shared/ui/PointerGlow";
import { CustomCursor } from "@/shared/ui/CustomCursor";
import { ScrollProgress } from "@/shared/ui/ScrollProgress";
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
      <body className="min-h-full bg-[#050407] text-zinc-200">
        <div className="aurora-bg" aria-hidden />
        <div className="aurora-vignette" aria-hidden />
        <ScrollProgress />
        <PointerGlow />
        <CustomCursor />
        <Preloader />
        <LenisProvider>{children}</LenisProvider>
        <div className="grain" aria-hidden />
      </body>
    </html>
  );
}
