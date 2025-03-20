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
export interface CalendarCell {
  day: number;
  type: DayType;
}

/**
 * Generates an array of calendar cells for a specific month.
 *
 * The function creates:
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

export { getDaysInMonth, generateCalendarDays };
