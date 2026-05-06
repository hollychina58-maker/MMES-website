"use client";

import { useState } from "react";
import Image from "next/image";
import { useTranslations, useLocale } from "next-intl";
import { motion } from "framer-motion";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import { ShareButtons } from "@/components/ShareButtons";
import { ArticleSchema, BreadcrumbSchema } from "@/components/StructuredData";
import { BASE_URL, IMAGE_BASE_URL } from "@/lib/api-config";
import { getImageUrl, getLocalizedBlogContent } from "@/lib/content";
import { usePageTracking } from "@/lib/useAnalytics";

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

interface BlogPostClientProps {
  initialPost: BlogPost | null;
  initialAllPosts: BlogPost[];
  locale: string;
}

export function BlogPostClient({ initialPost, initialAllPosts, locale }: BlogPostClientProps) {
  const t = useTranslations("blog");
  usePageTracking();
  const [post] = useState<BlogPost | null>(initialPost);
  const [allPosts] = useState<BlogPost[]>(initialAllPosts);

  function getLocalizedTitle(post: BlogPost): string {
    const content = post.content[locale] || post.content.en || Object.values(post.content)[0];
    return content?.title || post.slug;
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

  const localized = getLocalizedBlogContent(post.content, locale, post.slug);
  const articleContent = localized.content || "";
  const url = `${BASE_URL}/${locale}/blog/${post.slug}`;

  // Render markdown content with proper styling
  const renderContent = () => {
    return (
      <ReactMarkdown
        components={{
          h1: ({children}) => <h1 className="text-3xl font-bold mt-8 mb-4 tracking-tight text-slate-900 dark:text-white">{children}</h1>,
          h2: ({children}) => <h2 className="text-2xl font-bold mt-8 mb-4 tracking-tight text-slate-900 dark:text-white">{children}</h2>,
          h3: ({children}) => <h3 className="text-xl font-bold mt-6 mb-3 text-slate-900 dark:text-white">{children}</h3>,
          p: ({children}) => <p className="mb-4 leading-relaxed text-slate-700 dark:text-slate-300">{children}</p>,
          ul: ({children}) => <ul className="list-disc list-inside mb-4 space-y-2">{children}</ul>,
          ol: ({children}) => <ol className="list-decimal list-inside mb-4 space-y-2">{children}</ol>,
          li: ({children}) => <li className="text-slate-700 dark:text-slate-300">{children}</li>,
          code: ({children, className}) => {
            const isInline = !className;
            if (isInline) {
              return <code className="px-1.5 py-0.5 bg-slate-100 dark:bg-slate-800 rounded text-sm font-mono text-blue-600 dark:text-blue-400">{children}</code>;
            }
            return <code className="block p-4 bg-slate-100 dark:bg-slate-800 rounded-lg text-sm font-mono overflow-x-auto mb-4 text-slate-800 dark:text-slate-200">{children}</code>;
          },
          pre: ({children}) => <pre className="bg-slate-100 dark:bg-slate-800 rounded-lg p-4 mb-4 overflow-x-auto">{children}</pre>,
          blockquote: ({children}) => <blockquote className="border-l-4 border-blue-500 pl-4 italic text-slate-600 dark:text-slate-400 mb-4">{children}</blockquote>,
          hr: () => <hr className="my-8 border-slate-200 dark:border-slate-700" />,
          a: ({href, children}) => <a href={href} className="text-blue-600 hover:text-blue-800 underline" target="_blank" rel="noopener noreferrer">{children}</a>,
          strong: ({children}) => <strong className="font-semibold text-slate-900 dark:text-white">{children}</strong>,
          em: ({children}) => <em className="italic">{children}</em>,
        }}
      >
        {articleContent}
      </ReactMarkdown>
    );
  };

  return (
    <>
      <ArticleSchema
        title={localized.title}
        description={localized.excerpt}
        image={post.coverImage}
        url={url}
        datePublished={post.date}
        author={post.author}
        tags={post.tags}
        locale={locale}
      />
      <BreadcrumbSchema
        items={[
          { name: "Home", url: `${BASE_URL}/${locale}` },
          { name: "Blog", url: `${BASE_URL}/${locale}/blog` },
          { name: localized.title, url: url },
        ]}
      />
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
                <Image
                  src={getImageUrl(post.coverImage)}
                  alt={localized.title || post.slug}
                  fill
                  sizes="(max-width: 1024px) 100vw, 75vw"
                  className="object-cover"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-8">
                  <div className="flex flex-wrap gap-2 mb-4">
                    {post.tags.map((tag) => (
                      <span key={tag} className="px-3 py-1 bg-white/20 backdrop-blur-sm text-white text-sm rounded-full">{tag}</span>
                    ))}
                  </div>
                  <h1 className="text-2xl md:text-4xl font-bold text-white">{localized.title}</h1>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-4 mb-8 text-sm text-slate-500">
                <span className="font-semibold text-slate-700 dark:text-slate-300">{post.author}</span>
                <span>•</span>
                <time dateTime={post.date}>{post.date}</time>
                <span>•</span>
                <span>{post.readTime}</span>
              </div>

              <div className="prose prose-lg dark:prose-invert max-w-none">
                  <div className="bg-white dark:bg-slate-800 rounded-3xl p-8 md:p-12 border border-slate-200 dark:border-slate-700">
                    {renderContent()}
                  </div>
                </div>

              <div className="mt-8 p-6 rounded-2xl bg-slate-100 dark:bg-slate-800/50 text-center">
                <p className="text-slate-500 mb-4">{t("shareArticle")}</p>
                <ShareButtons url={url} title={localized.title} />
              </div>
            </motion.article>

            <aside className="space-y-8">
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }} className="bg-white dark:bg-slate-800 rounded-3xl p-8 border border-slate-200 dark:border-slate-700">
                <h3 className="text-lg font-semibold mb-6 tracking-tight text-slate-900 dark:text-white">{t("relatedPosts")}</h3>
                <div className="space-y-6">
                  {allPosts.map((relatedPost) => (
                    <Link key={relatedPost.id} href={`/blog/${encodeURIComponent(relatedPost.slug)}`} className="group block">
                      <div className="flex gap-4 items-start">
                        <div className="relative w-20 h-20 rounded-2xl overflow-hidden flex-shrink-0">
                          <Image
                            src={getImageUrl(relatedPost.coverImage)}
                            alt={getLocalizedTitle(relatedPost)}
                            fill
                            sizes="80px"
                            className="object-cover"
                          />
                        </div>
                        <p className="text-sm font-medium group-hover:text-blue-600 transition-colors line-clamp-2 leading-relaxed">{getLocalizedTitle(relatedPost)}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              </motion.div>

              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }} className="p-8 rounded-3xl bg-slate-900 text-white">
                <h3 className="text-lg font-semibold mb-2 tracking-tight">{t("needSolutions")}</h3>
                <p className="text-sm text-slate-400 mb-6 leading-relaxed">{t("contactForSolution")}</p>
                <Link href="/contact" className="block w-full py-4 bg-white text-slate-900 font-semibold rounded-full text-center hover:bg-slate-100 active:scale-[0.98] transition-all">{t("getInTouch")}</Link>
              </motion.div>
            </aside>
          </div>
        </div>
      </div>
    </>
  );
}