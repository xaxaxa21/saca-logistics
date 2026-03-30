import type { LucideIcon } from "lucide-react";
import { Warehouse, Package, Users, Tags } from "lucide-react";

/** Shared service card content for Services section and WServices hub modal */
export type ServiceCardData = {
  id: "3pl" | "fulfillment" | "workforce" | "value-added";
  icon: LucideIcon;
  title: string;
  subtitle: string;
  image: string;
  features: string[];
  color: string;
  gradient: string;
};

export const servicesCardsData: ServiceCardData[] = [
  {
    id: "3pl",
    icon: Warehouse,
    title: "3PL & Retail Logistics",
    subtitle:
      "Structured warehouse operations designed for accuracy, reliability and scalability",
    image:
      "https://images.unsplash.com/photo-1553413077-190dd305871c?q=80&w=800",
    features: [
      "Inbound reception and quality control",
      "Pallet storage and replenishment",
      "Picking and packing operations",
      "Cross-docking capabilities",
      "Inventory control and cycle counting",
      "KPI reporting and analytics",
    ],
    color: "#3988EA",
    gradient: "from-[#3988EA] to-[#124D95]",
  },
  {
    id: "fulfillment",
    icon: Package,
    title: "Fulfillment Solutions",
    subtitle:
      "Comprehensive B2B & B2C order processing for e-commerce and omnichannel businesses",
    image:
      "https://images.unsplash.com/photo-1578575437130-527eed3abbec?q=80&w=800",
    features: [
      "Pick & pack services",
      "Order consolidation and packaging",
      "Returns management (RMA)",
      "System integration (WMS/ERP)",
      "Performance monitoring",
      "Scalable with seasonal peaks",
    ],
    color: "#124D95",
    gradient: "from-[#124D95] to-[#0a2d4d]",
  },
  {
    id: "workforce",
    icon: Users,
    title: "Workforce Flexibility",
    subtitle:
      "Rapidly scale operational capacity with trained and certified staff",
    image:
      "https://images.unsplash.com/photo-1521737711867-e3b97375f902?q=80&w=800",
    features: [
      "Recruitment and placement",
      "Temporary and permanent staffing",
      "Operational ramp-up support",
      "Seasonal peak management",
      "Dedicated or shared teams",
      "Training and certification",
    ],
    color: "#F5A623",
    gradient: "from-[#F5A623] to-[#E09612]",
  },
  {
    id: "value-added",
    icon: Tags,
    title: "Value Added Services",
    subtitle: "Complementary services for compliance and retail standards",
    image:
      "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?q=80&w=800",
    features: [
      "Product labelling and re-labelling",
      "Translation services (Romanian/EU)",
      "Kitting and promotional packaging",
      "Co-packing operations",
      "Product preparation and rework",
      "Compliance documentation",
    ],
    color: "#3988EA",
    gradient: "from-[#3988EA] to-[#6ba8f0]",
  },
];

export function getServiceCardById(
  id: ServiceCardData["id"],
): ServiceCardData | undefined {
  return servicesCardsData.find((s) => s.id === id);
}
