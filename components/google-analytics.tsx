"use client";

import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";

declare global {
  interface Window {
    gtag?: (
      command: string,
      targetId: string | Date,
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

      // Enviar evento page_view explícito
      window.gtag("event", "page_view", {
        page_path: url,
        page_title: document.title,
        page_location: window.location.href,
      });

      // También actualizar la configuración
      window.gtag("config", "G-RR1LKGLVVM", {
        page_path: url,
      });

      console.log("📊 GA Pageview enviado:", {
        page_path: url,
        page_title: document.title,
        page_location: window.location.href,
      });
    }
  }, [pathname, searchParams]);

  return null;
}

