/**
 * @fileoverview YearCalendar Component
 *
 * This file contains the YearCalendar React component which renders a full-year calendar.
 * Each month is displayed as a card that includes a header for the month name and a grid
 * showing the days. The calendar includes the necessary leading days (from the previous month)
 * and trailing days (from the next month) to complete each week. The current day is highlighted.
 */

import { Dispatch, memo, SetStateAction, useMemo } from "react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { MONTH_NAMES, WEEKDAY_HEADERS } from "@/constants";
import { generateCalendarDays } from "./helpers";

/**
 * Props for the YearCalendar component.
 *
 * @property {number} [year] - The year to display. Defaults to the current year if not provided.
 * @property {Dispatch<SetStateAction<Date>>} [onDateChange] - The state setter to change the currentDate
 * @property {Dispatch<SetStateAction<string>>} [onViewChange] - The state setter to change the currentView
 */
interface YearCalendarProps {
  year?: number;
  onDateChange: Dispatch<SetStateAction<Date>>;
  onViewChange: Dispatch<SetStateAction<string>>;
}

/**
 * YearCalendar Component
 *
 * This component renders a calendar view for the entire year.
 * Each month is displayed in a card with a header for the month name and a grid layout
 * that shows the days. The calendar includes days from the previous and next months to ensure
 * that each week is fully populated, and the current day is highlighted if it falls within the displayed year.
 *
 * @component
 * @param {YearCalendarProps} props - The props for the component.
 * @returns {JSX.Element} A grid layout of calendar cards representing each month of the year.
 *
 * @example
 * <YearCalendar year={2025} />
 */
const YearCalendar: React.FC<YearCalendarProps> = ({
  year = new Date().getFullYear(),
  onDateChange,
  onViewChange,
}) => {
  const today = new Date();
  const todayYear = today.getFullYear();
  const todayMonth = today.getMonth();
  const todayDate = today.getDate();

  // Memoize calendar data for each month so it recalculates only when the `year` changes.
  const monthsData = useMemo(() => {
    return MONTH_NAMES.map((monthName, monthIndex) => {
      const days = generateCalendarDays(year, monthIndex);
      return { monthName, monthIndex, days };
    });
  }, [year]);

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
      {monthsData.map(({ monthName, monthIndex, days }) => (
        <Card
          key={monthName}
          className="cursor-pointer border-0 bg-sidebar/70 hover:bg-neutral-900"
          onClick={() => {
            onDateChange(new Date(year, monthIndex, 1));
            onViewChange("Month");
          }}
        >
          <CardHeader>
            <h3 className="text-left text-lg font-semibold text-purple-300 min-[2000px]:text-xl min-[2500px]:text-2xl min-[3000px]:text-3xl">
              {monthName}
            </h3>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-7 gap-1">
              {/* Render weekday headers */}
              {WEEKDAY_HEADERS.map((day) => (
                <div
                  key={day}
                  className="text-center text-xs font-medium min-[2000px]:text-base min-[2500px]:text-lg min-[3000px]:text-xl"
                >
                  {day}
                </div>
              ))}
              {/* Render calendar cells */}
              {days.map((cell, index) => {
                const isToday =
                  cell.type === "current" &&
                  year === todayYear &&
                  monthIndex === todayMonth &&
                  cell.day === todayDate;
                return (
                  <div
                    key={index}
                    className={`flex h-8 w-8 items-center justify-center text-sm min-[2000px]:h-9 min-[2000px]:w-9 min-[2000px]:text-base min-[2500px]:h-12 min-[2500px]:w-12 min-[2500px]:text-lg min-[3000px]:h-14 min-[3000px]:w-14 min-[3000px]:text-xl ${
                      cell.type === "current" ? "" : "text-gray-400"
                    } ${isToday ? "rounded-full bg-purple-900/50 text-white" : ""}`}
                  >
                    {cell.day}
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
YearCalendar.displayName = "YearCalendar";

export default memo(YearCalendar);
