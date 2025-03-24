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

/**
 * Props for the MonthCalendar component.
 */
interface MonthCalendarProps {
  year?: number;
  month?: number;
  onDateChange: Dispatch<SetStateAction<Date>>;
  onViewChange: Dispatch<SetStateAction<string>>;
}

/**
 * Props for the MonthDay component.
 */
interface MonthDayProps {
  cell: CalendarCell;
  onDayClick: (cell: CalendarCell) => void;
  isToday: boolean;
  width: number;
  height: number;
  weekday?: string;
  isWeekend?: boolean; // <-- New prop to indicate weekend cells
}

/**
 * MonthDay component renders an individual day cell for the month view.
 */
const MonthDay: React.FC<MonthDayProps> = ({
  cell,
  onDayClick,
  isToday,
  width,
  height,
  weekday,
  isWeekend,
}) => {
  const baseClasses =
    "cursor-pointer  rounded-xl border-[0.5px] shadow-none hover:bg-purple-300/10 hover:text-neutral-100";

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
      style={{ width, height }}
      className={`${baseClasses} ${bgClasses} ${textColor}`}
    >
      <CardHeader className="p-1">
        <div className="flex items-center justify-between">
          {weekday && (
            <div className="text-left text-sm font-semibold">{weekday}</div>
          )}
          <div className="text-right text-sm font-semibold">{cell.day}</div>
        </div>
      </CardHeader>
      <CardContent className="p-0" />
    </Card>
  );
};

/**
 * MonthCalendar component renders a calendar view for a given month.
 */
const MonthCalendar: React.FC<MonthCalendarProps> = ({
  year = new Date().getFullYear(),
  month = new Date().getMonth(),
  onDateChange,
  onViewChange,
}) => {
  const today = new Date();
  const { width: windowWidth, height: windowHeight } = useWindowDimensions();
  const { open, openMobile, isMobile } = useSidebar();

  const isSidebarOpen = useMemo(
    () => (isMobile ? openMobile : open),
    [isMobile, openMobile, open],
  );

  // Determine if the screen is small.
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

  // Pass !isSmallScreen to include trailing days only on larger screens.
  const days = useMemo(
    () => generateCalendarDays(year, month, !isSmallScreen),
    [year, month, isSmallScreen],
  );

  const totalRows = isSmallScreen ? days.length : 1 + days.length / 7;
  const cellHeight = !isSmallScreen ? windowHeight / totalRows : 128;

  /**
   * Computes the full date for a given calendar cell.
   */
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

  /**
   * Handles the day click event by computing the full date of the clicked cell
   * and updating the date and view.
   */
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
            {/* Render weekday headers only on larger screens */}
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
              // Determine if the cell is a weekend (Sunday=0 or Saturday=6)
              const isWeekend =
                cellDate.getDay() === 0 || cellDate.getDay() === 6;
              const weekday = isSmallScreen
                ? cellDate.toLocaleString("default", {
                    weekday: "short",
                  })
                : undefined;
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
