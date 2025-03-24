// YearCalendar.tsx
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
import { ClubClassType } from "@/schemas/classes";
import { ClubEventType } from "@/schemas/events";

interface YearCalendarProps {
  year?: number;
  onDateChange: Dispatch<SetStateAction<Date>>;
  onViewChange: Dispatch<SetStateAction<string>>;
  classesData: ClubClassType[];
  eventsData: ClubEventType[];
}

const YearCalendar: React.FC<YearCalendarProps> = ({
  year = new Date().getFullYear(),
  onDateChange,
  onViewChange,
  classesData,
  eventsData,
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
          className="cursor-pointer border-[0.5px] bg-sidebar/70 hover:bg-purple-300/10"
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
                // Compute the actual date for the cell based on its type
                let cellDate: Date;
                if (cell.type === "current") {
                  cellDate = new Date(year, monthIndex, cell.day);
                } else if (cell.type === "prev") {
                  const prevMonth = monthIndex === 0 ? 11 : monthIndex - 1;
                  const prevYear = monthIndex === 0 ? year - 1 : year;
                  cellDate = new Date(prevYear, prevMonth, cell.day);
                } else {
                  const nextMonth = monthIndex === 11 ? 0 : monthIndex + 1;
                  const nextYear = monthIndex === 11 ? year + 1 : year;
                  cellDate = new Date(nextYear, nextMonth, cell.day);
                }

                // Check if there is any class scheduled for this day
                // (Assuming each class's schedule.day corresponds to the JS getDay() number)
                const hasClass = classesData.some((cls) =>
                  cls.schedule?.some((s) => s.day === cellDate.getDay()),
                );

                // Check if an event spans this day
                const cellTime = new Date(
                  cellDate.getFullYear(),
                  cellDate.getMonth(),
                  cellDate.getDate(),
                ).getTime();
                const hasEvent = eventsData.some((event) => {
                  // Convert the timestamp to a Date (if needed)
                  const eventStart = event.startDate.toDate();
                  const eventEnd = event.endDate.toDate();
                  const eventStartTime = new Date(
                    eventStart.getFullYear(),
                    eventStart.getMonth(),
                    eventStart.getDate(),
                  ).getTime();
                  const eventEndTime = new Date(
                    eventEnd.getFullYear(),
                    eventEnd.getMonth(),
                    eventEnd.getDate(),
                  ).getTime();
                  return cellTime >= eventStartTime && cellTime <= eventEndTime;
                });

                const isToday =
                  cell.type === "current" &&
                  year === todayYear &&
                  monthIndex === todayMonth &&
                  cell.day === todayDate;

                return (
                  <div
                    key={index}
                    className={`relative flex h-8 w-8 items-center justify-center text-sm min-[2000px]:h-9 min-[2000px]:w-9 min-[2000px]:text-base min-[2500px]:h-12 min-[2500px]:w-12 min-[2500px]:text-lg min-[3000px]:h-14 min-[3000px]:w-14 min-[3000px]:text-xl ${isToday ? "rounded-full bg-neutral-800" : ""}`}
                  >
                    {/* Render event circle (purple-300) */}
                    {hasEvent && (
                      <div
                        className={`absolute ${
                          hasClass ? "inset-0" : "inset-0"
                        } rounded-full border border-purple-300`}
                      ></div>
                    )}
                    {/* Render class circle (purple-600) – inset if event circle is also present */}
                    {hasClass && (
                      <div
                        className={`absolute ${
                          hasEvent ? "inset-[3px]" : "inset-0"
                        } rounded-full border border-purple-900`}
                      ></div>
                    )}
                    <div
                      className={`relative z-10 ${
                        cell.type === "current" ? "" : "text-gray-400"
                      } ${isToday ? "font-bold text-white" : ""}`}
                    >
                      {cell.day}
                    </div>
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
