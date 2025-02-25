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
import { ClubMemberSchema, ClubMemberType } from "@/schemas/members";
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
 * @param {QueryDocumentSnapshot<DocumentData>} clubDocSnapshot - The Firestore document snapshot of a club.
 * @returns {ClubType} The parsed and validated club object.
 *
 * @example
 * const club = mapDocToClub(clubDocSnapshot);
 */
const mapDocToClub = (
  clubDocSnapshot: QueryDocumentSnapshot<DocumentData>,
): ClubType => {
  // Merge the document ID with the document data
  const rawData = { id: clubDocSnapshot.id, ...clubDocSnapshot.data() };
  // Validate and parse the data using Zod
  return ClubSchema.parse(rawData);
};

/**
 * Converts a Firestore user document snapshot into a typed `UserType` object.
 *
 * @param {DocumentSnapshot<DocumentData>} userDocSnapshot - The Firestore document snapshot of a user.
 * @returns {UserType} The parsed and validated user object.
 * @throws Will throw an error if the document data does not match the UserSchema.
 *
 * @example
 * const user = mapDocToUser(userDocSnapshot);
 */
const mapDocToUser = (
  userDocSnapshot: DocumentSnapshot<DocumentData>,
): UserType => {
  // Merge the document ID with the document data
  const rawData = { id: userDocSnapshot.id, ...userDocSnapshot.data() };
  // Validate with Zod; parse() will throw if the data doesn't match the schema
  return UserSchema.parse(rawData);
};

/**
 * Converts a Firestore membership document snapshot into a typed `UserMembershipType` object.
 *
 * @param {DocumentSnapshot<DocumentData>} userMembershipDocSnapshot - The Firestore document snapshot of a user membership.
 * @returns {UserMembershipType} The parsed and validated membership object.
 * @throws Will throw an error if the document data does not match the UserMembershipSchema.
 *
 * @example
 * const membership = mapDocToUserMembership(userMembershipDocSnapshot);
 */
const mapDocToUserMembership = (
  userMembershipDocSnapshot: DocumentSnapshot<DocumentData>,
): UserMembershipType => {
  // Merge the document ID with the document data
  const rawData = {
    id: userMembershipDocSnapshot.id,
    ...userMembershipDocSnapshot.data(),
  };
  // Validate with Zod; parse() will throw if the data doesn't match the schema
  return UserMembershipSchema.parse(rawData);
};

/**
 * Converts a Firestore club membership document snapshot into a typed `ClubMembershipType` object.
 *
 * @param {DocumentSnapshot<DocumentData>} clubMembershipDocSnapshot - The Firestore document snapshot of a club membership.
 * @returns {ClubMembershipType} The parsed and validated club membership object.
 * @throws Will throw an error if the document data does not match the ClubMembershipSchema.
 *
 * @example
 * const membership = mapDocToClubMembership(clubMembershipDocSnapshot);
 */
const mapDocToClubMembership = (
  clubMembershipDocSnapshot: DocumentSnapshot<DocumentData>,
): ClubMembershipType => {
  // Merge the document ID with the document data
  const rawData = {
    id: clubMembershipDocSnapshot.id,
    ...clubMembershipDocSnapshot.data(),
  };
  // Validate and parse the data using the ClubMembershipSchema
  return ClubMembershipSchema.parse(rawData);
};

/**
 * Converts a Firestore club session document snapshot into a typed `BaseClubSessionType` object.
 *
 * @param {QueryDocumentSnapshot<DocumentData>} sessionDocSnapshot - The Firestore document snapshot of a club session.
 * @returns {BaseClubSessionType} The parsed and validated club session object.
 * @throws Will throw an error if the document data does not match the BaseClubSessionSchema.
 *
 * @example
 * const session = mapDocToBaseSession(sessionDocSnapshot);
 */
const mapDocToBaseSession = (
  sessionDocSnapshot: QueryDocumentSnapshot<DocumentData>,
): BaseClubSessionType => {
  // Merge the document ID with the document data
  const rawData = { id: sessionDocSnapshot.id, ...sessionDocSnapshot.data() };
  // Validate with Zod; parse() will throw if the data doesn't match the schema
  return BaseClubSessionSchema.parse(rawData);
};

/**
 * Converts a Firestore club class document snapshot into a typed `ClubClassType` object.
 *
 * @param {QueryDocumentSnapshot<DocumentData>} clubClassDocSnapshot - The Firestore document snapshot of a club class.
 * @returns {ClubClassType} The parsed and validated club class object.
 * @throws Will throw an error if the document data does not match the ClubClassSchema.
 *
 * @example
 * const class = mapDocToClubClass(clubClassDocSnapshot);
 */
const mapDocToClubClass = (
  clubClassDocSnapshot: QueryDocumentSnapshot<DocumentData>,
): ClubClassType => {
  // Merge the document ID with the document data
  const rawData = {
    id: clubClassDocSnapshot.id,
    ...clubClassDocSnapshot.data(),
  };
  // Validate with Zod; parse() will throw if the data doesn't match the schema
  return ClubClassSchema.parse(rawData);
};

/**
 * Converts a Firestore club class document snapshot into a typed `ClubMemberType` object.
 *
 * @param {QueryDocumentSnapshot<DocumentData>} clubMemberDocSnapshot - The Firestore document snapshot of a club member.
 * @returns {ClubClassType} The parsed and validated club member object.
 * @throws Will throw an error if the document data does not match the ClubMemberSchema.
 *
 * @example
 * const class = mapDocToClubMember(clubMemberDocSnapshot);
 */
const mapDocToClubMember = (
  clubMemberDocSnapshot: QueryDocumentSnapshot<DocumentData>,
): ClubMemberType => {
  // Merge the document ID with the document data
  const rawData = {
    id: clubMemberDocSnapshot.id,
    ...clubMemberDocSnapshot.data(),
  };
  // Validate with Zod; parse() will throw if the data doesn't match the schema
  return ClubMemberSchema.parse(rawData);
};

export {
  mapDocToBaseSession,
  mapDocToUserMembership,
  mapDocToUser,
  mapDocToClub,
  mapDocToClubMembership,
  mapDocToClubClass,
  mapDocToClubMember,
};
