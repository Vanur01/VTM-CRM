"use client";

import { useEffect } from "react";
import dynamic from "next/dynamic";

export default function LenisProvider() {
  useEffect(() => {
    // Check if we're in browser environment
    if (typeof window === "undefined") return;

    // Dynamically import Lenis to avoid SSR issues
    import("@studio-freight/lenis").then(({ default: Lenis }) => {
      const lenis = new Lenis();

      function raf(time: any) {
        lenis.raf(time);
        requestAnimationFrame(raf);
      }

      requestAnimationFrame(raf);

      return () => {
        lenis.destroy();
      };
    });
  }, []);

  return null;
}
