"use client";

import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";

declare global {
  interface Window {
    gtag?: (
      command: string,
      targetId: string,
      config?: Record<string, any>
    ) => void;
  }
}

export function GoogleAnalytics() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (typeof window.gtag !== "undefined") {
      const url = pathname + (searchParams?.toString() ? `?${searchParams.toString()}` : "");
      
      // Enviar pageview a Google Analytics
      window.gtag("config", "G-RR1LKGLVVM", {
        page_path: url,
      });

      console.log("📊 GA Pageview:", url);
    }
  }, [pathname, searchParams]);

  return null;
}

