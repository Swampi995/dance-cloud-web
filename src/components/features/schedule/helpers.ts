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
 * - If `includeExtraDays` is true (default), it adds leading days from the previous month
 *   and trailing days from the next month to fill out the calendar grid.
 * - If false, only days from the current month are included.
 *
 * @param {number} year - The full year (e.g., 2025).
 * @param {number} month - The zero-indexed month for which the calendar is generated.
 * @param {boolean} [includeExtraDays=true] - Whether to include extra days from the adjacent months.
 * @returns {CalendarCell[]} An array of CalendarCell objects representing each cell in the calendar grid.
 */
function generateCalendarDays(
  year: number,
  month: number,
  includeExtraDays: boolean = true,
): CalendarCell[] {
  const daysInMonth = getDaysInMonth(year, month);
  const days: CalendarCell[] = [];

  if (includeExtraDays) {
    // Add leading days from the previous month.
    const firstDayIndex = new Date(year, month, 1).getDay();
    const prevMonth = month - 1;
    const prevYear = prevMonth < 0 ? year - 1 : year;
    const prevMonthIndex = prevMonth < 0 ? 11 : prevMonth;
    const daysInPrevMonth = getDaysInMonth(prevYear, prevMonthIndex);

    for (let i = 0; i < firstDayIndex; i++) {
      const day = daysInPrevMonth - firstDayIndex + 1 + i;
      days.push({ day, type: "prev" });
    }
  }

  // Add days for the current month.
  for (let day = 1; day <= daysInMonth; day++) {
    days.push({ day, type: "current" });
  }

  if (includeExtraDays) {
    // Add trailing days from the next month.
    const firstDayIndex = new Date(year, month, 1).getDay();
    const totalCells = Math.ceil((firstDayIndex + daysInMonth) / 7) * 7;
    const trailingDaysCount = totalCells - days.length;
    for (let day = 1; day <= trailingDaysCount; day++) {
      days.push({ day, type: "next" });
    }
  }

  return days;
}

export { getDaysInMonth, generateCalendarDays };
