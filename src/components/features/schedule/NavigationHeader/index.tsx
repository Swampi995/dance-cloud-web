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
    <div className="w-fit items-center justify-between space-y-4 place-self-center text-right md:flex md:w-full md:space-y-0">
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
