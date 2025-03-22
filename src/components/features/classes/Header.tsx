import { SidebarTrigger } from "@/components/ui/sidebar";
import { FC, memo } from "react";

/**
 * Renders the page header component, including the sidebar trigger
 * and the main page title.
 */
const Header: FC = memo(() => (
  <div className="mb-4 mt-6 flex items-center">
    <SidebarTrigger />
    <h1 className="pl-4 text-sm font-bold sm:text-xl md:text-2xl lg:text-4xl">
      Monthly summary
    </h1>
  </div>
));
Header.displayName = "Header";

export { Header };
