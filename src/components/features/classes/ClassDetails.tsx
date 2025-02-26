import { FC, memo, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ClubClassType } from "@/schemas/classes";

interface ClassDetailsProps {
  clubClass: ClubClassType | null;
}

const daysOfWeek = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

const ClassDetails: FC<ClassDetailsProps> = memo(({ clubClass }) => {
  // Memoize sorted schedules to avoid unnecessary re-sorting on re-renders.
  const sortedSchedules = useMemo(() => {
    return clubClass?.schedule
      ? [...clubClass.schedule].sort((a, b) => a.day - b.day)
      : [];
  }, [clubClass?.schedule]);

  return (
    <Card className="max-w-4xl rounded-3xl bg-sidebar/40">
      <CardHeader>
        <CardTitle className="text-sm font-light">Class Overview</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="flex place-items-center justify-between space-x-10">
          <p className="text-sm">Name</p>
          <p className="font-medium">{clubClass?.name ?? "Select a class"}</p>
        </div>
        <div className="flex place-items-center justify-between space-x-10">
          <p className="text-sm">Level</p>
          <p className="font-medium">{clubClass?.level ?? "Select a class"}</p>
        </div>
        <div className="flex place-items-center justify-between space-x-10">
          <p className="text-sm">Schedule</p>
          <div className="flex flex-wrap gap-1 font-medium md:gap-2 lg:gap-4">
            {sortedSchedules.length > 0
              ? sortedSchedules.map((sched, index) => {
                  const formattedHour = sched.hour.toString().padStart(2, "0");
                  const formattedMinute = sched.minute
                    .toString()
                    .padStart(2, "0");

                  return (
                    <div key={index}>
                      {/* Large screens: full day name */}
                      <span className="hidden rounded-sm bg-sidebar-accent px-2 py-1 text-sm lg:inline">
                        {daysOfWeek[sched.day]} {formattedHour}:
                        {formattedMinute}
                      </span>
                      {/* Medium screens: 3-letter abbreviation */}
                      <span className="inline rounded-sm bg-sidebar-accent px-2 py-1 text-sm lg:hidden">
                        {daysOfWeek[sched.day].slice(0, 3)} {formattedHour}:
                        {formattedMinute}
                      </span>
                    </div>
                  );
                })
              : "Select a class"}
          </div>
        </div>
      </CardContent>
    </Card>
  );
});

ClassDetails.displayName = "ClassDetails";

export { ClassDetails };
