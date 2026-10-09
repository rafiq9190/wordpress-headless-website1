import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { CtaBand } from "@/components/sections/CtaBand";
import { Stats } from "@/components/sections/Stats";
import { WpPageView } from "@/components/wp/WpPageView";
import { getPageByUri } from "@/lib/wp/api";
import { absoluteUrl } from "@/lib/wp/uri";
import { stripHtml, truncate } from "@/lib/utils";

const WP_URI = "/about/";

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPageByUri(WP_URI);
  if (!page) return { title: "About" };

  return {
    title: page.title,
    description: truncate(stripHtml(page.content), 160),
    alternates: { canonical: absoluteUrl("/about") },
    openGraph: { title: page.title, type: "article" },
  };
}

export default async function AboutPage() {
  const page = await getPageByUri(WP_URI);
  if (!page) notFound();

  return (
    <>
      <WpPageView page={page} eyebrow="About us" />
      <Stats />
      <CtaBand />
    </>
  );
}
