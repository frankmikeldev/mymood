"use client";

import {
  LineChart,
  PieChart,
  Pie,
  Cell,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import {
  Home, TrendingUp, BookOpen, Settings, LogOut, Heart,
  Bot, Users, Menu, X, Apple, Brain, Lightbulb, Activity, ChevronDown,
} from "lucide-react";
import Link from "next/link";

const font = "'Manrope', sans-serif";

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

export default function DashboardPage() {
  const router   = useRouter();
  const pathname = usePathname();
  const supabase = createClient();

  const [userName, setUserName]     = useState<string>("User");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const navLinks = [
    { icon: Home,       label: "Dashboard",    id: "dashboard"     },
    { icon: BookOpen,   label: "Journal",      id: "journal"       },
    { icon: Bot,        label: "AI Chatbot",   id: "chatbot"       },
    { icon: Users,      label: "Community",    id: "community"     },
    { icon: TrendingUp, label: "Insights",     id: "insights"      },
    { icon: Brain,      label: "Mental Health",id: "mental-health" },
    { icon: Apple,      label: "Diet Plan",    id: "diet"          },
    { icon: Lightbulb,  label: "Wellness Tips",id: "tips"          },
    { icon: Activity,   label: "Tracker",      id: "tracker"       },
    { icon: Settings,   label: "Settings",     id: "settings"      },
  ];

  const activeTab = navLinks.find((item) =>
    item.id === "dashboard"
      ? pathname === "/dashboard" || pathname === "/dashboard/"
      : pathname.startsWith(`/dashboard/${item.id}`)
  )?.id || "dashboard";

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        const name =
          session.user.user_metadata?.name ||
          session.user.user_metadata?.full_name ||
          session.user.email?.split("@")[0] ||
          "User";
        setUserName(name);
      } else {
        setTimeout(() => router.push("/login"), 400);
      }
    };
    checkUser();
  }, [router, supabase]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  const tooltipStyle = {
    contentStyle: {
      backgroundColor: "#FFFFFF",
      border: "1px solid #E2DDD6",
      borderRadius: "10px",
      color: "#444444",
      fontFamily: font,
      fontSize: "13px",
    },
  };

  return (
    <div className="min-h-screen flex" style={{ backgroundColor: "#F5F0E8" }}>

      {/* ==== MOBILE HEADER ==== */}
      <header
        className="lg:hidden fixed top-0 left-0 right-0 z-50 border-b flex items-center justify-between px-4 py-3"
        style={{ backgroundColor: "rgba(255,255,255,0.92)", borderColor: "#E2DDD6", backdropFilter: "blur(12px)" }}
      >
        <div className="flex items-center gap-3">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 rounded-lg transition"
            style={{ color: "#111111" }}
          >
            {sidebarOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
          <Link
            href="/dashboard"
            className="flex items-center gap-2"
            style={{ fontWeight: 800, fontSize: "17px", color: "#111111", fontFamily: font }}
          >
            <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ backgroundColor: "#111111" }}>
              <Heart size={13} fill="#F5F0E8" style={{ color: "#F5F0E8" }} />
            </div>
            MyMood
          </Link>
        </div>
      </header>

      {/* ==== SIDEBAR OVERLAY ==== */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/40 z-30 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* ==== SIDEBAR ==== */}
      <aside
        className={`fixed top-0 left-0 h-full w-64 border-r z-40 flex flex-col transform transition-transform duration-300 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0`}
        style={{ backgroundColor: "#F5F0E8", borderColor: "#E2DDD6" }}
      >
        <div className="flex flex-col h-full overflow-y-auto">

          {/* Logo */}
          <div className="p-6 flex items-center gap-3 shrink-0 border-b" style={{ borderColor: "#E2DDD6" }}>
            <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ backgroundColor: "#111111" }}>
              <Heart size={16} fill="#F5F0E8" style={{ color: "#F5F0E8" }} />
            </div>
            <div>
              <h1 style={{ fontWeight: 800, fontSize: "17px", color: "#111111", fontFamily: font }}>MyMood</h1>
              <p style={{ fontSize: "11px", color: "#6b7280", fontFamily: font }}>Mental Wellness</p>
            </div>
          </div>

          {/* Nav Links */}
          <nav className="flex-1 px-3 py-4 space-y-0.5">
            {navLinks.map((item) => {
              const Icon   = item.icon;
              const active = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    router.push(`/dashboard/${item.id === "dashboard" ? "" : item.id}`);
                    setSidebarOpen(false);
                  }}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition text-sm"
                  style={{
                    backgroundColor: active ? "#111111" : "transparent",
                    color:           active ? "#F5F0E8" : "#444444",
                    fontWeight:      active ? 600 : 400,
                    fontFamily: font,
                  }}
                  onMouseEnter={e => { if (!active) e.currentTarget.style.backgroundColor = "#EDE8DF"; }}
                  onMouseLeave={e => { if (!active) e.currentTarget.style.backgroundColor = "transparent"; }}
                >
                  <Icon size={17} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* ==== USER DROPDOWN ==== */}
        <div className="relative p-4 border-t" style={{ borderColor: "#E2DDD6" }}>
          <button
            onClick={() => setProfileOpen(!profileOpen)}
            className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl transition"
            onMouseEnter={e => (e.currentTarget.style.backgroundColor = "#EDE8DF")}
            onMouseLeave={e => (e.currentTarget.style.backgroundColor = "transparent")}
          >
            <div className="flex items-center gap-3">
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center text-sm"
                style={{ backgroundColor: "#E8521A", color: "#ffffff", fontWeight: 700, fontFamily: font }}
              >
                {userName.charAt(0).toUpperCase()}
              </div>
              <div className="text-left">
                <p style={{ fontWeight: 600, fontSize: "14px", color: "#111111", fontFamily: font }}>{userName}</p>
                <p style={{ fontSize: "11px", color: "#6b7280", fontFamily: font }}>Free Member</p>
              </div>
            </div>
            <ChevronDown
              size={14}
              style={{ color: "#9ca3af", transform: profileOpen ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.2s" }}
            />
          </button>

          {profileOpen && (
            <div
              className="mt-1 rounded-xl overflow-hidden"
              style={{ backgroundColor: "#FFFFFF", border: "1px solid #E2DDD6", boxShadow: "0 4px 16px rgba(0,0,0,0.08)" }}
            >
              <button
                onClick={() => { router.push("/dashboard/settings"); setProfileOpen(false); }}
                className="w-full flex items-center gap-2 px-4 py-2.5 transition text-sm"
                style={{ color: "#444444", fontFamily: font }}
                onMouseEnter={e => (e.currentTarget.style.backgroundColor = "#F5F0E8")}
                onMouseLeave={e => (e.currentTarget.style.backgroundColor = "transparent")}
              >
                <Settings size={14} />
                <span>Settings</span>
              </button>
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-2 px-4 py-2.5 transition text-sm border-t"
                style={{ color: "#ef4444", borderColor: "#E2DDD6", fontFamily: font }}
                onMouseEnter={e => (e.currentTarget.style.backgroundColor = "rgba(239,68,68,0.05)")}
                onMouseLeave={e => (e.currentTarget.style.backgroundColor = "transparent")}
              >
                <LogOut size={14} />
                <span>Sign out</span>
              </button>
            </div>
          )}
        </div>
      </aside>

      {/* ==== MAIN CONTENT ==== */}
      <main className="flex-1 lg:ml-64 px-6 pb-10 pt-20 lg:pt-8">

        {/* Header */}
        <header className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-2xl" style={{ fontWeight: 800, color: "#111111", fontFamily: font, letterSpacing: "-0.02em" }}>
              {getGreeting()}, {userName} 💙
            </h2>
            <p className="text-sm mt-0.5" style={{ color: "#6b7280", fontFamily: font, fontWeight: 400 }}>
              How are you feeling today?
            </p>
          </div>
        </header>

        {/* === Stat Cards === */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {[
            { label: "Today's Mood", value: "😊", sub: "Happy",            isEmoji: true  },
            { label: "Avg Score",    value: "3.2", sub: "out of 5",         isEmoji: false },
            { label: "Check-ins",    value: "26",  sub: "Last 30 days",     isEmoji: false },
            { label: "Streak",       value: "5🔥", sub: "Consecutive days", isEmoji: false },
          ].map((card) => (
            <div
              key={card.label}
              className="rounded-2xl p-5 text-center"
              style={{ backgroundColor: "#FFFFFF", border: "1px solid #E2DDD6", boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}
            >
              <p className="text-xs mb-2" style={{ color: "#6b7280", fontFamily: font }}>{card.label}</p>
              <p
                className={card.isEmoji ? "text-3xl mb-1" : "text-2xl"}
                style={{ fontWeight: 800, color: "#111111", fontFamily: font }}
              >
                {card.value}
              </p>
              <p className="text-xs" style={{ color: "#9ca3af", fontFamily: font }}>{card.sub}</p>
            </div>
          ))}
        </div>

        {/* === Charts === */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">

          {/* Line Chart */}
          <div
            className="rounded-2xl p-6"
            style={{ backgroundColor: "#FFFFFF", border: "1px solid #E2DDD6", boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}
          >
            <h3 className="text-sm mb-1" style={{ fontWeight: 700, color: "#111111", fontFamily: font }}>
              Weekly Progress
            </h3>
            <p className="text-xs mb-5" style={{ color: "#9ca3af", fontFamily: font }}>
              Your mood trend this week
            </p>
            <ResponsiveContainer width="100%" height={220}>
              <LineChart
                data={[
                  { day: "Mon", mood: 4 }, { day: "Tue", mood: 3 },
                  { day: "Wed", mood: 5 }, { day: "Thu", mood: 2 },
                  { day: "Fri", mood: 4 }, { day: "Sat", mood: 5 },
                  { day: "Sun", mood: 3 },
                ]}
                margin={{ top: 5, right: 10, left: -20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#E2DDD6" opacity={0.6} />
                <XAxis dataKey="day" tick={{ fill: "#6b7280", fontSize: 11, fontFamily: font }} axisLine={false} />
                <YAxis domain={[0, 5]} ticks={[1, 2, 3, 4, 5]} tick={{ fill: "#6b7280", fontSize: 11, fontFamily: font }} axisLine={false} />
                <Tooltip {...tooltipStyle} />
                <Line type="monotone" dataKey="mood" stroke="#E8521A" strokeWidth={2.5}
                  dot={{ r: 4, fill: "#E8521A", strokeWidth: 0 }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Pie Chart */}
          <div
            className="rounded-2xl p-6"
            style={{ backgroundColor: "#FFFFFF", border: "1px solid #E2DDD6", boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}
          >
            <h3 className="text-sm mb-1" style={{ fontWeight: 700, color: "#111111", fontFamily: font }}>
              Mood Distribution
            </h3>
            <p className="text-xs mb-5" style={{ color: "#9ca3af", fontFamily: font }}>
              Breakdown of your moods
            </p>
            <ResponsiveContainer width="100%" height={160}>
              <PieChart>
                <Pie
                  data={[
                    { name: "Happy",   value: 45 },
                    { name: "Calm",    value: 25 },
                    { name: "Anxious", value: 20 },
                    { name: "Sad",     value: 10 },
                  ]}
                  innerRadius={45} outerRadius={70} paddingAngle={4} dataKey="value"
                >
                  <Cell fill="#10b981" />
                  <Cell fill="#3b82f6" />
                  <Cell fill="#f59e0b" />
                  <Cell fill="#ef4444" />
                </Pie>
                <Tooltip {...tooltipStyle} />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex flex-wrap justify-center gap-3 mt-2">
              {[
                { label: "Happy",   color: "#10b981" },
                { label: "Calm",    color: "#3b82f6" },
                { label: "Anxious", color: "#f59e0b" },
                { label: "Sad",     color: "#ef4444" },
              ].map((item) => (
                <div key={item.label} className="flex items-center gap-1.5 text-xs" style={{ color: "#6b7280", fontFamily: font }}>
                  <span className="w-2.5 h-2.5 rounded-full" style={{ background: item.color }} />
                  {item.label}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* === Quick Nav === */}
        <div
          className="rounded-2xl p-6 mb-6"
          style={{ backgroundColor: "#FFFFFF", border: "1px solid #E2DDD6", boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}
        >
          <h3 className="text-sm mb-4" style={{ fontWeight: 700, color: "#111111", fontFamily: font }}>
            Quick access
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
            {[
              { icon: BookOpen,   label: "Journal",   id: "journal"  },
              { icon: Bot,        label: "AI Chat",   id: "chatbot"  },
              { icon: TrendingUp, label: "Insights",  id: "insights" },
              { icon: Activity,   label: "Tracker",   id: "tracker"  },
              { icon: Apple,      label: "Diet Plan", id: "diet"     },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => router.push(`/dashboard/${item.id}`)}
                  className="flex flex-col items-center gap-2 p-4 rounded-xl border transition"
                  style={{ borderColor: "#E2DDD6", color: "#444444", fontFamily: font, backgroundColor: "transparent" }}
                  onMouseEnter={e => {
                    e.currentTarget.style.backgroundColor = "#F5F0E8";
                    e.currentTarget.style.borderColor = "#111111";
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.backgroundColor = "transparent";
                    e.currentTarget.style.borderColor = "#E2DDD6";
                  }}
                >
                  <Icon size={20} />
                  <span className="text-xs" style={{ fontWeight: 500 }}>{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* === Tip of the Day === */}
        <div
          className="rounded-2xl px-6 py-4 text-center"
          style={{ backgroundColor: "#FFFFFF", border: "1px solid #E2DDD6", boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}
        >
          <p className="text-sm italic" style={{ color: "#6b7280", fontFamily: font, fontWeight: 400 }}>
            💙 Focus on progress, not perfection. Even small steps count.
          </p>
        </div>

      </main>
    </div>
  );
}