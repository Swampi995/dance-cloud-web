import { SidebarTrigger } from "@/components/ui/sidebar";
import { memo } from "react";

type HeaderProps = {
  title: string;
};

const Header = memo(({ title }: HeaderProps) => (
  <div className="mb-4 mt-6 flex justify-between">
    <div className="flex items-center space-x-4">
      <SidebarTrigger />
      <h1 className="text-sm font-bold sm:text-xl md:text-2xl lg:text-4xl">
        {title}
      </h1>
    </div>
  </div>
));
Header.displayName = "Header";

export { Header };
