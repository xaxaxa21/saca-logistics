/**
 * Hub service ids and labels — must stay in sync with SERVICES_DATA ids in
 * components/landing/wservicesx.tsx (setActiveService uses these numeric ids).
 */
export const SERVICE_HUB_SECTION_ID = "services";

export type ServiceHubNavItem = {
  id: number;
  label: string;
};

export const SERVICE_HUB_NAV_ITEMS: ServiceHubNavItem[] = [
  { id: 1, label: "Global Import & Export" },
  { id: 2, label: "Fulfillment Solutions" },
  { id: 3, label: "Workforce & Operational Flexibility" },
  { id: 4, label: "Labeling, Packaging & Co-packing" },
  { id: 5, label: "3PL Logistics — Retail & FMCG" },
];
