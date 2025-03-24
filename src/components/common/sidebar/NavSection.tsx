import { type LucideIcon } from "lucide-react";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { useLocation, useNavigate } from "react-router";

const NavSection = ({
  items,
  name,
}: {
  items: {
    name: string;
    url: string;
    icon: LucideIcon;
    disabled: boolean;
  }[];
  name: string;
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isMobile, openMobile, toggleSidebar } = useSidebar();

  return (
    <SidebarGroup className="group-data-[collapsible=icon]:hidden">
      <SidebarGroupLabel>{name}</SidebarGroupLabel>
      <SidebarMenu>
        {items.map((item) => (
          <SidebarMenuItem key={item.name}>
            <SidebarMenuButton
              // TODO: Temporary till we implement all the pages
              className={`${item.disabled && "cursor-default text-zinc-500 hover:bg-transparent hover:text-zinc-500 active:bg-transparent active:text-zinc-500"}`}
              isActive={location.pathname === item.url}
              asChild
            >
              <button
                onClick={() => {
                  if (isMobile && openMobile) {
                    toggleSidebar();
                  }
                  if (!item.disabled) {
                    navigate(item.url);
                  }
                }}
              >
                <item.icon />
                <span>{item.name}</span>
              </button>
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
};

NavSection.displayName = "NavSection";

export { NavSection };
