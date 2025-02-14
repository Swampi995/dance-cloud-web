import { z } from "zod";
import {
  DocumentData,
  QueryDocumentSnapshot,
  Timestamp,
} from "firebase/firestore";
import { UserSchema } from "./user";
import { ClubMembershipSchema, UserMembershipSchema } from "./membership";
import { DocumentReferenceSchema } from "./firebase";

// Base ClubSession schema uses references for user and membership.
export const BaseClubSessionSchema = z.object({
  id: z.string(),
  date: z.instanceof(Timestamp),
  user: DocumentReferenceSchema,
  membership: DocumentReferenceSchema,
});

export type BaseClubSessionType = z.infer<typeof BaseClubSessionSchema>;

// Extended ClubSession schema uses data from the user, user membership and club membership references
export const ExtendedClubSessionSchema = BaseClubSessionSchema.extend({
  userData: z.nullable(UserSchema),
  userMembershipData: z.nullable(UserMembershipSchema),
  clubMembershipData: z.nullable(ClubMembershipSchema),
});

export type ExtendedClubSessionType = z.infer<typeof ExtendedClubSessionSchema>;

// Paginated Club Sessions are just that, they contain the lastVisible element and the extended club sessions
export type PaginatedClubSessionsExtendedType = {
  sessions: ExtendedClubSessionType[];
  lastVisible: QueryDocumentSnapshot<DocumentData> | null;
};
