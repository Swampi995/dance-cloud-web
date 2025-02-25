import { z } from "zod";
import { ClubClassSchema } from "./classes";
import { UserSchema } from "./user";
import { Timestamp } from "firebase/firestore";

export const ClubMemberSchema = z.object({
  id: z.string(),
  classes: ClubClassSchema,
  user: UserSchema,
  created: z.instanceof(Timestamp),
});

export type ClubMemberType = z.infer<typeof ClubMemberSchema>;
