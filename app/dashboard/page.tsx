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
import { useRouter } from "next/navigation";
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
  Leaf,
  ChevronDown,
} from "lucide-react";

export default function DashboardPage() {
  const router = useRouter();
  const supabase = createClient();

  const [userName, setUserName] = useState<string>("User");
  const [activeTab, setActiveTab] = useState("dashboard");
  const [theme, setTheme] = useState("light");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  // ✅ Load theme immediately on mount
  useEffect(() => {
    const saved = localStorage.getItem("theme") || "light";
    setTheme(saved);
    document.body.classList.remove("light", "dark");
    document.body.classList.add(saved);
  }, []);

  // ✅ Toggle theme instantly (mobile & desktop)
  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    document.body.classList.remove("light", "dark");
    document.body.classList.add(newTheme);
    localStorage.setItem("theme", newTheme);
  };

  // ✅ Check logged-in user safely
  useEffect(() => {
    const checkUser = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (session?.user) {
        const name =
          session.user.user_metadata?.name ||
          session.user.user_metadata?.full_name ||
          session.user.email?.split("@")[0] ||
          "User";
        setUserName(name);
      } else {
        // avoid false redirect during session restoration
        setTimeout(() => {
          router.push("/login");
        }, 400);
      }
    };

    checkUser();
  }, [router, supabase]);

  // ✅ Handle Logout
  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  const navLinks = [
    { icon: Home, label: "Dashboard", id: "dashboard" },
    { icon: BookOpen, label: "Journal", id: "journal" },
    { icon: Bot, label: "AI Chatbot", id: "chatbot" },
    { icon: Users, label: "Community", id: "community" },
    { icon: TrendingUp, label: "History", id: "history" },
    { icon: Leaf, label: "Mental Health", id: "mental-health" },
    { icon: Apple, label: "Diet Plan", id: "diet" },
    { icon: Leaf, label: "Wellness Tips", id: "tips" },
    { icon: Leaf, label: "Tracker", id: "tracker" },
    { icon: Settings, label: "Settings", id: "settings" },
  ];

  return (
    <div className="min-h-screen flex bg-[var(--color-bg-main)] transition-colors">
      {/* ==== MOBILE HEADER ==== */}
      <header className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-[var(--color-bg-card)] border-b border-[var(--color-border)] flex items-center justify-between px-4 py-3 shadow-md">
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
          <h1 className="font-bold text-lg text-[var(--color-text-header)]">
            MyMood
          </h1>
        </div>
        <button
          onClick={toggleTheme}
          className="p-2 rounded-lg border border-[var(--color-border)] hover:bg-[var(--color-bg-badge)]"
        >
          {theme === "light" ? "🌙" : "☀️"}
        </button>
      </header>

      {/* ==== SIDEBAR ==== */}
      <aside
        className={`fixed top-0 left-0 h-full w-64 bg-[var(--color-bg-card)] border-r border-[var(--color-border)] shadow-lg z-40 flex flex-col justify-between transform transition-transform duration-300 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0`}
      >
        <div className="flex flex-col h-full overflow-y-auto scrollbar-thin">
          {/* Logo */}
          <div className="p-6 flex items-center gap-3 shrink-0">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-500 rounded-xl flex items-center justify-center">
              <Heart className="text-white" size={20} />
            </div>
            <div>
              <h1 className="font-bold text-xl text-[var(--color-text-header)]">
                MyMood
              </h1>
              <p className="text-xs text-[var(--color-text-body)] opacity-70">
                Mental Wellness
              </p>
            </div>
          </div>

          {/* Nav Links */}
          <nav className="flex-1 px-4 space-y-2 pb-6">
            {navLinks.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    router.push(`/dashboard/${item.id === "dashboard" ? "" : item.id}`);
                    setSidebarOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition ${
                    activeTab === item.id
                      ? "bg-gradient-to-r from-purple-500 to-blue-500 text-white shadow-lg"
                      : "text-[var(--color-text-body)] hover:bg-[var(--color-bg-badge)]"
                  }`}
                >
                  <Icon size={20} />
                  <span className="font-medium">{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* ==== USER DROPDOWN ==== */}
        <div className="relative p-6 border-t border-[var(--color-border)]">
          <button
            onClick={() => setProfileOpen(!profileOpen)}
            className="w-full flex items-center justify-between px-4 py-2 bg-[var(--color-bg-badge)] rounded-lg hover:opacity-90 transition"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-pink-400 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                {userName.charAt(0).toUpperCase()}
              </div>
              <div className="text-left">
                <p className="font-semibold text-[var(--color-text-header)] text-sm">
                  {userName}
                </p>
                <p className="text-xs text-[var(--color-text-body)] opacity-70">
                  Premium Member
                </p>
              </div>
            </div>
            <ChevronDown
              className={`w-4 h-4 text-[var(--color-text-body)] transition-transform ${
                profileOpen ? "rotate-180" : ""
              }`}
            />
          </button>

          {profileOpen && (
            <div className="mt-2 bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-lg shadow-lg">
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-2 text-red-500 hover:bg-red-50 px-4 py-2 rounded-lg transition"
              >
                <LogOut size={18} />
                <span className="text-sm font-medium">Logout</span>
              </button>
            </div>
          )}
        </div>
      </aside>

      {/* ==== MAIN CONTENT ==== */}
      <main className="flex-1 lg:ml-64 p-8 mt-36 lg:mt-16 transition-colors">
        {/* Header */}
        <header className="flex justify-between items-center mb-10">
          <div>
            <h2 className="text-3xl font-bold text-[var(--color-text-header)] mb-3 mt-3">
              Good Morning, {userName}
            </h2>
            <p className="text-[var(--color-text-body)] opacity-80">
              How are you feeling today?
            </p>
          </div>

          <button className="relative p-3 bg-[var(--color-bg-card)] rounded-xl border border-[var(--color-border)] hover:bg-[var(--color-bg-badge)] transition">
            <Bell size={20} className="text-[var(--color-text-header)]" />
            <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full text-white text-xs flex items-center justify-center">
              3
            </span>
          </button>
        </header>

        {/* === Mood Overview === */}
        <section className="p-10 bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-2xl mt-8">
          <h2 className="text-2xl font-bold text-[var(--color-text-header)] mb-8 text-center">
            Mood Overview 
          </h2>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-10">
            <div className="bg-[var(--color-bg-main)] border border-[var(--color-border)] rounded-xl p-5 text-center shadow-sm">
              <h4 className="text-sm text-[var(--color-text-body)] mb-1">
                Today's Mood
              </h4>
              <div className="text-4xl mb-2">😊</div>
              <p className="font-semibold text-[var(--color-text-header)]">
                Happy
              </p>
            </div>

            <div className="bg-[var(--color-bg-main)] border border-[var(--color-border)] rounded-xl p-5 text-center shadow-sm">
              <h4 className="text-sm text-[var(--color-text-body)] mb-1">
                Average Anxiety
              </h4>
              <p className="text-3xl font-bold text-[var(--color-accent)]">
                3.2
              </p>
            </div>

            <div className="bg-[var(--color-bg-main)] border border-[var(--color-border)] rounded-xl p-5 text-center shadow-sm">
              <h4 className="text-sm text-[var(--color-text-body)] mb-1">
                Last 30 Check-ins
              </h4>
              <p className="text-3xl font-bold text-[var(--color-text-header)]">
                26
              </p>
            </div>

            <div className="bg-[var(--color-bg-main)] border border-[var(--color-border)] rounded-xl p-5 text-center shadow-sm">
              <h4 className="text-sm text-[var(--color-text-body)] mb-1">
                Mood Streak
              </h4>
              <p className="text-3xl font-bold text-[var(--color-accent)]">
                5 🔥
              </p>
              <p className="text-xs text-[var(--color-text-body)] opacity-70">
                Consecutive days logged
              </p>
            </div>
          </div>

          {/* === Weekly Progress Chart === */}
          <div className="mb-12">
            <h3 className="text-xl font-semibold text-[var(--color-text-header)] mb-4 text-center">
              Weekly Progress 📈
            </h3>
            <div className="w-full flex flex-col items-center">
              <div className="w-full max-w-3xl">
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart
                    data={[
                      { day: "M", mood: 4 },
                      { day: "T", mood: 3 },
                      { day: "W", mood: 5 },
                      { day: "T ", mood: 2 },
                      { day: "F", mood: 4 },
                      { day: "S", mood: 5 },
                      { day: "S ", mood: 3 },
                    ]}
                    margin={{ top: 20, right: 30, left: 0, bottom: 10 }}
                  >
                    <defs>
                      <linearGradient id="colorMood" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#a855f7" stopOpacity={0.9} />
                        <stop offset="100%" stopColor="#3b82f6" stopOpacity={0.2} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="var(--color-border)"
                      opacity={0.4}
                    />
                    <XAxis
                      dataKey="day"
                      tick={{ fill: "var(--color-text-body)" }}
                      axisLine={false}
                    />
                    <YAxis
                      domain={[0, 5]}
                      ticks={[1, 2, 3, 4, 5]}
                      tick={{ fill: "var(--color-text-body)" }}
                      axisLine={false}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "var(--color-bg-card)",
                        border: "1px solid var(--color-border)",
                        borderRadius: "10px",
                        color: "var(--color-text-body)",
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="mood"
                      stroke="url(#colorMood)"
                      strokeWidth={3}
                      dot={{ r: 5, fill: "var(--color-accent)" }}
                      activeDot={{ r: 7 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              <p className="text-sm text-[var(--color-text-body)] mt-6 opacity-80">
                Track how your mood evolves through the week 
              </p>
            </div>
          </div>

          {/* === Mood Distribution Donut Chart === */}
          <div className="flex flex-col items-center mb-12">
            <h3 className="text-xl font-semibold text-[var(--color-text-header)] mb-4 text-center">
              Mood Distribution 
            </h3>
            <div className="w-full max-w-md">
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={[
                      { name: "Happy", value: 45 },
                      { name: "Calm", value: 25 },
                      { name: "Anxious", value: 20 },
                      { name: "Sad", value: 10 },
                    ]}
                    innerRadius={60}
                    outerRadius={90}
                    fill="var(--color-accent)"
                    paddingAngle={4}
                    dataKey="value"
                  >
                    <Cell fill="#10b981" />
                    <Cell fill="#3b82f6" />
                    <Cell fill="#f59e0b" />
                    <Cell fill="#ef4444" />
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "var(--color-bg-card)",
                      border: "1px solid var(--color-border)",
                      borderRadius: "10px",
                      color: "var(--color-text-body)",
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* === Tip of the Day === */}
          <div className="text-center border-t border-[var(--color-border)] pt-6">
            <p className="text-[var(--color-text-body)] italic text-sm max-w-lg mx-auto">
              Focus on progress, not perfection. Even small steps count 
            </p>
          </div>
        </section>
      </main>
    </div>
  );
}
