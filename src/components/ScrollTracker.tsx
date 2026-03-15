"use client";

import { useEffect } from "react";
import { trackEvent } from "@/lib/analytics";

export function ScrollTracker() {
  useEffect(() => {
    const thresholds = [50, 90];
    const fired = new Set<number>();

    function onScroll() {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (docHeight <= 0) return;
      const pct = Math.round((scrollTop / docHeight) * 100);

      for (const t of thresholds) {
        if (pct >= t && !fired.has(t)) {
          fired.add(t);
          trackEvent("scroll_depth", {
            depth: t,
            page: window.location.pathname,
          });
        }
      }
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return null;
}
