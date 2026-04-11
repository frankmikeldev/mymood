// lib/supabase/checkins.ts
import { createClient } from "@/utils/supabase/client";

export const supabase = createClient();

export async function createCheckin({ user_id, mood, emotion, notes, custom_mood }: {
  user_id?: string;
  mood?: number;
  emotion?: string;
  notes?: string;
  custom_mood?: string;
}) {
  // ✅ Debug — log exactly what we're sending
  console.log("createCheckin called with:", { user_id, mood, emotion, notes, custom_mood });

  const insertPayload = {
    user_id:     user_id     ?? null,
    mood:        mood        ?? null,
    emotion:     emotion     ?? null,
    notes:       notes       ?? null,
    custom_mood: custom_mood ?? null,
  };

  console.log("Insert payload:", insertPayload);

  const { data, error } = await supabase
    .from("checkins")
    .insert(insertPayload)
    .select()
    .single();

  if (error) {
    // ✅ Log the full Supabase error
    console.error("Supabase insert error:", {
      message: error.message,
      code:    error.code,
      details: error.details,
      hint:    error.hint,
    });
    throw error;
  }

  console.log("Checkin saved successfully:", data);
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

export async function getWeeklySummary(user_id: string) {
  const { data, error } = await supabase.rpc("weekly_mood_summary", { p_user_id: user_id });
  if (error) throw error;
  return data;
}

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