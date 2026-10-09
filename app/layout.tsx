import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono, Space_Grotesk } from "next/font/google";

import { Aurora } from "@/components/visual/Aurora";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { SmoothScroll } from "@/components/motion/SmoothScroll";
import { getMenu, getSiteSettings } from "@/lib/wp/api";
import { absoluteUrl } from "@/lib/wp/uri";

import "./globals.css";

const display = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  display: "swap",
});

const sans = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const mono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  display: "swap",
});

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();

  return {
    metadataBase: new URL(absoluteUrl("/")),
    title: {
      default: "Ledgerline — Financial clarity, engineered",
      template: `%s · Ledgerline`,
    },
    description:
      settings.description ||
      "Ledgerline unifies accounts, forecasts and reporting into one real-time financial operating system.",
    applicationName: "Ledgerline",
    openGraph: {
      type: "website",
      siteName: "Ledgerline",
      url: absoluteUrl("/"),
    },
    twitter: { card: "summary_large_image" },
    robots: { index: true, follow: true },
  };
}

export const viewport: Viewport = {
  themeColor: "#06060a",
  colorScheme: "dark",
};

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const menu = await getMenu("main");

  return (
    <html
      lang="en"
      className={`${display.variable} ${sans.variable} ${mono.variable} antialiased`}
    >
      <body className="min-h-dvh bg-canvas text-ink">
        <SmoothScroll />
        <Aurora />

        <a
          href="#main"
          className="sr-only focus-visible:not-sr-only focus-visible:fixed focus-visible:top-4 focus-visible:left-4 focus-visible:z-100 focus-visible:rounded-full focus-visible:bg-accent focus-visible:px-5 focus-visible:py-2.5 focus-visible:text-sm focus-visible:font-semibold focus-visible:text-canvas"
        >
          Skip to content
        </a>

        <div className="relative flex min-h-dvh flex-col">
          <Header menu={menu} />
          <main id="main" className="flex-1">
            {children}
          </main>
          <Footer menu={menu} />
        </div>
      </body>
    </html>
  );
}
