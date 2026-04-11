"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import {
  User, Bell, Shield, Palette,
  LogOut, Trash2, Check, ChevronRight, Settings,
} from "lucide-react";

const supabase = createClient();
const font = "'Manrope', sans-serif";

type Section = "profile" | "notifications" | "appearance" | "privacy" | "account";

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "12px 16px",
  borderRadius: "12px",
  border: "1px solid #E2DDD6",
  backgroundColor: "#F5F0E8",
  fontSize: "15px",
  fontFamily: font,
  fontWeight: 400,
  color: "#111111",
  outline: "none",
  transition: "border-color 0.2s",
};

export default function SettingsPage() {
  const [loading, setLoading]           = useState(true);
  const [saving, setSaving]             = useState(false);
  const [saved, setSaved]               = useState(false);
  const [activeSection, setActiveSection] = useState<Section>("profile");
  const [userEmail, setUserEmail]       = useState("");
  const [name, setName]                 = useState("");
  const [username, setUsername]         = useState("");
  const [bio, setBio]                   = useState("");
  const [notifications, setNotifications] = useState(true);
  const [reminderTime, setReminderTime] = useState("20:00");
  const [emailNotifs, setEmailNotifs]   = useState(false);
  const [weeklyReport, setWeeklyReport] = useState(true);
  const [language, setLanguage]         = useState("en");
  const [anonymousPosts, setAnonymousPosts] = useState(true);
  const [shareData, setShareData]       = useState(false);

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
      weekly_report: weeklyReport, language,
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
    <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: "#F5F0E8" }}>
      <div className="flex flex-col items-center gap-3">
        <div className="w-8 h-8 rounded-full border-2 border-t-transparent animate-spin" style={{ borderColor: "#E2DDD6", borderTopColor: "transparent" }} />
        <p style={{ fontSize: "14px", color: "#6b7280", fontFamily: font }}>Loading settings...</p>
      </div>
    </div>
  );

  const navItems: { id: Section; icon: React.ElementType; label: string }[] = [
    { id: "profile",       icon: User,    label: "Profile"       },
    { id: "notifications", icon: Bell,    label: "Notifications" },
    { id: "appearance",    icon: Palette, label: "Appearance"    },
    { id: "privacy",       icon: Shield,  label: "Privacy & Data"},
    { id: "account",       icon: LogOut,  label: "Account"       },
  ];

  const Toggle = ({ value, onChange }: { value: boolean; onChange: () => void }) => (
    <button
      onClick={onChange}
      className="flex items-center rounded-full transition-colors duration-200"
      style={{
        width: "44px",
        height: "24px",
        backgroundColor: value ? "#E8521A" : "#E2DDD6",
        flexShrink: 0,
      }}
    >
      <div
        className="rounded-full shadow transition-transform duration-200"
        style={{
          width: "16px",
          height: "16px",
          backgroundColor: "#FFFFFF",
          transform: value ? "translateX(24px)" : "translateX(4px)",
        }}
      />
    </button>
  );

  const SettingRow = ({
    label, description, value, onChange,
  }: {
    label: string; description?: string; value: boolean; onChange: () => void;
  }) => (
    <div
      className="flex items-center justify-between py-4"
      style={{ borderBottom: "1px solid #E2DDD6" }}
    >
      <div>
        <p style={{ fontSize: "15px", fontWeight: 600, color: "#111111", fontFamily: font }}>
          {label}
        </p>
        {description && (
          <p style={{ fontSize: "13px", color: "#6b7280", fontFamily: font, marginTop: "2px" }}>
            {description}
          </p>
        )}
      </div>
      <Toggle value={value} onChange={onChange} />
    </div>
  );

  const sectionLabel = (text: string) => (
    <p style={{ fontSize: "11px", fontWeight: 700, color: "#9ca3af", fontFamily: font, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: "20px" }}>
      {text}
    </p>
  );

  const fieldLabel = (text: string) => (
    <p style={{ fontSize: "13px", fontWeight: 600, color: "#444444", fontFamily: font, marginBottom: "8px" }}>
      {text}
    </p>
  );

  return (
    <div className="min-h-screen p-6 md:p-10" style={{ backgroundColor: "#F5F0E8", fontFamily: font }}>
      <div className="max-w-5xl mx-auto">

        {/* ── Header ── */}
        <div
          className="flex items-start justify-between mb-8 pb-5"
          style={{ borderBottom: "1px solid #E2DDD6" }}
        >
          <div>
            <h1 style={{ fontWeight: 800, fontSize: "22px", color: "#111111", fontFamily: font, letterSpacing: "-0.02em" }}>
              Settings
            </h1>
            <p style={{ color: "#6b7280", fontSize: "14px", fontFamily: font, fontWeight: 400, marginTop: "4px" }}>
              Manage your account and preferences
            </p>
          </div>
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
            style={{ backgroundColor: "#EDE8DF", border: "1px solid #E2DDD6" }}
          >
            <Settings size={18} style={{ color: "#111111" }} />
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-6">

          {/* ── Sidebar Nav — beige ── */}
          <div className="md:w-52 shrink-0">
            <div
              className="rounded-2xl p-2 space-y-0.5"
              style={{ backgroundColor: "#EDE8DF", border: "1px solid #E2DDD6" }}
            >
              {navItems.map((item) => {
                const active = activeSection === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveSection(item.id)}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition"
                    style={{
                      backgroundColor: active ? "#111111" : "transparent",
                      color:           active ? "#F5F0E8" : "#444444",
                      fontWeight:      active ? 600 : 400,
                      fontFamily: font,
                    }}
                    onMouseEnter={e => { if (!active) e.currentTarget.style.backgroundColor = "#D8D1C4"; }}
                    onMouseLeave={e => { if (!active) e.currentTarget.style.backgroundColor = "transparent"; }}
                  >
                    <item.icon size={15} />
                    {item.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* ── Main Content ── */}
          <div className="flex-1 space-y-4">

            {/* Profile */}
            {activeSection === "profile" && (
              <div
                className="rounded-2xl p-6 space-y-5"
                style={{ backgroundColor: "#FFFFFF", border: "1px solid #E2DDD6", boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}
              >
                {sectionLabel("Profile")}

                {/* Avatar row */}
                <div className="flex items-center gap-4">
                  <div
                    className="w-14 h-14 rounded-full flex items-center justify-center text-xl shrink-0"
                    style={{ backgroundColor: "#E8521A", color: "#ffffff", fontWeight: 800, fontFamily: font }}
                  >
                    {name ? name.charAt(0).toUpperCase() : "?"}
                  </div>
                  <div>
                    <p style={{ fontSize: "15px", fontWeight: 700, color: "#111111", fontFamily: font }}>
                      {name || "Your Name"}
                    </p>
                    <p style={{ fontSize: "13px", color: "#9ca3af", fontFamily: font }}>{userEmail}</p>
                  </div>
                </div>

                <div className="space-y-4">
                  {[
                    { label: "Full Name", value: name,     onChange: setName,     placeholder: "Your name"  },
                    { label: "Username",  value: username, onChange: setUsername, placeholder: "@username"  },
                  ].map((field) => (
                    <div key={field.label}>
                      {fieldLabel(field.label)}
                      <input
                        value={field.value}
                        onChange={(e) => field.onChange(e.target.value)}
                        placeholder={field.placeholder}
                        style={{ ...inputStyle }}
                        onFocus={e => (e.currentTarget.style.borderColor = "#E8521A")}
                        onBlur={e  => (e.currentTarget.style.borderColor = "#E2DDD6")}
                      />
                    </div>
                  ))}

                  <div>
                    {fieldLabel("Bio")}
                    <textarea
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                      rows={3}
                      placeholder="A short bio about yourself..."
                      style={{ ...inputStyle, resize: "none" }}
                      onFocus={e => (e.currentTarget.style.borderColor = "#E8521A")}
                      onBlur={e  => (e.currentTarget.style.borderColor = "#E2DDD6")}
                    />
                  </div>

                  <div>
                    {fieldLabel("Email")}
                    <input
                      value={userEmail}
                      disabled
                      style={{
                        ...inputStyle,
                        opacity: 0.5,
                        cursor: "not-allowed",
                      }}
                    />
                    <p style={{ fontSize: "12px", color: "#9ca3af", fontFamily: font, marginTop: "4px" }}>
                      Email cannot be changed here
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Notifications */}
            {activeSection === "notifications" && (
              <div
                className="rounded-2xl p-6"
                style={{ backgroundColor: "#FFFFFF", border: "1px solid #E2DDD6", boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}
              >
                {sectionLabel("Notifications")}
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
                    {fieldLabel("Reminder Time")}
                    <input
                      type="time"
                      value={reminderTime}
                      onChange={(e) => setReminderTime(e.target.value)}
                      style={{ ...inputStyle, width: "auto" }}
                      onFocus={e => (e.currentTarget.style.borderColor = "#E8521A")}
                      onBlur={e  => (e.currentTarget.style.borderColor = "#E2DDD6")}
                    />
                  </div>
                )}
              </div>
            )}

            {/* Appearance */}
            {activeSection === "appearance" && (
              <div
                className="rounded-2xl p-6 space-y-5"
                style={{ backgroundColor: "#FFFFFF", border: "1px solid #E2DDD6", boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}
              >
                {sectionLabel("Appearance")}
                <div>
                  {fieldLabel("Language")}
                  <select
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                    style={{ ...inputStyle }}
                    onFocus={e => (e.currentTarget.style.borderColor = "#E8521A")}
                    onBlur={e  => (e.currentTarget.style.borderColor = "#E2DDD6")}
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
              <div
                className="rounded-2xl p-6"
                style={{ backgroundColor: "#FFFFFF", border: "1px solid #E2DDD6", boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}
              >
                {sectionLabel("Privacy & Data")}
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
                  <p style={{ fontSize: "13px", color: "#6b7280", fontFamily: font, lineHeight: 1.7 }}>
                    🔒 Your journal entries and mood data are private and encrypted.
                    They are never shared with third parties without your consent.
                  </p>
                  <button
                    className="flex items-center gap-1 transition"
                    style={{ fontSize: "13px", fontWeight: 600, color: "#E8521A", fontFamily: font }}
                    onMouseEnter={e => (e.currentTarget.style.opacity = "0.7")}
                    onMouseLeave={e => (e.currentTarget.style.opacity = "1")}
                  >
                    View Privacy Policy <ChevronRight size={13} />
                  </button>
                </div>
              </div>
            )}

            {/* Account */}
            {activeSection === "account" && (
              <div className="space-y-4">
                {/* Sign out card */}
                <div
                  className="rounded-2xl p-6 space-y-4"
                  style={{ backgroundColor: "#FFFFFF", border: "1px solid #E2DDD6", boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}
                >
                  {sectionLabel("Account")}
                  <div className="pb-4" style={{ borderBottom: "1px solid #E2DDD6" }}>
                    <p style={{ fontSize: "12px", color: "#9ca3af", fontFamily: font }}>Signed in as</p>
                    <p style={{ fontSize: "15px", fontWeight: 600, color: "#111111", fontFamily: font, marginTop: "2px" }}>
                      {userEmail}
                    </p>
                  </div>
                  <button
                    onClick={signOut}
                    className="w-full flex items-center gap-3 p-3 rounded-xl border transition text-sm"
                    style={{ borderColor: "#E2DDD6", color: "#444444", fontFamily: font, fontWeight: 500 }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = "#111111"; e.currentTarget.style.color = "#111111"; }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = "#E2DDD6"; e.currentTarget.style.color = "#444444"; }}
                  >
                    <LogOut size={15} />
                    Sign Out
                  </button>
                </div>

                {/* Danger zone card */}
                <div
                  className="rounded-2xl p-6 space-y-3"
                  style={{ backgroundColor: "#FFFFFF", border: "1px solid rgba(239,68,68,0.2)", boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}
                >
                  <p
                    className="flex items-center gap-2"
                    style={{ fontSize: "11px", fontWeight: 700, color: "#ef4444", fontFamily: font, letterSpacing: "0.08em", textTransform: "uppercase" }}
                  >
                    <Trash2 size={13} /> Danger Zone
                  </p>
                  <p style={{ fontSize: "14px", color: "#6b7280", fontFamily: font, fontWeight: 400, lineHeight: 1.75 }}>
                    Permanently delete your account and all associated data. This cannot be undone.
                  </p>
                  <button
                    onClick={deleteAccount}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl border transition text-sm"
                    style={{
                      backgroundColor: "rgba(239,68,68,0.06)",
                      borderColor: "rgba(239,68,68,0.2)",
                      color: "#ef4444",
                      fontFamily: font,
                      fontWeight: 600,
                    }}
                    onMouseEnter={e => (e.currentTarget.style.backgroundColor = "rgba(239,68,68,0.12)")}
                    onMouseLeave={e => (e.currentTarget.style.backgroundColor = "rgba(239,68,68,0.06)")}
                  >
                    <Trash2 size={13} />
                    Delete My Account
                  </button>
                </div>
              </div>
            )}

            {/* ── Save Button ── */}
            {activeSection !== "account" && (
              <button
                onClick={saveSettings}
                disabled={saving}
                className="flex items-center gap-2 px-6 py-3 rounded-xl transition disabled:opacity-50 hover:-translate-y-0.5"
                style={{
                  backgroundColor: saved ? "#22c55e" : "#E8521A",
                  color: "#ffffff",
                  fontWeight: 700,
                  fontSize: "15px",
                  fontFamily: font,
                  boxShadow: "0 2px 12px rgba(232,82,26,0.3)",
                  transition: "all 0.3s",
                }}
                onMouseEnter={e => { if (!saved) e.currentTarget.style.backgroundColor = "#D4480F"; }}
                onMouseLeave={e => { if (!saved) e.currentTarget.style.backgroundColor = saved ? "#22c55e" : "#E8521A"; }}
              >
                {saved ? (
                  <><Check size={15} /> Saved!</>
                ) : saving ? "Saving..." : "Save Changes"}
              </button>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}