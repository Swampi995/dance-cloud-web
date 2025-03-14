import { ComponentProps } from "react";
import { useNavigate } from "react-router";
import {
  BarChart,
  CalendarDays,
  ChevronDown,
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

import logoUrl from "@/assets/images/logo.avif";

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
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { NavSection } from "./NavSection";
import { useClubs } from "@/hooks/use-clubs";

const data = {
  navMain: [
    {
      name: "Club details",
      url: "#",
      icon: House,
      disabled: true,
    },
    {
      name: "Schedule",
      url: "#",
      icon: CalendarDays,
      disabled: true,
    },
    {
      name: "Sessions",
      url: "/sessions",
      icon: LayoutGrid,
      disabled: false,
    },
    {
      name: "Monthly Summary",
      url: "/classes",
      icon: BarChart,
      disabled: false,
    },
    {
      name: "Analytics",
      url: "#",
      icon: TrendingUp,
      disabled: true,
    },
  ],
  navSecondary: [
    {
      title: "Contact",
      url: "#",
      icon: LifeBuoy,
      disabled: true,
    },
    {
      title: "Feedback",
      url: "#",
      icon: Send,
      disabled: true,
    },
  ],
  memberships: [
    {
      name: "Members",
      url: "#",
      icon: UsersRound,
      disabled: true,
    },
    {
      name: "Classes",
      url: "/classes",
      icon: GraduationCap,
      disabled: false,
    },
    {
      name: "Memberships",
      url: "#",
      icon: Tag,
      disabled: true,
    },
  ],
  events: [
    {
      name: "Upcoming",
      url: "#",
      icon: PartyPopper,
      disabled: true,
    },
    {
      name: "Past",
      url: "#",
      icon: PartyPopper,
      disabled: true,
    },
  ],
};

const AppSidebar = ({ ...props }: ComponentProps<typeof Sidebar>) => {
  const navigate = useNavigate();
  const { clubs, selectedClub, setSelectedClub } = useClubs();

  return (
    <Sidebar {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem className="flex space-x-2 pl-2">
            <button onClick={() => navigate("/")}>
              <div className="aspect-square size-10">
                <img src={logoUrl} />
              </div>
            </button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton size="lg" asChild>
                  <div>
                    <div className="grid flex-1 text-left text-sm leading-tight text-sidebar-primary-foreground">
                      <span className="truncate px-2 font-semibold">
                        DanceCloud
                      </span>
                      <span className="truncate px-2 text-xs">
                        {selectedClub?.name ?? "Admin"}
                      </span>
                    </div>
                    <ChevronDown />
                  </div>
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start">
                <DropdownMenuLabel>Select a Club</DropdownMenuLabel>
                {clubs?.map((club) => (
                  <DropdownMenuCheckboxItem
                    key={club.id}
                    checked={selectedClub?.id === club.id}
                    onCheckedChange={() => setSelectedClub(club)}
                  >
                    {club.name}
                  </DropdownMenuCheckboxItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
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
