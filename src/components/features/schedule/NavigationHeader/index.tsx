import { Dispatch, FC, SetStateAction } from "react";
import { NavigationControls } from "./NavigationControls";
import { ViewSelector } from "./ViewSelector";

interface NavigationHeaderProps {
  activeView: string;
  currentDate: Date;
  onDateChange: Dispatch<SetStateAction<Date>>;
  onViewChange: Dispatch<SetStateAction<string>>;
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
      <ViewSelector activeView={activeView} onViewChange={onViewChange} />
    </div>
  );
};
NavigationHeader.displayName = "NavigationHeader";

export { NavigationHeader };
