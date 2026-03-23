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
  Home,
  TrendingUp,
  BookOpen,
  Settings,
  LogOut,
  Heart,
  Bell,
  Bot,
  Users,
  Menu,
  X,
  Apple,
  Brain,
  Lightbulb,
  Activity,
  ChevronDown,
} from "lucide-react";

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

export default function DashboardPage() {
  const router = useRouter();
  const pathname = usePathname();
  const supabase = createClient();

  const [userName, setUserName] = useState<string>("User");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const navLinks = [
    { icon: Home,      label: "Dashboard",     id: "dashboard" },
    { icon: BookOpen,  label: "Journal",        id: "journal" },
    { icon: Bot,       label: "AI Chatbot",     id: "chatbot" },
    { icon: Users,     label: "Community",      id: "community" },
    { icon: TrendingUp,label: "Insights",       id: "insights" },
    { icon: Brain,     label: "Mental Health",  id: "mental-health" },
    { icon: Apple,     label: "Diet Plan",      id: "diet" },
    { icon: Lightbulb, label: "Wellness Tips",  id: "tips" },
    { icon: Activity,  label: "Tracker",        id: "tracker" },
    { icon: Settings,  label: "Settings",       id: "settings" },
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
      backgroundColor: "var(--color-bg-card)",
      border: "1px solid var(--color-border)",
      borderRadius: "10px",
      color: "var(--color-text-body)",
    },
  };

  return (
    <div className="min-h-screen flex bg-[var(--color-bg-main)]">

      {/* ==== MOBILE HEADER ==== */}
      <header className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-[var(--color-bg-card)] border-b border-[var(--color-border)] flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 rounded-lg hover:bg-[var(--color-bg-badge)] transition"
          >
            {sidebarOpen ? (
              <X size={22} className="text-[var(--color-text-header)]" />
            ) : (
              <Menu size={22} className="text-[var(--color-text-header)]" />
            )}
          </button>
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-[var(--color-bg-main)] border border-[var(--color-border)] rounded-lg flex items-center justify-center">
              <Heart size={14} className="text-[var(--color-text-header)]" fill="currentColor" />
            </div>
            <h1 className="font-bold text-lg text-[var(--color-text-header)]">MyMood</h1>
          </div>
        </div>
        <button className="relative p-2.5 bg-[var(--color-bg-main)] rounded-xl border border-[var(--color-border)] hover:bg-[var(--color-bg-badge)] transition">
          <Bell size={18} className="text-[var(--color-text-header)]" />
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-white text-xs flex items-center justify-center">
            3
          </span>
        </button>
      </header>

      {/* ==== SIDEBAR OVERLAY ==== */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* ==== SIDEBAR ==== */}
      <aside
        className={`fixed top-0 left-0 h-full w-64 bg-[var(--color-bg-card)] border-r border-[var(--color-border)] z-40 flex flex-col transform transition-transform duration-300 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0`}
      >
        <div className="flex flex-col h-full overflow-y-auto">

          {/* Logo */}
          <div className="p-6 flex items-center gap-3 shrink-0 border-b border-[var(--color-border)]">
            <div className="w-9 h-9 bg-[var(--color-bg-main)] border border-[var(--color-border)] rounded-xl flex items-center justify-center">
              <Heart size={16} className="text-[var(--color-text-header)]" fill="currentColor" />
            </div>
            <div>
              <h1 className="font-bold text-lg text-[var(--color-text-header)]">MyMood</h1>
              <p className="text-xs text-[var(--color-text-body)] opacity-50">Mental Wellness</p>
            </div>
          </div>

          {/* Nav Links */}
          <nav className="flex-1 px-3 py-4 space-y-0.5">
            {navLinks.map((item) => {
              const Icon = item.icon;
              const active = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    router.push(`/dashboard/${item.id === "dashboard" ? "" : item.id}`);
                    setSidebarOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition text-sm ${
                    active
                      ? "bg-[var(--color-text-header)] text-[var(--color-bg-main)] font-medium"
                      : "text-[var(--color-text-body)] hover:bg-[var(--color-bg-badge)]"
                  }`}
                >
                  <Icon size={17} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* ==== USER DROPDOWN ==== */}
        <div className="relative p-4 border-t border-[var(--color-border)]">
          <button
            onClick={() => setProfileOpen(!profileOpen)}
            className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl hover:bg-[var(--color-bg-badge)] transition"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-[var(--color-bg-main)] border border-[var(--color-border)] rounded-full flex items-center justify-center text-[var(--color-text-header)] font-bold text-sm">
                {userName.charAt(0).toUpperCase()}
              </div>
              <div className="text-left">
                <p className="font-medium text-[var(--color-text-header)] text-sm">{userName}</p>
                <p className="text-xs text-[var(--color-text-body)] opacity-50">Free Member</p>
              </div>
            </div>
            <ChevronDown
              size={14}
              className={`text-[var(--color-text-body)] opacity-50 transition-transform ${
                profileOpen ? "rotate-180" : ""
              }`}
            />
          </button>

          {profileOpen && (
            <div className="mt-1 bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-xl overflow-hidden">
              <button
                onClick={() => { router.push("/dashboard/settings"); setProfileOpen(false); }}
                className="w-full flex items-center gap-2 text-[var(--color-text-body)] hover:bg-[var(--color-bg-badge)] px-4 py-2.5 transition text-sm"
              >
                <Settings size={14} />
                <span>Settings</span>
              </button>
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-2 text-red-500 hover:bg-red-500/5 px-4 py-2.5 transition text-sm border-t border-[var(--color-border)]"
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
            <h2 className="text-2xl font-bold text-[var(--color-text-header)]">
              {getGreeting()}, {userName} 💙
            </h2>
            <p className="text-[var(--color-text-body)] opacity-60 text-sm mt-0.5">
              How are you feeling today?
            </p>
          </div>
          <button className="relative p-2.5 bg-[var(--color-bg-card)] rounded-xl border border-[var(--color-border)] hover:bg-[var(--color-bg-badge)] transition">
            <Bell size={18} className="text-[var(--color-text-header)]" />
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-white text-xs flex items-center justify-center">
              3
            </span>
          </button>
        </header>

        {/* === Stat Cards === */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {[
            { label: "Today's Mood", value: "😊", sub: "Happy",             isEmoji: true  },
            { label: "Avg Score",    value: "3.2", sub: "out of 5",          isEmoji: false },
            { label: "Check-ins",    value: "26",  sub: "Last 30 days",      isEmoji: false },
            { label: "Streak",       value: "5🔥", sub: "Consecutive days",  isEmoji: false },
          ].map((card) => (
            <div key={card.label} className="bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-2xl p-5 text-center">
              <p className="text-xs text-[var(--color-text-body)] opacity-60 mb-2">{card.label}</p>
              <p className={`font-bold text-[var(--color-text-header)] ${card.isEmoji ? "text-3xl mb-1" : "text-2xl"}`}>
                {card.value}
              </p>
              <p className="text-xs text-[var(--color-text-body)] opacity-50">{card.sub}</p>
            </div>
          ))}
        </div>

        {/* === Charts === */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">

          {/* Line Chart */}
          <div className="bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-2xl p-6">
            <h3 className="text-sm font-semibold text-[var(--color-text-header)] mb-1">Weekly Progress</h3>
            <p className="text-xs text-[var(--color-text-body)] opacity-50 mb-5">Your mood trend this week</p>
            <ResponsiveContainer width="100%" height={220}>
              <LineChart
                data={[
                  { day: "Mon", mood: 4 },
                  { day: "Tue", mood: 3 },
                  { day: "Wed", mood: 5 },
                  { day: "Thu", mood: 2 },
                  { day: "Fri", mood: 4 },
                  { day: "Sat", mood: 5 },
                  { day: "Sun", mood: 3 },
                ]}
                margin={{ top: 5, right: 10, left: -20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" opacity={0.4} />
                <XAxis dataKey="day" tick={{ fill: "var(--color-text-body)", fontSize: 11 }} axisLine={false} />
                <YAxis domain={[0, 5]} ticks={[1, 2, 3, 4, 5]} tick={{ fill: "var(--color-text-body)", fontSize: 11 }} axisLine={false} />
                <Tooltip {...tooltipStyle} />
                <Line type="monotone" dataKey="mood" stroke="var(--color-text-header)" strokeWidth={2.5}
                  dot={{ r: 4, fill: "var(--color-text-header)", strokeWidth: 0 }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Pie Chart */}
          <div className="bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-2xl p-6">
            <h3 className="text-sm font-semibold text-[var(--color-text-header)] mb-1">Mood Distribution</h3>
            <p className="text-xs text-[var(--color-text-body)] opacity-50 mb-5">Breakdown of your moods</p>
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
                <div key={item.label} className="flex items-center gap-1.5 text-xs text-[var(--color-text-body)] opacity-70">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ background: item.color }} />
                  {item.label}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* === Quick Nav === */}
        <div className="bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-2xl p-6 mb-6">
          <h3 className="text-sm font-semibold text-[var(--color-text-header)] mb-4">Quick access</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
            {[
              { icon: BookOpen,   label: "Journal",  id: "journal"  },
              { icon: Bot,        label: "AI Chat",  id: "chatbot"  },
              { icon: TrendingUp, label: "Insights", id: "insights" },
              { icon: Activity,   label: "Tracker",  id: "tracker"  },
              { icon: Apple,      label: "Diet Plan",id: "diet"     },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <button key={item.id} onClick={() => router.push(`/dashboard/${item.id}`)}
                  className="flex flex-col items-center gap-2 p-4 rounded-xl border border-[var(--color-border)] hover:bg-[var(--color-bg-badge)] hover:border-[var(--color-text-header)] transition text-[var(--color-text-body)] opacity-70 hover:opacity-100">
                  <Icon size={20} />
                  <span className="text-xs font-medium">{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* === Tip of the Day === */}
        <div className="bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-2xl px-6 py-4 text-center">
          <p className="text-[var(--color-text-body)] opacity-60 text-sm italic">
            💙 Focus on progress, not perfection. Even small steps count.
          </p>
        </div>

      </main>
    </div>
  );
}