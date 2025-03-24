import { FC, useState, lazy, Suspense, memo } from "react";
import { NavigationHeader } from "./NavigationHeader";
import { Header } from "./Header";
import { useClubEvents } from "@/hooks/use-club-events";
import { useClubs } from "@/hooks/use-clubs";
import { useClubClasses } from "@/hooks/use-club-classes";

// Lazy-load the calendar components.
const YearCalendar = lazy(() => import("./YearCalendar"));
const MonthCalendar = lazy(() => import("./MonthCalendar"));
const DayCalendar = lazy(() => import("./DayCalendar"));

const Schedule: FC = () => {
  // Lift state up so that Header and Calendar share the same date.
  const [activeView, setActiveView] = useState<string>("Year");
  const [currentDate, setCurrentDate] = useState<Date>(new Date());

  // State to control legend visibility toggles.
  const [visibility, setVisibility] = useState<{
    class: boolean;
    event: boolean;
  }>({
    class: true,
    event: true,
  });

  // This function is passed to NavigationHeader/Legend to update which items are visible.
  const onToggleVisibility = (item: "class" | "event", visible: boolean) => {
    setVisibility((prev) => ({
      ...prev,
      [item]: visible,
    }));
  };

  const { selectedClub } = useClubs();
  const { data: eventData } = useClubEvents(selectedClub?.id ?? "");
  const { data: classesData } = useClubClasses(selectedClub?.id ?? "");

  console.log("classesData", classesData);
  console.log("eventsData", eventData);

  // Optionally filter events and classes based on visibility toggles.
  const filteredEventsData = visibility.event ? eventData : [];
  const filteredClassesData = visibility.class ? classesData : [];

  // Render the appropriate calendar based on the active view.
  const renderCalendar = () => {
    switch (activeView) {
      case "Year":
        return (
          <YearCalendar
            year={currentDate.getFullYear()}
            onDateChange={setCurrentDate}
            onViewChange={setActiveView}
            classesData={filteredClassesData}
            eventsData={filteredEventsData}
          />
        );
      case "Month":
        return (
          <MonthCalendar
            year={currentDate.getFullYear()}
            month={currentDate.getMonth()}
            onDateChange={setCurrentDate}
            onViewChange={setActiveView}
            classesData={filteredClassesData}
            eventsData={filteredEventsData}
          />
        );
      case "Day":
        return (
          <DayCalendar
            date={currentDate}
            classesData={filteredClassesData}
            eventsData={filteredEventsData}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div
      className="flex flex-1 flex-col px-4 sm:px-10"
      style={{ width: "calc(100% - 250px)" }}
    >
      <Header />
      <div className="mx-auto mb-10 space-y-4">
        <NavigationHeader
          activeView={activeView}
          currentDate={currentDate}
          onDateChange={setCurrentDate}
          onViewChange={setActiveView}
          onToggleVisibility={onToggleVisibility}
        />
        {/* Suspense to show a fallback while the calendar component loads */}
        <Suspense>{renderCalendar()}</Suspense>
      </div>
    </div>
  );
};

Schedule.displayName = "Schedule";

export default memo(Schedule);
