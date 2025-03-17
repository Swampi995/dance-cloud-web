import { FC, memo, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ClubClassType } from "@/schemas/classes";
import { ClubType } from "@/schemas/club";
import { useClubTeachers } from "@/hooks/use-club-teachers";
import { InfoRow } from "./InfoRow";
import { ScheduleList } from "./ScheduleItem";
import { TeachersList } from "./TeacherList";

/**
 * Props for the ClassDetails component.
 * @typedef {Object} ClassDetailsProps
 * @property {ClubClassType | null} clubClass - The club class details.
 * @property {ClubType | null} club - The club details.
 * @property {number} month - The month (0-indexed; e.g., 0 for January).
 * @property {number} year - The year.
 */
interface ClassDetailsProps {
  clubClass: ClubClassType | null;
  club: ClubType | null;
  month: number; // 0-indexed month (e.g., 0 for January)
  year: number;
}

/**
 * An array representing the days of the week.
 */
const daysOfWeek = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

/**
 * A component that displays detailed information about a club class,
 * including class name, level, session count, schedule, and teachers.
 *
 * @param {ClassDetailsProps} props - The properties for the class details component.
 * @returns {JSX.Element} The rendered ClassDetails component.
 */
const ClassDetails: FC<ClassDetailsProps> = memo(
  ({ club, clubClass, month, year }) => {
    const { data: teachersData } = useClubTeachers(
      club?.id ?? "",
      clubClass?.id ?? "",
    );

    /**
     * Formats the class schedule by sorting it by day and padding the hour/minute values.
     * Also creates a short form for small screens.
     */
    const formattedSchedules = useMemo(() => {
      if (!clubClass?.schedule?.length) return [];

      // Sort schedules by day and format each entry
      const sorted = [...clubClass.schedule].sort((a, b) => a.day - b.day);
      return sorted.map((sched) => {
        const formattedHour = sched.hour.toString().padStart(2, "0");
        const formattedMinute = sched.minute.toString().padStart(2, "0");
        const dayName = daysOfWeek[sched.day];

        return {
          large: `${dayName} ${formattedHour}:${formattedMinute}`,
          small: `${dayName.slice(0, 3)} ${formattedHour}:${formattedMinute}`,
        };
      });
    }, [clubClass?.schedule]);

    /**
     * Sorts and extracts teacher names from the fetched teacher data.
     * Returns a default message if no teachers are assigned.
     */
    const sortedTeacherNames = useMemo(() => {
      const names = teachersData
        .filter((t) => t?.userData?.name)
        .map((t) => t.userData!.name)
        .sort((a, b) => a.localeCompare(b));

      return names.length ? names : ["No teachers assigned"];
    }, [teachersData]);

    /**
     * Calculates the number of sessions for the class in the given month and year
     * by counting matching weekdays in the month for each scheduled session.
     */
    const sessionCount = useMemo(() => {
      if (!clubClass?.schedule?.length) return 0;

      // Determine the number of days in the month.
      const daysInMonth = new Date(year, month + 1, 0).getDate();
      let count = 0;

      // For each scheduled session, count the number of matching weekdays in the month.
      clubClass.schedule.forEach((sched) => {
        for (let day = 1; day <= daysInMonth; day++) {
          const date = new Date(year, month, day);
          if (date.getDay() === sched.day) {
            count++;
          }
        }
      });
      return count;
    }, [clubClass?.schedule, month, year]);

    const isClassSelected = !!clubClass;

    return (
      <Card className="max-w-4xl rounded-3xl bg-sidebar/40">
        <CardHeader>
          <CardTitle className="text-sm font-light">Class Overview</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <InfoRow label="Name" value={clubClass?.name ?? "Select a class"} />
          <InfoRow label="Level" value={clubClass?.level ?? "Select a class"} />
          <InfoRow
            label="Sessions"
            value={isClassSelected ? sessionCount.toString() : "Select a class"}
          />

          <div className="flex place-items-center justify-between space-x-10">
            <p className="text-sm">Schedule</p>
            <div className="flex flex-wrap gap-1 font-medium md:gap-2 lg:gap-4">
              {!isClassSelected ? (
                <span>Select a class</span>
              ) : (
                <ScheduleList schedules={formattedSchedules} />
              )}
            </div>
          </div>

          <div className="flex place-items-center justify-between space-x-10">
            <p className="text-sm">Teachers</p>
            <div className="flex flex-wrap gap-1 font-medium md:gap-2 lg:gap-4">
              {!isClassSelected ? (
                <span>Select a class</span>
              ) : (
                <TeachersList teachers={sortedTeacherNames} />
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  },
);
ClassDetails.displayName = "ClassDetails";

export { ClassDetails };
