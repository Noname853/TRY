import { z } from "zod";

export const emailSchema = z.string().email("Format email tidak valid");
export const passwordSchema = z.string().min(6, "Password minimal 6 karakter");

export const loginSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
});

export const registerSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
  name: z.string().min(1).max(60).optional(),
});

export const habitCreateSchema = z.object({
  name: z.string().min(1).max(80),
  icon: z.string().max(8).default("✨"),
  target: z.string().max(80).nullable().optional(),
  goal_id: z.string().uuid().nullable().optional(),
});

export const habitUpdateSchema = habitCreateSchema.partial().extend({
  is_active: z.boolean().optional(),
});

export const habitLogSchema = z.object({
  date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Format tanggal YYYY-MM-DD")
    .optional(),
  completed: z.boolean().default(true),
  note: z.string().max(280).nullable().optional(),
});

export const checkinMessageSchema = z.object({
  content: z.string().min(1).max(2000),
  mood: z.string().max(40).optional(),
  energy: z.string().max(40).optional(),
  sleep_quality: z.string().max(40).optional(),
});

export const goalCreateSchema = z.object({
  prompt: z.string().min(5).max(500),
});

export const goalUpdateSchema = z.object({
  milestones: z
    .array(
      z.object({
        title: z.string(),
        description: z.string().optional(),
        week: z.string().optional(),
        completed: z.boolean().optional(),
      }),
    )
    .optional(),
  is_active: z.boolean().optional(),
});

export const onboardingSchema = z.object({
  name: z.string().min(1).max(60),
  ai_name: z.string().min(1).max(40).optional(),
  goal_category: z.string().max(60),
});

export const pushSubscribeSchema = z.object({
  endpoint: z.string().url(),
  expirationTime: z.number().nullable().optional(),
  keys: z.object({
    p256dh: z.string(),
    auth: z.string(),
  }),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type HabitCreateInput = z.infer<typeof habitCreateSchema>;
export type CheckinMessageInput = z.infer<typeof checkinMessageSchema>;
export type GoalCreateInput = z.infer<typeof goalCreateSchema>;
export type OnboardingInput = z.infer<typeof onboardingSchema>;
