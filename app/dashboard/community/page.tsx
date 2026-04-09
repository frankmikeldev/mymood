"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { Heart, MessageCircle, Send, Users } from "lucide-react";
import DOMPurify from "dompurify";

const supabase = createClient();
const font = "'Manrope', sans-serif";

const ANON_NAMES = [
  "Peaceful Panda", "Calm Koala", "Gentle Giraffe", "Quiet Quail",
  "Serene Swan", "Mindful Moose", "Brave Butterfly", "Kind Kangaroo",
  "Hopeful Heron", "Tender Tiger", "Warm Walrus", "Soft Sparrow",
  "Caring Crane", "Blissful Bear", "Loving Lynx", "Tranquil Turtle",
];

function getAnonName(userId: string) {
  return ANON_NAMES[userId.charCodeAt(0) % ANON_NAMES.length];
}

function sanitize(text: string) {
  return DOMPurify.sanitize(text, { ALLOWED_TAGS: [] });
}

const inputStyle: React.CSSProperties = {
  width: "100%",
  backgroundColor: "#F5F0E8",
  border: "1px solid #E2DDD6",
  borderRadius: "12px",
  padding: "12px 16px",
  fontSize: "15px",
  fontFamily: font,
  fontWeight: 400,
  color: "#111111",
  outline: "none",
  resize: "none",
  transition: "border-color 0.2s",
};

