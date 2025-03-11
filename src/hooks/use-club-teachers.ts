import { subscribeToTeachersForClub } from "@/api/teachers";
import { ExtendedClubTeacherType } from "@/schemas/teachers";
import { useEffect, useState } from "react";

/**
 * Custom hook that subscribes to teacher updates for a specific club and class.
 *
 * This hook sets up a subscription via `subscribeToTeachersForClub` to listen for
 * real-time updates on the teachers associated with the given club and class. It manages
 * the teacher data, loading state, and any errors encountered during the subscription.
 *
 * @param {string} clubId - The unique identifier for the club.
 * @param {string} classId - The unique identifier for the class.
 * @returns {{
 *   data: ExtendedClubTeacherType[],
 *   error: Error | null,
 *   loading: boolean
 * }} An object containing:
 *   - **data**: The list of teachers for the club.
 *   - **error**: An error object if an error occurred during subscription; otherwise, `null`.
 *   - **loading**: A boolean indicating whether the teacher data is currently being loaded.
 *
 * @example
 * // Example usage in a React component:
 * import { useClubTeachers } from "./path/to/useClubTeachers";
 *
 * const ClubTeachersComponent = ({ clubId, classId }) => {
 *   const { data, error, loading } = useClubTeachers(clubId, classId);
 *
 *   if (loading) return <div>Loading...</div>;
 *   if (error) return <div>Error: {error.message}</div>;
 *
 *   return (
 *     <ul>
 *       {data.map((teacher) => (
 *         <li key={teacher.id}>{teacher.name}</li>
 *       ))}
 *     </ul>
 *   );
 * };
 *
 * export default ClubTeachersComponent;
 */
const useClubTeachers = (clubId: string, classId: string) => {
  // State to store the club teacher data
  const [data, setData] = useState<ExtendedClubTeacherType[]>([]);

  // State to store any error encountered during the subscription process
  const [error, setError] = useState<Error | null>(null);

  // State indicating whether data is currently being loaded.
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (!clubId || !classId) return;

    setLoading(true);

    // Begin subscription to the club's teachers.
    // The subscription listens for real-time updates and invokes callbacks accordingly.
    const unsubscribe = subscribeToTeachersForClub(
      clubId,
      classId,
      // Success callback: update the club teacher data and mark loading as complete.
      (newData) => {
        setData([...newData]);
        setLoading(false);
      },
      // Error callback: log the error, update the error state, and mark loading as complete.
      (error) => {
        console.error("Error subscribing to teachers:", error);
        setError(error);
        setLoading(false);
      },
    );
    // Cleanup: Unsubscribe from the club teachers updates when the component unmounts or when the clubId or classId changes.
    return () => {
      unsubscribe();
    };
  }, [clubId, classId]);

  // Return the current club teacher data, any subscription error, and the loading status.
  return { data, error, loading };
};

export { useClubTeachers };
