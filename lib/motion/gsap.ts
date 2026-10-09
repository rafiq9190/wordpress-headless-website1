"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

/**
 * Register plugins exactly once per client bundle. `registerPlugin` is
 * idempotent, but keeping it behind a module-level guard means it never runs
 * during SSR, where `document` is absent.
 */
let registered = false;

export function registerGsap() {
  if (registered || typeof window === "undefined") return;
  gsap.registerPlugin(ScrollTrigger);
  gsap.defaults({ ease: "power3.out", duration: 0.9 });
  registered = true;
}

/**
 * Single source of truth for the reduced-motion decision.
 *
 * Every animation in the app checks this. The CSS in globals.css also
 * neutralises durations, but GSAP writes inline styles that CSS can't reach —
 * an opacity-0 start state would otherwise leave content permanently invisible
 * for anyone who asked for less motion. That is the failure mode this prevents.
 */
export function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") return true;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export { gsap, ScrollTrigger };
