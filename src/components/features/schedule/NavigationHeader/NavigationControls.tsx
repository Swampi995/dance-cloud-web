import { Dispatch, FC, SetStateAction } from "react";
import { Button } from "@/components/ui/button";

interface NavigationControlsProps {
  activeView: string;
  currentDate: Date;
  onDateChange: Dispatch<SetStateAction<Date>>;
}

const NavigationControls: FC<NavigationControlsProps> = ({
  activeView,
  currentDate,
  onDateChange,
}) => {
  // Format the date based on the active view.
  const formattedDate = (() => {
    if (activeView === "Year") {
      return currentDate.toLocaleDateString(undefined, { year: "numeric" });
    } else if (activeView === "Month") {
      return currentDate.toLocaleDateString(undefined, {
        month: "long",
        year: "numeric",
      });
    } else if (activeView === "Day") {
      return currentDate.toLocaleDateString(undefined, {
        weekday: "short",
        day: "numeric",
        month: "long",
        year: "numeric",
      });
    }
    return currentDate.toDateString();
  })();

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
    <div className="flex items-center space-x-2">
      <Button variant="outline" size="sm" onClick={handlePrevious}>
        ←
      </Button>
      <span className="text-base font-bold">{formattedDate}</span>
      <Button variant="outline" size="sm" onClick={handleNext}>
        →
      </Button>
    </div>
  );
};
NavigationControls.displayName = "NavigationControls";

export { NavigationControls };
