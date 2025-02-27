import { z } from "zod";
import { DocumentReferenceSchema } from "./firebase";
import { UserSchema } from "./user";

export const BaseClubTeacherSchema = z.object({
  id: z.string(),
  user: DocumentReferenceSchema,
  classes: z.array(DocumentReferenceSchema),
});

export type BaseClubTeacherType = z.infer<typeof BaseClubTeacherSchema>;

export const ExtendedClubTeacherSchema = BaseClubTeacherSchema.extend({
  userData: z.nullable(UserSchema),
});

export type ExtendedClubTeacherType = z.infer<typeof ExtendedClubTeacherSchema>;
