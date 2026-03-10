"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import {
  User, Bell, Shield, Palette, Globe,
  LogOut, Trash2, Check, ChevronRight, Moon, Sun
} from "lucide-react";

const supabase = createClient();

type Section = "profile" | "notifications" | "appearance" | "privacy" | "account";

export default function SettingsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [activeSection, setActiveSection] = useState<Section>("profile");
  const [userEmail, setUserEmail] = useState("");

  // Profile
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [bio, setBio] = useState("");

  // Notifications
  const [notifications, setNotifications] = useState(true);
  const [reminderTime, setReminderTime] = useState("20:00");
  const [emailNotifs, setEmailNotifs] = useState(false);
  const [weeklyReport, setWeeklyReport] = useState(true);

  // Appearance
  const [theme, setTheme] = useState("dark");
  const [language, setLanguage] = useState("en");

  // Privacy
  const [anonymousPosts, setAnonymousPosts] = useState(true);
  const [shareData, setShareData] = useState(false);

  useEffect(() => {
    loadSettings();
  }, []);

  async function loadSettings() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    setUserEmail(user.email || "");

    const { data } = await supabase
      .from("user_profiles")
      .select("*")
      .eq("id", user.id)
      .single();

    if (data) {
      setName(data.name || "");
      setUsername(data.username || "");
      setBio(data.bio || "");
      setNotifications(data.notifications ?? true);
      setReminderTime(data.reminder_time || "20:00");
      setEmailNotifs(data.email_notifs ?? false);
      setWeeklyReport(data.weekly_report ?? true);
      setTheme(data.theme || "dark");
      setLanguage(data.language || "en");
      setAnonymousPosts(data.anonymous_posts ?? true);
      setShareData(data.share_data ?? false);
    }

    setLoading(false);
  }

  async function saveSettings() {
    setSaving(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    await supabase.from("user_profiles").upsert({
      id: user.id,
      name,
      username,
      bio,
      notifications,
      reminder_time: reminderTime,
      email_notifs: emailNotifs,
      weekly_report: weeklyReport,
      theme,
      language,
      anonymous_posts: anonymousPosts,
      share_data: shareData,
      updated_at: new Date().toISOString(),
    });

    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  }

  async function signOut() {
    await supabase.auth.signOut();
    window.location.href = "/";
  }

  async function deleteAccount() {
    const confirmed = window.confirm(
      "Are you sure you want to delete your account? This action cannot be undone."
    );
    if (!confirmed) return;
    const confirmed2 = window.confirm("All your data will be permanently deleted. Continue?");
    if (!confirmed2) return;
    await supabase.auth.signOut();
    window.location.href = "/";
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-400">
        Loading settings...
      </div>
    );
  }

  const navItems: { id: Section; icon: React.ElementType; label: string }[] = [
    { id: "profile", icon: User, label: "Profile" },
    { id: "notifications", icon: Bell, label: "Notifications" },
    { id: "appearance", icon: Palette, label: "Appearance" },
    { id: "privacy", icon: Shield, label: "Privacy & Data" },
    { id: "account", icon: LogOut, label: "Account" },
  ];

  const Toggle = ({ value, onChange }: { value: boolean; onChange: () => void }) => (
    <button
      onClick={onChange}
      className={`w-12 h-6 flex items-center rounded-full transition-colors duration-200 ${
        value ? "bg-[var(--color-accent)]" : "bg-gray-600"
      }`}
    >
      <div className={`bg-white w-5 h-5 rounded-full shadow transform transition-transform duration-200 ${
        value ? "translate-x-6" : "translate-x-1"
      }`} />
    </button>
  );

  const SettingRow = ({
    label,
    description,
    value,
    onChange,
  }: {
    label: string;
    description?: string;
    value: boolean;
    onChange: () => void;
  }) => (
    <div className="flex items-center justify-between py-3 border-b border-[var(--color-border)] last:border-0">
      <div>
        <p className="text-sm font-medium text-white">{label}</p>
        {description && <p className="text-xs text-gray-400 mt-0.5">{description}</p>}
      </div>
      <Toggle value={value} onChange={onChange} />
    </div>
  );

  return (
    <div className="min-h-screen bg-[var(--color-bg)] p-6 md:p-10">
      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white">Settings</h1>
          <p className="text-gray-400 mt-2">Manage your account and preferences</p>
        </div>

        <div className="flex flex-col md:flex-row gap-6">

          {/* Sidebar Nav */}
          <div className="md:w-56 shrink-0">
            <div className="bg-[var(--color-box)] border border-[var(--color-border)] rounded-2xl p-2 space-y-1">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveSection(item.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition ${
                    activeSection === item.id
                      ? "bg-[var(--color-accent)]/10 text-[var(--color-accent)] font-semibold"
                      : "text-gray-400 hover:text-white hover:bg-white/5"
                  }`}
                >
                  <item.icon size={16} />
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 space-y-5">

            {/* ── Profile ── */}
            {activeSection === "profile" && (
              <div className="bg-[var(--color-box)] border border-[var(--color-border)] rounded-2xl p-6 space-y-5">
                <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                  <User size={18} /> Profile
                </h2>

                {/* Avatar placeholder */}
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-full bg-[var(--color-accent)]/20 flex items-center justify-center text-2xl font-bold text-[var(--color-accent)]">
                    {name ? name.charAt(0).toUpperCase() : "?"}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white">{name || "Your Name"}</p>
                    <p className="text-xs text-gray-400">{userEmail}</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="text-xs text-gray-400 mb-1 block">Full Name</label>
                    <input
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full p-3 rounded-lg bg-[var(--color-bg)] border border-[var(--color-border)] text-white text-sm focus:outline-none focus:border-[var(--color-accent)] transition"
                      placeholder="Your name"
                    />
                  </div>

                  <div>
                    <label className="text-xs text-gray-400 mb-1 block">Username</label>
                    <input
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="w-full p-3 rounded-lg bg-[var(--color-bg)] border border-[var(--color-border)] text-white text-sm focus:outline-none focus:border-[var(--color-accent)] transition"
                      placeholder="@username"
                    />
                  </div>

                  <div>
                    <label className="text-xs text-gray-400 mb-1 block">Bio</label>
                    <textarea
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                      rows={3}
                      className="w-full p-3 rounded-lg bg-[var(--color-bg)] border border-[var(--color-border)] text-white text-sm resize-none focus:outline-none focus:border-[var(--color-accent)] transition"
                      placeholder="A short bio about yourself..."
                    />
                  </div>

                  <div>
                    <label className="text-xs text-gray-400 mb-1 block">Email</label>
                    <input
                      value={userEmail}
                      disabled
                      className="w-full p-3 rounded-lg bg-[var(--color-bg)] border border-[var(--color-border)] text-gray-500 text-sm cursor-not-allowed"
                    />
                    <p className="text-xs text-gray-500 mt-1">Email cannot be changed here</p>
                  </div>
                </div>
              </div>
            )}

            {/* ── Notifications ── */}
            {activeSection === "notifications" && (
              <div className="bg-[var(--color-box)] border border-[var(--color-border)] rounded-2xl p-6 space-y-2">
                <h2 className="text-lg font-semibold text-white flex items-center gap-2 mb-4">
                  <Bell size={18} /> Notifications
                </h2>

                <SettingRow
                  label="Mood Reminders"
                  description="Daily reminders to log your mood"
                  value={notifications}
                  onChange={() => setNotifications(!notifications)}
                />
                <SettingRow
                  label="Email Notifications"
                  description="Receive updates and tips via email"
                  value={emailNotifs}
                  onChange={() => setEmailNotifs(!emailNotifs)}
                />
                <SettingRow
                  label="Weekly Wellness Report"
                  description="Get a summary of your mood trends each week"
                  value={weeklyReport}
                  onChange={() => setWeeklyReport(!weeklyReport)}
                />

                {notifications && (
                  <div className="pt-4">
                    <label className="text-xs text-gray-400 mb-1 block">Reminder Time</label>
                    <input
                      type="time"
                      value={reminderTime}
                      onChange={(e) => setReminderTime(e.target.value)}
                      className="p-3 rounded-lg bg-[var(--color-bg)] border border-[var(--color-border)] text-white text-sm focus:outline-none focus:border-[var(--color-accent)] transition"
                    />
                  </div>
                )}
              </div>
            )}

            {/* ── Appearance ── */}
            {activeSection === "appearance" && (
              <div className="bg-[var(--color-box)] border border-[var(--color-border)] rounded-2xl p-6 space-y-5">
                <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                  <Palette size={18} /> Appearance
                </h2>

                <div>
                  <label className="text-xs text-gray-400 mb-3 block">Theme</label>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { value: "dark", label: "Dark", icon: Moon },
                      { value: "light", label: "Light", icon: Sun },
                    ].map((t) => (
                      <button
                        key={t.value}
                        onClick={() => setTheme(t.value)}
                        className={`flex items-center gap-3 p-4 rounded-xl border transition ${
                          theme === t.value
                            ? "border-[var(--color-accent)] bg-[var(--color-accent)]/10 text-[var(--color-accent)]"
                            : "border-[var(--color-border)] text-gray-400 hover:border-gray-500"
                        }`}
                      >
                        <t.icon size={18} />
                        <span className="text-sm font-medium">{t.label}</span>
                        {theme === t.value && <Check size={14} className="ml-auto" />}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-xs text-gray-400 mb-2 block">Language</label>
                  <select
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                    className="w-full p-3 rounded-lg bg-[var(--color-bg)] border border-[var(--color-border)] text-white text-sm focus:outline-none focus:border-[var(--color-accent)] transition"
                  >
                    <option value="en">🇬🇧 English</option>
                    <option value="es">🇪🇸 Spanish</option>
                    <option value="fr">🇫🇷 French</option>
                    <option value="de">🇩🇪 German</option>
                    <option value="pt">🇧🇷 Portuguese</option>
                    <option value="ar">🇸🇦 Arabic</option>
                  </select>
                </div>
              </div>
            )}

            {/* ── Privacy ── */}
            {activeSection === "privacy" && (
              <div className="bg-[var(--color-box)] border border-[var(--color-border)] rounded-2xl p-6 space-y-2">
                <h2 className="text-lg font-semibold text-white flex items-center gap-2 mb-4">
                  <Shield size={18} /> Privacy & Data
                </h2>

                <SettingRow
                  label="Anonymous Community Posts"
                  description="Your name is never shown on community posts"
                  value={anonymousPosts}
                  onChange={() => setAnonymousPosts(!anonymousPosts)}
                />
                <SettingRow
                  label="Share Anonymous Usage Data"
                  description="Help improve MyMood by sharing anonymous analytics"
                  value={shareData}
                  onChange={() => setShareData(!shareData)}
                />

                <div className="pt-4 space-y-3">
                  <p className="text-xs text-gray-400 leading-relaxed">
                    🔒 Your journal entries and mood data are private and encrypted.
                    They are never shared with third parties without your consent.
                  </p>
                  <button className="text-sm text-[var(--color-accent)] hover:underline flex items-center gap-1">
                    View Privacy Policy <ChevronRight size={14} />
                  </button>
                </div>
              </div>
            )}

            {/* ── Account ── */}
            {activeSection === "account" && (
              <div className="space-y-4">
                <div className="bg-[var(--color-box)] border border-[var(--color-border)] rounded-2xl p-6 space-y-4">
                  <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                    <LogOut size={18} /> Account
                  </h2>

                  <div className="py-2 border-b border-[var(--color-border)]">
                    <p className="text-xs text-gray-400">Signed in as</p>
                    <p className="text-sm text-white font-medium mt-0.5">{userEmail}</p>
                  </div>

                  <button
                    onClick={signOut}
                    className="w-full flex items-center gap-3 p-3 rounded-xl border border-[var(--color-border)] text-gray-300 hover:text-white hover:border-gray-500 transition text-sm"
                  >
                    <LogOut size={16} />
                    Sign Out
                  </button>
                </div>

                <div className="bg-red-500/5 border border-red-500/20 rounded-2xl p-6 space-y-3">
                  <h2 className="text-lg font-semibold text-red-400 flex items-center gap-2">
                    <Trash2 size={18} /> Danger Zone
                  </h2>
                  <p className="text-sm text-gray-400">
                    Permanently delete your account and all associated data including journal entries, mood history, and community posts. This cannot be undone.
                  </p>
                  <button
                    onClick={deleteAccount}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 hover:bg-red-500/20 transition text-sm"
                  >
                    <Trash2 size={14} />
                    Delete My Account
                  </button>
                </div>
              </div>
            )}

            {/* Save Button — hidden on account tab */}
            {activeSection !== "account" && (
              <button
                onClick={saveSettings}
                disabled={saving}
                className="flex items-center gap-2 px-6 py-3 rounded-xl bg-[var(--color-accent)] text-white hover:opacity-90 transition disabled:opacity-60"
              >
                {saved ? (
                  <><Check size={16} /> Saved!</>
                ) : saving ? (
                  "Saving..."
                ) : (
                  "Save Changes"
                )}
              </button>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}