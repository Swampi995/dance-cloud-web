import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FC } from "react";

interface ViewSelectorProps {
  activeView: string;
  onChange: (view: string) => void;
}

const ViewSelector: FC<ViewSelectorProps> = ({ activeView, onChange }) => {
  const views: string[] = ["Year", "Month", "Day"];

  return (
    <Tabs value={activeView} onValueChange={onChange}>
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
