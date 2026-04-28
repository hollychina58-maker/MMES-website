"use client";

import { useEffect, useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { motion } from "framer-motion";
import { useParams } from "next/navigation";
import { Link } from "@/routing";
import { ShareButtons } from "@/components/ShareButtons";
import { ProductSchema, BreadcrumbSchema } from "@/components/StructuredData";
import { API_ENDPOINTS, BASE_URL } from "@/lib/api-config";
import { getLocalizedContent, getImageUrl } from "@/lib/content";

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

export function ProductDetailClient() {
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
        ]);
        if (res instanceof Response) {
          const data = await res.json();
          const products: Product[] = data.data || [];
          const found = products.find((p) => p.slug.toLowerCase() === slug.toLowerCase());
          setProduct(found || null);
        }
      } catch {
        // Error handled silently - user will see empty state
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

  const localized = getLocalizedContent(product.content, locale, product.id);
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
        url={`${BASE_URL}/${locale}/products/${product.slug}`}
        sku={product.id}
      />
      <BreadcrumbSchema
        items={[
          { name: "Home", url: `${BASE_URL}/${locale}` },
          { name: "Products", url: `${BASE_URL}/${locale}/products` },
          { name: localized.name, url: `${BASE_URL}/${locale}/products/${product.slug}` },
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
                <div className="relative aspect-square rounded-3xl overflow-hidden bg-slate-100 dark:bg-slate-800">
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
                  <div className="absolute top-4 left-4 z-20">
                    <span className="px-4 py-2 bg-white/90 dark:bg-slate-800/90 backdrop-blur-md rounded-full shadow-lg text-sm font-bold text-slate-900 dark:text-white">
                      {localized.name}
                    </span>
                  </div>
                </div>

                {/* CTA Card - Below Image */}
                <div className="mt-6 p-6 rounded-3xl bg-slate-900">
                  <p className="text-slate-400 text-center mb-4 text-sm">
                    {t("ctaText")}
                  </p>
                  <Link
                    href="/contact"
                    className="block w-full py-4 bg-white text-slate-900 font-semibold rounded-full text-center hover:bg-slate-100 active:scale-[0.98] transition-all"
                  >
                    {t("detail.quote")}
                  </Link>
                </div>

                {/* Share - Below CTA */}
                <div className="mt-4 p-4 rounded-xl bg-slate-100 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
                  <p className="text-xs lg:text-sm text-slate-500 mb-3 text-center">{t("share")}</p>
                  <ShareButtons
                    url={`${BASE_URL}/${locale}/products/${product.slug}`}
                    title={localized.name}
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
              <div className="p-8 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                <h1 className="text-2xl lg:text-3xl xl:text-4xl font-bold mb-4 tracking-tight text-slate-900 dark:text-white leading-tight">
                  {localized.name}
                </h1>
                <p className="text-base text-slate-500 dark:text-slate-400 leading-relaxed">
                  {localized.description}
                </p>
              </div>

              {/* Specs Card */}
              <div className="p-8 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                <h2 className="text-lg font-semibold mb-6 text-slate-900 dark:text-white tracking-tight">{t("detail.specs")}</h2>

                {/* Specs Table */}
                <div className="space-y-4">
                  {specsEntries.map((spec, index) => (
                    <div
                      key={index}
                      className="flex justify-between items-start py-3 border-b border-slate-100 dark:border-slate-700/50 last:border-0"
                    >
                      <span className="text-sm text-slate-500 dark:text-slate-400">
                        {spec.name}
                      </span>
                      <span className="text-sm font-semibold text-slate-900 dark:text-white text-right">
                        {spec.value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </>
  );
}