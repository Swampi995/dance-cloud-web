import { FC, memo, useEffect, useMemo, useState, useCallback } from "react";
import { HorizontalCalendar } from "@/components/features/classes/HorizontalCalendar";
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

const Header: FC = memo(() => (
  <div className="mb-4 mt-6 flex items-center">
    <SidebarTrigger />
    <h1 className="pl-4 text-sm font-bold sm:text-xl md:text-2xl lg:text-4xl">
      Monthly summary
    </h1>
  </div>
));

Header.displayName = "Header";

interface ClassSelectorProps {
  classesData: ClubClassType[];
  onSelect: (selectedId: string) => void;
}

const ClassSelector: FC<ClassSelectorProps> = memo(
  ({ classesData, onSelect }) => {
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

interface ControlsProps {
  classesData: ClubClassType[];
  onSelectClass: (classData: ClubClassType | null) => void;
  selectedMonth: number;
  onMonthChange: (month: number) => void;
}

const Controls: FC<ControlsProps> = memo(
  ({ classesData, onSelectClass, selectedMonth, onMonthChange }) => {
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

const Classes: FC = () => {
  const { selectedClub } = useClubs();
  const { toast } = useToast();
  const [selectedMonth, setSelectedMonth] = useState<number>(
    new Date().getMonth(),
  );
  const [selectedClass, setSelectedClass] = useState<ClubClassType | null>(
    null,
  );

  // Check why this isn't triggering a refresh of the class details when the club changes
  const { data: classesData = [], error: classesError } = useClubClasses(
    selectedClub?.id ?? "",
  );

  // TODO: Check if this is alright, and where to add similar changes
  // Reset the selectedClass if selectedClub changes
  useEffect(() => setSelectedClass(null), [selectedClub]);

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
      <HorizontalCalendar month={1} year={2025} />
    </div>
  );
};

Classes.displayName = "Classes";

export { Classes };
