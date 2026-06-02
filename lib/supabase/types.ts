// Type definitions selaras dengan db/schema.sql
export type Mood = "Semangat" | "Tenang" | "Stres" | "Lemas" | string;
export type Energy = "Tinggi" | "Sedang" | "Rendah" | string;
export type MemoryCategory = "personal" | "pattern" | "moment" | "preference";
export type MemorySource = "checkin" | "reflection" | "onboarding";

export type ChatRole = "user" | "assistant" | "system";
export type ChatMessage = { role: ChatRole; content: string; timestamp: string };

export type Milestone = {
  title: string;
  description?: string;
  week?: string;
  completed?: boolean;
};

export type UserRow = {
  id: string;
  email: string;
  name: string | null;
  ai_name: string | null;
  goal_category: string | null;
  notification_time_morning: string;
  notification_time_evening: string;
  ai_notifications_enabled: boolean;
  push_subscription: PushSubscriptionJSON | null;
  onboarding_completed: boolean;
  created_at: string;
};

export type GoalRow = {
  id: string;
  user_id: string;
  title: string;
  description: string | null;
  milestones: Milestone[];
  is_active: boolean;
  target_date: string | null;
  created_at: string;
};

export type HabitRow = {
  id: string;
  user_id: string;
  name: string;
  icon: string;
  target: string | null;
  goal_id: string | null;
  is_active: boolean;
  created_at: string;
};

export type HabitLogRow = {
  id: string;
  habit_id: string;
  user_id: string;
  date: string;
  completed: boolean;
  note: string | null;
  created_at: string;
};

export type CheckinRow = {
  id: string;
  user_id: string;
  date: string;
  mood: Mood | null;
  energy: Energy | null;
  sleep_quality: string | null;
  messages: ChatMessage[];
  created_at: string;
};

export type MemoryRow = {
  id: string;
  user_id: string;
  category: MemoryCategory;
  content: string;
  source: MemorySource | null;
  created_at: string;
  updated_at: string;
};
