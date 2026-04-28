"use client";

import { useState, useEffect } from "react";
import { useTranslations, useLocale } from "next-intl";
import { motion } from "framer-motion";
import { Link } from "@/routing";
import { API_ENDPOINTS } from "@/lib/api-config";
import { getImageUrl, getLocalizedBlogContent } from "@/lib/content";

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

export function BlogClient() {
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
      } catch {
        // Error handled silently - user sees empty state
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
          className="max-w-3xl mb-20"
        >
          <p className="text-sm font-medium text-blue-600 tracking-widest uppercase mb-6">Blog</p>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight">{t("title")}</h1>
          <p className="text-lg text-slate-500 dark:text-slate-400 leading-relaxed">
            {t("subtitle")}
          </p>
        </motion.div>

        {/* Featured Post */}
        {featuredPost && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className="mb-24"
          >
            <Link href={`/blog/${encodeURIComponent(featuredPost.slug)}`} className="group block">
              <div className="relative min-h-[500px] rounded-3xl overflow-hidden bg-slate-900">
                <div className="absolute inset-0">
                  <img
                    src={getImageUrl(featuredPost.coverImage)}
                    alt={getLocalizedBlogContent(featuredPost.content, locale, featuredPost.slug).title}
                    className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/60 to-transparent" />
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-10 md:p-16">
                  <div className="flex items-center gap-3 mb-6">
                    <span className="px-3 py-1 bg-blue-600 text-white text-xs font-semibold rounded-full">
                      {t("featured")}
                    </span>
                    {featuredPost.tags.map((tag) => (
                      <span key={tag} className={`px-2 py-1 text-xs rounded-full ${tagColors[tag] || "bg-slate-700 text-slate-300"}`}>
                        {tag}
                      </span>
                    ))}
                  </div>
                  <h2 className="text-3xl md:text-5xl font-bold text-white mb-4 tracking-tight group-hover:text-blue-400 transition-colors">
                    {getLocalizedBlogContent(featuredPost.content, locale, featuredPost.slug).title}
                  </h2>
                  <p className="text-slate-300 mb-6 max-w-2xl text-lg leading-relaxed">
                    {getLocalizedBlogContent(featuredPost.content, locale, featuredPost.slug).excerpt}
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {otherPosts.map((post, index) => (
            <motion.article
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + index * 0.1 }}
            >
              <Link href={`/blog/${encodeURIComponent(post.slug)}`} className="group block h-full">
                <div className="h-full rounded-3xl overflow-hidden bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-blue-300 dark:hover:border-blue-700 transition-colors">
                  {/* Image */}
                  <div className="relative aspect-video overflow-hidden">
                    <img
                      src={getImageUrl(post.coverImage)}
                      alt={getLocalizedBlogContent(post.content, locale, post.slug).title}
                      className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-500"
                    />
                  </div>

                  {/* Content */}
                  <div className="p-8">
                    <div className="flex flex-wrap gap-2 mb-4">
                      {post.tags.map((tag) => (
                        <span key={tag} className={`px-2 py-1 text-xs rounded-full ${tagColors[tag] || "bg-slate-200 dark:bg-slate-700"}`}>
                          {tag}
                        </span>
                      ))}
                    </div>
                    <h3 className="text-xl font-semibold mb-3 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors tracking-tight">
                      {getLocalizedBlogContent(post.content, locale, post.slug).title}
                    </h3>
                    <p className="text-slate-500 dark:text-slate-400 text-sm mb-6 line-clamp-2 leading-relaxed">
                      {getLocalizedBlogContent(post.content, locale, post.slug).excerpt}
                    </p>
                    <div className="flex items-center gap-3 text-xs text-slate-400">
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
          className="mt-24 p-10 md:p-16 rounded-3xl bg-slate-900 text-white text-center"
        >
          <h3 className="text-2xl md:text-3xl font-bold mb-4 tracking-tight">{t("newsletter")}</h3>
          <p className="text-slate-400 mb-8 max-w-xl mx-auto leading-relaxed">
            {t("newsletterDesc")}
          </p>
          <Link
            href="/contact"
            className="inline-block px-8 py-4 bg-white text-slate-900 font-semibold rounded-full hover:bg-slate-100 active:scale-[0.98] transition-all"
          >
            {t("subscribe")}
          </Link>
        </motion.div>
      </div>
    </div>
  );
}