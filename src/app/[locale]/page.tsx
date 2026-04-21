"use client";

import { useEffect, useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { Link } from "@/routing";
import { motion } from "framer-motion";
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

const features = [
  { key: "highPrecision", icon: "🎯" },
  { key: "reliable", icon: "🛡️" },
  { key: "innovative", icon: "⚡" },
  { key: "support", icon: "🌍" },
];

export default function HomePage() {
  const t = useTranslations("home");
  const locale = useLocale();
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(true);

  useEffect(() => {
    async function fetchFeaturedProducts() {
      try {
        const res = await Promise.race([
          fetch(API_ENDPOINTS.products),
          new Promise((_, reject) => setTimeout(() => reject(new Error('timeout')), 3000))
        ]) as Response;
        const data = await res.json();
        const publishedProducts = (data.data || []).filter((p: Product) => p.published);
        // Take first 4 products for featured section
        setFeaturedProducts(publishedProducts.slice(0, 4));
      } catch (error) {
        console.error("API fetch failed or timed out:", error);
      } finally {
        setLoadingProducts(false);
      }
    }
    fetchFeaturedProducts();
  }, []);

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-blue-900/50 to-slate-900" />
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500 rounded-full blur-[128px]" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-500 rounded-full blur-[128px]" />
        </div>

        <div className="relative z-10 container mx-auto px-4 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-4xl md:text-6xl font-bold text-white mb-6"
          >
            {t("hero.title")}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-lg md:text-xl text-slate-300 mb-8 max-w-3xl mx-auto"
          >
            {t("hero.subtitle")}
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <Link
              href="/products"
              className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-semibold rounded-full hover:shadow-lg hover:shadow-blue-500/30 transition-all"
            >
              {t("hero.cta")}
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </motion.div>
        </div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <svg className="w-6 h-6 text-white/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-white dark:bg-slate-900">
        <div className="container mx-auto px-4">
          <motion.h2
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-bold text-center mb-16"
          >
            {t("features.title")}
          </motion.h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.key}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-blue-500 dark:hover:border-blue-500 transition-colors group"
              >
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-2 group-hover:text-blue-600 transition-colors">
                  {t(`features.${feature.key}`)}
                </h3>
                <p className="text-slate-600 dark:text-slate-400">
                  {t(`features.${feature.key}Desc`)}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section className="py-24 bg-slate-50 dark:bg-slate-900/50">
        <div className="container mx-auto px-4">
          <motion.h2
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-bold text-center mb-16"
          >
            {t("products.title")}
          </motion.h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {loadingProducts ? (
              <div className="col-span-4 flex justify-center py-12">
                <div className="animate-spin w-12 h-12 border-4 border-[#0066ff] border-t-transparent rounded-full" />
              </div>
            ) : featuredProducts.length > 0 ? (
              featuredProducts.map((product, index) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="group"
                >
                  <Link href={`/products/${product.slug.toLowerCase()}`}>
                  <div className="relative overflow-hidden rounded-2xl bg-white dark:bg-slate-800 p-4 shadow-lg group-hover:shadow-xl transition-shadow">
                    <div className="aspect-square relative mb-4 bg-slate-100 dark:bg-slate-700 rounded-xl overflow-hidden">
                      {product.image ? (
                        <img
                          src={getImageUrl(product.image)}
                          alt={getLocalizedContent(product, locale).name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center text-slate-400">
                          <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                          </svg>
                        </div>
                      )}
                    </div>
                    <h3 className="font-semibold text-lg mb-1">{getLocalizedContent(product, locale).name}</h3>
                    <p className="text-slate-600 dark:text-slate-400 text-sm line-clamp-2">{getLocalizedContent(product, locale).description}</p>
                  </div>
                  </Link>
                </motion.div>
              ))
            ) : (
              <p className="col-span-4 text-center text-slate-500 py-12">暂无产品</p>
            )}
          </div>

          <div className="text-center mt-12">
            <Link
              href="/products"
              className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium"
            >
              {t("products.viewAll")}
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-r from-blue-600 to-cyan-500">
        <div className="container mx-auto px-4 text-center">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-bold text-white mb-4"
          >
            {t("cta.title")}
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-xl text-white/90 mb-8 max-w-2xl mx-auto"
          >
            {t("cta.description")}
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-8 py-4 bg-white text-blue-600 font-semibold rounded-full hover:bg-slate-100 transition-colors"
            >
              {t("cta.button")}
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
