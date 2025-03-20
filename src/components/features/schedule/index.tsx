import { FC, useState, lazy, Suspense, memo } from "react";
import { NavigationHeader } from "./NavigationHeader";
import { Header } from "./Header";

// Lazy-load the calendar components.
const YearCalendar = lazy(() => import("./YearCalendar"));
const MonthCalendar = lazy(() => import("./MonthCalendar"));
const DayCalendar = lazy(() => import("./DayCalendar"));

const Schedule: FC = () => {
  // Lift state up so that Header and Calendar share the same date.
  const [activeView, setActiveView] = useState<string>("Year");
  const [currentDate, setCurrentDate] = useState<Date>(new Date());

  // Render the appropriate calendar based on the active view.
  const renderCalendar = () => {
    switch (activeView) {
      case "Year":
        return (
          <YearCalendar
            year={currentDate.getFullYear()}
            onDateChange={setCurrentDate}
            onViewChange={setActiveView}
          />
        );
      case "Month":
        return (
          <MonthCalendar
            year={currentDate.getFullYear()}
            month={currentDate.getMonth()}
            onDateChange={setCurrentDate}
            onViewChange={setActiveView}
          />
        );
      case "Day":
        return <DayCalendar date={currentDate} />;
      default:
        return null;
    }
  };

  return (
    <div
      className="flex flex-1 flex-col gap-4 px-4 sm:px-10"
      style={{ width: "calc(100% - 250px)" }}
    >
      <Header />
      <div className="mx-auto mb-10 space-y-4">
        <NavigationHeader
          activeView={activeView}
          currentDate={currentDate}
          onDateChange={setCurrentDate}
          onViewChange={setActiveView}
        />
        {/* Suspense to show a fallback while the calendar component loads */}
        <Suspense>{renderCalendar()}</Suspense>
      </div>
    </div>
  );
};

Schedule.displayName = "Schedule";

export default memo(Schedule);
