import { Metadata } from "next";
import { API_ENDPOINTS } from "@/lib/api-config";
import { BlogPostClient } from "./BlogPostClient";

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

async function getBlogPost(slug: string): Promise<{ post: BlogPost | null; allPosts: BlogPost[] }> {
  try {
    const res = await fetch(API_ENDPOINTS.blog, { cache: "no-store" });
    if (res.ok) {
      const data = await res.json();
      const posts: BlogPost[] = data.data || [];
      const found = posts.find((p) => p.slug.toLowerCase() === slug.toLowerCase()) || null;
      const others = posts.filter((p) => p.slug.toLowerCase() !== slug.toLowerCase()).slice(0, 3);
      return { post: found, allPosts: others };
    }
  } catch (error) {
    console.error("API fetch failed:", error);
  }
  return { post: null, allPosts: [] };
}

type Props = {
  params: Promise<{ locale: string; slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  const { post } = await getBlogPost(slug);

  if (!post) {
    return {
      title: "Blog Post Not Found - MMES-MCTI",
    };
  }

  const content = post.content[locale] || post.content.en || Object.values(post.content)[0];
  const title = content?.title || post.slug;
  const description = content?.excerpt || "";
  const url = `https://mmes-website-production.up.railway.app/${locale}/blog/${post.slug}`;

  return {
    title: `${title} - MMES-MCTI`,
    description,
    alternates: {
      canonical: url,
      languages: {
        en: `https://mmes-website-production.up.railway.app/en/blog/${post.slug}`,
        zh: `https://mmes-website-production.up.railway.app/zh/blog/${post.slug}`,
        ru: `https://mmes-website-production.up.railway.app/ru/blog/${post.slug}`,
        ar: `https://mmes-website-production.up.railway.app/ar/blog/${post.slug}`,
        fa: `https://mmes-website-production.up.railway.app/fa/blog/${post.slug}`,
        la: `https://mmes-website-production.up.railway.app/la/blog/${post.slug}`,
      },
    },
    openGraph: {
      type: "article",
      title,
      description,
      url,
      siteName: "MMES-MCTI",
      locale,
      images: [
        {
          url: post.coverImage,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [post.coverImage],
    },
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { locale, slug } = await params;
  const decodedSlug = decodeURIComponent(slug);
  const { post, allPosts } = await getBlogPost(decodedSlug);

  return <BlogPostClient initialPost={post} initialAllPosts={allPosts} locale={locale} />;
}