"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useTranslations, useLocale } from "next-intl";
import { Link } from "@/routing";
import { motion } from "framer-motion";
import { API_ENDPOINTS, IMAGE_BASE_URL } from "@/lib/api-config";
import { getLocalizedContent, getImageUrl } from "@/lib/content";
import { usePageTracking } from "@/lib/useAnalytics";
import {
  Target,
  Shield,
  Lightning,
  GlobeHemisphereWest,
} from "@phosphor-icons/react";

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

const features = [
  { key: "highPrecision", icon: Target },
  { key: "reliable", icon: Shield },
  { key: "innovative", icon: Lightning },
  { key: "support", icon: GlobeHemisphereWest },
];

export default function HomePage() {
  const t = useTranslations("home");
  const locale = useLocale();
  usePageTracking();
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [productsError, setProductsError] = useState(false);

  const fetchFeaturedProducts = async () => {
    setLoadingProducts(true);
    setProductsError(false);
    try {
      const res = await Promise.race([
        fetch(API_ENDPOINTS.products),
        new Promise((_, reject) => setTimeout(() => reject(new Error('timeout')), 3000))
      ]);
      if (res instanceof Response) {
        const data = await res.json();
        const publishedProducts = (data.data || []).filter((p: Product) => p.published);
        setFeaturedProducts(publishedProducts.slice(0, 4));
      }
    } catch {
      setProductsError(true);
    } finally {
      setLoadingProducts(false);
    }
  };

  useEffect(() => {
    fetchFeaturedProducts();
  }, []);

  return (
    <div className="flex flex-col">
      {/* Hero Section - Asymmetric Layout */}
      <section className="relative min-h-[100dvh] flex items-center overflow-hidden">
        {/* Background with neutral dark tone */}
        <div className="absolute inset-0 bg-[#0a0a0f]" />
        <div className="absolute inset-0">
          {/* Subtle geometric accent */}
          <div className="absolute top-0 right-0 w-[60%] h-full bg-gradient-to-l from-slate-800/40 to-transparent" />
          <div className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-gradient-to-t from-blue-900/20 to-transparent" />
        </div>

        <div className="relative z-10 container mx-auto px-4 py-24">
          <div className="max-w-3xl">
            <motion.p
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="text-sm font-medium text-blue-400 tracking-widest uppercase mb-6"
            >
              Precision Inertial Navigation
            </motion.p>
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="text-5xl md:text-7xl font-bold tracking-tight text-white mb-6 leading-[1.1]"
            >
              {t("hero.title")}
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-lg md:text-xl text-slate-400 mb-10 max-w-xl leading-relaxed"
            >
              {t("hero.subtitle")}
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="flex flex-wrap gap-4"
            >
              <Link
                href="/products"
                className="inline-flex items-center gap-3 px-8 py-4 bg-white text-slate-900 font-semibold rounded-full hover:bg-slate-100 active:scale-[0.98] transition-all"
              >
                {t("hero.cta")}
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center gap-3 px-8 py-4 border border-slate-700 text-white font-semibold rounded-full hover:bg-slate-800/50 active:scale-[0.98] transition-all"
              >
                Contact Us
              </Link>
            </motion.div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2">
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            className="w-6 h-10 border-2 border-slate-600 rounded-full flex justify-center pt-2"
          >
            <div className="w-1 h-2 bg-slate-500 rounded-full" />
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-32 bg-white dark:bg-slate-900">
        <div className="container mx-auto px-4">
          <motion.h2
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-bold text-center mb-20 tracking-tight"
          >
            {t("features.title")}
          </motion.h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
            {features.map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <motion.div
                  key={feature.key}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="group"
                >
                  <div className="w-14 h-14 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-6 group-hover:bg-blue-50 dark:group-hover:bg-blue-900/20 transition-colors">
                    <IconComponent className="w-7 h-7 text-slate-700 dark:text-slate-300 group-hover:text-blue-600 transition-colors" weight="duotone" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3 text-slate-900 dark:text-white">
                    {t(`features.${feature.key}`)}
                  </h3>
                  <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                    {t(`features.${feature.key}Desc`)}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section className="py-32 bg-slate-50 dark:bg-slate-900/50">
        <div className="container mx-auto px-4">
          <motion.h2
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-bold text-center mb-20 tracking-tight"
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
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="group"
                >
                  <Link href={`/products/${product.slug.toLowerCase()}`} className="block">
                    <div className="bg-white dark:bg-slate-800 rounded-3xl overflow-hidden">
                      <div className="aspect-square relative bg-slate-100 dark:bg-slate-700">
                        {product.image ? (
                          <Image
                            src={getImageUrl(product.image)}
                            alt={getLocalizedContent(product.content, locale, product.id).name}
                            fill
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                            className="object-cover group-hover:scale-[1.02] transition-transform duration-500"
                          />
                        ) : (
                          <div className="absolute inset-0 flex items-center justify-center text-slate-400">
                            <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                            </svg>
                          </div>
                        )}
                      </div>
                      <div className="p-6">
                        <h3 className="font-semibold text-lg mb-2 text-slate-900 dark:text-white">{getLocalizedContent(product.content, locale, product.id).name}</h3>
                        <p className="text-slate-600 dark:text-slate-400 text-sm line-clamp-2 leading-relaxed">{getLocalizedContent(product.content, locale, product.id).description}</p>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))
            ) : productsError ? (
              <div className="col-span-4 flex flex-col items-center justify-center py-12 gap-4">
                <p className="text-red-500">加载失败</p>
                <button
                  onClick={fetchFeaturedProducts}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  重试
                </button>
              </div>
            ) : (
              <p className="col-span-4 text-center text-slate-500 py-12">暂无产品</p>
            )}
          </div>

          <div className="text-center mt-16">
            <Link
              href="/products"
              className="inline-flex items-center gap-2 text-slate-900 dark:text-white font-medium hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
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
      <section className="py-32 bg-slate-900">
        <div className="container mx-auto px-4 text-center">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-5xl font-bold text-white mb-6 tracking-tight"
          >
            {t("cta.title")}
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-lg text-slate-400 mb-12 max-w-2xl mx-auto leading-relaxed"
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
              className="inline-flex items-center gap-3 px-10 py-5 bg-white text-slate-900 font-semibold rounded-full hover:bg-slate-100 active:scale-[0.98] transition-all"
            >
              {t("cta.button")}
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
