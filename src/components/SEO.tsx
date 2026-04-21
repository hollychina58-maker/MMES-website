import { routing } from "@/routing";
import { OrganizationSchema, WebSiteSchema } from "./StructuredData";

const BASE_URL = "https://mmes-website-production.up.railway.app";

interface SEOProps {
  title?: string;
  description?: string;
  canonical?: string;
  locale?: string;
  type?: "website" | "article";
  image?: string;
}

export function SEO({
  title = "MMES-MCTI - Precision Inertial Navigation Systems",
  description = "Leading provider of precision inertial navigation systems (AHRS, IMU, Gyroscope) for aerospace, defense, and industrial applications worldwide.",
  canonical,
  locale = "en",
  type = "website",
  image = "/images/og-image.jpg",
}: SEOProps) {
  const allLocales = routing.locales.map((l) => ({
    locale: l,
    href: `${BASE_URL}/${l}${canonical || ""}`,
  }));

  return (
    <>
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={`${BASE_URL}/${locale}${canonical || ""}`} />

      {/* Open Graph */}
      <meta property="og:type" content={type} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={`${BASE_URL}${image}`} />
      <meta property="og:url" content={`${BASE_URL}/${locale}${canonical || ""}`} />
      <meta property="og:site_name" content="MMES-MCTI" />
      <meta property="og:locale" content={locale} />

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={`${BASE_URL}${image}`} />
      <meta name="twitter:site" content="@mmes_mcti" />

      {/* hreflang - include all locales including current */}
      <link rel="alternate" hrefLang="x-default" href={`${BASE_URL}/en${canonical || ""}`} />
      {allLocales.map((link) => (
        <link
          key={link.locale}
          rel="alternate"
          hrefLang={link.locale}
          href={link.href}
        />
      ))}

      {/* Robots */}
      <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />

      {/* Structured Data */}
      <OrganizationSchema />
      <WebSiteSchema />
    </>
  );
}
