export function StructuredData() {
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "SACA Logistics",
    alternateName: "Saca Experts SRL",
    url: "https://sacalogistics.com",
    logo: "https://sacalogistics.com/logo.png",
    description:
      "From sourcing to shelf – fully managed. Flexible 3PL, fulfillment & global logistics solutions for retail, FMCG and e-commerce.",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Bucharest",
      addressCountry: "Romania",
    },
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "customer service",
      email: "contact@sacalogistics.com",
    },
    sameAs: ["https://www.linkedin.com/company/sacalogistics"],
  };

  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    serviceType: "Third-Party Logistics (3PL)",
    provider: {
      "@type": "Organization",
      name: "SACA Logistics",
    },
    areaServed: {
      "@type": "Place",
      name: "Europe",
    },
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Logistics Services",
      itemListElement: [
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "3PL & Retail Logistics",
            description:
              "Structured warehouse operations designed for accuracy, reliability and scalability.",
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Fulfillment Solutions",
            description:
              "Comprehensive B2B & B2C order processing for e-commerce and omnichannel businesses.",
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Workforce Flexibility",
            description:
              "Rapidly scale operational capacity with trained and certified staff.",
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Labeling, Packaging & Co-packing",
            description:
              "Labelling, kitting, co-packing, and product preparation services.",
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Global Import/Export",
            description:
              "International freight coordination and customs management.",
          },
        },
      ],
    },
  };

  const localBusinessSchema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: "SACA Logistics",
    "@id": "https://sacalogistics.com",
    url: "https://sacalogistics.com",
    image: "https://sacalogistics.com/warehouse.jpg",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Bucharest",
      addressCountry: "RO",
    },
    priceRange: "$$",
    openingHoursSpecification: {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      opens: "08:00",
      closes: "18:00",
    },
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "What services does SACA Logistics offer?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "SACA Logistics offers comprehensive 3PL services including warehousing, fulfillment, workforce solutions, value-added services like labeling and kitting, and global import/export logistics.",
        },
      },
      {
        "@type": "Question",
        name: "What industries does SACA Logistics serve?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "SACA Logistics specializes in retail, FMCG (Fast-Moving Consumer Goods), and e-commerce logistics, serving businesses of all sizes across Europe.",
        },
      },
      {
        "@type": "Question",
        name: "What is the warehouse capacity of SACA Logistics?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Our state-of-the-art facility offers 10,000 m² of warehouse space, with 7,000-8,000 pallet positions, 150 e-commerce pick lines, and 6 expandable loading docks.",
        },
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(localBusinessSchema),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
    </>
  );
}
