// MonthCalendar.tsx
import React, {
  Dispatch,
  memo,
  SetStateAction,
  useCallback,
  useMemo,
} from "react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { WEEKDAY_HEADERS } from "@/constants";
import { useSidebar } from "@/components/ui/sidebar";
import { useWindowDimensions } from "@/hooks/use-window-dimensions";
import { CalendarCell, generateCalendarDays } from "./helpers";
import { ClubClassType } from "@/schemas/classes";
import { ClubEventType } from "@/schemas/events";

interface MonthCalendarProps {
  year?: number;
  month?: number;
  onDateChange: Dispatch<SetStateAction<Date>>;
  onViewChange: Dispatch<SetStateAction<string>>;
  classesData: ClubClassType[];
  eventsData: ClubEventType[];
}

interface MonthDayProps {
  cell: CalendarCell;
  onDayClick: (cell: CalendarCell) => void;
  isToday: boolean;
  width: number;
  height: number;
  weekday?: string;
  isWeekend?: boolean;
  // Props to display events and classes for the day.
  events?: ClubEventType[];
  classes?: ClubClassType[];
}

const MonthDay: React.FC<MonthDayProps> = ({
  cell,
  onDayClick,
  isToday,
  width,
  height,
  weekday,
  isWeekend,
  events,
  classes,
}) => {
  const baseClasses =
    "cursor-pointer rounded-xl border-[0.5px] shadow-none hover:bg-purple-300/10 hover:text-neutral-100";
  const textColor =
    cell.type === "current" ? "text-neutral-300" : "text-neutral-600";

  let bgClasses = "bg-sidebar/70";
  if (isToday) {
    bgClasses = "bg-purple-900/30 text-neutral-200";
  } else if (isWeekend) {
    bgClasses = "bg-neutral-900/50";
  }

  return (
    <Card
      onClick={() => onDayClick(cell)}
      // Setting the height:height will make the cells a fixed height and their content scrollable
      style={{ width, minHeight: height }}
      className={`flex h-full flex-col ${baseClasses} ${bgClasses} ${textColor}`}
    >
      <CardHeader className="p-1">
        <div className="flex items-center justify-between">
          {weekday && (
            <div className="text-left text-sm font-semibold">{weekday}</div>
          )}
          <div className="text-right text-sm font-semibold">{cell.day}</div>
        </div>
      </CardHeader>
      <CardContent className="flex-1 overflow-scroll p-1">
        {/* Flex container for events and classes */}
        <div className="flex flex-wrap gap-1">
          {events &&
            events.map((event) => (
              <div
                key={event.id}
                className="truncate rounded bg-blue-300 px-1 py-0.5 text-xs text-neutral-800"
              >
                {event.name}
              </div>
            ))}
          {classes &&
            classes.map((cls) => (
              <div
                key={cls.id}
                className="truncate rounded bg-purple-300 px-1 py-0.5 text-xs text-neutral-800"
              >
                {cls.name}
              </div>
            ))}
        </div>
      </CardContent>
    </Card>
  );
};

const MonthCalendar: React.FC<MonthCalendarProps> = ({
  year = new Date().getFullYear(),
  month = new Date().getMonth(),
  onDateChange,
  onViewChange,
  classesData,
  eventsData,
}) => {
  const today = new Date();
  const { width: windowWidth, height: windowHeight } = useWindowDimensions();
  const { open, openMobile, isMobile } = useSidebar();

  const isSidebarOpen = useMemo(
    () => (isMobile ? openMobile : open),
    [isMobile, openMobile, open],
  );

  const isSmallScreen = useMemo(
    () => (isSidebarOpen ? windowWidth - 255 : windowWidth) < 1280,
    [isSidebarOpen, windowWidth],
  );

  const availableWidth = useMemo(() => {
    return isSmallScreen
      ? windowWidth - 80 - (isSidebarOpen ? 255 : 0)
      : windowWidth - 32 - 80 - (isSidebarOpen ? 255 : 0);
  }, [windowWidth, isSmallScreen, isSidebarOpen]);

  const cellWidth = useMemo(
    () => (isSmallScreen ? availableWidth : availableWidth / 7),
    [availableWidth, isSmallScreen],
  );

  const days = useMemo(
    () => generateCalendarDays(year, month, !isSmallScreen),
    [year, month, isSmallScreen],
  );

  const totalRows = isSmallScreen ? days.length : 1 + days.length / 7;
  const cellHeight = !isSmallScreen ? windowHeight / totalRows : 128;

  const getDateForCell = useCallback(
    (cell: CalendarCell): Date => {
      if (cell.type === "prev") {
        const prevMonth = month - 1;
        const newYear = prevMonth < 0 ? year - 1 : year;
        const newMonth = prevMonth < 0 ? 11 : prevMonth;
        return new Date(newYear, newMonth, cell.day);
      } else if (cell.type === "next") {
        const nextMonth = month + 1;
        const newYear = nextMonth > 11 ? year + 1 : year;
        const newMonth = nextMonth > 11 ? 0 : nextMonth;
        return new Date(newYear, newMonth, cell.day);
      } else {
        return new Date(year, month, cell.day);
      }
    },
    [year, month],
  );

  const handleDayClick = useCallback(
    (cell: CalendarCell) => {
      const selectedDate = getDateForCell(cell);
      onDateChange(selectedDate);
      onViewChange("Day");
    },
    [getDateForCell, onDateChange, onViewChange],
  );

  return (
    <div>
      <Card className="h-full border-0">
        <CardContent className="h-full p-0">
          <div
            className={`grid h-full ${
              isSmallScreen ? "grid-cols-1" : "grid-cols-7"
            }`}
          >
            {/* Render weekday headers on larger screens */}
            {!isSmallScreen &&
              WEEKDAY_HEADERS.map((day) => (
                <div
                  key={day}
                  className="bg-black pb-3 text-xs font-medium text-neutral-200"
                >
                  {day}
                </div>
              ))}
            {days.map((cell, index) => {
              const cellDate = getDateForCell(cell);
              const isToday =
                cell.type === "current" &&
                year === today.getFullYear() &&
                month === today.getMonth() &&
                cell.day === today.getDate();
              const isWeekend =
                cellDate.getDay() === 0 || cellDate.getDay() === 6;
              const weekday = isSmallScreen
                ? cellDate.toLocaleString("default", {
                    weekday: "short",
                  })
                : undefined;

              // Use the same calculation as in YearCalendar
              const cellTime = new Date(
                cellDate.getFullYear(),
                cellDate.getMonth(),
                cellDate.getDate(),
              ).getTime();

              const dayEvents = eventsData.filter((event) => {
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

              // Filter classes based on their schedule (assuming each schedule item has a `day` property)
              const dayClasses = classesData.filter((cls) => {
                if (!cls.schedule) return false;
                return cls.schedule.some(
                  (scheduleItem: { day: number }) =>
                    scheduleItem.day === cellDate.getDay(),
                );
              });

              return (
                <MonthDay
                  key={`${cell.type}-${cell.day}-${index}`}
                  cell={cell}
                  onDayClick={handleDayClick}
                  isToday={isToday}
                  width={cellWidth}
                  height={cellHeight}
                  weekday={weekday}
                  isWeekend={isWeekend}
                  events={dayEvents}
                  classes={dayClasses}
                />
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

MonthCalendar.displayName = "MonthCalendar";

export default memo(MonthCalendar);
