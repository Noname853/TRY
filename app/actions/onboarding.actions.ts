"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient, getSessionUser } from "@/lib/supabase/server";
import { onboardingSchema } from "@/lib/validations";

export async function completeOnboarding(formData: FormData) {
  const user = await getSessionUser();
  if (!user) throw new Error("Unauthorized");

  const parsed = onboardingSchema.parse({
    name: formData.get("name"),
    ai_name: formData.get("ai_name") || "Luna",
    goal_category: formData.get("goal_category"),
  });

  const supabase = await createClient();
  await supabase
    .from("users")
    .update({
      name: parsed.name,
      ai_name: parsed.ai_name,
      goal_category: parsed.goal_category,
      onboarding_completed: true,
    })
    .eq("id", user.id);

  // Tambahkan onboarding ke ai_memory
  await supabase.from("ai_memory").insert({
    user_id: user.id,
    category: "personal",
    content: `${parsed.name} memilih fokus pada ${parsed.goal_category}.`,
    source: "onboarding",
  });

  revalidatePath("/", "layout");
  redirect("/dashboard");
}
