import { SidebarProvider } from "../ui/sidebar";
import { AppSidebar } from "../common/sidebar/AppSidebar";
import { Outlet } from "react-router";

const SidebarLayout = () => (
  <SidebarProvider>
    <AppSidebar />
    <Outlet />
  </SidebarProvider>
);

SidebarLayout.displayName = "SidebarLayout";

export default SidebarLayout;
