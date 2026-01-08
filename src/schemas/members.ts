import { z } from "zod";
import { Timestamp } from "firebase/firestore";
import { DocumentReferenceSchema } from "./firebase";
import { UserSchema } from "./user";
import { UserMembershipSchema } from "./membership";

export const BaseClubMemberSchema = z.object({
  id: z.string(),
  classes: z.array(DocumentReferenceSchema).optional(),
  user: DocumentReferenceSchema,
  created: z.instanceof(Timestamp),
});

export type BaseClubMemberType = z.infer<typeof BaseClubMemberSchema>;

export const ExtendedClubMemberSchema = BaseClubMemberSchema.extend({
  userData: z.nullable(UserSchema),
  userMembershipData: z.nullable(UserMembershipSchema),
  userPastMembershipData: z.nullable(z.array(UserMembershipSchema)),
});

export type ExtendedClubMemberType = z.infer<typeof ExtendedClubMemberSchema>;
