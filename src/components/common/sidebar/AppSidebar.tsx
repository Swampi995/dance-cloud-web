import {
  CalendarDays,
  GraduationCap,
  House,
  LayoutGrid,
  LifeBuoy,
  PartyPopper,
  Send,
  Tag,
  TrendingUp,
  UsersRound,
} from "lucide-react";

import { NavMain } from "@/components/common/sidebar/NavMain";
import { NavUser } from "@/components/common/sidebar/NavUser";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import logoUrl from "@/assets/images/logo.avif";

import { useNavigate } from "react-router";
import { ComponentProps } from "react";
import { NavSection } from "./NavSection";

const data = {
  navMain: [
    {
      name: "Club details",
      url: "#",
      icon: House,
    },
    {
      name: "Schedule",
      url: "#",
      icon: CalendarDays,
    },
    {
      name: "Sessions",
      url: "/sessions",
      icon: LayoutGrid,
    },
    {
      name: "Analytics",
      url: "#",
      icon: TrendingUp,
    },
  ],
  navSecondary: [
    {
      title: "Contact",
      url: "#",
      icon: LifeBuoy,
    },
    {
      title: "Feedback",
      url: "#",
      icon: Send,
    },
  ],
  memberships: [
    {
      name: "Members",
      url: "#",
      icon: UsersRound,
    },
    {
      name: "Classes",
      url: "#",
      icon: GraduationCap,
    },
    {
      name: "Memberships",
      url: "#",
      icon: Tag,
    },
  ],
  events: [
    {
      name: "Upcoming",
      url: "#",
      icon: PartyPopper,
    },
    {
      name: "Past",
      url: "#",
      icon: PartyPopper,
    },
  ],
};

const AppSidebar = ({ ...props }: ComponentProps<typeof Sidebar>) => {
  const navigate = useNavigate();

  return (
    <Sidebar {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <button onClick={() => navigate("/")}>
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg text-sidebar-primary-foreground">
                  <img src={logoUrl} />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">DanceCloud</span>
                  <span className="truncate text-xs">Admin</span>
                </div>
              </button>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavSection items={data.memberships} name="Memberships" />
        <NavSection items={data.events} name="Events" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  );
};

AppSidebar.displayName = "AppSidebar";

export { AppSidebar };
