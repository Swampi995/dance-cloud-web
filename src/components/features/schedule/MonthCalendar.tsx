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
 *
 * @typedef {Object} MonthCalendarProps
 * @property {number} [year] - The year to display. Defaults to the current year.
 * @property {number} [month] - The month to display (0-indexed). Defaults to the current month.
 * @property {Dispatch<SetStateAction<Date>>} onDateChange - Callback to update the selected date.
 * @property {Dispatch<SetStateAction<string>>} onViewChange - Callback to update the current view.
 */
interface MonthCalendarProps {
  year?: number;
  month?: number;
  onDateChange: Dispatch<SetStateAction<Date>>;
  onViewChange: Dispatch<SetStateAction<string>>;
}

/**
 * Props for the MonthDay component.
 *
 * @typedef {Object} MonthDayProps
 * @property {CalendarCell} cell - The calendar cell data.
 * @property {(cell: CalendarCell) => void} onDayClick - Callback when a day is clicked.
 * @property {boolean} isToday - Flag indicating if this cell represents today's date.
 * @property {number} width - The width of the cell.
 * @property {number} height - The height of the cell.
 * @property {string} [weekday] - Optional weekday label.
 */
interface MonthDayProps {
  cell: CalendarCell;
  onDayClick: (cell: CalendarCell) => void;
  isToday: boolean;
  width: number;
  height: number;
  weekday?: string;
}

/**
 * MonthDay component renders an individual day cell for the month view.
 *
 * @param {MonthDayProps} props - The props for MonthDay.
 * @returns {JSX.Element} The rendered day cell.
 */
const MonthDay: React.FC<MonthDayProps> = ({
  cell,
  onDayClick,
  isToday,
  width,
  height,
  weekday,
}) => (
  <Card
    onClick={() => onDayClick(cell)}
    style={{ width, height }}
    className={`cursor-pointer rounded-none border-[0.5px] bg-transparent shadow-none hover:bg-neutral-900 ${
      cell.type === "current" ? "" : "text-gray-400"
    } ${isToday ? "bg-purple-900/50 text-white" : ""}`}
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

/**
 * MonthCalendar component renders a calendar view for a given month.
 *
 * @param {MonthCalendarProps} props - The props for MonthCalendar.
 * @returns {JSX.Element} The rendered month calendar.
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

  const days = useMemo(() => generateCalendarDays(year, month), [year, month]);

  const totalRows = isSmallScreen ? days.length : 1 + days.length / 7;
  const cellHeight = !isSmallScreen ? windowHeight / totalRows : 150;

  /**
   * Computes the full date for a given calendar cell.
   *
   * @param {CalendarCell} cell - The calendar cell.
   * @returns {Date} The computed Date object corresponding to the cell.
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
   *
   * @param {CalendarCell} cell - The calendar cell that was clicked.
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
      <Card className="h-full border-0 bg-sidebar/70">
        <CardContent className="h-full p-0">
          <div
            className={`grid h-full ${isSmallScreen ? "grid-cols-1" : "grid-cols-7"}`}
          >
            {/* Render weekday headers only on larger screens */}
            {!isSmallScreen &&
              WEEKDAY_HEADERS.map((day) => (
                <div key={day} className="bg-black pb-3 text-xs font-medium">
                  {day}
                </div>
              ))}
            {days.map((cell, index) => {
              const isToday =
                cell.type === "current" &&
                year === today.getFullYear() &&
                month === today.getMonth() &&
                cell.day === today.getDate();
              const weekday = isSmallScreen
                ? getDateForCell(cell).toLocaleString("default", {
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
