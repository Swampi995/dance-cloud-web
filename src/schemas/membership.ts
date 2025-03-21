import { z } from "zod";
import { Timestamp } from "firebase/firestore";
import { DocumentReferenceSchema } from "./firebase";

export const ClubCategorySchema = z.object({
  id: z.string(),
  name: z.string().optional(),
  ageGroup: z.enum(["children", "adults", "seniors"]).optional(),
});

export type ClubCategoryType = z.infer<typeof ClubCategorySchema>;

export const ClubMembershipSchema = z.object({
  id: z.string(),
  name: z.string().optional(),
  classesNo: z.number().or(z.string()),
  unlimitedClasses: z.boolean().optional(),
  price: z.number(),
  priceExtraSession: z.number().optional(),
  orderNo: z.string().or(z.number()),
  duration: z.string().or(z.number()),
  loyaltyDiscount: z.number().optional(),
  category: ClubCategorySchema.optional(),
});

export type ClubMembershipType = z.infer<typeof ClubMembershipSchema>;

export const UserMembershipSchema = z.object({
  id: z.string(),
  amountReceived: z.number().optional(),
  expiration: z.instanceof(Timestamp).optional(),
  purchased: z.instanceof(Timestamp).optional(),
  startDate: z.instanceof(Timestamp).optional(),
  club: DocumentReferenceSchema.optional(),
  membership: DocumentReferenceSchema.optional(),
});

export type UserMembershipType = z.infer<typeof UserMembershipSchema>;
