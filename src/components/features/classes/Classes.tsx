/**
 * This file contains the main `Classes` page component, which is responsible for:
 * - Displaying the page header (with sidebar trigger and title).
 * - Fetching and listing classes for a selected club.
 * - Providing controls for selecting a class and month.
 * - Displaying detailed information about a selected class.
 * - Displaying a horizontal calendar component.
 */

import { FC, memo, useEffect, useMemo, useState, useCallback } from "react";

import { MonthPicker } from "@/components/ui/month-picker";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { useClubClasses } from "@/hooks/use-club-classes";
import { useClubs } from "@/hooks/use-clubs";
import { useToast } from "@/hooks/use-toast";
import { ClubClassType } from "@/schemas/classes";
import { ClassDetails } from "./ClassDetails";
import { ClassCalendar } from "./ClassCalendar";

/**
 * Renders the page header component, including the sidebar trigger
 * and the main page title.
 */
const Header: FC = memo(() => (
  <div className="mb-4 mt-6 flex items-center">
    <SidebarTrigger />
    <h1 className="pl-4 text-sm font-bold sm:text-xl md:text-2xl lg:text-4xl">
      Monthly summary
    </h1>
  </div>
));
Header.displayName = "Header";

/**
 * Defines the props for the ClassSelector component.
 */
interface ClassSelectorProps {
  /**
   * The array of classes available for selection.
   */
  classesData: ClubClassType[];
  /**
   * Callback function that is called when a class is selected.
   * Receives the selected class ID as an argument.
   */
  onSelect: (selectedId: string) => void;
}

/**
 * Renders a dropdown to select a class from the given array of classes.
 *
 * @param {ClassSelectorProps} props - The component props.
 */
const ClassSelector: FC<ClassSelectorProps> = memo(
  ({ classesData, onSelect }) => {
    // Memoize the creation of select items to avoid unnecessary re-renders.
    const selectItems = useMemo(
      () =>
        classesData.map((clubClass: ClubClassType) => (
          <SelectItem key={clubClass.id} value={clubClass.id}>
            {clubClass.name}
          </SelectItem>
        )),
      [classesData],
    );

    return (
      <Select onValueChange={(value) => onSelect(value)}>
        <SelectTrigger className="w-[300px]">
          <SelectValue placeholder="Select a class" />
        </SelectTrigger>
        <SelectContent>{selectItems}</SelectContent>
      </Select>
    );
  },
);
ClassSelector.displayName = "ClassSelector";

/**
 * Defines the props for the Controls component.
 */
interface ControlsProps {
  /**
   * The array of classes available for selection.
   */
  classesData: ClubClassType[];
  /**
   * Callback function called when a user selects a class, passing the corresponding class data object
   * or null if none is selected.
   */
  onSelectClass: (classData: ClubClassType | null) => void;
  /**
   * The currently selected month (0-based index).
   */
  selectedMonth: number;
  /**
   * Callback function to change the selected month.
   */
  onMonthChange: (month: number) => void;
}

/**
 * Displays a class selector and a month picker, allowing the user to filter and view
 * the data for a particular class and month.
 *
 * @param {ControlsProps} props - The component props.
 */
const Controls: FC<ControlsProps> = memo(
  ({ classesData, onSelectClass, selectedMonth, onMonthChange }) => {
    /**
     * Handles selection of a class by finding it in the classesData array
     * and calling `onSelectClass` with the found class or null if not found.
     */
    const handleSelect = useCallback(
      (selectedId: string) => {
        const clubClass = classesData.find(
          (classData) => classData.id === selectedId,
        );
        onSelectClass(clubClass ?? null);
      },
      [classesData, onSelectClass],
    );

    return (
      <div className="flex items-center space-x-2">
        <ClassSelector classesData={classesData} onSelect={handleSelect} />
        <MonthPicker
          value={selectedMonth}
          onChange={onMonthChange}
          width={120}
        />
      </div>
    );
  },
);
Controls.displayName = "Controls";

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
        <ClassDetails clubClass={selectedClass} club={selectedClub} />
      </div>
      <ClassCalendar
        clubClass={selectedClass}
        club={selectedClub}
        month={selectedMonth}
        year={2025}
      />
    </div>
  );
};

Classes.displayName = "Classes";

export default Classes;
