"use client";

import { useEffect, useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { motion } from "framer-motion";
import { useParams } from "next/navigation";
import { Link } from "@/routing";
import { ShareButtons } from "@/components/ShareButtons";
import { ProductSchema, BreadcrumbSchema } from "@/components/StructuredData";
import { API_ENDPOINTS, IMAGE_BASE_URL } from "@/lib/api-config";

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

const specsIcons: Record<string, string> = {
  accuracy: "🎯",
  range: "🌐",
  power: "⚡",
  weight: "⚖️",
  interface: "🔌",
};

function getLocalizedContent(product: Product, locale: string) {
  const content = product.content[locale] || product.content.en || Object.values(product.content)[0];
  return {
    name: content?.name || product.id,
    description: content?.description || "",
  };
}

// Get image URL - use relative paths directly (from /public folder)
// when they start with '/', otherwise prepend IMAGE_BASE_URL
function getImageUrl(imagePath: string | undefined): string {
  if (!imagePath) return "";
  if (imagePath.startsWith("/")) return imagePath;
  return `${IMAGE_BASE_URL}${imagePath}`;
}

export default function ProductDetailPage() {
  const params = useParams();
  const t = useTranslations("products");
  const locale = useLocale();
  const slug = params.slug as string;
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProduct() {
      // Try fallback first for local dev (API likely not running)
      try {
        const fbRes = await Promise.race([
          fetch('/data/products.json'),
          new Promise((_, reject) => setTimeout(() => reject(new Error('timeout')), 3000))
        ]);
        const fbData = await fbRes.json();
        const fbFound = (fbData.data || []).find((p: Product) => p.slug.toLowerCase() === slug.toLowerCase());
        if (fbFound) {
          setProduct(fbFound);
          setLoading(false);
          return;
        }
      } catch (e) {
        console.log('Fallback timeout or failed, trying API...');
      }
      
      // Try API
      try {
        const res = await fetch(API_ENDPOINTS.products);
        const data = await res.json();
        const products: Product[] = data.data || [];
        const found = products.find((p) => p.slug.toLowerCase() === slug.toLowerCase());
        setProduct(found || null);
      } catch (error) {
        console.error("API fetch failed:", error);
      } finally {
        setLoading(false);
      }
    }
    if (slug) {
      fetchProduct();
    }
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen py-12 flex items-center justify-center">
        <div className="animate-spin w-12 h-12 border-4 border-[#0066ff] border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen py-12 flex items-center justify-center">
        <div className="text-center">
          <p className="text-slate-500 text-lg mb-4">产品未找到</p>
          <Link href="/products" className="text-blue-600 hover:underline">
            返回产品列表
          </Link>
        </div>
      </div>
    );
  }

  const localized = getLocalizedContent(product, locale);
  // Handle both old format (array) and new format (Record<string, array>)
  // If target language specs array is empty, fallback to English
  const specsArray: ProductSpec[] = Array.isArray(product.specs)
    ? product.specs
    : ((product.specs[locale]?.length ?? 0) > 0
        ? product.specs[locale]
        : product.specs['en'] || []);
  const specsEntries: [string, string][] = specsArray
    .map((s, idx) => [s.name || s.value || `参数${idx + 1}`, s.value + (s.unit ? ` ${s.unit}` : "")])
    .filter((entry): entry is [string, string] => (entry[0].trim() !== "" || entry[1].trim() !== ""));

  return (
    <>
      <ProductSchema
        name={localized.name}
        description={localized.description}
        image={getImageUrl(product.image)}
        url={`https://mmes-mcti.com/${locale}/products/${product.slug}`}
        sku={product.id}
      />
      <BreadcrumbSchema
        items={[
          { name: "Home", url: `https://mmes-mcti.com/${locale}` },
          { name: "Products", url: `https://mmes-mcti.com/${locale}/products` },
          { name: localized.name, url: `https://mmes-mcti.com/${locale}/products/${product.slug}` },
        ]}
      />
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-4">
        {/* Back Link */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="mb-8"
        >
          <Link
            href="/products"
            className="inline-flex items-center gap-2 text-slate-500 hover:text-blue-600 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span>{t("back") || "Back to Products"}</span>
          </Link>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Image Gallery */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-3 space-y-4"
          >
            {/* Main Image */}
            <div className="relative aspect-square rounded-3xl overflow-hidden bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900 shadow-2xl">
              <div className="absolute inset-0 backdrop-blur-xl opacity-20" />
              {product.image ? (
                <img
                  src={getImageUrl(product.image)}
                  alt={localized.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center text-slate-400 z-10">
                  <svg className="w-24 h-24" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                  </svg>
                </div>
              )}
              {/* Product Badge */}
              <div className="absolute top-6 left-6 z-20 px-4 py-2 bg-white/90 dark:bg-slate-800/90 backdrop-blur-md rounded-full shadow-lg">
                <span className="text-sm font-bold bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
                  {localized.name}
                </span>
              </div>
            </div>
          </motion.div>

          {/* Product Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-2 space-y-6"
          >
            {/* Title Card */}
            <div className="p-8 rounded-3xl bg-white dark:bg-slate-800 shadow-xl border border-slate-200 dark:border-slate-700">
              <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">
                {localized.name}
              </h1>
              <p className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed">
                {localized.description}
              </p>
            </div>

            {/* Specs Card */}
            <div className="p-8 rounded-3xl bg-gradient-to-br from-blue-600/5 to-cyan-500/5 dark:from-blue-600/10 dark:to-cyan-500/10 border border-blue-200 dark:border-blue-800 shadow-lg">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 flex items-center justify-center">
                  <span className="text-white text-lg">⚙️</span>
                </div>
                <h2 className="text-xl font-bold">{t("detail.specs")}</h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {specsEntries.map(([key, value]) => (
                  <motion.div
                    key={key}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex items-center gap-3 p-4 rounded-2xl bg-white dark:bg-slate-800 shadow-sm border border-slate-100 dark:border-slate-700 hover:shadow-md hover:border-blue-300 dark:hover:border-blue-600 transition-all"
                  >
                    <span className="text-2xl">{specsIcons[key.toLowerCase()] || "📊"}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-slate-500 uppercase tracking-wider truncate">{key}</p>
                      <p className="font-bold text-lg truncate">{value}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* CTA Card */}
            <div className="p-6 rounded-3xl bg-gradient-to-r from-blue-600 to-cyan-500 shadow-xl">
              <p className="text-white/90 text-center mb-4">
                {t("ctaText")}
              </p>
              <Link
                href="/contact"
                className="block w-full py-4 bg-white text-blue-600 font-bold rounded-xl text-center hover:bg-slate-100 transition-colors shadow-lg"
              >
                {t("detail.quote")}
              </Link>
            </div>

            {/* Share */}
            <div className="p-6 rounded-2xl bg-slate-100 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
              <p className="text-sm text-slate-500 mb-4 text-center">{t("share")}</p>
              <ShareButtons
                url={`https://mmes-mcti.com/products/${product.slug}`}
                title={`${localized.name} - ${localized.description}`}
              />
            </div>
          </motion.div>
        </div>
      </div>
    </div>
    </>
  );
}