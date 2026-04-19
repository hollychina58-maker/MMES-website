"use client";

import { useState, useEffect } from "react";
import { useTranslations, useLocale } from "next-intl";
import { motion } from "framer-motion";
import { Link } from "@/routing";
import { API_ENDPOINTS, IMAGE_BASE_URL } from "@/lib/api-config";

interface BlogPost {
  id: string;
  slug: string;
  coverImage: string;
  tags: string[];
  author: string;
  date: string;
  readTime: string;
  published: boolean;
  content: Record<string, {
    title: string;
    excerpt: string;
    content: string;
  }>;
}

const tagColors: Record<string, string> = {
  Navigation: "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300",
  AHRS: "bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300",
  Technology: "bg-cyan-100 text-cyan-700 dark:bg-cyan-900 dark:text-cyan-300",
  UAV: "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300",
  Autonomous: "bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300",
  IMU: "bg-pink-100 text-pink-700 dark:bg-pink-900 dark:text-pink-300",
  "Sensor Fusion": "bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-300",
  GNSS: "bg-teal-100 text-teal-700 dark:bg-teal-900 dark:text-teal-300",
};

function getLocalizedContent(post: BlogPost, locale: string) {
  const content = post.content[locale] || post.content.en || Object.values(post.content)[0];
  return {
    title: content?.title || post.slug,
    excerpt: content?.excerpt || "",
  };
}

export default function BlogPage() {
  const t = useTranslations("blog");
  const locale = useLocale();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPosts() {
      try {
        const res = await fetch(API_ENDPOINTS.blog);
        if (res.ok) {
          const response = await res.json();
          setPosts(response.data || []);
        }
      } catch (error) {
        console.error("Failed to fetch posts:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchPosts();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen py-12 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const featuredPost = posts[0];
  const otherPosts = posts.slice(1);

  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-4">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">
            {t("title")}
          </h1>
          <p className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            {t("subtitle")}
          </p>
        </motion.div>

        {/* Featured Post */}
        {featuredPost && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className="mb-16"
          >
            <Link href={`/blog/${encodeURIComponent(featuredPost.slug)}`} className="group block">
              <div className="relative h-[400px] rounded-3xl overflow-hidden bg-gradient-to-br from-slate-900 to-slate-800 dark:from-slate-800 dark:to-slate-900 shadow-2xl">
                <div className="absolute inset-0">
                  <img
                    src={`${IMAGE_BASE_URL}${featuredPost.coverImage}`}
                    alt={getLocalizedContent(featuredPost, locale).title}
                    className="w-full h-full object-cover opacity-40 group-hover:opacity-30 transition-opacity"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/80 to-transparent" />
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="px-3 py-1 bg-blue-500 text-white text-xs font-semibold rounded-full">
                      {t("featured")}
                    </span>
                    {featuredPost.tags.map((tag) => (
                      <span key={tag} className={`px-2 py-1 text-xs rounded-full ${tagColors[tag] || "bg-slate-700 text-slate-300"}`}>
                        {tag}
                      </span>
                    ))}
                  </div>
                  <h2 className="text-2xl md:text-4xl font-bold text-white mb-4 group-hover:text-blue-400 transition-colors">
                    {getLocalizedContent(featuredPost, locale).title}
                  </h2>
                  <p className="text-slate-300 mb-4 max-w-2xl">
                    {getLocalizedContent(featuredPost, locale).excerpt}
                  </p>
                  <div className="flex items-center gap-4 text-slate-400 text-sm">
                    <span>{featuredPost.author}</span>
                    <span>•</span>
                    <span>{featuredPost.date}</span>
                    <span>•</span>
                    <span>{featuredPost.readTime} {t("minRead")}</span>
                  </div>
                </div>
              </div>
            </Link>
          </motion.div>
        )}

        {/* Blog Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {otherPosts.map((post, index) => (
            <motion.article
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + index * 0.1 }}
            >
              <Link href={`/blog/${encodeURIComponent(post.slug)}`} className="group block h-full">
                <div className="h-full rounded-2xl overflow-hidden bg-white dark:bg-slate-800 shadow-lg hover:shadow-2xl transition-all border border-slate-200 dark:border-slate-700">
                  {/* Image */}
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={`${IMAGE_BASE_URL}${post.coverImage}`}
                      alt={getLocalizedContent(post, locale).title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent" />
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <div className="flex flex-wrap gap-2 mb-3">
                      {post.tags.map((tag) => (
                        <span key={tag} className={`px-2 py-1 text-xs rounded-full ${tagColors[tag] || "bg-slate-200 dark:bg-slate-700"}`}>
                          {tag}
                        </span>
                      ))}
                    </div>
                    <h3 className="text-xl font-bold mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {getLocalizedContent(post, locale).title}
                    </h3>
                    <p className="text-slate-600 dark:text-slate-400 text-sm mb-4 line-clamp-2">
                      {getLocalizedContent(post, locale).excerpt}
                    </p>
                    <div className="flex items-center gap-3 text-xs text-slate-500">
                      <span>{post.date}</span>
                      <span>•</span>
                      <span>{post.readTime} {t("minRead")}</span>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.article>
          ))}
        </div>

        {/* Empty State */}
        {posts.length === 0 && (
          <div className="text-center py-16">
            <p className="text-slate-500 text-lg">No blog posts yet.</p>
          </div>
        )}

        {/* Newsletter CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-16 p-8 md:p-12 rounded-3xl bg-gradient-to-r from-blue-600 to-cyan-500 text-white text-center"
        >
          <h3 className="text-2xl font-bold mb-4">{t("newsletter")}</h3>
          <p className="text-white/90 mb-6 max-w-xl mx-auto">
            {t("newsletterDesc")}
          </p>
          <Link
            href="/contact"
            className="inline-block px-8 py-3 bg-white text-blue-600 font-semibold rounded-xl hover:bg-slate-100 transition-colors"
          >
            {t("subscribe")}
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
