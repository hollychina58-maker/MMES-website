"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "@/routing";

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

const defaultFormData = {
  title: "",
  slug: "",
  excerpt: "",
  content: "",
  coverImage: "/images/PA-GS.jpg",
  tags: [] as string[],
  author: "MMES-MCTI",
  published: false,
};

const tagOptions = ["Navigation", "AHRS", "IMU", "GNSS", "UAV", "Technology", "Autonomous", "Sensor Fusion"];

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .substring(0, 60);
}

function calculateReadTime(content: string): string {
  const wordsPerMinute = 200;
  const words = content.trim().split(/\s+/).length;
  const minutes = Math.ceil(words / wordsPerMinute);
  return `${Math.max(1, minutes)} min read`;
}

export default function AdminPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<BlogPost[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState<"all" | "published" | "drafts">("all");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(defaultFormData);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [notification, setNotification] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const [tagInput, setTagInput] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchPosts = useCallback(async () => {
    try {
      const res = await fetch("/api/blog");
      if (res.ok) {
        const data = await res.json();
        setPosts(data);
      }
    } catch (error) {
      console.error("Failed to fetch posts:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  useEffect(() => {
    let result = posts;
    if (filter === "published") result = result.filter((p) => p.published);
    if (filter === "drafts") result = result.filter((p) => !p.published);
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (p) =>
          p.slug.toLowerCase().includes(q) ||
          p.tags.some((t) => t.toLowerCase().includes(q)) ||
          p.content.en?.title.toLowerCase().includes(q)
      );
    }
    setFilteredPosts(result);
  }, [posts, filter, searchQuery]);

  const showNotification = useCallback((type: "success" | "error", message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 3000);
  }, []);

  const handleCreate = () => {
    setFormData(defaultFormData);
    setIsEditing(false);
    setEditingId(null);
    setIsModalOpen(true);
  };

  const handleEdit = (post: BlogPost) => {
    const enContent = post.content.en || Object.values(post.content)[0];
    setFormData({
      title: enContent?.title || "",
      slug: post.slug,
      excerpt: enContent?.excerpt || "",
      content: enContent?.content || "",
      coverImage: post.coverImage,
      tags: post.tags,
      author: post.author,
      published: post.published,
    });
    setIsEditing(true);
    setEditingId(post.id);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this post?")) return;
    try {
      const res = await fetch(`/api/blog/${id}`, { method: "DELETE" });
      if (res.ok || res.status === 204) {
        await fetchPosts();
        showNotification("success", "Post deleted successfully");
      } else {
        showNotification("error", "Failed to delete post");
      }
    } catch {
      showNotification("error", "Failed to delete post");
    }
  };

  const handleSave = async () => {
    if (!formData.title.trim()) {
      showNotification("error", "Title is required");
      return;
    }
    const slug = formData.slug.trim() || generateSlug(formData.title);

    const postData = {
      title: formData.title,
      slug,
      excerpt: formData.excerpt,
      content: formData.content,
      coverImage: formData.coverImage,
      tags: formData.tags,
      author: formData.author,
      published: formData.published,
    };

    try {
      if (isEditing && editingId) {
        const res = await fetch(`/api/blog/${editingId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(postData),
        });
        if (res.ok) {
          await fetchPosts();
          showNotification("success", "Post updated successfully");
        } else {
          showNotification("error", "Failed to update post");
        }
      } else {
        const res = await fetch("/api/blog", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(postData),
        });
        if (res.ok) {
          await fetchPosts();
          showNotification("success", "Post created successfully");
        } else {
          showNotification("error", "Failed to create post");
        }
      }
      setIsModalOpen(false);
    } catch {
      showNotification("error", "An error occurred");
    }
  };

  const handlePublish = async (id: string) => {
    const post = posts.find((p) => p.id === id);
    if (!post) return;
    try {
      const res = await fetch(`/api/blog/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...post, published: !post.published }),
      });
      if (res.ok) {
        await fetchPosts();
        showNotification("success", "Post status updated");
      }
    } catch {
      showNotification("error", "Failed to update status");
    }
  };

  const handleSlugAuto = () => {
    if (formData.title) {
      setFormData({ ...formData, slug: generateSlug(formData.title) });
    }
  };

  const addTag = (tag: string) => {
    const trimmed = tag.trim();
    if (trimmed && !formData.tags.includes(trimmed)) {
      setFormData({ ...formData, tags: [...formData.tags, trimmed] });
    }
    setTagInput("");
  };

  const removeTag = (tag: string) => {
    setFormData({ ...formData, tags: formData.tags.filter((t) => t !== tag) });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-900 dark:to-slate-800 py-12">
      <AnimatePresence>
        {notification && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className={`fixed top-4 right-4 z-50 px-6 py-4 rounded-xl shadow-lg ${
              notification.type === "success" ? "bg-green-500 text-white" : "bg-red-500 text-white"
            }`}
          >
            {notification.message}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-800 dark:text-white">Blog Admin</h1>
            <p className="text-slate-500 mt-1">Manage your blog posts</p>
          </div>
          <div className="flex gap-3">
            <Link
              href="/blog"
              className="px-6 py-3 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-lg font-medium hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors border border-slate-200 dark:border-slate-700"
            >
              View Blog
            </Link>
            <button
              onClick={handleCreate}
              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-500 text-white rounded-lg font-medium hover:shadow-lg hover:shadow-blue-500/30 transition-all"
            >
              New Post
            </button>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Search posts..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex gap-2">
              {(["all", "published", "drafts"] as const).map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    filter === f
                      ? "bg-blue-600 text-white"
                      : "bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-600"
                  }`}
                >
                  {f.charAt(0).toUpperCase() + f.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg overflow-hidden">
          {filteredPosts.length === 0 ? (
            <div className="p-12 text-center">
              <p className="text-slate-500 text-lg">No posts found</p>
              <button onClick={handleCreate} className="mt-4 px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700">
                Create Your First Post
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50 dark:bg-slate-700/50">
                  <tr>
                    <th className="px-6 py-4 text-start font-semibold text-slate-600 dark:text-slate-400">Title</th>
                    <th className="px-6 py-4 text-start font-semibold text-slate-600 dark:text-slate-400">Slug</th>
                    <th className="px-6 py-4 text-start font-semibold text-slate-600 dark:text-slate-400">Tags</th>
                    <th className="px-6 py-4 text-start font-semibold text-slate-600 dark:text-slate-400">Date</th>
                    <th className="px-6 py-4 text-start font-semibold text-slate-600 dark:text-slate-400">Status</th>
                    <th className="px-6 py-4 text-start font-semibold text-slate-600 dark:text-slate-400">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                  {filteredPosts.map((post) => {
                    const enContent = post.content.en;
                    return (
                      <tr key={post.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/30">
                        <td className="px-6 py-4 font-medium text-slate-800 dark:text-white">
                          {enContent?.title || post.slug}
                        </td>
                        <td className="px-6 py-4 text-slate-500 font-mono text-sm">{post.slug}</td>
                        <td className="px-6 py-4">
                          <div className="flex flex-wrap gap-1">
                            {post.tags.slice(0, 2).map((tag) => (
                              <span key={tag} className="px-2 py-1 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400 text-xs rounded-full">
                                {tag}
                              </span>
                            ))}
                            {post.tags.length > 2 && (
                              <span className="px-2 py-1 text-slate-400 text-xs">+{post.tags.length - 2}</span>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-slate-500">{post.date}</td>
                        <td className="px-6 py-4">
                          <button
                            onClick={() => handlePublish(post.id)}
                            className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                              post.published
                                ? "bg-green-100 text-green-700 hover:bg-green-200"
                                : "bg-yellow-100 text-yellow-700 hover:bg-yellow-200"
                            }`}
                          >
                            {post.published ? "Published" : "Draft"}
                          </button>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex gap-3">
                            <button onClick={() => handleEdit(post)} className="text-blue-600 hover:text-blue-800 font-medium">
                              Edit
                            </button>
                            <button onClick={() => handleDelete(post.id)} className="text-red-600 hover:text-red-800 font-medium">
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-6">
            <p className="text-slate-500 mb-1">Total Posts</p>
            <p className="text-3xl font-bold text-slate-800 dark:text-white">{posts.length}</p>
          </div>
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-6">
            <p className="text-slate-500 mb-1">Published</p>
            <p className="text-3xl font-bold text-green-600">{posts.filter((p) => p.published).length}</p>
          </div>
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-6">
            <p className="text-slate-500 mb-1">Drafts</p>
            <p className="text-3xl font-bold text-yellow-600">{posts.filter((p) => !p.published).length}</p>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setIsModalOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white dark:bg-slate-800 rounded-2xl p-8 w-full max-w-3xl max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="text-2xl font-bold mb-6 text-slate-800 dark:text-white">
                {isEditing ? "Edit Post" : "Create New Post"}
              </h2>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium mb-2 text-slate-700 dark:text-slate-400">Title</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter post title"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-sm font-medium text-slate-700 dark:text-slate-400">Slug</label>
                    <button type="button" onClick={handleSlugAuto} className="text-xs text-blue-600 hover:text-blue-800">
                      Auto-generate from title
                    </button>
                  </div>
                  <input
                    type="text"
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
                    placeholder="post-url-slug"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 text-slate-700 dark:text-slate-400">Excerpt</label>
                  <textarea
                    rows={2}
                    value={formData.excerpt}
                    onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                    placeholder="Brief description for the post"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 text-slate-700 dark:text-slate-400">Cover Image</label>
                  <select
                    value={formData.coverImage}
                    onChange={(e) => setFormData({ ...formData, coverImage: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="/images/PA-GS.jpg">PA-GS.jpg</option>
                    <option value="/images/PA-AHRS01.jpg">PA-AHRS01.jpg</option>
                    <option value="/images/PA-IMU-01G.jpg">PA-IMU-01G.jpg</option>
                    <option value="/images/PA-3ARG-A.jpg">PA-3ARG-A.jpg</option>
                    <option value="/images/PA-ARG-A.jpg">PA-ARG-A.jpg</option>
                    <option value="/images/PA-LAMIII-D.jpg">PA-LAMIII-D.jpg</option>
                    <option value="/images/PA-LASI-A.jpg">PA-LASI-A.jpg</option>
                    <option value="/images/PM-C3000.jpg">PM-C3000.jpg</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 text-slate-700 dark:text-slate-400">Tags</label>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {formData.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded-full text-sm flex items-center gap-2"
                      >
                        {tag}
                        <button onClick={() => removeTag(tag)} className="hover:text-red-600">×</button>
                      </span>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <select
                      value=""
                      onChange={(e) => addTag(e.target.value)}
                      className="flex-1 px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900"
                    >
                      <option value="">Add a tag...</option>
                      {tagOptions.filter((t) => !formData.tags.includes(t)).map((t) => (
                        <option key={t} value={t}>{t}</option>
                      ))}
                    </select>
                    <input
                      type="text"
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") { e.preventDefault(); addTag(tagInput); }
                      }}
                      placeholder="Custom tag"
                      className="flex-1 px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900"
                    />
                    <button type="button" onClick={() => addTag(tagInput)} className="px-4 py-2 bg-slate-100 dark:bg-slate-700 rounded-lg">
                      Add
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 text-slate-700 dark:text-slate-400">Content (Markdown)</label>
                  <textarea
                    rows={15}
                    value={formData.content}
                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none font-mono text-sm"
                    placeholder="# Heading&#10;&#10;Your content here..."
                  />
                </div>

                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.published}
                      onChange={(e) => setFormData({ ...formData, published: e.target.checked })}
                      className="w-5 h-5 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-slate-700 dark:text-slate-400">Publish immediately</span>
                  </label>
                </div>
              </div>

              <div className="flex justify-end gap-4 mt-8">
                <button onClick={() => setIsModalOpen(false)} className="px-6 py-3 text-slate-600 hover:text-slate-800 font-medium">
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  className="px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-500 text-white rounded-xl font-medium hover:shadow-lg hover:shadow-blue-500/30"
                >
                  {isEditing ? "Update Post" : "Create Post"}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
