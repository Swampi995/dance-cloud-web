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
import { FC, useEffect, useMemo, useState } from "react";

const Classes: FC = () => {
  const { selectedClub } = useClubs();
  const { toast } = useToast();
  // TODO: Add loading state
  const { data, error } = useClubClasses(selectedClub?.id ?? "");
  const [selectedMonth, setSelectedMonth] = useState<number>(
    new Date().getMonth(),
  );

  // Log data for debugging
  useEffect(() => {
    console.log("useClubClasses -> data", data);
  }, [data]);

  // Trigger a toast if an error occurs
  useEffect(() => {
    if (error) {
      toast({
        title: "Error loading classes",
        description:
          error.message || "An error occurred while fetching club classes.",
        variant: "destructive",
      });
    }
  }, [error, toast]);

  const selectItems = useMemo(() => {
    return data?.map((clubClass: ClubClassType) => (
      <SelectItem key={clubClass.id} value={clubClass.name}>
        {clubClass.name}
      </SelectItem>
    ));
  }, [data]);

  return (
    <div className="flex flex-1 flex-col gap-4 px-4 pb-4 sm:px-10">
      <div className="mt-6 flex items-center justify-between space-x-2">
        <div className="flex items-center">
          <SidebarTrigger />
          <h1 className="pl-4 text-sm font-bold sm:text-xl md:text-2xl lg:text-4xl">
            Monthly summary
          </h1>
        </div>
        <MonthPicker
          value={selectedMonth}
          onChange={setSelectedMonth}
          width={120}
        />
      </div>
      <div className="flex flex-1 justify-between rounded-xl p-1 py-4 sm:px-4">
        <Select>
          <SelectTrigger className="w-auto">
            <SelectValue placeholder="Select a class" />
          </SelectTrigger>
          <SelectContent>{selectItems}</SelectContent>
        </Select>
      </div>
    </div>
  );
};

Classes.displayName = "Classes";

export { Classes };
