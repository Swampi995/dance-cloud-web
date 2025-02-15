import { z } from "zod";

export const UserSchema = z.object({
  id: z.string(),
  email: z.string().optional().nullable(),
  description: z.string().optional(),
  name: z.string(),
  nickname: z.string().optional(),
  contactEmail: z.string(),
  photoURL: z.string().nullable(),
  blurhash: z.string().optional(),
  token: z.string().optional(),
  level: z.enum(["beginner", "intermediate", "advanced", "pro"]).optional(),
});

export type UserType = z.infer<typeof UserSchema>;
