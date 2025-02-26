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
import { useClubMembers } from "@/hooks/use-club-members";
import { useClubs } from "@/hooks/use-clubs";
import { useToast } from "@/hooks/use-toast";
import { ClubClassType } from "@/schemas/classes";
import { FC, useEffect, useMemo, useState } from "react";
import { ClassDetails } from "./ClassDetails";

const Classes: FC = () => {
  const { selectedClub } = useClubs();
  // console.log("selectedClub", selectedClub);
  const { toast } = useToast();
  // TODO: Add loading state

  const [selectedMonth, setSelectedMonth] = useState<number>(
    new Date().getMonth(),
  );
  const [selectedClass, setSelectedClass] = useState<ClubClassType | null>(
    null,
  );

  const {
    data: classesData,
    // loading: _classesLoading,
    error: classesError,
  } = useClubClasses(selectedClub?.id ?? "");
  const {
    data: membersData,
    // loading: _membersLoading,
    // error: _membersError,
  } = useClubMembers(selectedClub?.id ?? "", selectedClass?.id ?? "");

  useEffect(() => {
    // console.log("useClubMembers -> membersData", membersData);
  }, [membersData]);

  // Log data for debugging
  useEffect(() => {
    // console.log("useClubClasses -> classesData", classesData);
  }, [classesData]);

  // Trigger a toast if an error occurs
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

  const selectItems = useMemo(() => {
    return classesData?.map((clubClass: ClubClassType) => (
      <SelectItem key={clubClass.id} value={clubClass.id}>
        {clubClass.name}
      </SelectItem>
    ));
  }, [classesData]);

  return (
    <div
      className="flex flex-1 flex-col gap-4 px-4 sm:px-10"
      style={{ width: "calc(100% - 250px)" }}
    >
      <div className="mb-4 mt-6 flex items-center">
        <SidebarTrigger />
        <h1 className="pl-4 text-sm font-bold sm:text-xl md:text-2xl lg:text-4xl">
          Monthly summary
        </h1>
      </div>
      <div className="flex flex-col justify-between space-y-2 rounded-xl">
        <div className="flex items-center space-x-2">
          <Select
            onValueChange={(value) => {
              const clubClass = classesData.find(
                (classData) => classData.id === value,
              );
              setSelectedClass(clubClass ?? null);
            }}
          >
            <SelectTrigger className="w-[300px]">
              <SelectValue placeholder="Select a class" />
            </SelectTrigger>
            <SelectContent>{selectItems}</SelectContent>
          </Select>
          <MonthPicker
            value={selectedMonth}
            onChange={setSelectedMonth}
            width={120}
          />
        </div>
        <ClassDetails clubClass={selectedClass} />
      </div>
      <HorizontalCalendar month={1} year={2025} />
    </div>
  );
};

Classes.displayName = "Classes";

export { Classes };
