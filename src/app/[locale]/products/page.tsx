"use client";

import { useEffect, useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { motion } from "framer-motion";
import { Link } from "@/routing";
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

export default function ProductsPage() {
  const t = useTranslations("products");
  const locale = useLocale();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProducts() {
      try {
        const res = await Promise.race([
          fetch(API_ENDPOINTS.products),
          new Promise((_, reject) => setTimeout(() => reject(new Error('timeout')), 3000))
        ]);
        if (res instanceof Response) {
          const data = await res.json();
          const publishedProducts = (data.data || []).filter(
            (p: Product) => p.published
          );
          setProducts(publishedProducts);
        }
      } catch {
        // Error handled silently - user sees empty state
      } finally {
        setLoading(false);
      }
    }
    fetchProducts();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen py-24 flex items-center justify-center">
        <div className="animate-spin w-12 h-12 border-4 border-[#0066ff] border-t-transparent rounded-full" />
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="min-h-screen py-24 flex items-center justify-center">
        <p className="text-slate-500 text-lg">{t("noProducts") || "暂无产品"}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-24">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-20"
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight">{t("title")}</h1>
          <p className="text-lg text-slate-500 dark:text-slate-400 max-w-xl mx-auto">{t("subtitle")}</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {products.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="group"
            >
              <Link href={`/products/${product.slug.toLowerCase()}`} className="block bg-white dark:bg-slate-800 rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-700 hover:border-blue-300 dark:hover:border-blue-700 transition-colors">
                <div className="aspect-square relative bg-slate-100 dark:bg-slate-700">
                  {product.image ? (
                    <img
                      src={product.image.startsWith('http') ? product.image : `${IMAGE_BASE_URL}${product.image}`}
                      alt={getLocalizedContent(product, locale).name}
                      className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-500"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center text-slate-400">
                      <svg className="w-16 h-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                      </svg>
                    </div>
                  )}
                </div>
                <div className="p-8">
                  <h3 className="text-xl font-semibold mb-3 text-slate-900 dark:text-white">
                    {getLocalizedContent(product, locale).name}
                  </h3>
                  <p className="text-slate-500 dark:text-slate-400 text-sm mb-6 line-clamp-2 leading-relaxed">
                    {getLocalizedContent(product, locale).description}
                  </p>
                  <span className="inline-flex items-center gap-2 text-sm font-medium text-blue-600 dark:text-blue-400 group-hover:gap-3 transition-all">
                    {t("viewDetails")}
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </span>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}