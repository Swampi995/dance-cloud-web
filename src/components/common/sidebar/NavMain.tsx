import { type LucideIcon } from "lucide-react";
import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { useNavigate, useLocation } from "react-router";

const NavMain = ({
  items,
}: {
  items: {
    name: string;
    url: string;
    icon: LucideIcon;
    disabled: boolean;
  }[];
}) => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <SidebarGroup className="group-data-[collapsible=icon]:hidden">
      <SidebarMenu>
        {items.map((item) => (
          <SidebarMenuItem key={item.name}>
            <SidebarMenuButton
              // TODO: Temporary till we implement all the pages
              className={`${item.disabled && "cursor-default text-zinc-500 hover:bg-transparent hover:text-zinc-500 active:bg-transparent active:text-zinc-500"}`}
              isActive={location.pathname === item.url}
              asChild
            >
              <button onClick={() => !item.disabled && navigate(item.url)}>
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

NavMain.displayName = "NavMain";

export { NavMain };
