"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import {
  User, Bell, Shield, Palette,
  LogOut, Trash2, Check, ChevronRight, Moon, Sun, Settings,
} from "lucide-react";

const supabase = createClient();

type Section = "profile" | "notifications" | "appearance" | "privacy" | "account";

export default function SettingsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [activeSection, setActiveSection] = useState<Section>("profile");
  const [userEmail, setUserEmail] = useState("");

  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [bio, setBio] = useState("");
  const [notifications, setNotifications] = useState(true);
  const [reminderTime, setReminderTime] = useState("20:00");
  const [emailNotifs, setEmailNotifs] = useState(false);
  const [weeklyReport, setWeeklyReport] = useState(true);
  const [theme, setTheme] = useState("dark");
  const [language, setLanguage] = useState("en");
  const [anonymousPosts, setAnonymousPosts] = useState(true);
  const [shareData, setShareData] = useState(false);

  useEffect(() => { loadSettings(); }, []);

  async function loadSettings() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    setUserEmail(user.email || "");
    const { data } = await supabase.from("user_profiles").select("*").eq("id", user.id).single();
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
      id: user.id, name, username, bio, notifications,
      reminder_time: reminderTime, email_notifs: emailNotifs,
      weekly_report: weeklyReport, theme, language,
      anonymous_posts: anonymousPosts, share_data: shareData,
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
    const confirmed = window.confirm("Are you sure you want to delete your account? This cannot be undone.");
    if (!confirmed) return;
    const confirmed2 = window.confirm("All your data will be permanently deleted. Continue?");
    if (!confirmed2) return;
    await supabase.auth.signOut();
    window.location.href = "/";
  }

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--color-bg-main)]">
      <div className="flex flex-col items-center gap-3">
        <div className="w-8 h-8 rounded-full border-2 border-[var(--color-text-header)] border-t-transparent animate-spin opacity-40" />
        <p className="text-sm text-[var(--color-text-body)] opacity-40">Loading settings...</p>
      </div>
    </div>
  );

  const navItems: { id: Section; icon: React.ElementType; label: string }[] = [
    { id: "profile", icon: User, label: "Profile" },
    { id: "notifications", icon: Bell, label: "Notifications" },
    { id: "appearance", icon: Palette, label: "Appearance" },
    { id: "privacy", icon: Shield, label: "Privacy & Data" },
    { id: "account", icon: LogOut, label: "Account" },
  ];

  const inputClass = "w-full px-4 py-3 rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-main)] text-sm text-[var(--color-text-header)] placeholder:text-[var(--color-text-body)] placeholder:opacity-30 outline-none focus:border-[var(--color-text-header)] focus:border-opacity-30 transition";

  const Toggle = ({ value, onChange }: { value: boolean; onChange: () => void }) => (
    <button
      onClick={onChange}
      className={`w-11 h-6 flex items-center rounded-full transition-colors duration-200 ${
        value ? "bg-[var(--color-text-header)]" : "bg-[var(--color-border)]"
      }`}
    >
      <div className={`bg-[var(--color-bg-main)] w-4 h-4 rounded-full shadow transform transition-transform duration-200 ${
        value ? "translate-x-6" : "translate-x-1"
      }`} />
    </button>
  );

  const SettingRow = ({
    label, description, value, onChange,
  }: {
    label: string; description?: string; value: boolean; onChange: () => void;
  }) => (
    <div className="flex items-center justify-between py-3.5 border-b border-[var(--color-border)] last:border-0">
      <div>
        <p className="text-sm font-medium text-[var(--color-text-header)]">{label}</p>
        {description && <p className="text-xs text-[var(--color-text-body)] opacity-40 mt-0.5">{description}</p>}
      </div>
      <Toggle value={value} onChange={onChange} />
    </div>
  );

  return (
    <div className="min-h-screen bg-[var(--color-bg-main)] p-6 md:p-10">
      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <div className="flex items-start justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-[var(--color-text-header)]">Settings</h1>
            <p className="text-[var(--color-text-body)] opacity-50 text-sm mt-1">
              Manage your account and preferences
            </p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-[var(--color-bg-card)] border border-[var(--color-border)] flex items-center justify-center shrink-0">
            <Settings size={18} className="text-[var(--color-text-header)]" />
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-6">

          {/* Sidebar Nav */}
          <div className="md:w-52 shrink-0">
            <div className="bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-2xl p-2 space-y-0.5">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveSection(item.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition ${
                    activeSection === item.id
                      ? "bg-[var(--color-text-header)] text-[var(--color-bg-main)] font-medium"
                      : "text-[var(--color-text-body)] opacity-60 hover:opacity-100 hover:bg-[var(--color-bg-main)]"
                  }`}
                >
                  <item.icon size={15} />
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 space-y-4">

            {/* Profile */}
            {activeSection === "profile" && (
              <div className="bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-2xl p-6 space-y-5">
                <h2 className="text-xs font-semibold text-[var(--color-text-body)] opacity-40 uppercase tracking-widest">
                  Profile
                </h2>

                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-full bg-[var(--color-bg-main)] border border-[var(--color-border)] flex items-center justify-center text-xl font-bold text-[var(--color-text-header)]">
                    {name ? name.charAt(0).toUpperCase() : "?"}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-[var(--color-text-header)]">
                      {name || "Your Name"}
                    </p>
                    <p className="text-xs text-[var(--color-text-body)] opacity-40">{userEmail}</p>
                  </div>
                </div>

                <div className="space-y-4">
                  {[
                    { label: "Full Name", value: name, onChange: setName, placeholder: "Your name" },
                    { label: "Username", value: username, onChange: setUsername, placeholder: "@username" },
                  ].map((field) => (
                    <div key={field.label}>
                      <label className="block text-xs text-[var(--color-text-body)] opacity-40 mb-2">
                        {field.label}
                      </label>
                      <input
                        value={field.value}
                        onChange={(e) => field.onChange(e.target.value)}
                        placeholder={field.placeholder}
                        className={inputClass}
                      />
                    </div>
                  ))}

                  <div>
                    <label className="block text-xs text-[var(--color-text-body)] opacity-40 mb-2">Bio</label>
                    <textarea
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                      rows={3}
                      placeholder="A short bio about yourself..."
                      className={`${inputClass} resize-none`}
                    />
                  </div>

                  <div>
                    <label className="block text-xs text-[var(--color-text-body)] opacity-40 mb-2">Email</label>
                    <input
                      value={userEmail}
                      disabled
                      className="w-full px-4 py-3 rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-main)] text-sm text-[var(--color-text-body)] opacity-30 cursor-not-allowed"
                    />
                    <p className="text-xs text-[var(--color-text-body)] opacity-30 mt-1">
                      Email cannot be changed here
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Notifications */}
            {activeSection === "notifications" && (
              <div className="bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-2xl p-6 space-y-1">
                <h2 className="text-xs font-semibold text-[var(--color-text-body)] opacity-40 uppercase tracking-widest mb-4">
                  Notifications
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
                    <label className="block text-xs text-[var(--color-text-body)] opacity-40 mb-2">
                      Reminder Time
                    </label>
                    <input
                      type="time"
                      value={reminderTime}
                      onChange={(e) => setReminderTime(e.target.value)}
                      className={inputClass}
                      style={{ width: "auto" }}
                    />
                  </div>
                )}
              </div>
            )}

            {/* Appearance */}
            {activeSection === "appearance" && (
              <div className="bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-2xl p-6 space-y-5">
                <h2 className="text-xs font-semibold text-[var(--color-text-body)] opacity-40 uppercase tracking-widest">
                  Appearance
                </h2>

                <div>

                </div>

                <div>
                  <label className="block text-xs text-[var(--color-text-body)] opacity-40 mb-2">Language</label>
                  <select
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                    className={inputClass}
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

            {/* Privacy */}
            {activeSection === "privacy" && (
              <div className="bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-2xl p-6 space-y-1">
                <h2 className="text-xs font-semibold text-[var(--color-text-body)] opacity-40 uppercase tracking-widest mb-4">
                  Privacy & Data
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
                  <p className="text-xs text-[var(--color-text-body)] opacity-40 leading-relaxed">
                    🔒 Your journal entries and mood data are private and encrypted.
                    They are never shared with third parties without your consent.
                  </p>
                  <button className="flex items-center gap-1 text-xs text-[var(--color-text-body)] opacity-50 hover:opacity-100 transition">
                    View Privacy Policy <ChevronRight size={12} />
                  </button>
                </div>
              </div>
            )}

            {/* Account */}
            {activeSection === "account" && (
              <div className="space-y-4">
                <div className="bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-2xl p-6 space-y-4">
                  <h2 className="text-xs font-semibold text-[var(--color-text-body)] opacity-40 uppercase tracking-widest">
                    Account
                  </h2>
                  <div className="py-2 border-b border-[var(--color-border)]">
                    <p className="text-xs text-[var(--color-text-body)] opacity-40">Signed in as</p>
                    <p className="text-sm text-[var(--color-text-header)] font-medium mt-0.5">{userEmail}</p>
                  </div>
                  <button
                    onClick={signOut}
                    className="w-full flex items-center gap-3 p-3 rounded-xl border border-[var(--color-border)] text-[var(--color-text-body)] opacity-60 hover:opacity-100 hover:border-[var(--color-text-header)] transition text-sm"
                  >
                    <LogOut size={15} />
                    Sign Out
                  </button>
                </div>

                <div className="bg-[var(--color-bg-card)] border border-red-500/20 rounded-2xl p-6 space-y-3">
                  <h2 className="text-xs font-semibold text-red-400 uppercase tracking-widest flex items-center gap-2">
                    <Trash2 size={13} /> Danger Zone
                  </h2>
                  <p className="text-sm text-[var(--color-text-body)] opacity-50 leading-relaxed">
                    Permanently delete your account and all associated data. This cannot be undone.
                  </p>
                  <button
                    onClick={deleteAccount}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-red-500/8 border border-red-500/20 text-red-400 hover:bg-red-500/15 transition text-sm"
                  >
                    <Trash2 size={13} />
                    Delete My Account
                  </button>
                </div>
              </div>
            )}

            {/* Save Button */}
            {activeSection !== "account" && (
              <button
                onClick={saveSettings}
                disabled={saving}
                className="flex items-center gap-2 px-6 py-3 rounded-xl bg-[var(--color-text-header)] text-[var(--color-bg-main)] font-semibold text-sm hover:opacity-90 transition disabled:opacity-50"
              >
                {saved ? (
                  <><Check size={15} /> Saved!</>
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