export default function CommunityPage() {
  const [posts, setPosts]               = useState<any[]>([]);
  const [newPost, setNewPost]           = useState("");
  const [userId, setUserId]             = useState<string | null>(null);
  const [likedPosts, setLikedPosts]     = useState<Set<string>>(new Set());
  const [openComments, setOpenComments] = useState<string | null>(null);
  const [comments, setComments]         = useState<Record<string, any[]>>({});
  const [newComment, setNewComment]     = useState("");
  const [posting, setPosting]           = useState(false);

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) { setUserId(user.id); fetchLikedPosts(user.id); }
    });
    fetchPosts();
    const channel = supabase
      .channel("community-feed")
      .on("postgres_changes", { event: "*", schema: "public", table: "community_posts" },    () => fetchPosts())
      .on("postgres_changes", { event: "*", schema: "public", table: "community_likes" },    () => fetchPosts())
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
    const { data } = await supabase.from("community_likes").select("post_id").eq("user_id", uid);
    if (data) setLikedPosts(new Set(data.map((l) => l.post_id)));
  }

  async function fetchComments(postId: string) {
    const { data } = await supabase
      .from("community_comments").select("*").eq("post_id", postId)
      .order("created_at", { ascending: true });
    if (data) setComments((prev) => ({ ...prev, [postId]: data }));
  }

  async function createPost() {
    if (!newPost.trim() || !userId) return;
    setPosting(true);
    const cleanPost = sanitize(newPost);
    if (!cleanPost.trim()) { setPosting(false); return; }
    await supabase.from("community_posts").insert({ content: cleanPost, user_id: userId });
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
    const cleanComment = sanitize(newComment);
    if (!cleanComment.trim()) return;
    await supabase.from("community_comments").insert({ post_id: postId, user_id: userId, comment: cleanComment });
    setNewComment("");
    fetchComments(postId);
    fetchPosts();
  }

  function toggleComments(postId: string) {
    if (openComments === postId) { setOpenComments(null); }
    else { setOpenComments(postId); fetchComments(postId); }
  }

  function timeAgo(date: string) {
    const seconds = Math.floor((Date.now() - new Date(date).getTime()) / 1000);
    if (seconds < 60) return "just now";
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    return `${Math.floor(seconds / 86400)}d ago`;
  }

  return (
    <div className="min-h-screen p-6 md:p-10" style={{ backgroundColor: "#F5F0E8", fontFamily: font }}>
      <div className="max-w-2xl mx-auto">

        {/* ── Page Header ── */}
        <div
          className="flex items-start justify-between mb-8 pb-5"
          style={{ borderBottom: "1px solid #E2DDD6" }}
        >
          <div>
            <h1 style={{ fontWeight: 800, fontSize: "22px", color: "#111111", fontFamily: font, letterSpacing: "-0.02em" }}>
              Community
            </h1>
            <p style={{ color: "#6b7280", fontSize: "14px", fontFamily: font, fontWeight: 400, marginTop: "2px" }}>
              A safe, anonymous space to share and support each other.
            </p>
            <div
              className="mt-3 inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs"
              style={{ backgroundColor: "#EDE8DF", border: "1px solid #E2DDD6", color: "#6b7280", fontFamily: font, fontWeight: 500 }}
            >
              🔒 All posts are anonymous
            </div>
          </div>
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
            style={{ backgroundColor: "#EDE8DF", border: "1px solid #E2DDD6" }}
          >
            <Users size={18} style={{ color: "#111111" }} />
          </div>
        </div>

        {/* ── Compose box ── */}
        <div
          className="mb-6 rounded-2xl p-5 space-y-4"
          style={{ backgroundColor: "#EDE8DF", border: "1px solid #E2DDD6" }}
        >
          <div className="flex items-center gap-2">
            <div
              className="w-7 h-7 rounded-full flex items-center justify-center text-xs"
              style={{ backgroundColor: "#F5F0E8", border: "1px solid #E2DDD6", color: "#6b7280", fontWeight: 700 }}
            >
              ?
            </div>
            <span style={{ fontSize: "13px", color: "#6b7280", fontFamily: font }}>
              Posting as <span style={{ color: "#111111", fontWeight: 600 }}>Anonymous</span>
            </span>
          </div>

          <textarea
            value={newPost}
            onChange={(e) => setNewPost(e.target.value)}
            placeholder="Share how you're feeling today..."
            rows={3}
            style={{ ...inputStyle }}
            onFocus={e => (e.currentTarget.style.borderColor = "#E8521A")}
            onBlur={e  => (e.currentTarget.style.borderColor = "#E2DDD6")}
          />

          <div className="flex justify-end">
            <button
              onClick={createPost}
              disabled={!newPost.trim() || posting}
              className="flex items-center gap-2 px-5 py-2.5 rounded-full transition disabled:opacity-30 disabled:cursor-not-allowed hover:-translate-y-0.5"
              style={{
                backgroundColor: "#E8521A",
                color: "#ffffff",
                fontSize: "14px",
                fontWeight: 700,
                fontFamily: font,
                boxShadow: "0 2px 12px rgba(232,82,26,0.3)",
              }}
              onMouseEnter={e => (e.currentTarget.style.backgroundColor = "#D4480F")}
              onMouseLeave={e => (e.currentTarget.style.backgroundColor = "#E8521A")}
            >
              {posting ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Posting...
                </>
              ) : (
                <><Send size={13} /> Share anonymously</>
              )}
            </button>
          </div>
        </div>

        {/* ── Divider ── */}
        <div style={{ borderBottom: "1px solid #E2DDD6" }} />

        {/* ── Feed ── */}
        <div>
          {posts.length === 0 && (
            <div className="text-center py-20">
              <p className="text-3xl mb-3">🌱</p>
              <p style={{ fontWeight: 700, color: "#111111", fontFamily: font, fontSize: "16px" }}>
                No posts yet
              </p>
              <p style={{ color: "#6b7280", fontFamily: font, fontSize: "14px", marginTop: "4px" }}>
                Be the first to share something
              </p>
            </div>
          )}

          {posts.map((post, idx) => {
            const isLiked        = likedPosts.has(post.id);
            const isCommentsOpen = openComments === post.id;
            const anonName       = getAnonName(post.user_id);
            const isMyPost       = post.user_id === userId;
            const likeCount      = post.community_likes[0]?.count    || 0;
            const commentCount   = post.community_comments[0]?.count || 0;

            return (
              <div
                key={post.id}
                className="py-5 px-1 transition-colors"
                style={{ borderBottom: idx < posts.length - 1 ? "1px solid #E2DDD6" : "none" }}
                onMouseEnter={e => (e.currentTarget.style.backgroundColor = "#EDE8DF")}
                onMouseLeave={e => (e.currentTarget.style.backgroundColor = "transparent")}
              >
                <div className="flex gap-3">

                  {/* Avatar */}
                  <div
                    className="w-9 h-9 rounded-full flex items-center justify-center text-sm shrink-0 mt-0.5"
                    style={{ backgroundColor: "#E8521A", color: "#ffffff", fontWeight: 700, fontFamily: font }}
                  >
                    {anonName.charAt(0)}
                  </div>

                  <div className="flex-1 min-w-0">

                    {/* Name + time */}
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <span style={{ fontWeight: 700, fontSize: "15px", color: "#111111", fontFamily: font }}>
                        {isMyPost ? "You (Anonymous)" : anonName}
                      </span>
                      <span style={{ fontSize: "13px", color: "#9ca3af", fontFamily: font }}>
                        · {timeAgo(post.created_at)}
                      </span>
                    </div>

                    {/* Post content */}
                    <p style={{ fontSize: "15px", fontWeight: 400, color: "#222222", fontFamily: font, lineHeight: 1.75 }}>
                      {post.content}
                    </p>

                    {/* Actions */}
                    <div className="flex items-center gap-5 mt-3">
                      <button
                        onClick={() => toggleLike(post.id)}
                        className="flex items-center gap-1.5 transition"
                        style={{
                          fontSize: "13px",
                          fontFamily: font,
                          color: isLiked ? "#ef4444" : "#9ca3af",
                          fontWeight: 500,
                        }}
                        onMouseEnter={e => { if (!isLiked) e.currentTarget.style.color = "#ef4444"; }}
                        onMouseLeave={e => { if (!isLiked) e.currentTarget.style.color = "#9ca3af"; }}
                      >
                        <Heart size={15} fill={isLiked ? "currentColor" : "none"} strokeWidth={isLiked ? 0 : 1.5} />
                        <span>{likeCount}</span>
                      </button>

                      <button
                        onClick={() => toggleComments(post.id)}
                        className="flex items-center gap-1.5 transition"
                        style={{
                          fontSize: "13px",
                          fontFamily: font,
                          color: isCommentsOpen ? "#111111" : "#9ca3af",
                          fontWeight: 500,
                        }}
                        onMouseEnter={e => (e.currentTarget.style.color = "#111111")}
                        onMouseLeave={e => { if (!isCommentsOpen) e.currentTarget.style.color = "#9ca3af"; }}
                      >
                        <MessageCircle size={15} />
                        <span>{commentCount}</span>
                      </button>
                    </div>

                    {/* ── Comments ── */}
                    {isCommentsOpen && (
                      <div className="mt-4 space-y-3">

                        {(comments[post.id] || []).length === 0 ? (
                          <p style={{ fontSize: "13px", color: "#9ca3af", fontFamily: font }}>
                            No comments yet. Be the first!
                          </p>
                        ) : (
                          (comments[post.id] || []).map((c) => (
                            <div key={c.id} className="flex gap-2.5">
                              <div
                                className="w-7 h-7 rounded-full flex items-center justify-center text-xs shrink-0 mt-0.5"
                                style={{ backgroundColor: "#EDE8DF", border: "1px solid #E2DDD6", color: "#111111", fontWeight: 700, fontFamily: font }}
                              >
                                {getAnonName(c.user_id).charAt(0)}
                              </div>
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-0.5">
                                  <span style={{ fontSize: "13px", fontWeight: 700, color: "#111111", fontFamily: font }}>
                                    {c.user_id === userId ? "You (Anonymous)" : getAnonName(c.user_id)}
                                  </span>
                                  <span style={{ fontSize: "12px", color: "#9ca3af", fontFamily: font }}>
                                    · {timeAgo(c.created_at)}
                                  </span>
                                </div>
                                <p style={{ fontSize: "14px", fontWeight: 400, color: "#222222", fontFamily: font, lineHeight: 1.7 }}>
                                  {c.comment}
                                </p>
                              </div>
                            </div>
                          ))
                        )}

                        {/* Comment input */}
                        <div className="flex items-center gap-2 mt-3 pt-3" style={{ borderTop: "1px solid #E2DDD6" }}>
                          <input
                            placeholder="Comment anonymously..."
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && submitComment(post.id)}
                            style={{
                              flex: 1,
                              minWidth: 0,
                              backgroundColor: "#F5F0E8",
                              border: "1px solid #E2DDD6",
                              borderRadius: "12px",
                              padding: "10px 14px",
                              fontSize: "14px",
                              fontFamily: font,
                              fontWeight: 400,
                              color: "#111111",
                              outline: "none",
                            }}
                            onFocus={e => (e.currentTarget.style.borderColor = "#E8521A")}
                            onBlur={e  => (e.currentTarget.style.borderColor = "#E2DDD6")}
                          />
                          <button
                            onClick={() => submitComment(post.id)}
                            disabled={!newComment.trim()}
                            className="w-9 h-9 rounded-xl flex items-center justify-center transition shrink-0 disabled:opacity-30 hover:-translate-y-0.5"
                            style={{ backgroundColor: "#E8521A", color: "#ffffff" }}
                            onMouseEnter={e => (e.currentTarget.style.backgroundColor = "#D4480F")}
                            onMouseLeave={e => (e.currentTarget.style.backgroundColor = "#E8521A")}
                          >
                            <Send size={13} />
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
}