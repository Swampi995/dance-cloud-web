import { SidebarTrigger } from "@/components/ui/sidebar";
import { memo } from "react";

const Header = memo(() => (
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

export { Header };
