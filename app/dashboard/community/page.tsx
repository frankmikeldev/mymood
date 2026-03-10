"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { Heart, MessageCircle, Send } from "lucide-react";

const supabase = createClient();

const ANON_NAMES = [
  "Peaceful Panda", "Calm Koala", "Gentle Giraffe", "Quiet Quail",
  "Serene Swan", "Mindful Moose", "Brave Butterfly", "Kind Kangaroo",
  "Hopeful Heron", "Tender Tiger", "Warm Walrus", "Soft Sparrow",
  "Caring Crane", "Blissful Bear", "Loving Lynx", "Tranquil Turtle",
];

function getAnonName(userId: string) {
  // Always gives the same name for the same user ID
  const index = userId.charCodeAt(0) % ANON_NAMES.length;
  return ANON_NAMES[index];
}

export default function CommunityPage() {
  const [posts, setPosts] = useState<any[]>([]);
  const [newPost, setNewPost] = useState("");
  const [userId, setUserId] = useState<string | null>(null);
  const [likedPosts, setLikedPosts] = useState<Set<string>>(new Set());
  const [openComments, setOpenComments] = useState<string | null>(null);
  const [comments, setComments] = useState<Record<string, any[]>>({});
  const [newComment, setNewComment] = useState("");

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) {
        setUserId(user.id);
        fetchLikedPosts(user.id);
      }
    });

    fetchPosts();

    const channel = supabase
      .channel("community-feed")
      .on("postgres_changes", { event: "*", schema: "public", table: "community_posts" }, () => fetchPosts())
      .on("postgres_changes", { event: "*", schema: "public", table: "community_likes" }, () => fetchPosts())
      .on("postgres_changes", { event: "*", schema: "public", table: "community_comments" }, () => fetchPosts())
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, []);

  async function fetchPosts() {
    const { data } = await supabase
      .from("community_posts")
      .select(`*, community_likes(count), community_comments(count)`)
      .order("created_at", { ascending: false });

    if (data) setPosts(data);
  }

  async function fetchLikedPosts(uid: string) {
    const { data } = await supabase
      .from("community_likes")
      .select("post_id")
      .eq("user_id", uid);

    if (data) setLikedPosts(new Set(data.map((l) => l.post_id)));
  }

  async function fetchComments(postId: string) {
    const { data } = await supabase
      .from("community_comments")
      .select("*")
      .eq("post_id", postId)
      .order("created_at", { ascending: true });

    if (data) setComments((prev) => ({ ...prev, [postId]: data }));
  }

  async function createPost() {
    if (!newPost.trim() || !userId) return;

    await supabase.from("community_posts").insert({
      content: newPost,
      user_id: userId,
    });

    setNewPost("");
  }

  async function toggleLike(postId: string) {
    if (!userId) return;

    if (likedPosts.has(postId)) {
      await supabase
        .from("community_likes")
        .delete()
        .eq("post_id", postId)
        .eq("user_id", userId);

      setLikedPosts((prev) => {
        const next = new Set(prev);
        next.delete(postId);
        return next;
      });
    } else {
      await supabase.from("community_likes").insert({
        post_id: postId,
        user_id: userId,
      });

      setLikedPosts((prev) => new Set([...prev, postId]));
    }

    fetchPosts();
  }

  async function submitComment(postId: string) {
    if (!newComment.trim() || !userId) return;

    await supabase.from("community_comments").insert({
      post_id: postId,
      user_id: userId,
      comment: newComment,
    });

    setNewComment("");
    fetchComments(postId);
    fetchPosts();
  }

  function toggleComments(postId: string) {
    if (openComments === postId) {
      setOpenComments(null);
    } else {
      setOpenComments(postId);
      fetchComments(postId);
    }
  }

  function timeAgo(date: string) {
    const seconds = Math.floor((Date.now() - new Date(date).getTime()) / 1000);
    if (seconds < 60) return "just now";
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    return `${Math.floor(seconds / 86400)}d ago`;
  }

  return (
    <div className="min-h-screen bg-[var(--color-bg)] p-6 md:p-10">
      <div className="max-w-3xl mx-auto">

        {/* Header */}
        <div className="mb-10">
          <h1 className="text-3xl font-bold text-white">MyMood Community</h1>
          <p className="text-[var(--color-text-muted)] mt-2">
            A safe, anonymous space to share and support each other.
          </p>
          <div className="mt-3 inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-500/10 border border-green-500/20 text-green-400 text-xs">
            🔒 All posts are anonymous — your identity is never shown
          </div>
        </div>

        {/* Create Post */}
        <div className="mb-8 bg-[var(--color-box)] border border-[var(--color-border)] rounded-xl p-4">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 rounded-full bg-[var(--color-accent)]/20 flex items-center justify-center text-xs text-[var(--color-accent)] font-semibold">
              ?
            </div>
            <span className="text-xs text-[var(--color-text-muted)]">
              Posting as <span className="text-[var(--color-accent)]">Anonymous</span>
            </span>
          </div>

          <textarea
            value={newPost}
            onChange={(e) => setNewPost(e.target.value)}
            placeholder="Share how you're feeling today..."
            className="w-full bg-transparent border border-[var(--color-border)] rounded-lg p-3 text-sm resize-none text-white placeholder:text-gray-500 outline-none focus:border-[var(--color-accent)] transition"
            rows={3}
          />

          <button
            onClick={createPost}
            disabled={!newPost.trim()}
            className="mt-3 px-4 py-2 rounded-lg border border-[var(--color-accent)] text-[var(--color-accent)] hover:bg-[var(--color-accent)]/10 transition disabled:opacity-40"
          >
            Share Anonymously
          </button>
        </div>

        {/* Posts */}
        <div className="space-y-6">
          {posts.map((post) => {
            const isLiked = likedPosts.has(post.id);
            const isCommentsOpen = openComments === post.id;
            const anonName = getAnonName(post.user_id);
            const isMyPost = post.user_id === userId;

            return (
              <div
                key={post.id}
                className="bg-[var(--color-box)] border border-[var(--color-border)] rounded-xl p-5"
              >
                {/* Post author row */}
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-8 h-8 rounded-full bg-[var(--color-accent)]/20 flex items-center justify-center text-xs font-bold text-[var(--color-accent)]">
                    {anonName.charAt(0)}
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-[var(--color-text-primary)]">
                      {isMyPost ? "You (Anonymous)" : anonName}
                    </p>
                    <p className="text-xs text-gray-500">{timeAgo(post.created_at)}</p>
                  </div>
                </div>

                {/* Content */}
                <p className="text-sm text-white leading-relaxed">{post.content}</p>

                {/* Actions */}
                <div className="flex items-center gap-6 mt-4 text-sm text-gray-400">
                  <button
                    onClick={() => toggleLike(post.id)}
                    className={`flex items-center gap-1.5 transition ${
                      isLiked ? "text-red-500" : "hover:text-red-400"
                    }`}
                  >
                    <Heart size={18} fill={isLiked ? "currentColor" : "none"} strokeWidth={isLiked ? 0 : 1.5} />
                    <span>{post.community_likes[0]?.count || 0}</span>
                  </button>

                  <button
                    onClick={() => toggleComments(post.id)}
                    className={`flex items-center gap-1.5 transition ${
                      isCommentsOpen ? "text-[var(--color-accent)]" : "hover:text-[var(--color-accent)]"
                    }`}
                  >
                    <MessageCircle size={18} />
                    <span>{post.community_comments[0]?.count || 0}</span>
                  </button>
                </div>

                {/* Comments section */}
                {isCommentsOpen && (
                  <div className="mt-4 border-t border-[var(--color-border)] pt-4 space-y-3">
                    {(comments[post.id] || []).length === 0 ? (
                      <p className="text-xs text-gray-500">No comments yet. Be the first!</p>
                    ) : (
                      (comments[post.id] || []).map((c) => (
                        <div key={c.id} className="flex gap-2">
                          <div className="w-6 h-6 rounded-full bg-[var(--color-accent)]/20 flex items-center justify-center text-xs font-bold text-[var(--color-accent)] shrink-0 mt-0.5">
                            {getAnonName(c.user_id).charAt(0)}
                          </div>
                          <div className="flex-1 bg-[var(--color-bg)] rounded-lg px-3 py-2">
                            <p className="text-xs font-semibold text-[var(--color-accent)] mb-0.5">
                              {c.user_id === userId ? "You (Anonymous)" : getAnonName(c.user_id)}
                            </p>
                            <p className="text-sm text-gray-300">{c.comment}</p>
                            <p className="text-xs text-gray-500 mt-1">{timeAgo(c.created_at)}</p>
                          </div>
                        </div>
                      ))
                    )}

                    {/* New comment input */}
                    <div className="flex items-center gap-2 mt-2">
                      <input
                        className="flex-1 min-w-0 bg-[var(--color-bg)] border border-[var(--color-border)] rounded-full px-4 py-2 text-sm text-white placeholder:text-gray-500 outline-none focus:border-[var(--color-accent)] transition"
                        placeholder="Comment anonymously..."
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && submitComment(post.id)}
                      />
                      <button
                        onClick={() => submitComment(post.id)}
                        disabled={!newComment.trim()}
                        className="w-8 h-8 rounded-full bg-[var(--color-accent)] flex items-center justify-center text-white disabled:opacity-40 transition shrink-0"
                      >
                        <Send size={14} />
                      </button>
                    </div>
                  </div>
                )}

              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
}