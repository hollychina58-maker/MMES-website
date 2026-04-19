import { NextRequest, NextResponse } from 'next/server';
import { getPublishedPosts, createPost } from '@/lib/blog-data';
import { CreateBlogPostDto } from '@/types/blog';

function validateCreatePost(data: unknown): CreateBlogPostDto {
  if (!data || typeof data !== 'object') {
    throw new Error('Invalid request body');
  }

  const obj = data as Record<string, unknown>;

  if (!obj.slug || typeof obj.slug !== 'string') {
    throw new Error('Slug is required');
  }

  if (!obj.coverImage || typeof obj.coverImage !== 'string') {
    throw new Error('Cover image is required');
  }

  if (!obj.author || typeof obj.author !== 'string') {
    throw new Error('Author is required');
  }

  if (!obj.date || typeof obj.date !== 'string') {
    throw new Error('Date is required');
  }

  if (!obj.readTime || typeof obj.readTime !== 'string') {
    throw new Error('Read time is required');
  }

  if (!obj.content) {
    throw new Error('Content is required');
  }

  // Handle content as either string or locale object
  let content: Record<string, { title: string; excerpt: string; content: string }>;
  if (typeof obj.content === 'string') {
    content = {
      en: {
        title: (obj.title as string) || obj.slug as string,
        excerpt: (obj.excerpt as string) || '',
        content: obj.content as string,
      },
    };
  } else {
    content = obj.content as Record<string, { title: string; excerpt: string; content: string }>;
  }

  return {
    slug: obj.slug,
    coverImage: obj.coverImage,
    tags: Array.isArray(obj.tags) ? obj.tags : [],
    author: obj.author,
    date: obj.date,
    readTime: obj.readTime,
    published: Boolean(obj.published),
    content,
  };
}

export async function GET() {
  try {
    const posts = await getPublishedPosts();
    return NextResponse.json({ success: true, data: posts });
  } catch (error) {
    console.error('Error fetching posts:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch posts' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = validateCreatePost(body);
    const newPost = await createPost(validatedData);

    return NextResponse.json({ success: true, data: newPost }, { status: 201 });
  } catch (error) {
    console.error('Error creating post:', error);

    if (error instanceof Error && error.message.includes('already exists')) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 400 }
      );
    }

    if (error instanceof Error && error.message.includes('required')) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: false, error: 'Failed to create post' },
      { status: 500 }
    );
  }
}
