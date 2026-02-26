// lib/supabase/checkins.ts
import { createClient } from "@/utils/supabase/client";

export const supabase = createClient();

export async function createCheckin({ user_id, mood, emotion, notes }: {
  user_id?: string,
  mood: number,
  emotion?: string,
  notes?: string
}) {
  const { data, error } = await supabase.from("checkins").insert({
    user_id, mood, emotion, notes
  }).select().single();
  if (error) throw error;
  return data;
}

export async function getRecentCheckins(user_id: string, limit = 30) {
  const { data, error } = await supabase
    .from("checkins")
    .select("*")
    .eq("user_id", user_id)
    .order("created_at", { ascending: false })
    .limit(limit);
  if (error) throw error;
  return data;
}

/** aggregated by weekday (0..6) */
export async function getWeeklySummary(user_id: string) {
  const { data, error } = await supabase.rpc("weekly_mood_summary", { p_user_id: user_id });
  // if you don't have RPC, fallback to client-side aggregation of last 7 entries
  if (error) throw error;
  return data;
}

/** todays entry (optional single-entry UX) */
export async function getTodayCheckin(user_id: string) {
  const { data, error } = await supabase
    .from("checkins")
    .select("*")
    .eq("user_id", user_id)
    .gte("created_at", new Date(new Date().setHours(0,0,0,0)).toISOString())
    .order("created_at", { ascending: false })
    .limit(1);
  if (error) throw error;
  return data?.[0] ?? null;
}
