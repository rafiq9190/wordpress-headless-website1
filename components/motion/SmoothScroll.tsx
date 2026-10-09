"use client";

import Lenis from "lenis";
import { useEffect } from "react";

import { gsap, prefersReducedMotion, registerGsap, ScrollTrigger } from "@/lib/motion/gsap";

/**
 * Lenis smooth scrolling, driven by GSAP's ticker.
 *
 * Sharing one ticker instead of running a second requestAnimationFrame loop
 * keeps Lenis and ScrollTrigger on the same frame — otherwise pinned sections
 * visibly lag the scroll position by a frame. `lagSmoothing(0)` stops GSAP
 * from fast-forwarding after a tab is backgrounded, which would snap the page.
 *
 * Renders nothing, and does nothing at all under `prefers-reduced-motion`,
 * where native scrolling is what the visitor asked for.
 */
export function SmoothScroll() {
  useEffect(() => {
    registerGsap();
    if (prefersReducedMotion()) return;

    const lenis = new Lenis({
      duration: 1.05,
      smoothWheel: true,
      touchMultiplier: 1.6,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    });

    lenis.on("scroll", ScrollTrigger.update);

    const tick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(tick);
      gsap.ticker.lagSmoothing(500, 33);
      lenis.destroy();
    };
  }, []);

  return null;
}
