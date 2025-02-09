import { SidebarInset, SidebarProvider, SidebarTrigger } from "../ui/sidebar";
import { Separator } from "@radix-ui/react-separator";
import { AppSidebar } from "../common/sidebar/AppSidebar";
import { Outlet } from "react-router";

const SidebarLayout = () => (
  <SidebarProvider>
    <AppSidebar />
    <SidebarInset>
      <header className="flex h-16 shrink-0 items-center gap-2">
        <div className="flex items-center gap-2 px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
        </div>
      </header>
      <Outlet />
    </SidebarInset>
  </SidebarProvider>
);

SidebarLayout.displayName = "SidebarLayout";

export default SidebarLayout;
