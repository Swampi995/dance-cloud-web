import { db } from "@/lib/firebase";
import { ExtendedClubTeacherType } from "@/schemas/teachers";
import { FirebaseError } from "firebase/app";
import { collection, doc, onSnapshot, query, where } from "firebase/firestore";
import { mapDocToBaseClubTeacher, mapDocToUser } from "./mappers";

/**
 * Subscribes to real-time updates for teachers associated with a specific club and class.
 *
 * This function sets up a real-time listener on the "teachers" subcollection of a club,
 * filtering teacher documents to those associated with a specific class. For each teacher document,
 * it establishes a nested listener on the corresponding user document referenced in the teacher data.
 * When either the teacher or user data changes, the provided callback is invoked with an updated
 * array of extended teacher objects.
 *
 * @param {string} clubId - The unique identifier of the club.
 * @param {string} classId - The unique identifier of the class within the club.
 * @param {(data: ExtendedClubTeacherType[]) => void} callback - Function called with an updated array of extended teacher objects.
 * @param {(error: Error) => void} [errorCallback] - Optional callback function that is called if an error occurs during subscription.
 * @returns {() => void} A cleanup function that unsubscribes from all real-time listeners.
 *
 * @example
 * // Subscribe to teacher updates for a specific club and class.
 * const unsubscribe = subscribeToTeachersForClub(
 *   "club123",
 *   "classA",
 *   (teachers) => {
 *     console.log("Updated teachers data:", teachers);
 *   },
 *   (error) => {
 *     console.error("Error fetching teachers data:", error);
 *   }
 * );
 *
 * // When it's time to clean up and stop listening:
 * unsubscribe();
 */
export const subscribeToTeachersForClub = (
  clubId: string,
  classId: string,
  callback: (data: ExtendedClubTeacherType[]) => void,
  errorCallback?: (error: Error) => void,
) => {
  // Build a reference to the specific club and class documents and its "teachers" subcollection.
  const clubDocRef = doc(db, "clubs", clubId);
  const clubClassDocRef = doc(clubDocRef, "classes", classId);

  const clubTeachersRef = collection(clubDocRef, "teachers");

  // Create a query against the "teachers" subcollection.
  const clubTeachersQuery = query(
    clubTeachersRef,
    where("classes", "array-contains", clubClassDocRef),
  );

  // This array will hold unsubscribe functions for all nested listeners.
  let extraUnsubs: Array<() => void> = [];

  // Subscribe to the main club teachers query for real-time updates.
  const unsubscribe = onSnapshot(
    clubTeachersQuery,
    (clubTeacherDocSnapshot) => {
      // Clear any existing nested subscriptions before processing the new snapshot.
      extraUnsubs.forEach((fn) => fn());
      extraUnsubs = [];

      // Map each document in the snapshot to an extended club teacher object.
      const extendedClubTeachers: ExtendedClubTeacherType[] =
        clubTeacherDocSnapshot.docs.map((docSnap) => {
          // Map the base club teacher data.
          const baseClubTeacher = mapDocToBaseClubTeacher(docSnap);
          // Create an extended club teacher structure with placeholders for nested data.
          const extendedClubTeacher: ExtendedClubTeacherType = {
            ...baseClubTeacher,
            userData: null,
          };

          // Subscribe to real-time updates on the user document referenced in the base club teacher.
          const unsubUser = onSnapshot(
            baseClubTeacher.user,
            (userDocSnapshot) => {
              extendedClubTeacher.userData = mapDocToUser(userDocSnapshot);
              // Invoke callback with updated session data whenever user data changes.
              callback(extendedClubTeachers);
            },
            (err: FirebaseError) => {
              console.error("Error fetching user data:", err);
              if (errorCallback) errorCallback(err);
            },
          );

          extraUnsubs.push(unsubUser);

          return extendedClubTeacher;
        });

      // Call the callback with the updated list of club teachers.
      callback(extendedClubTeachers);
    },
    (error: FirebaseError) => {
      console.error("Error subscribing to teachers:", error);
      if (errorCallback) errorCallback(error);
    },
  );

  // Return a cleanup function that unsubscribes from the main query and all nested listeners.
  return () => {
    unsubscribe();
    extraUnsubs.forEach((fn) => fn());
  };
};
