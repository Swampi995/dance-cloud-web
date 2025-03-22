/**
 * This file contains the main `Classes` page component, which is responsible for:
 * - Displaying the page header (with sidebar trigger and title).
 * - Fetching and listing classes for a selected club.
 * - Providing controls for selecting a class and month.
 * - Displaying detailed information about a selected class.
 * - Displaying a horizontal calendar component.
 */

import { FC, useEffect, useMemo, useState } from "react";

import { useClubClasses } from "@/hooks/use-club-classes";
import { useClubs } from "@/hooks/use-clubs";
import { useToast } from "@/hooks/use-toast";
import { ClubClassType } from "@/schemas/classes";
import { ClassCalendar } from "./ClassCalendar";
import { ClassDetails } from "./ClassDetails";
import { Header } from "./Header";
import { Controls } from "./Controls";

/**
 * The main `Classes` component that displays a monthly summary of classes for the selected club.
 * It fetches the list of classes for the currently selected club and provides controls
 * for selecting a specific class and month. The selected class's details are displayed in
 * the `ClassDetails` component.
 *
 * @returns {JSX.Element} The rendered `Classes` component.
 */
const Classes: FC = () => {
  const { selectedClub } = useClubs();
  const { toast } = useToast();

  const year = useMemo(() => new Date().getFullYear(), []);

  // The currently selected month (defaults to the current month).
  const [selectedMonth, setSelectedMonth] = useState<number>(
    new Date().getMonth(),
  );

  // The currently selected class. Null when no class is selected.
  const [selectedClass, setSelectedClass] = useState<ClubClassType | null>(
    null,
  );

  // Reset the selected class if the selected club changes.
  useEffect(() => setSelectedClass(null), [selectedClub]);

  // Fetch the classes for the currently selected club.
  const { data: classesData = [], error: classesError } = useClubClasses(
    selectedClub?.id ?? "",
  );

  // Display an error toast if there's an error loading classes.
  useEffect(() => {
    if (classesError) {
      toast({
        title: "Error loading classes",
        description:
          classesError.message ||
          "An error occurred while fetching club classes.",
        variant: "destructive",
      });
    }
  }, [classesError, toast]);

  return (
    <div
      className="flex flex-1 flex-col gap-4 px-4 sm:px-10"
      style={{ width: "calc(100% - 250px)" }}
    >
      <Header />
      <div className="flex flex-col justify-between space-y-2 rounded-xl">
        <Controls
          classesData={classesData}
          onSelectClass={setSelectedClass}
          selectedMonth={selectedMonth}
          onMonthChange={setSelectedMonth}
        />
        <ClassDetails
          clubClass={selectedClass}
          club={selectedClub}
          month={selectedMonth}
          year={year}
        />
      </div>
      <ClassCalendar
        clubClass={selectedClass}
        club={selectedClub}
        month={selectedMonth}
        year={year}
      />
    </div>
  );
};
Classes.displayName = "Classes";

export default Classes;
