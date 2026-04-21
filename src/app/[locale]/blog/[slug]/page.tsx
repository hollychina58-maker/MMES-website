"use client";

import { useState, useEffect } from "react";
import { useTranslations, useLocale } from "next-intl";
import { motion } from "framer-motion";
import { Link } from "@/routing";
import { ShareButtons } from "@/components/ShareButtons";
import { API_ENDPOINTS, IMAGE_BASE_URL } from "@/lib/api-config";
import { useParams } from "next/navigation";

interface BlogContent {
  title: string;
  excerpt: string;
  content: string;
}

interface BlogPost {
  id: string;
  slug: string;
  coverImage: string;
  tags: string[];
  author: string;
  date: string;
  readTime: string;
  published: boolean;
  content: Record<string, BlogContent>;
}

export default function BlogPostPage() {
  const params = useParams();
  const slug = decodeURIComponent(params.slug as string);
  const t = useTranslations("blog");
  const locale = useLocale();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [allPosts, setAllPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;

    async function fetchPosts() {
      try {
        const res = await fetch(API_ENDPOINTS.blog);
        if (res.ok) {
          const response = await res.json();
          const posts: BlogPost[] = response.data || [];
          const found = posts.find((p) => p.slug.toLowerCase() === slug.toLowerCase());
          setPost(found || null);
          // Get related posts (excluding current post)
          setAllPosts(posts.filter((p) => p.slug.toLowerCase() !== slug.toLowerCase()).slice(0, 3));
        }
      } catch (error) {
        console.error("Failed to fetch posts:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchPosts();
  }, [slug]);

  // Get localized title for related posts
  function getLocalizedTitle(post: BlogPost): string {
    const content = post.content[locale] || post.content.en || Object.values(post.content)[0];
    return content?.title || post.slug;
  }

  if (loading) {
    return (
      <div className="min-h-screen py-12 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen py-12 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Post not found</h1>
          <Link href="/blog" className="text-blue-600 hover:text-blue-800">
            {t("back")}
          </Link>
        </div>
      </div>
    );
  }

  const localizedContent = post.content[locale] || post.content.en || Object.values(post.content)[0];
  const title = localizedContent?.title || post.slug;
  const articleContent = localizedContent?.content || "";
  const excerpt = localizedContent?.excerpt || "";

  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-4">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="mb-8">
          <Link href="/blog" className="inline-flex items-center gap-2 text-slate-500 hover:text-blue-600 transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span>{t("back")}</span>
          </Link>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <motion.article initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="lg:col-span-3">
            <div className="relative h-[350px] md:h-[450px] rounded-3xl overflow-hidden mb-8">
              <img src={`${IMAGE_BASE_URL}${post.coverImage}`} alt={title} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-8">
                <div className="flex flex-wrap gap-2 mb-4">
                  {post.tags.map((tag) => (
                    <span key={tag} className="px-3 py-1 bg-white/20 backdrop-blur-sm text-white text-sm rounded-full">{tag}</span>
                  ))}
                </div>
                <h1 className="text-2xl md:text-4xl font-bold text-white">{title}</h1>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-4 mb-8 text-sm text-slate-500">
              <span className="font-semibold text-slate-700 dark:text-slate-300">{post.author}</span>
              <span>•</span>
              <span>{post.date}</span>
              <span>•</span>
              <span>{post.readTime}</span>
            </div>

            <div className="prose prose-lg dark:prose-invert max-w-none">
              <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 md:p-12 shadow-lg border border-slate-200 dark:border-slate-700">
                {articleContent.split('\n').map((line, index) => {
                  if (line.startsWith('# ')) return <h1 key={index} className="text-3xl font-bold mt-8 mb-4">{line.slice(2)}</h1>;
                  else if (line.startsWith('## ')) return <h2 key={index} className="text-2xl font-bold mt-8 mb-4">{line.slice(3)}</h2>;
                  else if (line.startsWith('### ')) return <h3 key={index} className="text-xl font-bold mt-6 mb-3">{line.slice(4)}</h3>;
                  else if (line.startsWith('- ')) return <li key={index} className="ml-4 mb-2">{line.slice(2)}</li>;
                  else if (line.startsWith('| ')) return <div key={index} className="font-mono text-sm bg-slate-100 dark:bg-slate-900 p-2 rounded my-2 overflow-x-auto">{line}</div>;
                  else if (line.trim() === '') return <div key={index} className="h-4"></div>;
                  else return <p key={index} className="mb-4 leading-relaxed">{line}</p>;
                })}
              </div>
            </div>

            <div className="mt-8 p-6 rounded-2xl bg-slate-100 dark:bg-slate-800/50 text-center">
              <p className="text-slate-500 mb-4">{t("shareArticle")}</p>
              <ShareButtons url={`https://mmes-mcti.com/${locale}/blog/${post.slug}`} title={title} />
            </div>
          </motion.article>

          <aside className="space-y-8">
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }} className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg border border-slate-200 dark:border-slate-700">
              <h3 className="text-lg font-bold mb-4">{t("relatedPosts")}</h3>
              <div className="space-y-4">
                {allPosts.map((relatedPost) => (
                  <Link key={relatedPost.id} href={`/blog/${encodeURIComponent(relatedPost.slug)}`} className="group block">
                    <div className="flex gap-3 items-start">
                      <div className="relative w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                        <img src={`${IMAGE_BASE_URL}${relatedPost.coverImage}`} alt="" className="w-full h-full object-cover" />
                      </div>
                      <p className="text-sm font-medium group-hover:text-blue-600 transition-colors line-clamp-2">{getLocalizedTitle(relatedPost)}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }} className="p-6 rounded-2xl bg-gradient-to-br from-blue-600 to-cyan-500 text-white">
              <h3 className="text-lg font-bold mb-2">{t("needSolutions")}</h3>
              <p className="text-sm text-white/90 mb-4">{t("contactForSolution")}</p>
              <Link href="/contact" className="block w-full py-2 bg-white text-blue-600 font-semibold rounded-lg text-center hover:bg-slate-100 transition-colors">{t("getInTouch")}</Link>
            </motion.div>
          </aside>
        </div>
      </div>
    </div>
  );
}
