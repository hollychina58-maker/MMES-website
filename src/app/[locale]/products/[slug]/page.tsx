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

function getLocalizedContent(product: Product, locale: string) {
  const content = product.content[locale] || product.content.en || Object.values(product.content)[0];
  return {
    name: content?.name || product.id,
    description: content?.description || "",
  };
}

// Get image URL - normalize paths for static assets
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

export default function ProductDetailPage() {
  const params = useParams();
  const t = useTranslations("products");
  const locale = useLocale();
  const slug = params.slug as string;
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProduct() {
      try {
        const res = await Promise.race([
          fetch(API_ENDPOINTS.products),
          new Promise((_, reject) => setTimeout(() => reject(new Error('timeout')), 3000))
        ]) as Response;
        const data = await res.json();
        const products: Product[] = data.data || [];
        const found = products.find((p) => p.slug.toLowerCase() === slug.toLowerCase());
        setProduct(found || null);
        if (found) {
          setLoading(false);
          return;
        }
      } catch (error) {
        console.error("API fetch failed or timed out:", error);
      }

      // Fallback to static JSON when API unavailable
      try {
        const fbRes = await Promise.race([
          fetch('/data/products.json'),
          new Promise((_, reject) => setTimeout(() => reject(new Error('timeout')), 3000))
        ]) as Response;
        const fbData = await fbRes.json();
        const fbFound = (fbData.data || []).find((p: Product) => p.slug.toLowerCase() === slug.toLowerCase());
        if (fbFound) {
          setProduct(fbFound);
        }
      } catch (fbErr) {
        console.error("Fallback also failed:", fbErr);
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
  const specsArray: ProductSpec[] = Array.isArray(product.specs)
    ? product.specs
    : ((product.specs[locale]?.length ?? 0) > 0
        ? product.specs[locale]
        : product.specs['en'] || []);
  const specsEntries: { name: string; value: string }[] = specsArray
    .map((s, idx) => ({
      name: s.name || s.value || `参数${idx + 1}`,
      value: s.value + (s.unit ? ` ${s.unit}` : "")
    }))
    .filter((entry) => entry.name.trim() !== "" || entry.value.trim() !== "");

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
      <div className="min-h-screen">
        <div className="container mx-auto px-4 py-6 lg:py-8">
          {/* Back Link */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="mb-4 lg:mb-6"
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

          {/* Main Content - Two Column Layout */}
          <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
            {/* Left Column - Image (Sticky) */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="lg:w-5/12 xl:w-1/2"
            >
              <div className="lg:sticky lg:top-8">
                {/* Main Image */}
                <div className="relative aspect-square rounded-xl lg:rounded-2xl overflow-hidden bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900 shadow-lg lg:shadow-xl">
                  <div className="absolute inset-0 backdrop-blur-xl opacity-20" />
                  {product.image ? (
                    <img
                      src={getImageUrl(product.image)}
                      alt={localized.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center text-slate-400 z-10">
                      <svg className="w-20 lg:w-24 h-20 lg:h-24" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                      </svg>
                    </div>
                  )}
                  {/* Product Badge */}
                  <div className="absolute top-3 left-3 lg:top-4 lg:left-4 z-20 px-3 py-1.5 bg-white/90 dark:bg-slate-800/90 backdrop-blur-md rounded-full shadow-lg">
                    <span className="text-xs lg:text-sm font-bold bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent whitespace-nowrap">
                      {localized.name}
                    </span>
                  </div>
                </div>

                {/* CTA Card - Below Image */}
                <div className="mt-4 p-4 lg:p-5 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 shadow-lg lg:shadow-xl">
                  <p className="text-white/90 text-center mb-3 text-sm lg:text-base">
                    {t("ctaText")}
                  </p>
                  <Link
                    href="/contact"
                    className="block w-full py-2.5 lg:py-3 bg-white text-blue-600 font-bold rounded-lg text-center hover:bg-slate-100 transition-colors shadow text-sm lg:text-base"
                  >
                    {t("detail.quote")}
                  </Link>
                </div>

                {/* Share - Below CTA */}
                <div className="mt-4 p-4 rounded-xl bg-slate-100 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
                  <p className="text-xs lg:text-sm text-slate-500 mb-3 text-center">{t("share")}</p>
                  <ShareButtons
                    url={`https://mmes-mcti.com/products/${product.slug}`}
                    title={`${localized.name} - ${localized.description}`}
                  />
                </div>
              </div>
            </motion.div>

            {/* Right Column - Product Info & Specs (Scrollable) */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="lg:w-7/12 xl:w-1/2 space-y-4 lg:space-y-6"
            >
              {/* Title Card */}
              <div className="p-5 lg:p-6 xl:p-8 rounded-xl lg:rounded-2xl bg-white dark:bg-slate-800 shadow-lg border border-slate-200 dark:border-slate-700">
                <h1 className="text-xl lg:text-2xl xl:text-3xl font-bold mb-2 lg:mb-3 bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-300 bg-clip-text text-transparent leading-tight">
                  {localized.name}
                </h1>
                <p className="text-sm lg:text-base text-slate-600 dark:text-slate-400 leading-relaxed">
                  {localized.description}
                </p>
              </div>

              {/* Specs Card */}
              <div className="p-5 lg:p-6 xl:p-8 rounded-xl lg:rounded-2xl bg-gradient-to-br from-blue-600/5 to-cyan-500/5 dark:from-blue-600/10 dark:to-cyan-500/10 border border-blue-200 dark:border-blue-800 shadow-lg">
                <div className="flex items-center gap-3 mb-4 lg:mb-5">
                  <div className="w-8 h-8 lg:w-10 lg:h-10 rounded-lg lg:rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 flex items-center justify-center">
                    <span className="text-white text-sm lg:text-lg">⚙️</span>
                  </div>
                  <h2 className="text-base lg:text-lg xl:text-xl font-bold">{t("detail.specs")}</h2>
                </div>

                {/* Specs Table */}
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <tbody>
                      {specsEntries.map((spec, index) => (
                        <tr
                          key={index}
                          className="border-b border-slate-100 dark:border-slate-700/50 last:border-0"
                        >
                          <td className="py-2.5 lg:py-3 pr-3 lg:pr-4 align-top">
                            <span className="text-xs lg:text-sm text-slate-500 dark:text-slate-400 font-medium block">
                              {spec.name}
                            </span>
                          </td>
                          <td className="py-2.5 lg:py-3 align-top">
                            <span className="text-sm lg:text-base font-semibold text-slate-900 dark:text-white block">
                              {spec.value}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </>
  );
}
