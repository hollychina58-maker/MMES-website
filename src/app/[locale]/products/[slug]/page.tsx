import { Metadata } from "next";
import { API_ENDPOINTS, IMAGE_BASE_URL } from "@/lib/api-config";
import { ProductDetailClient } from "./ProductDetailClient";

interface ProductSpec {
  name: string;
  value: string;
  unit?: string;
}

interface Product {
  id: string;
  slug: string;
  image: string;
  specs: Record<string, ProductSpec[]>;
  published: boolean;
  content: Record<string, { name: string; description: string }>;
}

function getImageUrl(imagePath: string | undefined): string {
  if (!imagePath) return "";
  if (imagePath.startsWith("/images/products/")) {
    return imagePath.replace("/images/products/", "/images/");
  }
  if (imagePath.startsWith("/images/")) return imagePath;
  if (imagePath.startsWith("/")) return imagePath;
  if (imagePath.startsWith("http://") || imagePath.startsWith("https://")) return imagePath;
  return `${IMAGE_BASE_URL}${imagePath}`;
}

async function getProduct(slug: string): Promise<Product | null> {
  try {
    const res = await fetch(API_ENDPOINTS.products, { cache: "no-store" });
    if (res.ok) {
      const data = await res.json();
      const products: Product[] = data.data || [];
      return products.find((p) => p.slug.toLowerCase() === slug.toLowerCase()) || null;
    }
  } catch (error) {
    console.error("API fetch failed:", error);
  }

  // Fallback to static JSON
  try {
    const fbRes = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || ""}/data/products.json`, { cache: "no-store" });
    if (fbRes.ok) {
      const fbData = await fbRes.json();
      return (fbData.data || []).find((p: Product) => p.slug.toLowerCase() === slug.toLowerCase()) || null;
    }
  } catch (error) {
    console.error("Fallback also failed:", error);
  }

  return null;
}

async function getProductContent(product: Product | null, locale: string) {
  if (!product) return { name: "", description: "", image: "" };
  const content = product.content[locale] || product.content.en || Object.values(product.content)[0];
  return {
    name: content?.name || product.id,
    description: content?.description || "",
    image: getImageUrl(product.image),
  };
}

type Props = {
  params: Promise<{ locale: string; slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  const product = await getProduct(slug);

  if (!product) {
    return {
      title: "Product Not Found - MMES-MCTI",
      description: "The requested product could not be found.",
    };
  }

  const { name, description, image } = await getProductContent(product, locale);
  const url = `https://mmes-website-production.up.railway.app/${locale}/products/${product.slug}`;

  return {
    title: `${name} - MMES-MCTI`,
    description,
    alternates: {
      canonical: url,
      languages: {
        en: `https://mmes-website-production.up.railway.app/en/products/${product.slug}`,
        zh: `https://mmes-website-production.up.railway.app/zh/products/${product.slug}`,
        ru: `https://mmes-website-production.up.railway.app/ru/products/${product.slug}`,
        ar: `https://mmes-website-production.up.railway.app/ar/products/${product.slug}`,
        fa: `https://mmes-website-production.up.railway.app/fa/products/${product.slug}`,
        la: `https://mmes-mctI.com/la/products/${product.slug}`,
      },
    },
    openGraph: {
      type: "website",
      title: name,
      description,
      url,
      siteName: "MMES-MCTI",
      locale,
      images: [
        {
          url: image,
          width: 800,
          height: 800,
          alt: name,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: name,
      description,
      images: [image],
    },
  };
}

export default async function ProductDetailPage() {
  return <ProductDetailClient />;
}