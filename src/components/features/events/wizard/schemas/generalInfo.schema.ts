import { z } from "zod";

export const generalInfoSchema = z.object({
  images: z.array(z.instanceof(File)).optional(),
  title: z.string().min(1, "Title is required").max(20, "Max 20 characters"),
  subtitle: z
    .string()
    .max(30, "Max 30 characters")
    .optional()
    .or(z.literal("")),
  description: z.string().optional(),
  maxParticipants: z
    .number({ invalid_type_error: "Please enter a number" })
    .int("Must be a whole number")
    .positive("Must be greater than 0")
    .optional(),
  isVisible: z.boolean().default(true),
});

export type GeneralInfoFormValues = z.infer<typeof generalInfoSchema>;
