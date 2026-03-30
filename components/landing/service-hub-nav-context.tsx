"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { ScrollSmoother } from "gsap/ScrollSmoother";
import { SERVICE_HUB_SECTION_ID } from "@/lib/service-hub-nav";

/** Matches prior header `scrollToSection` offset */
const HEADER_SCROLL_OFFSET_PX = 80;

function scrollElementIntoViewSmooth(el: HTMLElement): void {
  const smoother = ScrollSmoother.get();
  if (smoother) {
    smoother.scrollTo(el, true, "top 100px");
  } else {
    const top =
      el.getBoundingClientRect().top + window.scrollY - HEADER_SCROLL_OFFSET_PX;
    window.scrollTo({ top, behavior: "smooth" });
  }
}

export type ServiceHubNavContextValue = {
  pendingServiceId: number | null;
  requestNavigateToService: (serviceId: number) => void;
  clearPendingService: () => void;
  scrollToSectionHref: (href: string) => void;
};

const ServiceHubNavContext = createContext<ServiceHubNavContextValue | null>(
  null,
);

export function ServiceHubNavProvider({ children }: { children: ReactNode }) {
  const [pendingServiceId, setPendingServiceId] = useState<number | null>(null);

  const clearPendingService = useCallback(() => {
    setPendingServiceId(null);
  }, []);

  const scrollToSectionHref = useCallback((href: string) => {
    const sel = href.startsWith("#") ? href : `#${href}`;
    const el = document.querySelector(sel);
    if (!(el instanceof HTMLElement)) return;
    scrollElementIntoViewSmooth(el);
  }, []);

  const requestNavigateToService = useCallback((serviceId: number) => {
    const el = document.getElementById(SERVICE_HUB_SECTION_ID);
    if (!el) return;
    scrollElementIntoViewSmooth(el);
    setPendingServiceId(serviceId);
  }, []);

  const value = useMemo(
    () => ({
      pendingServiceId,
      requestNavigateToService,
      clearPendingService,
      scrollToSectionHref,
    }),
    [
      pendingServiceId,
      requestNavigateToService,
      clearPendingService,
      scrollToSectionHref,
    ],
  );

  return (
    <ServiceHubNavContext.Provider value={value}>
      {children}
    </ServiceHubNavContext.Provider>
  );
}

/** For Header — must be used under ServiceHubNavProvider */
export function useServiceHubNav(): ServiceHubNavContextValue {
  const ctx = useContext(ServiceHubNavContext);
  if (!ctx) {
    throw new Error(
      "useServiceHubNav must be used within ServiceHubNavProvider",
    );
  }
  return ctx;
}

/** For WServicesSection — returns null if provider missing (safe for Storybook / tests) */
export function useServiceHubNavOptional(): ServiceHubNavContextValue | null {
  return useContext(ServiceHubNavContext);
}
