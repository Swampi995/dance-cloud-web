/**
 * @fileoverview YearCalendar Component
 *
 * This file contains the YearCalendar React component which renders a full-year calendar.
 * Each month is displayed as a card that includes a header for the month name and a grid
 * showing the days. The calendar includes the necessary leading days (from the previous month)
 * and trailing days (from the next month) to complete each week. The current day is highlighted.
 */

import React, { useMemo } from "react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";

// Array of month names used for display.
const monthNames = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

// Array of abbreviated weekday headers.
const WEEKDAY_HEADERS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

/**
 * Returns the number of days in a given month.
 * Note: Month is zero-indexed (0 = January, 11 = December).
 *
 * @param {number} year - The full year (e.g., 2025).
 * @param {number} month - The zero-indexed month.
 * @returns {number} The number of days in the specified month.
 */
function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate();
}

/**
 * Type representing the kind of day shown in the calendar.
 * - "prev": Day from the previous month.
 * - "current": Day from the current month.
 * - "next": Day from the next month.
 */
type DayType = "prev" | "current" | "next";

/**
 * Represents a cell in the calendar grid.
 *
 * @property {number} day - The day number to display.
 * @property {DayType} type - Indicates whether the day belongs to the previous, current, or next month.
 */
interface CalendarCell {
  day: number;
  type: DayType;
}

/**
 * Generates an array of calendar cells for a specific month.
 *
 * The function creates a grid that includes:
 * - Leading days from the previous month (if the month does not start on Sunday).
 * - All days of the current month.
 * - Trailing days from the next month to complete the final week.
 *
 * @param {number} year - The full year (e.g., 2025).
 * @param {number} month - The zero-indexed month for which the calendar is generated.
 * @returns {CalendarCell[]} An array of CalendarCell objects representing each cell in the calendar grid.
 */
function generateCalendarDays(year: number, month: number): CalendarCell[] {
  const daysInMonth = getDaysInMonth(year, month);
  const firstDayIndex = new Date(year, month, 1).getDay();
  const totalCells = Math.ceil((firstDayIndex + daysInMonth) / 7) * 7;

  // Calculate information for the previous month.
  const prevMonth = month - 1;
  const prevYear = prevMonth < 0 ? year - 1 : year;
  const prevMonthIndex = prevMonth < 0 ? 11 : prevMonth;
  const daysInPrevMonth = getDaysInMonth(prevYear, prevMonthIndex);

  const days: CalendarCell[] = [];

  // Add leading days from the previous month.
  for (let i = 0; i < firstDayIndex; i++) {
    const day = daysInPrevMonth - firstDayIndex + 1 + i;
    days.push({ day, type: "prev" });
  }

  // Add days for the current month.
  for (let day = 1; day <= daysInMonth; day++) {
    days.push({ day, type: "current" });
  }

  // Add trailing days from the next month.
  const trailingDaysCount = totalCells - days.length;
  for (let day = 1; day <= trailingDaysCount; day++) {
    days.push({ day, type: "next" });
  }

  return days;
}

/**
 * Props for the YearCalendar component.
 *
 * @property {number} [year] - The year to display. Defaults to the current year if not provided.
 */
interface YearCalendarProps {
  year?: number;
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
}) => {
  const today = new Date();
  const todayYear = today.getFullYear();
  const todayMonth = today.getMonth();
  const todayDate = today.getDate();

  // Memoize calendar data for each month so it recalculates only when the `year` changes.
  const monthsData = useMemo(() => {
    return monthNames.map((monthName, monthIndex) => {
      const days = generateCalendarDays(year, monthIndex);
      return { monthName, monthIndex, days };
    });
  }, [year]);

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
      {monthsData.map(({ monthName, monthIndex, days }) => (
        <Card key={monthName} className="border-0 bg-sidebar/70">
          <CardHeader>
            <h3 className="text-left text-lg font-semibold text-purple-300">
              {monthName}
            </h3>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-7 gap-1">
              {/* Render weekday headers */}
              {WEEKDAY_HEADERS.map((day) => (
                <div key={day} className="text-center text-xs font-medium">
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
                    className={`flex h-8 w-8 items-center justify-center text-sm ${
                      cell.type === "current" ? "" : "text-gray-400"
                    } ${isToday ? "rounded-full bg-purple-500 text-white" : ""}`}
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

export { YearCalendar };
