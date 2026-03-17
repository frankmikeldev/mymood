"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { Trash2, Search, MessageSquare } from "lucide-react";

const supabase = createClient();

export default function AdminCommunityPage() {
  const [posts, setPosts] = useState<any[]>([]);
  const [filtered, setFiltered] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);

  useEffect(() => { fetchPosts(); }, []);

  useEffect(() => {
    const q = search.toLowerCase();
    setFiltered(posts.filter((p) => p.content?.toLowerCase().includes(q)));
  }, [search, posts]);

  async function fetchPosts() {
    setLoading(true);
    const { data, error } = await supabase
      .from("community_posts")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(100);

    if (error) {
      console.error("Error fetching posts:", error.message);
      setLoading(false);
      return;
    }

    setPosts(data || []);
    setFiltered(data || []);
    setLoading(false);
  }

  async function deletePost(id: string) {
    setDeleting(id);
    const { error } = await supabase
      .from("community_posts")
      .delete()
      .eq("id", id);

    if (!error) {
      setPosts((prev) => prev.filter((p) => p.id !== id));
      setFiltered((prev) => prev.filter((p) => p.id !== id));
    }
    setDeleting(null);
  }

  return (
    <div className="space-y-6 max-w-5xl">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Community Posts</h1>
          <p className="text-gray-400 mt-1 text-sm">{posts.length} total posts</p>
        </div>
        <div className="w-10 h-10 rounded-xl bg-violet-600/10 flex items-center justify-center">
          <MessageSquare size={18} className="text-violet-400" />
        </div>
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search posts..."
          className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-[#0f0f18] border border-white/10 text-sm text-white placeholder:text-gray-500 outline-none focus:border-violet-500 transition"
        />
      </div>

      {/* Posts */}
      <div className="space-y-3">
        {loading ? (
          <div className="flex items-center justify-center gap-2 py-16 text-gray-500">
            <div className="w-4 h-4 border-2 border-violet-500 border-t-transparent rounded-full animate-spin" />
            Loading posts...
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16 bg-[#0f0f18] border border-white/5 rounded-2xl">
            <MessageSquare size={28} className="text-gray-600 mx-auto mb-3" />
            <p className="text-gray-500 text-sm">No posts found</p>
          </div>
        ) : (
          filtered.map((post) => (
            <div
              key={post.id}
              className="bg-[#0f0f18] border border-white/5 rounded-2xl p-5 hover:border-white/10 transition"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">

                  {/* Meta */}
                  <div className="flex items-center gap-2 mb-2 flex-wrap">
                    <span className="text-xs text-gray-600">
                      {new Date(post.created_at).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                    {post.mood && (
                      <span className="px-2 py-0.5 rounded-full bg-violet-500/10 text-violet-300 text-xs">
                        {post.mood}
                      </span>
                    )}
                    <span className="text-xs text-gray-600 font-mono">
                      {post.id?.slice(0, 8)}...
                    </span>
                  </div>

                  {/* Content */}
                  <p className="text-sm text-gray-300 leading-relaxed">
                    {post.content}
                  </p>

                  {/* Stats */}
                  <div className="flex gap-4 mt-3 text-xs text-gray-600">
                    <span>User: {post.user_id?.slice(0, 8)}...</span>
                  </div>
                </div>

                {/* Delete button */}
                <button
                  onClick={() => deletePost(post.id)}
                  disabled={deleting === post.id}
                  className="p-2 rounded-lg hover:bg-red-500/10 text-red-400 transition shrink-0 disabled:opacity-50"
                  title="Delete post"
                >
                  {deleting === post.id ? (
                    <div className="w-4 h-4 border-2 border-red-400 border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <Trash2 size={15} />
                  )}
                </button>
              </div>
            </div>
          ))
        )}
      </div>

    </div>
  );
}