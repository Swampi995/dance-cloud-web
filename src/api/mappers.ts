/**
 * This module provides utility functions to map Firestore document snapshots
 * to strongly-typed objects using predefined Zod schemas. Each mapping function
 * extracts the document's ID along with its data, and validates it against the
 * corresponding schema.
 *
 * @module mappers
 */

import { ClubClassSchema, ClubClassType } from "@/schemas/classes";
import { ClubSchema, ClubType } from "@/schemas/club";
import {
  UserMembershipType,
  UserMembershipSchema,
  ClubMembershipSchema,
  ClubMembershipType,
} from "@/schemas/membership";
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
 * const club = mapDocToClub(clubDocSnapshot);
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
 * Converts a Firestore club membership document snapshot into a typed `ClubMembershipType` object.
 *
 * @param {DocumentSnapshot<DocumentData>} docSnap - The Firestore document snapshot of a club membership.
 * @returns {ClubMembershipType} The parsed and validated club membership object.
 * @throws Will throw an error if the document data does not match the ClubMembershipSchema.
 *
 * @example
 * const membership = mapDocToClubMembership(clubMembershipDocSnapshot);
 */
const mapDocToClubMembership = (
  docSnap: DocumentSnapshot<DocumentData>,
): ClubMembershipType => {
  // Merge the document ID with the document data
  const rawData = { id: docSnap.id, ...docSnap.data() };
  // Validate and parse the data using the ClubMembershipSchema
  return ClubMembershipSchema.parse(rawData);
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

/**
 * Converts a Firestore club class document snapshot into a typed `ClubClassType` object.
 *
 * @param {QueryDocumentSnapshot<DocumentData>} docSnap - The Firestore document snapshot of a club class.
 * @returns {ClubClassType} The parsed and validated club class object.
 * @throws Will throw an error if the document data does not match the ClubClassScheama.
 *
 * @example
 * const class = mapDocToClubClass(clubClassDocSnapshot);
 */
const mapDocToClubClass = (
  docSnap: QueryDocumentSnapshot<DocumentData>,
): ClubClassType => {
  // Merge the document ID with the document data
  const rawData = { id: docSnap.id, ...docSnap.data() };
  // Validate with Zod; parse() will throw if the data doesn't match the schema
  return ClubClassSchema.parse(rawData);
};

export {
  mapDocToBaseSession,
  mapDocToUserMembership,
  mapDocToUser,
  mapDocToClub,
  mapDocToClubMembership,
  mapDocToClubClass,
};
