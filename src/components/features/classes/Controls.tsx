import { MonthPicker } from "@/components/ui/month-picker";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ClubClassType } from "@/schemas/classes";
import { FC, memo, useCallback, useMemo } from "react";

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
      <Select
        onValueChange={(value) => onSelect(value)}
        disabled={!selectItems.length}
      >
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

export { Controls };
