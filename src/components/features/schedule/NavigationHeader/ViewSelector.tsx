import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dispatch, FC, SetStateAction } from "react";

interface ViewSelectorProps {
  activeView: string;
  onViewChange: Dispatch<SetStateAction<string>>;
}

const ViewSelector: FC<ViewSelectorProps> = ({ activeView, onViewChange }) => {
  const views: string[] = ["Year", "Month", "Day"];

  return (
    <Tabs value={activeView} onValueChange={onViewChange}>
      <TabsList className="flex space-x-2">
        {views.map((view) => (
          <TabsTrigger key={view} value={view}>
            {view}
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  );
};
ViewSelector.displayName = "ViewSelector";

export { ViewSelector };
