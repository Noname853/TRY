import type { HabitLogRow } from "./supabase/types";
import { shiftDays, todayISO } from "./date";

/**
 * Hitung streak hari berturut-turut sampai hari ini.
 * Toleransi: jika hari ini belum log tapi kemarin completed, streak masih dihitung dari kemarin.
 */
export function calcStreak(logs: Pick<HabitLogRow, "date" | "completed">[]) {
  const completedSet = new Set(logs.filter((l) => l.completed).map((l) => l.date));
  const today = todayISO();
  let cursor = completedSet.has(today) ? today : shiftDays(today, -1);
  let streak = 0;
  while (completedSet.has(cursor)) {
    streak += 1;
    cursor = shiftDays(cursor, -1);
  }
  return streak;
}

export function weeklyCompletionRate(
  logs: Pick<HabitLogRow, "date" | "completed">[],
  activeHabits: number,
  weekStart: string,
) {
  if (activeHabits === 0) return 0;
  const days = Array.from({ length: 7 }, (_, i) => shiftDays(weekStart, i));
  const expected = days.length * activeHabits;
  const done = logs.filter(
    (l) => l.completed && days.includes(l.date),
  ).length;
  return Math.round((done / expected) * 100);
}
