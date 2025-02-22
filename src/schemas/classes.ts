import { z } from "zod";
import { ClubCategorySchema } from "./membership";

export const ClubClassScheduleSchema = z.object({
  day: z.number(),
  hour: z.number(),
  minute: z.number(),
});

export const ClubClassSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string().optional(),
  photoURL: z.string(),
  blurhash: z.string(),
  level: z.enum(["beginner", "intermediate", "pro"]),
  category: ClubCategorySchema.optional(),
  duration: z.number().or(z.string()),
  maxParticipants: z.number().or(z.string()),
  orderNo: z.number().or(z.string()),
  schedule: z.array(ClubClassScheduleSchema),
});

export type ClubClassType = z.infer<typeof ClubClassSchema>;
