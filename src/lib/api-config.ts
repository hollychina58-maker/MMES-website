/**
 * API Configuration
 * Uses environment variable for backend URL
 * - Development: http://localhost:3001
 * - Production: Set NEXT_PUBLIC_API_URL to your Railway backend URL
 */

// Get API base URL from environment variable, default to localhost in development
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

// Frontend base URL for SEO (sitemap, meta tags, structured data)
export const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://mmes-website-production.up.railway.app';

// API endpoints
export const API_ENDPOINTS = {
  products: `${API_BASE_URL}/api/products`,
  blog: `${API_BASE_URL}/api/blog`,
  upload: `${API_BASE_URL}/api/upload`,
  translate: `${API_BASE_URL}/api/translate`,
  login: `${API_BASE_URL}/api/admin/login`,
} as const;

// Image base URL - for loading product/blog images from backend
// In production, this should be the same as API_BASE_URL
export const IMAGE_BASE_URL = process.env.NEXT_PUBLIC_IMAGE_URL || API_BASE_URL;
