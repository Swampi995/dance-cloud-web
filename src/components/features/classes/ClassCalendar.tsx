import { useClubMembers } from "@/hooks/use-club-members";
import { ClubClassType } from "@/schemas/classes";
import { ClubType } from "@/schemas/club";
import { FC, memo, useMemo } from "react";

/**
 * Props for the ClassCalendar component.
 *
 * @typedef {Object} ClassCalendarProps
 * @property {ClubType | null} club - The club object. Can be null.
 * @property {ClubClassType | null} clubClass - The club class object. Can be null.
 * @property {number} month - 0-indexed month (e.g., 0 for January).
 * @property {number} year - The year for the calendar.
 */
type ClassCalendarProps = {
  club: ClubType | null;
  clubClass: ClubClassType | null;
  month: number; // 0-indexed month (e.g., 0 for January)
  year: number;
};

const cellWidth = 80; // width in pixels for each day cell
const entryHeight = 40; // height in pixels for each member entry row

/**
 * Generates a random purple shade in HSL format.
 *
 * Purple hues are typically around 250 to 290 degrees.
 * Saturation is randomly chosen between 40% and 100% and lightness between 30% and 70%.
 *
 * @returns {string} A string representing an HSL color.
 */
const getRandomPurple = () => {
  const hue = Math.floor(Math.random() * 40) + 250;
  const saturation = Math.floor(Math.random() * 60) + 40;
  const lightness = Math.floor(Math.random() * 40) + 30;
  return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
};

/**
 * Renders a calendar view for a club class, displaying the class members over the days of the specified month.
 *
 * This component calculates the days in the month, filters valid members based on their membership start
 * and expiration dates, and assigns a random purple shade to each member to display their entry consistently.
 *
 * @component
 * @param {ClassCalendarProps} props - The properties for the ClassCalendar component.
 * @returns {JSX.Element} The rendered ClassCalendar component.
 */
const ClassCalendar: FC<ClassCalendarProps> = memo(
  ({ club, clubClass, month, year }) => {
    const { data: members } = useClubMembers(
      club?.id ?? "",
      clubClass?.id ?? "",
    );

    // Calculate number of days in the given month and year.
    // For a 0-indexed month, new Date(year, month + 1, 0) gives the last day of the month.
    const numDays = useMemo(
      () => new Date(year, month + 1, 0).getDate(),
      [year, month],
    );
    // Determine the start date of the calendar (first day of the month).
    const calendarStartDate = useMemo(
      () => new Date(year, month, 1),
      [year, month],
    );
    // Determine the end date of the calendar (last day of the month).
    const calendarEndDate = useMemo(
      () => new Date(year, month, numDays),
      [year, month, numDays],
    );

    // Day labels remain static.
    const dayLabels = useMemo(
      () => ["SU", "MO", "TU", "WE", "TH", "FR", "SA"],
      [],
    );

    // Build an array of day objects for the calendar.
    const days = useMemo(() => {
      return Array.from({ length: numDays }, (_, i) => {
        const day = i + 1;
        const date = new Date(year, month, day);
        return { day, label: dayLabels[date.getDay()] };
      });
    }, [numDays, year, month, dayLabels]);

    // Filter members whose membership dates intersect with the current month.
    const validMembers = useMemo(() => {
      return members?.filter((member) => {
        if (
          !member.userMembershipData ||
          !member.userData ||
          !member.userMembershipData.startDate ||
          !member.userMembershipData.expiration
        ) {
          return false;
        }
        const start = member.userMembershipData.startDate.toDate();
        const expiration = member.userMembershipData.expiration.toDate();
        return expiration >= calendarStartDate && start <= calendarEndDate;
      });
    }, [members, calendarStartDate, calendarEndDate]);

    // Generate random colors for each valid member to ensure consistency between renders.
    const memberColors = useMemo(() => {
      const mapping: { [key: string]: string } = {};
      validMembers?.forEach((member) => {
        if (member.userData?.name) {
          mapping[member.userData.name] = getRandomPurple();
        }
      });
      return mapping;
    }, [validMembers]);

    return (
      <div className="overflow-x-auto rounded-sm bg-sidebar p-4">
        <div className="min-w-max">
          {/* Calendar Header */}
          <div className="flex">
            {days.map(({ day, label }, index) => (
              <div
                key={day}
                className={`${index === 0 ? "border-l-2" : ""} border-r-2 text-center`}
                style={{ width: cellWidth }}
              >
                <div className="text-sm font-bold">
                  {day} {label}
                </div>
              </div>
            ))}
          </div>
          {/* Member Entries */}
          <div
            className="relative"
            style={{
              height: (validMembers?.length || 0) * entryHeight,
              marginTop: validMembers?.length ? 10 : 0,
            }}
          >
            {validMembers?.map((member, index) => {
              const start = member.userMembershipData!.startDate!.toDate();
              const expiration =
                member.userMembershipData!.expiration!.toDate();

              // Determine effective start and end days within the current month.
              const effectiveStartDay =
                start < calendarStartDate ? 1 : start.getDate();
              const effectiveEndDay =
                expiration > calendarEndDate ? numDays : expiration.getDate();

              // Calculate left offset and width based on effective start/end days.
              const left = (effectiveStartDay - 1) * cellWidth;
              const width =
                (effectiveEndDay - effectiveStartDay + 1) * cellWidth;

              return (
                <div
                  key={member.userData!.name}
                  className="absolute flex items-center justify-center rounded-xl border"
                  style={{
                    top: index * entryHeight,
                    left,
                    width,
                    height: entryHeight - 10,
                    backgroundColor: memberColors[member.userData!.name],
                  }}
                >
                  <span className="truncate px-1 text-sm">
                    {member.userData!.name}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  },
);

ClassCalendar.displayName = "ClassCalendar";

export { ClassCalendar };
