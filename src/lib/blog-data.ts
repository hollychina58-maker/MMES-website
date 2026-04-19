import fs from 'fs/promises';
import path from 'path';
import { randomUUID } from 'crypto';
import { BlogPost, CreateBlogPostDto, UpdateBlogPostDto } from '@/types/blog';

const DATA_DIR = path.join(process.cwd(), 'data');
const BLOG_FILE = path.join(DATA_DIR, 'blog.json');

async function ensureDataDir(): Promise<void> {
  try {
    await fs.access(DATA_DIR);
  } catch {
    await fs.mkdir(DATA_DIR, { recursive: true });
  }
}

async function readBlogFile(): Promise<BlogPost[]> {
  try {
    const data = await fs.readFile(BLOG_FILE, 'utf-8');
    return JSON.parse(data) as BlogPost[];
  } catch {
    return [];
  }
}

async function writeBlogFile(posts: BlogPost[]): Promise<void> {
  await ensureDataDir();
  await fs.writeFile(BLOG_FILE, JSON.stringify(posts, null, 2), 'utf-8');
}

export async function getPosts(): Promise<BlogPost[]> {
  const posts = await readBlogFile();
  return posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export async function getPublishedPosts(): Promise<BlogPost[]> {
  const posts = await getPosts();
  return posts.filter(post => post.published);
}

export async function getPostById(id: string): Promise<BlogPost | null> {
  const posts = await readBlogFile();
  return posts.find(post => post.id === id) || null;
}

export async function getPostBySlug(slug: string): Promise<BlogPost | null> {
  const posts = await readBlogFile();
  return posts.find(post => post.slug === slug) || null;
}

export async function createPost(data: CreateBlogPostDto): Promise<BlogPost> {
  const posts = await readBlogFile();

  const existingPost = posts.find(post => post.slug === data.slug);
  if (existingPost) {
    throw new Error(`Post with slug "${data.slug}" already exists`);
  }

  const newPost: BlogPost = {
    ...data,
    id: randomUUID(),
  };

  posts.push(newPost);
  await writeBlogFile(posts);

  return newPost;
}

export async function updatePost(id: string, data: UpdateBlogPostDto): Promise<BlogPost | null> {
  const posts = await readBlogFile();
  const index = posts.findIndex(post => post.id === id);

  if (index === -1) {
    return null;
  }

  if (data.slug && data.slug !== posts[index].slug) {
    const slugExists = posts.some(post => post.slug === data.slug && post.id !== id);
    if (slugExists) {
      throw new Error(`Post with slug "${data.slug}" already exists`);
    }
  }

  const updatedPost: BlogPost = {
    ...posts[index],
    ...data,
  };

  posts[index] = updatedPost;
  await writeBlogFile(posts);

  return updatedPost;
}

export async function deletePost(id: string): Promise<boolean> {
  const posts = await readBlogFile();
  const index = posts.findIndex(post => post.id === id);

  if (index === -1) {
    return false;
  }

  posts.splice(index, 1);
  await writeBlogFile(posts);

  return true;
}
