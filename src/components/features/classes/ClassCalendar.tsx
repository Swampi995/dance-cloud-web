import { useSidebar } from "@/components/ui/sidebar";
import { useClubMembers } from "@/hooks/use-club-members";
import { useWindowDimensions } from "@/hooks/use-window-dimensions";
import { ClubClassType } from "@/schemas/classes";
import { ClubType } from "@/schemas/club";
import { FC, memo, useMemo, Fragment } from "react";

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

const entryHeight = 40; // height in pixels for each member entry row

/**
 * Generates a random purple shade in HSL format.
 *
 * Purple hues are now more narrowly defined around 260 to 280 degrees.
 * Saturation is randomly chosen between 40% and 100% and lightness between 30% and 70%.
 *
 * @returns {string} A string representing an HSL color.
 */
const getRandomPurple = () => {
  const hue = Math.floor(Math.random() * 20) + 260; // hue between 260 and 280 degrees
  const saturation = Math.floor(Math.random() * 60) + 40;
  const lightness = Math.floor(Math.random() * 40) + 30;
  return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
};

/**
 * Renders a calendar view for a club class, displaying the class members over the days of the specified month.
 * In addition to the current membership (displayed in a random purple shade), if a member has past membership data,
 * each past membership period (from the `userPastMembershipData` array) is displayed on the same row with a gray color.
 *
 * If a member does not have an active membership event for the current month, but has past membership data,
 * their past membership events are still displayed.
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

    const { open, openMobile, isMobile } = useSidebar();

    // Use a hook to get the window dimensions
    const { width: windowWidth } = useWindowDimensions();

    // Calculate number of days in the given month and year.
    const numDays = useMemo(
      () => new Date(year, month + 1, 0).getDate(),
      [year, month],
    );

    const isSidebarOpen = useMemo(
      () => (isMobile ? openMobile : open),
      [isMobile, openMobile, open],
    );

    // Calculate cellWidth based on window width and number of days in the month.
    const cellWidth = useMemo(() => {
      const availableWidth = windowWidth - 32 - 80 - (isSidebarOpen ? 255 : 0); // Account for the container's horizontal padding (e.g., p-4 on each side) & the sidebar
      const widthPerDay = availableWidth / numDays;
      return Math.max(43, widthPerDay);
    }, [windowWidth, numDays, isSidebarOpen]);

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
    const dayLabels = useMemo(() => ["S", "M", "T", "W", "T", "F", "S"], []);

    // Build an array of day objects for the calendar.
    const days = useMemo(() => {
      return Array.from({ length: numDays }, (_, i) => {
        const day = i + 1;
        const date = new Date(year, month, day);
        return { day, label: dayLabels[date.getDay()] };
      });
    }, [numDays, year, month, dayLabels]);

    // Filter members: include if active membership intersects the month
    // OR if any past membership period intersects the month.
    const validMembers = useMemo(() => {
      return members?.filter((member) => {
        const activeValid =
          member.userMembershipData &&
          member.userData &&
          member.userMembershipData.startDate &&
          member.userMembershipData.expiration &&
          member.userMembershipData.startDate.toDate() <= calendarEndDate &&
          member.userMembershipData.expiration.toDate() >= calendarStartDate;

        const pastValid =
          member.userPastMembershipData &&
          Array.isArray(member.userPastMembershipData) &&
          member.userPastMembershipData.some((past) => {
            if (!past.startDate || !past.expiration) return false;
            const pastStart = past.startDate.toDate();
            const pastExpiration = past.expiration.toDate();
            return (
              pastExpiration >= calendarStartDate &&
              pastStart <= calendarEndDate
            );
          });
        return activeValid || pastValid;
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
      <div className="overflow-x-auto">
        <div className="w-max rounded-sm bg-sidebar p-4">
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
              return (
                <Fragment key={member.userData!.name}>
                  {/* Past membership segments */}
                  {member.userPastMembershipData &&
                    Array.isArray(member.userPastMembershipData) &&
                    member.userPastMembershipData.map((past, pastIndex) => {
                      if (!past.startDate || !past.expiration) return null;
                      const pastStart = past.startDate.toDate();
                      const pastExpiration = past.expiration.toDate();
                      // Only render if the past membership period intersects with the current month.
                      if (
                        pastExpiration < calendarStartDate ||
                        pastStart > calendarEndDate
                      ) {
                        return null;
                      }
                      const pastEffectiveStartDay =
                        pastStart < calendarStartDate ? 1 : pastStart.getDate();
                      const pastEffectiveEndDay =
                        pastExpiration > calendarEndDate
                          ? numDays
                          : pastExpiration.getDate();
                      const pastLeft = (pastEffectiveStartDay - 1) * cellWidth;
                      const pastWidth =
                        (pastEffectiveEndDay - pastEffectiveStartDay + 1) *
                        cellWidth;
                      return (
                        <div
                          key={`${member.userData!.name}-past-${pastIndex}`}
                          className="absolute flex items-center justify-center rounded-xl border bg-neutral-800"
                          style={{
                            top: index * entryHeight,
                            left: pastLeft,
                            width: pastWidth,
                            height: entryHeight - 10,
                            zIndex: 1,
                          }}
                        >
                          <span className="truncate px-1 text-sm">
                            {member.userData!.name}
                          </span>
                        </div>
                      );
                    })}
                  {/* Current membership segment (only if active membership data exists) */}
                  {member.userMembershipData &&
                    member.userMembershipData.startDate &&
                    member.userMembershipData.expiration &&
                    (() => {
                      const currentStart =
                        member.userMembershipData.startDate.toDate();
                      const currentExpiration =
                        member.userMembershipData.expiration.toDate();
                      const effectiveStartDay =
                        currentStart < calendarStartDate
                          ? 1
                          : currentStart.getDate();
                      const effectiveEndDay =
                        currentExpiration > calendarEndDate
                          ? numDays
                          : currentExpiration.getDate();
                      const currentLeft = (effectiveStartDay - 1) * cellWidth;
                      const currentWidth =
                        (effectiveEndDay - effectiveStartDay + 1) * cellWidth;
                      return (
                        <div
                          className="absolute flex items-center justify-center rounded-xl border"
                          style={{
                            top: index * entryHeight,
                            left: currentLeft,
                            width: currentWidth,
                            height: entryHeight - 10,
                            backgroundColor:
                              memberColors[member.userData!.name],
                            zIndex: 2,
                          }}
                        >
                          <span className="truncate px-1 text-sm">
                            {member.userData!.name}
                          </span>
                        </div>
                      );
                    })()}
                </Fragment>
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
