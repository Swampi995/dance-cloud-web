import { SidebarTrigger } from "@/components/ui/sidebar";
import { FC, memo, useState } from "react";
import { YearCalendar } from "./YearCalendar";
import { ViewSelector } from "./ViewSelector";
import { NavigationControls } from "./NavigationControls";

interface NavigationHeaderProps {
  activeView: string;
  currentDate: Date;
  onDateChange: (date: Date) => void;
  onViewChange: (view: string) => void;
}

const NavigationHeader: FC<NavigationHeaderProps> = ({
  activeView,
  currentDate,
  onDateChange,
  onViewChange,
}) => {
  return (
    <div className="items-center justify-between space-x-4 space-y-4 text-right md:flex md:space-y-0">
      <NavigationControls
        activeView={activeView}
        currentDate={currentDate}
        onDateChange={onDateChange}
      />
      <ViewSelector activeView={activeView} onChange={onViewChange} />
    </div>
  );
};
NavigationHeader.displayName = "NavigationHeader";

interface HeaderProps {
  activeView: string;
  setActiveView: (view: string) => void;
  currentDate: Date;
  setCurrentDate: (date: Date) => void;
}

const Header: FC<HeaderProps> = memo(() => (
  <div className="mb-4 mt-6 flex justify-between">
    <div className="flex items-center space-x-4">
      <SidebarTrigger />
      <h1 className="text-sm font-bold sm:text-xl md:text-2xl lg:text-4xl">
        Schedule
      </h1>
    </div>
  </div>
));
Header.displayName = "Header";

const Schedule: FC = () => {
  // Lift state up so that Header and Calendar share the same date.
  const [activeView, setActiveView] = useState<string>("Year");
  const [currentDate, setCurrentDate] = useState<Date>(new Date());

  return (
    <div
      className="flex flex-1 flex-col gap-4 px-4 sm:px-10"
      style={{ width: "calc(100% - 250px)" }}
    >
      <Header
        activeView={activeView}
        setActiveView={setActiveView}
        currentDate={currentDate}
        setCurrentDate={setCurrentDate}
      />
      <div className="mx-auto space-y-4">
        <NavigationHeader
          activeView={activeView}
          currentDate={currentDate}
          onDateChange={setCurrentDate}
          onViewChange={setActiveView}
        />
        {/* Conditionally render different calendars based on activeView.
            Here, we only render the YearCalendar for brevity. */}
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
