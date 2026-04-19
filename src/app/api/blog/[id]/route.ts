import { NextRequest, NextResponse } from 'next/server';
import { getPostById, updatePost, deletePost } from '@/lib/blog-data';
import { UpdateBlogPostDto } from '@/types/blog';

interface RouteParams {
  params: Promise<{ id: string }>;
}

function validateUpdatePost(data: unknown): UpdateBlogPostDto {
  if (!data || typeof data !== 'object') {
    throw new Error('Invalid request body');
  }

  const obj = data as Record<string, unknown>;

  if (obj.slug !== undefined && typeof obj.slug !== 'string') {
    throw new Error('Slug must be a string');
  }

  if (obj.coverImage !== undefined && typeof obj.coverImage !== 'string') {
    throw new Error('Cover image must be a string');
  }

  if (obj.tags !== undefined && !Array.isArray(obj.tags)) {
    throw new Error('Tags must be an array');
  }

  if (obj.author !== undefined && typeof obj.author !== 'string') {
    throw new Error('Author must be a string');
  }

  if (obj.date !== undefined && typeof obj.date !== 'string') {
    throw new Error('Date must be a string');
  }

  if (obj.readTime !== undefined && typeof obj.readTime !== 'string') {
    throw new Error('Read time must be a string');
  }

  if (obj.content !== undefined && typeof obj.content !== 'object') {
    throw new Error('Content must be an object');
  }

  return {
    slug: obj.slug as string | undefined,
    coverImage: obj.coverImage as string | undefined,
    tags: obj.tags as string[] | undefined,
    author: obj.author as string | undefined,
    date: obj.date as string | undefined,
    readTime: obj.readTime as string | undefined,
    published: obj.published as boolean | undefined,
    content: obj.content as UpdateBlogPostDto['content'],
  };
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const post = await getPostById(id);

    if (!post) {
      return NextResponse.json(
        { success: false, error: 'Post not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: post });
  } catch (error) {
    console.error('Error fetching post:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch post' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const body = await request.json();
    const validatedData = validateUpdatePost(body);

    const updatedPost = await updatePost(id, validatedData);

    if (!updatedPost) {
      return NextResponse.json(
        { success: false, error: 'Post not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: updatedPost });
  } catch (error) {
    console.error('Error updating post:', error);

    if (error instanceof Error && error.message.includes('already exists')) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: false, error: 'Failed to update post' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const deleted = await deletePost(id);

    if (!deleted) {
      return NextResponse.json(
        { success: false, error: 'Post not found' },
        { status: 404 }
      );
    }

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error('Error deleting post:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete post' },
      { status: 500 }
    );
  }
}
