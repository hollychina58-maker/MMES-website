import { MetadataRoute } from "next";
import { BASE_URL } from "@/lib/api-config";

interface Product {
  id: string;
  slug: string;
  published: boolean;
}

interface BlogPost {
  id: string;
  slug: string;
  published: boolean;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const locales = ["en", "ru", "ar", "zh", "fa", "la"];
  const staticRoutes = ["", "/products", "/about", "/contact", "/blog"];

  // Fetch products and blog posts from API
  let products: Product[] = [];
  let blogPosts: BlogPost[] = [];

  try {
    const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

    const [productsRes, blogRes] = await Promise.all([
      fetch(`${apiBaseUrl}/api/products`, { cache: "no-store" }),
      fetch(`${apiBaseUrl}/api/blog`, { cache: "no-store" }),
    ]);

    if (productsRes.ok) {
      const productsData = await productsRes.json();
      products = (productsData.data || []).filter((p: Product) => p.published);
    }

    if (blogRes.ok) {
      const blogData = await blogRes.json();
      blogPosts = (blogData.data || []).filter((p: BlogPost) => p.published);
    }
  } catch (error) {
    console.error("Sitemap fetch error:", error);
  }

  const sitemap: MetadataRoute.Sitemap = [];

  // Static routes
  locales.forEach((locale) => {
    staticRoutes.forEach((route) => {
      sitemap.push({
        url: `${BASE_URL}/${locale}${route}`,
        lastModified: new Date(),
        changeFrequency: route === "" ? "daily" : "weekly",
        priority: route === "" ? 1 : 0.8,
      });
    });
  });

  // Product detail pages
  products.forEach((product) => {
    locales.forEach((locale) => {
      sitemap.push({
        url: `${BASE_URL}/${locale}/products/${product.slug.toLowerCase()}`,
        lastModified: new Date(),
        changeFrequency: "weekly",
        priority: 0.7,
      });
    });
  });

  // Blog post pages
  blogPosts.forEach((post) => {
    locales.forEach((locale) => {
      sitemap.push({
        url: `${BASE_URL}/${locale}/blog/${encodeURIComponent(post.slug)}`,
        lastModified: new Date(),
        changeFrequency: "monthly",
        priority: 0.6,
      });
    });
  });

  return sitemap;
}