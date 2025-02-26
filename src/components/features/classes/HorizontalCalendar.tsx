import { FC, memo } from "react";

type HorizontalCalendarProps = {
  month: number; // 1-indexed month (e.g., 1 for January)
  year: number;
};

const cellWidth = 80; // width in pixels for each day cell

const HorizontalCalendar: FC<HorizontalCalendarProps> = memo(
  ({ month, year }) => {
    // Determine the number of days in the given month.
    const numDays = new Date(year, month, 0).getDate();

    // Day labels where getDay() returns 0 for Sunday, 1 for Monday, etc.
    const dayLabels = ["SU", "MO", "TU", "WE", "TH", "FR", "SA"];

    // Dynamically generate the days array for the month.
    const days = Array.from({ length: numDays }, (_, i) => {
      const day = i + 1;
      const date = new Date(year, month - 1, day);
      return { day, label: dayLabels[date.getDay()] };
    });

    return (
      <div className="overflow-x-auto rounded-sm bg-sidebar p-4">
        <div className="flex min-w-max">
          {days.map(({ day, label }) => (
            <div
              key={day}
              className="text-center"
              style={{
                width: cellWidth,
              }}
            >
              <div className="text-sm font-bold">
                {day} {label}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  },
);

HorizontalCalendar.displayName = "HorizontalCalendar";

export { HorizontalCalendar };
