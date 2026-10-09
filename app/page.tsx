import { Suspense } from "react";

import { CtaBand } from "@/components/sections/CtaBand";
import { Faq } from "@/components/sections/Faq";
import { Features } from "@/components/sections/Features";
import { Hero } from "@/components/sections/Hero";
import { LatestPosts, LatestPostsSkeleton } from "@/components/sections/LatestPosts";
import { LogoWall } from "@/components/sections/LogoWall";
import { Stats } from "@/components/sections/Stats";
import { Testimonials } from "@/components/sections/Testimonials";
import { PricingPreview } from "@/components/sections/PricingPreview";

export default function HomePage() {
  return (
    <>
      <Hero />
      <LogoWall />
      <Features />
      <Stats />

      {/*
        The only section that touches WordPress. Its own Suspense boundary means
        a slow WPGraphQL response delays this grid alone — the hero and features
        are static and stream immediately.
      */}
      <Suspense fallback={<LatestPostsSkeleton />}>
        <LatestPosts />
      </Suspense>

      <Testimonials />
      <PricingPreview />
      <Faq />
      <CtaBand />
    </>
  );
}
