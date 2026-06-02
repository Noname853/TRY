"use client";

import { create } from "zustand";
import type { HabitRow } from "@/lib/supabase/types";

type HabitsState = {
  habits: HabitRow[];
  setHabits: (h: HabitRow[]) => void;
  toggle: (id: string, completed: boolean) => Promise<void>;
};

export const useHabitsStore = create<HabitsState>((set) => ({
  habits: [],
  setHabits: (habits) => set({ habits }),
  toggle: async (id, completed) => {
    await fetch(`/api/habits/${id}/logs`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ completed }),
    });
  },
}));
