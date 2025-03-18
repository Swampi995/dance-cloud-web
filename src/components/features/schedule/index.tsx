import { FC, useState } from "react";
import { YearCalendar } from "./YearCalendar";
import { NavigationHeader } from "./NavigationHeader";
import { Header } from "./Header";

const Schedule: FC = () => {
  // Lift state up so that Header and Calendar share the same date.
  const [activeView, setActiveView] = useState<string>("Year");
  const [currentDate, setCurrentDate] = useState<Date>(new Date());

  return (
    <div
      className="flex flex-1 flex-col gap-4 px-4 sm:px-10"
      style={{ width: "calc(100% - 250px)" }}
    >
      <Header />
      <div className="mx-auto space-y-4">
        <NavigationHeader
          activeView={activeView}
          currentDate={currentDate}
          onDateChange={setCurrentDate}
          onViewChange={setActiveView}
        />
        {/* Conditionally render different calendars based on activeView. */}
        <YearCalendar
          year={currentDate.getFullYear()}
          onDateChange={setCurrentDate}
        />
      </div>
    </div>
  );
};
Schedule.displayName = "Schedule";

export default Schedule;
