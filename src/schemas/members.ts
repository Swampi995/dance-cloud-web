import { z } from "zod";
import { Timestamp } from "firebase/firestore";
import { DocumentReferenceSchema } from "./firebase";
import { UserSchema } from "./user";

export const BaseClubMemberSchema = z.object({
  id: z.string(),
  classes: z.array(DocumentReferenceSchema).optional(),
  user: DocumentReferenceSchema,
  created: z.instanceof(Timestamp),
});

export type BaseClubMemberType = z.infer<typeof BaseClubMemberSchema>;

export const ExtendedClubMemberSchema = BaseClubMemberSchema.extend({
  userData: z.nullable(UserSchema),
});

export type ExtendedClubMemberType = z.infer<typeof ExtendedClubMemberSchema>;
