"use client";

import { useEffect, useRef } from "react";

import { gsap, prefersReducedMotion, registerGsap } from "./gsap";

/**
 * Setup may return a cleanup function, for anything `gsap.context()` does not
 * track itself — `gsap.matchMedia()` instances and manual event listeners.
 */
type Setup = (context: {
  root: HTMLElement;
  gsap: typeof gsap;
}) => void | (() => void);

/**
 * Scope a set of GSAP animations to one element and tear them down cleanly.
 *
 * Uses `gsap.context()` so every tween, timeline and ScrollTrigger created
 * inside `setup` is tracked and reverted together on unmount. Without the
 * `revert()`, ScrollTriggers from an unmounted route keep observing scroll and
 * leak across client-side navigations.
 *
 * Returns early under `prefers-reduced-motion`, which means elements keep the
 * static styles they were authored with — so animated-in content must be
 * visible by default and animated *from* a hidden state inside `setup`, never
 * the other way round.
 */
export function useGsap<T extends HTMLElement = HTMLDivElement>(setup: Setup) {
  const ref = useRef<T | null>(null);
  const setupRef = useRef(setup);

  // Keep the latest closure without re-running the animation effect on every
  // render. Assigned in an effect rather than during render — writing to a ref
  // while rendering is not safe under concurrent rendering. This effect is
  // declared first, so it has already run by the time the one below fires.
  useEffect(() => {
    setupRef.current = setup;
  });

  useEffect(() => {
    const root = ref.current;
    if (!root) return;

    registerGsap();
    if (prefersReducedMotion()) return;

    let cleanup: void | (() => void);

    const context = gsap.context(() => {
      cleanup = setupRef.current({ root, gsap });
    }, root);

    return () => {
      cleanup?.();
      context.revert();
    };
  }, []);

  return ref;
}
