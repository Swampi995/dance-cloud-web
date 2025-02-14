/**
 * This module provides utility functions to map Firestore document snapshots
 * to strongly-typed objects using predefined Zod schemas. Each mapping function
 * extracts the document's ID along with its data, and validates it against the
 * corresponding schema.
 *
 * @module mappers
 */

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
 * Converts a Firestore club document snapshot into a typed `ClubType` object.
 *
 * @param {QueryDocumentSnapshot<DocumentData>} doc - The Firestore document snapshot of a club.
 * @returns {ClubType} The parsed and validated club object.
 *
 * @example
 * const club = mapDocToClub(docSnapshot);
 */
const mapDocToClub = (doc: QueryDocumentSnapshot<DocumentData>): ClubType => {
  // Merge the document ID with the document data
  const rawData = { id: doc.id, ...doc.data() };
  // Validate and parse the data using Zod
  return ClubSchema.parse(rawData);
};

/**
 * Converts a Firestore user document snapshot into a typed `UserType` object.
 *
 * @param {DocumentSnapshot<DocumentData>} docSnap - The Firestore document snapshot of a user.
 * @returns {UserType} The parsed and validated user object.
 * @throws Will throw an error if the document data does not match the UserSchema.
 *
 * @example
 * const user = mapDocToUser(userDocSnapshot);
 */
const mapDocToUser = (docSnap: DocumentSnapshot<DocumentData>): UserType => {
  // Merge the document ID with the document data
  const rawData = { id: docSnap.id, ...docSnap.data() };
  // Validate with Zod; parse() will throw if the data doesn't match the schema
  return UserSchema.parse(rawData);
};

/**
 * Converts a Firestore membership document snapshot into a typed `UserMembershipType` object.
 *
 * @param {DocumentSnapshot<DocumentData>} docSnap - The Firestore document snapshot of a user membership.
 * @returns {UserMembershipType} The parsed and validated membership object.
 * @throws Will throw an error if the document data does not match the UserMembershipSchema.
 *
 * @example
 * const membership = mapDocToUserMembership(membershipDocSnapshot);
 */
const mapDocToUserMembership = (
  docSnap: DocumentSnapshot<DocumentData>,
): UserMembershipType => {
  // Merge the document ID with the document data
  const rawData = { id: docSnap.id, ...docSnap.data() };
  // Validate with Zod; parse() will throw if the data doesn't match the schema
  return UserMembershipSchema.parse(rawData);
};

/**
 * Converts a Firestore club session document snapshot into a typed `BaseClubSessionType` object.
 *
 * @param {QueryDocumentSnapshot<DocumentData>} docSnap - The Firestore document snapshot of a club session.
 * @returns {BaseClubSessionType} The parsed and validated club session object.
 * @throws Will throw an error if the document data does not match the BaseClubSessionSchema.
 *
 * @example
 * const session = mapDocToBaseSession(sessionDocSnapshot);
 */
const mapDocToBaseSession = (
  docSnap: QueryDocumentSnapshot<DocumentData>,
): BaseClubSessionType => {
  // Merge the document ID with the document data
  const rawData = { id: docSnap.id, ...docSnap.data() };
  // Validate with Zod; parse() will throw if the data doesn't match the schema
  return BaseClubSessionSchema.parse(rawData);
};

export {
  mapDocToBaseSession,
  mapDocToUserMembership,
  mapDocToUser,
  mapDocToClub,
};
