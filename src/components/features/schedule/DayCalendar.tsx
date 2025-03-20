/**
 * @fileoverview DayCalendar Component
 *
 * This file contains the DayCalendar React component which renders a calendar view for a single day.
 * The component displays a header with the full date and a grid of hourly cells.
 * Clicking on an hour cell triggers the onDateChange callback with the corresponding Date object.
 */

import { Dispatch, memo, SetStateAction, useMemo } from "react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";

interface DayCalendarProps {
  /**
   * The date to display. Defaults to the current date if not provided.
   */
  date?: Date;
  /**
   * Callback that receives a new Date when a specific hour is selected.
   */
  onDateChange: Dispatch<SetStateAction<Date>>;
}

/**
 * Helper function to format an hour in 12-hour format with AM/PM.
 *
 * @param {number} hour - The hour (0-23).
 * @returns {string} The formatted hour string.
 */
function formatHour(hour: number): string {
  if (hour === 0) return "12 AM";
  if (hour < 12) return `${hour} AM`;
  if (hour === 12) return "12 PM";
  return `${hour - 12} PM`;
}

/**
 * DayCalendar Component
 *
 * This component renders a day view with a header displaying the full date and a grid of hourly cells.
 * Clicking on an hour cell updates the selected date with that specific hour.
 *
 * @component
 * @param {DayCalendarProps} props - The props for the component.
 * @returns {JSX.Element} A calendar view for a single day.
 *
 * @example
 * <DayCalendar date={new Date()} onDateChange={setDate} />
 */
const DayCalendar: React.FC<DayCalendarProps> = ({
  date = new Date(),
  onDateChange,
}) => {
  const now = new Date();
  const isToday =
    date.getFullYear() === now.getFullYear() &&
    date.getMonth() === now.getMonth() &&
    date.getDate() === now.getDate();

  // Create an array of 24 hours (0 through 23).
  const hours = useMemo(() => Array.from({ length: 24 }, (_, i) => i), []);

  // Format the header date string.
  const headerDate = date.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  return (
    <Card className="border-0 bg-sidebar/70">
      <CardHeader>
        <h3 className="text-left text-lg font-semibold text-purple-300">
          {headerDate}
        </h3>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-4 gap-2">
          {hours.map((hour) => {
            const isCurrentHour = isToday && hour === now.getHours();
            return (
              <div
                key={hour}
                onClick={() =>
                  onDateChange(
                    new Date(
                      date.getFullYear(),
                      date.getMonth(),
                      date.getDate(),
                      hour,
                    ),
                  )
                }
                className={`flex h-10 cursor-pointer items-center justify-center rounded-full text-sm text-white hover:bg-purple-500 ${
                  isCurrentHour && "bg-purple-500"
                }`}
              >
                {formatHour(hour)}
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

DayCalendar.displayName = "DayCalendar";

export default memo(DayCalendar);
