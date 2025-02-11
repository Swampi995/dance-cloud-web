import { ComponentProps } from "react";
import { useNavigate } from "react-router";
import {
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
