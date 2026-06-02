"use server";

import { revalidatePath } from "next/cache";
import { createClient, getSessionUser } from "@/lib/supabase/server";
import { habitCreateSchema, habitLogSchema } from "@/lib/validations";
import { todayISO } from "@/lib/date";

export async function createHabit(formData: FormData) {
  const user = await getSessionUser();
  if (!user) throw new Error("Unauthorized");

  const parsed = habitCreateSchema.parse({
    name: formData.get("name"),
    icon: formData.get("icon") || "✨",
    target: formData.get("target") || null,
  });

  const supabase = await createClient();
  await supabase.from("habits").insert({ ...parsed, user_id: user.id });
  revalidatePath("/dashboard");
}

export async function toggleHabitLog(habitId: string, completed: boolean) {
  const user = await getSessionUser();
  if (!user) throw new Error("Unauthorized");
  const parsed = habitLogSchema.parse({ completed });

  const supabase = await createClient();
  await supabase
    .from("habit_logs")
    .upsert(
      {
        habit_id: habitId,
        user_id: user.id,
        date: todayISO(),
        completed: parsed.completed,
      },
      { onConflict: "habit_id,date" },
    );
  revalidatePath("/dashboard");
  revalidatePath(`/habits/${habitId}`);
}

export async function deleteHabit(habitId: string) {
  const user = await getSessionUser();
  if (!user) throw new Error("Unauthorized");

  const supabase = await createClient();
  await supabase
    .from("habits")
    .update({ is_active: false })
    .eq("id", habitId)
    .eq("user_id", user.id);
  revalidatePath("/dashboard");
}
