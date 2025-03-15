import { SidebarTrigger } from "@/components/ui/sidebar";
import { FC, memo } from "react";
import { YearCalendar } from "./YearCalendar";

/**
 * Renders the page header component, including the sidebar trigger
 * and the main page title.
 */
const Header: FC = memo(() => (
  <div className="mb-4 mt-6 flex items-center">
    <SidebarTrigger />
    <h1 className="pl-4 text-sm font-bold sm:text-xl md:text-2xl lg:text-4xl">
      Schedule
    </h1>
  </div>
));
Header.displayName = "Header";

const Schedule: FC = () => {
  return (
    <div
      className="flex flex-1 flex-col gap-4 px-4 sm:px-10"
      style={{ width: "calc(100% - 250px)" }}
    >
      <Header />
      <YearCalendar />
    </div>
  );
};

Schedule.displayName = "Schedule";
export default Schedule;
