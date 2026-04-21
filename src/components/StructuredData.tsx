interface OrganizationSchema {
  name?: string;
  url?: string;
  logo?: string;
  description?: string;
  sameAs?: string[];
}

interface ProductSchema {
  name: string;
  description: string;
  image: string;
  url: string;
  brand?: string;
  sku?: string;
  price?: string;
  priceCurrency?: string;
  availability?: string;
  category?: string;
}

interface ArticleSchema {
  title: string;
  description: string;
  image?: string;
  url: string;
  datePublished?: string;
  dateModified?: string;
  author?: string;
  publisher?: string;
  category?: string;
  tags?: string[];
}

export function OrganizationSchema({
  name = "MMES-MCTI",
  url = "https://mmes-website-production.up.railway.app",
  logo = "https://mmes-website-production.up.railway.app/images/og-image.jpg",
  description = "Leading provider of precision inertial navigation systems (AHRS, IMU, Gyroscope) for aerospace, defense, and industrial applications worldwide.",
  sameAs = [
    "https://www.linkedin.com/company/mmes-mcti",
    "https://twitter.com/mmes_mcti",
  ],
}: OrganizationSchema = {}) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": "https://mmes-website-production.up.railway.app/#organization",
    name,
    url,
    logo,
    description,
    sameAs,
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "sales",
      availableLanguage: ["English", "Chinese", "Russian", "Arabic", "Persian"],
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export function WebSiteSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": "https://mmes-website-production.up.railway.app/#website",
    name: "MMES-MCTI",
    url: "https://mmes-website-production.up.railway.app",
    publisher: {
      "@id": "https://mmes-website-production.up.railway.app/#organization",
    },
    potentialAction: {
      "@type": "SearchAction",
      target: "https://mmes-website-production.up.railway.app/{search_term_string}",
      "query-input": "required name=search_term_string",
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export function ProductSchema({
  name,
  description,
  image,
  url,
  brand = "MMES-MCTI",
  sku,
  price,
  priceCurrency = "USD",
  availability = "https://schema.org/InStock",
  category = "Inertial Navigation Systems",
}: ProductSchema) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name,
    description,
    image,
    url,
    brand: {
      "@type": "Brand",
      name: brand,
    },
    sku,
    manufacturer: {
      "@id": "https://mmes-website-production.up.railway.app/#organization",
    },
    category,
    offers: {
      "@type": "Offer",
      price,
      priceCurrency,
      availability,
      seller: {
        "@id": "https://mmes-website-production.up.railway.app/#organization",
      },
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export function ArticleSchema({
  title,
  description,
  image,
  url,
  datePublished,
  dateModified,
  author = "MMES-MCTI",
  publisher = "MMES-MCTI",
  category,
  tags = [],
}: ArticleSchema) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: title,
    description,
    image,
    url,
    datePublished,
    dateModified,
    author: {
      "@type": "Person",
      name: author,
    },
    publisher: {
      "@type": "Organization",
      name: publisher,
      "@id": "https://mmes-website-production.up.railway.app/#organization",
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": url,
    },
    articleSection: category,
    keywords: tags.join(", "),
    inLanguage: "en",
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export function BreadcrumbSchema({ items }: { items: { name: string; url: string }[] }) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export function FAQSchema({ faqs }: { faqs: { question: string; answer: string }[] }) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
