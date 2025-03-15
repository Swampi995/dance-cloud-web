import { SidebarTrigger } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { FC, memo, useState } from "react";
import { YearCalendar } from "./YearCalendar";

type ViewType = "Year" | "Month" | "Day";

interface ViewSelectorProps {
  activeView: ViewType;
  onChange: (view: ViewType) => void;
}

const ViewSelector: FC<ViewSelectorProps> = ({ activeView, onChange }) => {
  const views: ViewType[] = ["Year", "Month", "Day"];
  return (
    <div className="flex space-x-2">
      {views.map((view) => (
        <Button
          key={view}
          variant={activeView === view ? "default" : "outline"}
          onClick={() => onChange(view)}
        >
          {view}
        </Button>
      ))}
    </div>
  );
};

interface NavigationControlsProps {
  activeView: ViewType;
  currentDate: Date;
  onDateChange: (date: Date) => void;
}

const NavigationControls: FC<NavigationControlsProps> = ({
  activeView,
  currentDate,
  onDateChange,
}) => {
  const handlePrevious = () => {
    if (activeView === "Year") {
      onDateChange(
        new Date(
          currentDate.getFullYear() - 1,
          currentDate.getMonth(),
          currentDate.getDate(),
        ),
      );
    } else if (activeView === "Month") {
      onDateChange(
        new Date(
          currentDate.getFullYear(),
          currentDate.getMonth() - 1,
          currentDate.getDate(),
        ),
      );
    } else if (activeView === "Day") {
      onDateChange(
        new Date(
          currentDate.getFullYear(),
          currentDate.getMonth(),
          currentDate.getDate() - 1,
        ),
      );
    }
  };

  const handleToday = () => {
    onDateChange(new Date());
  };

  const handleNext = () => {
    if (activeView === "Year") {
      onDateChange(
        new Date(
          currentDate.getFullYear() + 1,
          currentDate.getMonth(),
          currentDate.getDate(),
        ),
      );
    } else if (activeView === "Month") {
      onDateChange(
        new Date(
          currentDate.getFullYear(),
          currentDate.getMonth() + 1,
          currentDate.getDate(),
        ),
      );
    } else if (activeView === "Day") {
      onDateChange(
        new Date(
          currentDate.getFullYear(),
          currentDate.getMonth(),
          currentDate.getDate() + 1,
        ),
      );
    }
  };

  return (
    <div className="flex space-x-2">
      <Button variant="outline" onClick={handlePrevious}>
        ←
      </Button>
      <Button variant="outline" onClick={handleToday}>
        Today
      </Button>
      <Button variant="outline" onClick={handleNext}>
        →
      </Button>
    </div>
  );
};

interface HeaderProps {
  activeView: ViewType;
  setActiveView: (view: ViewType) => void;
  currentDate: Date;
  setCurrentDate: (date: Date) => void;
}

const Header: FC<HeaderProps> = memo(
  ({ activeView, setActiveView, currentDate, setCurrentDate }) => (
    <div className="mb-4 mt-6 flex justify-between">
      <div className="flex items-center space-x-4">
        <SidebarTrigger />
        <h1 className="text-sm font-bold sm:text-xl md:text-2xl lg:text-4xl">
          Schedule
        </h1>
      </div>
      <ViewSelector activeView={activeView} onChange={setActiveView} />
      <NavigationControls
        activeView={activeView}
        currentDate={currentDate}
        onDateChange={setCurrentDate}
      />
    </div>
  ),
);
Header.displayName = "Header";

const Schedule: FC = () => {
  // Lift state up so that both Header and the Calendar share the same date.
  const [activeView, setActiveView] = useState<ViewType>("Year");
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
      {/* Render the YearCalendar. You could conditionally render different calendars based on activeView. */}
      <YearCalendar year={currentDate.getFullYear()} />
    </div>
  );
};

Schedule.displayName = "Schedule";
export default Schedule;
