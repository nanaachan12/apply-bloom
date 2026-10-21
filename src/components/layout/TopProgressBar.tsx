"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

export function TopProgressBar() {
  const pathname = usePathname();
  const [isNavigating, setIsNavigating] = useState(false);
  const [progress, setProgress] = useState(0);

  // When pathname changes, finalize progress and hide
  useEffect(() => {
    setProgress(100);
    const timer = setTimeout(() => {
      setIsNavigating(false);
      setProgress(0);
    }, 200);

    return () => clearTimeout(timer);
  }, [pathname]);

  // Listen to in-app link clicks for instant 0ms visual feedback
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const target = (e.target as HTMLElement).closest("a");
      if (
        target &&
        target.href &&
        target.href.startsWith(window.location.origin) &&
        !target.target &&
        !e.ctrlKey &&
        !e.metaKey &&
        !e.shiftKey
      ) {
        try {
          const url = new URL(target.href);
          if (url.pathname !== window.location.pathname) {
            setIsNavigating(true);
            setProgress(35);
            setTimeout(() => {
              setProgress((p) => (p > 0 && p < 80 ? 75 : p));
            }, 120);
          }
        } catch {
          // ignore
        }
      }
    };

    window.addEventListener("click", handleClick, { capture: true });
    return () =>
      window.removeEventListener("click", handleClick, { capture: true });
  }, []);

  if (!isNavigating && progress === 0) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-50 h-[3px] bg-transparent pointer-events-none">
      <div
        className="h-full bg-linear-to-r from-[#788B4E] via-[#A8D063] to-[#F45B88] shadow-[0_0_8px_rgba(155,195,88,0.7)]"
        style={{
          width: `${progress}%`,
          opacity: progress === 100 ? 0 : 1,
          transition:
            progress === 100
              ? "width 150ms ease-out, opacity 200ms ease-out 80ms"
              : "width 250ms cubic-bezier(0.2, 0.8, 0.4, 1)",
        }}
      />
    </div>
  );
}
