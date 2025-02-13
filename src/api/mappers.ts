// mappers.ts

import { ClubSchema, ClubType } from "@/schemas/club";
import { UserMembershipType, UserMembershipSchema } from "@/schemas/membership";
import { BaseClubSessionType, BaseClubSessionSchema } from "@/schemas/session";
import { UserType, UserSchema } from "@/schemas/user";
import {
  QueryDocumentSnapshot,
  DocumentData,
  DocumentSnapshot,
} from "firebase/firestore";

/**
 * Converts a Club document snapshot into a typed `ClubType`.
 */
const mapDocToClub = (doc: QueryDocumentSnapshot<DocumentData>): ClubType => {
  const rawData = { id: doc.id, ...doc.data() };
  return ClubSchema.parse(rawData);
};

/**
 * Converts a User document snapshot into a typed `UserType`.
 */
const mapDocToUser = (docSnap: DocumentSnapshot<DocumentData>): UserType => {
  // Merge doc ID and data
  const rawData = { id: docSnap.id, ...docSnap.data() };
  // Validate with Zod; parse() will throw if it doesn’t match the schema
  return UserSchema.parse(rawData);
};

/**
 * Converts a Membership document snapshot into a typed `UserMembershipType`.
 */
const mapDocToUserMembership = (
  docSnap: DocumentSnapshot<DocumentData>,
): UserMembershipType => {
  const rawData = { id: docSnap.id, ...docSnap.data() };
  // Validate with Zod; parse() will throw if it doesn’t match the schema
  return UserMembershipSchema.parse(rawData);
};

/**
 * Converts a Club Session document snapshot into a typed `ClubSession`.
 */
const mapDocToBaseSession = (
  docSnap: QueryDocumentSnapshot<DocumentData>,
): BaseClubSessionType => {
  const rawData = { id: docSnap.id, ...docSnap.data() };
  // Validate with Zod; parse() will throw if it doesn’t match the schema
  return BaseClubSessionSchema.parse(rawData);
};

export {
  mapDocToBaseSession,
  mapDocToUserMembership,
  mapDocToUser,
  mapDocToClub,
};
