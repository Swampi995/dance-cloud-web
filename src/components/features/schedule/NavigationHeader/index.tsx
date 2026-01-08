import { Dispatch, FC, SetStateAction } from "react";
import { NavigationControls } from "./NavigationControls";
import { ViewSelector } from "./ViewSelector";
import { Legend } from "./Legend";

interface NavigationHeaderProps {
  activeView: string;
  currentDate: Date;
  onDateChange: Dispatch<SetStateAction<Date>>;
  onViewChange: Dispatch<SetStateAction<string>>;
  onToggleVisibility?: (item: "class" | "event", visible: boolean) => void;
}

const NavigationHeader: FC<NavigationHeaderProps> = ({
  activeView,
  currentDate,
  onDateChange,
  onViewChange,
  onToggleVisibility,
}) => {
  return (
    //  Add sticky top-0 z-50 to make it stick
    <div className="w-fit items-center justify-between space-x-0 space-y-4 place-self-center text-right md:flex md:w-full md:space-x-2 md:space-y-0">
      <NavigationControls
        activeView={activeView}
        currentDate={currentDate}
        onDateChange={onDateChange}
      />
      <ViewSelector activeView={activeView} onViewChange={onViewChange} />
      <Legend onToggleVisibility={onToggleVisibility} />
    </div>
  );
};

NavigationHeader.displayName = "NavigationHeader";

export { NavigationHeader };
