"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { Heart, MessageCircle, Send, Users } from "lucide-react";
import DOMPurify from "dompurify";

const supabase = createClient();

const ANON_NAMES = [
  "Peaceful Panda", "Calm Koala", "Gentle Giraffe", "Quiet Quail",
  "Serene Swan", "Mindful Moose", "Brave Butterfly", "Kind Kangaroo",
  "Hopeful Heron", "Tender Tiger", "Warm Walrus", "Soft Sparrow",
  "Caring Crane", "Blissful Bear", "Loving Lynx", "Tranquil Turtle",
];

function getAnonName(userId: string) {
  const index = userId.charCodeAt(0) % ANON_NAMES.length;
  return ANON_NAMES[index];
}

function sanitize(text: string) {
  return DOMPurify.sanitize(text, { ALLOWED_TAGS: [] });
}

export default function CommunityPage() {
  const [posts, setPosts] = useState<any[]>([]);
  const [newPost, setNewPost] = useState("");
  const [userId, setUserId] = useState<string | null>(null);
  const [likedPosts, setLikedPosts] = useState<Set<string>>(new Set());
  const [openComments, setOpenComments] = useState<string | null>(null);
  const [comments, setComments] = useState<Record<string, any[]>>({});
  const [newComment, setNewComment] = useState("");
  const [posting, setPosting] = useState(false);

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
    setPosting(true);

    // ✅ Sanitize post content before saving
    const cleanPost = sanitize(newPost);
    if (!cleanPost.trim()) { setPosting(false); return; }

    await supabase.from("community_posts").insert({
      content: cleanPost,
      user_id: userId,
    });

    setNewPost("");
    setPosting(false);
  }

  async function toggleLike(postId: string) {
    if (!userId) return;
    if (likedPosts.has(postId)) {
      await supabase.from("community_likes").delete().eq("post_id", postId).eq("user_id", userId);
      setLikedPosts((prev) => { const next = new Set(prev); next.delete(postId); return next; });
    } else {
      await supabase.from("community_likes").insert({ post_id: postId, user_id: userId });
      setLikedPosts((prev) => new Set([...prev, postId]));
    }
    fetchPosts();
  }

  async function submitComment(postId: string) {
    if (!newComment.trim() || !userId) return;

    // ✅ Sanitize comment before saving
    const cleanComment = sanitize(newComment);
    if (!cleanComment.trim()) return;

    await supabase.from("community_comments").insert({
      post_id: postId,
      user_id: userId,
      comment: cleanComment,
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

  const inputClass = "w-full bg-[var(--color-bg-main)] border border-[var(--color-border)] rounded-xl px-4 py-3 text-sm text-[var(--color-text-header)] placeholder:text-[var(--color-text-body)] placeholder:opacity-40 outline-none focus:border-[var(--color-text-header)] transition resize-none";

  return (
    <div className="min-h-screen bg-[var(--color-bg-main)] p-6 md:p-10">
      <div className="max-w-3xl mx-auto">

        {/* Header */}
        <div className="flex items-start justify-between mb-10">
          <div>
            <h1 className="text-2xl font-bold text-[var(--color-text-header)]">Community</h1>
            <p className="text-[var(--color-text-body)] opacity-50 text-sm mt-1">
              A safe, anonymous space to share and support each other.
            </p>
            <div className="mt-3 inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[var(--color-bg-card)] border border-[var(--color-border)] text-[var(--color-text-body)] opacity-60 text-xs">
              🔒 All posts are anonymous
            </div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-[var(--color-bg-card)] border border-[var(--color-border)] flex items-center justify-center shrink-0">
            <Users size={18} className="text-[var(--color-text-header)]" />
          </div>
        </div>

        {/* Create Post */}
        <div className="mb-8 bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-7 h-7 rounded-full bg-[var(--color-bg-main)] border border-[var(--color-border)] flex items-center justify-center text-xs text-[var(--color-text-body)] font-semibold">
              ?
            </div>
            <span className="text-xs text-[var(--color-text-body)] opacity-50">
              Posting as <span className="text-[var(--color-text-header)] opacity-100">Anonymous</span>
            </span>
          </div>

          <textarea
            value={newPost}
            onChange={(e) => setNewPost(e.target.value)}
            placeholder="Share how you're feeling today..."
            className={inputClass}
            rows={3}
          />

          <div className="flex justify-end mt-3">
            <button
              onClick={createPost}
              disabled={!newPost.trim() || posting}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[var(--color-text-header)] text-[var(--color-bg-main)] text-sm font-semibold hover:opacity-90 transition disabled:opacity-30 disabled:cursor-not-allowed"
            >
              {posting ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-current border-t-transparent rounded-full animate-spin" />
                  Posting...
                </>
              ) : (
                <>
                  <Send size={13} />
                  Share anonymously
                </>
              )}
            </button>
          </div>
        </div>

        {/* Posts */}
        <div className="space-y-4">
          {posts.length === 0 && (
            <div className="text-center py-20 bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-2xl">
              <p className="text-3xl mb-3">🌱</p>
              <p className="text-[var(--color-text-header)] font-medium">No posts yet</p>
              <p className="text-[var(--color-text-body)] opacity-50 text-sm mt-1">
                Be the first to share something
              </p>
            </div>
          )}

          {posts.map((post) => {
            const isLiked = likedPosts.has(post.id);
            const isCommentsOpen = openComments === post.id;
            const anonName = getAnonName(post.user_id);
            const isMyPost = post.user_id === userId;
            const likeCount = post.community_likes[0]?.count || 0;
            const commentCount = post.community_comments[0]?.count || 0;

            return (
              <div
                key={post.id}
                className="bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-2xl p-5 hover:border-[var(--color-text-header)] hover:border-opacity-20 transition"
              >
                {/* Author row */}
                <div className="flex items-center gap-2.5 mb-4">
                  <div className="w-8 h-8 rounded-full bg-[var(--color-bg-main)] border border-[var(--color-border)] flex items-center justify-center text-xs font-bold text-[var(--color-text-header)]">
                    {anonName.charAt(0)}
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-[var(--color-text-header)]">
                      {isMyPost ? "You (Anonymous)" : anonName}
                    </p>
                    <p className="text-xs text-[var(--color-text-body)] opacity-40">
                      {timeAgo(post.created_at)}
                    </p>
                  </div>
                </div>

                {/* Content */}
                <p className="text-sm text-[var(--color-text-body)] leading-relaxed">
                  {post.content}
                </p>

                {/* Actions */}
                <div className="flex items-center gap-5 mt-4 pt-4 border-t border-[var(--color-border)]">
                  <button
                    onClick={() => toggleLike(post.id)}
                    className={`flex items-center gap-1.5 text-xs transition ${
                      isLiked
                        ? "text-red-500"
                        : "text-[var(--color-text-body)] opacity-50 hover:opacity-100 hover:text-red-400"
                    }`}
                  >
                    <Heart
                      size={15}
                      fill={isLiked ? "currentColor" : "none"}
                      strokeWidth={isLiked ? 0 : 1.5}
                    />
                    <span>{likeCount}</span>
                  </button>

                  <button
                    onClick={() => toggleComments(post.id)}
                    className={`flex items-center gap-1.5 text-xs transition ${
                      isCommentsOpen
                        ? "text-[var(--color-text-header)]"
                        : "text-[var(--color-text-body)] opacity-50 hover:opacity-100 hover:text-[var(--color-text-header)]"
                    }`}
                  >
                    <MessageCircle size={15} />
                    <span>{commentCount}</span>
                  </button>
                </div>

                {/* Comments section */}
                {isCommentsOpen && (
                  <div className="mt-4 pt-4 border-t border-[var(--color-border)] space-y-3">
                    {(comments[post.id] || []).length === 0 ? (
                      <p className="text-xs text-[var(--color-text-body)] opacity-40">
                        No comments yet. Be the first!
                      </p>
                    ) : (
                      (comments[post.id] || []).map((c) => (
                        <div key={c.id} className="flex gap-2.5">
                          <div className="w-6 h-6 rounded-full bg-[var(--color-bg-main)] border border-[var(--color-border)] flex items-center justify-center text-xs font-bold text-[var(--color-text-header)] shrink-0 mt-0.5">
                            {getAnonName(c.user_id).charAt(0)}
                          </div>
                          <div className="flex-1 bg-[var(--color-bg-main)] border border-[var(--color-border)] rounded-xl px-3 py-2.5">
                            <p className="text-xs font-semibold text-[var(--color-text-header)] mb-1">
                              {c.user_id === userId ? "You (Anonymous)" : getAnonName(c.user_id)}
                            </p>
                            <p className="text-sm text-[var(--color-text-body)] opacity-80 leading-relaxed">
                              {c.comment}
                            </p>
                            <p className="text-xs text-[var(--color-text-body)] opacity-30 mt-1.5">
                              {timeAgo(c.created_at)}
                            </p>
                          </div>
                        </div>
                      ))
                    )}

                    {/* New comment input */}
                    <div className="flex items-center gap-2 mt-3">
                      <input
                        className="flex-1 min-w-0 bg-[var(--color-bg-main)] border border-[var(--color-border)] rounded-xl px-4 py-2.5 text-sm text-[var(--color-text-header)] placeholder:text-[var(--color-text-body)] placeholder:opacity-40 outline-none focus:border-[var(--color-text-header)] transition"
                        placeholder="Comment anonymously..."
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && submitComment(post.id)}
                      />
                      <button
                        onClick={() => submitComment(post.id)}
                        disabled={!newComment.trim()}
                        className="w-9 h-9 rounded-xl bg-[var(--color-text-header)] text-[var(--color-bg-main)] flex items-center justify-center disabled:opacity-30 transition shrink-0 hover:opacity-80"
                      >
                        <Send size={13} />
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